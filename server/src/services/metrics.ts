import { db } from "../db";
import {
	githubCommits,
	githubPullRequests,
	githubReviews,
	jiraTickets,
	metricsSnapshots,
} from "../db/schema";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";

export interface TimeRange {
	startDate: Date;
	endDate: Date;
}

export interface GitHubMetrics {
	totalPRs: number;
	mergedPRs: number;
	openPRs: number;
	totalReviews: number;
	actionableReviews: number;
	totalCommits: number;
	linesAdded: number;
	linesDeleted: number;
	avgPRSize: number;
	reviewQualityScore: number;
}

export interface JiraMetrics {
	totalTickets: number;
	completedTickets: number;
	inProgressTickets: number;
	totalStoryPoints: number;
	completedStoryPoints: number;
	avgCycleTime: number;
	bugCount: number;
	featureCount: number;
	techDebtCount: number;
	velocity: number;
}

export interface AggregatedMetrics {
	github: GitHubMetrics;
	jira: JiraMetrics;
	overall: {
		productivityScore: number;
		collaborationScore: number;
		qualityScore: number;
		velocityTrend: "up" | "down" | "stable";
	};
	timeRange: TimeRange;
}

export class MetricsService {
	async getGitHubMetrics(
		userId: string,
		timeRange: TimeRange,
	): Promise<GitHubMetrics> {
		const prs = await db
			.select()
			.from(githubPullRequests)
			.where(
				and(
					eq(githubPullRequests.userId, userId),
					gte(githubPullRequests.createdAt, timeRange.startDate),
					lte(githubPullRequests.createdAt, timeRange.endDate),
				),
			);

		const reviews = await db
			.select()
			.from(githubReviews)
			.where(
				and(
					eq(githubReviews.userId, userId),
					gte(githubReviews.submittedAt, timeRange.startDate),
					lte(githubReviews.submittedAt, timeRange.endDate),
				),
			);

		const commits = await db
			.select()
			.from(githubCommits)
			.where(
				and(
					eq(githubCommits.userId, userId),
					gte(githubCommits.committedAt, timeRange.startDate),
					lte(githubCommits.committedAt, timeRange.endDate),
				),
			);

		const mergedPRs = prs.filter((pr) => pr.state === "merged");
		const openPRs = prs.filter((pr) => pr.state === "open");

		const actionableReviews = reviews.filter(
			(r) =>
				r.state === "changes_requested" ||
				(r.body && r.body.length > 50),
		);

		const totalLinesAdded = commits.reduce(
			(sum, c) => sum + (c.additions || 0),
			0,
		);
		const totalLinesDeleted = commits.reduce(
			(sum, c) => sum + (c.deletions || 0),
			0,
		);

		const prSizes = prs.map((pr) => (pr.additions || 0) + (pr.deletions || 0));
		const avgPRSize =
			prSizes.length > 0
				? prSizes.reduce((a, b) => a + b, 0) / prSizes.length
				: 0;

		const reviewQualityScore =
			reviews.length > 0 ? (actionableReviews.length / reviews.length) * 100 : 0;

		return {
			totalPRs: prs.length,
			mergedPRs: mergedPRs.length,
			openPRs: openPRs.length,
			totalReviews: reviews.length,
			actionableReviews: actionableReviews.length,
			totalCommits: commits.length,
			linesAdded: totalLinesAdded,
			linesDeleted: totalLinesDeleted,
			avgPRSize: Math.round(avgPRSize),
			reviewQualityScore: Math.round(reviewQualityScore),
		};
	}

	async getJiraMetrics(
		userId: string,
		timeRange: TimeRange,
	): Promise<JiraMetrics> {
		const tickets = await db
			.select()
			.from(jiraTickets)
			.where(
				and(
					eq(jiraTickets.userId, userId),
					gte(jiraTickets.createdAt, timeRange.startDate),
					lte(jiraTickets.createdAt, timeRange.endDate),
				),
			);

		const completed = tickets.filter(
			(t) => t.status === "Done" || t.status === "Closed",
		);
		const inProgress = tickets.filter((t) => t.status === "In Progress");

		const totalStoryPoints = tickets.reduce(
			(sum, t) => sum + (t.storyPoints || 0),
			0,
		);
		const completedStoryPoints = completed.reduce(
			(sum, t) => sum + (t.storyPoints || 0),
			0,
		);

		const cycleTimes = completed
			.filter((t) => t.resolvedAt)
			.map((t) => {
				const created = new Date(t.createdAt).getTime();
				const resolved = new Date(t.resolvedAt!).getTime();
				return (resolved - created) / (1000 * 60 * 60 * 24);
			});

		const avgCycleTime =
			cycleTimes.length > 0
				? cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length
				: 0;

		const bugs = tickets.filter((t) => t.issueType === "Bug");
		const features = tickets.filter(
			(t) => t.issueType === "Story" || t.issueType === "Feature",
		);
		const techDebt = tickets.filter((t) => t.issueType === "Technical Debt");

		const daysInRange =
			(timeRange.endDate.getTime() - timeRange.startDate.getTime()) /
			(1000 * 60 * 60 * 24);
		const weeksInRange = daysInRange / 7;
		const velocity =
			weeksInRange > 0 ? completedStoryPoints / weeksInRange : 0;

		return {
			totalTickets: tickets.length,
			completedTickets: completed.length,
			inProgressTickets: inProgress.length,
			totalStoryPoints,
			completedStoryPoints,
			avgCycleTime: Math.round(avgCycleTime * 10) / 10,
			bugCount: bugs.length,
			featureCount: features.length,
			techDebtCount: techDebt.length,
			velocity: Math.round(velocity * 10) / 10,
		};
	}

	async getAggregatedMetrics(
		userId: string,
		timeRange: TimeRange,
	): Promise<AggregatedMetrics> {
		const github = await this.getGitHubMetrics(userId, timeRange);
		const jira = await this.getJiraMetrics(userId, timeRange);

		const productivityScore = this.calculateProductivityScore(github, jira);
		const collaborationScore = this.calculateCollaborationScore(github);
		const qualityScore = this.calculateQualityScore(github, jira);
		const velocityTrend = await this.calculateVelocityTrend(userId, timeRange);

		return {
			github,
			jira,
			overall: {
				productivityScore,
				collaborationScore,
				qualityScore,
				velocityTrend,
			},
			timeRange,
		};
	}

	private calculateProductivityScore(
		github: GitHubMetrics,
		jira: JiraMetrics,
	): number {
		const prScore = Math.min((github.mergedPRs / 10) * 30, 30);
		const commitScore = Math.min((github.totalCommits / 50) * 20, 20);
		const ticketScore = Math.min((jira.completedTickets / 20) * 30, 30);
		const storyPointScore = Math.min((jira.completedStoryPoints / 50) * 20, 20);

		return Math.round(prScore + commitScore + ticketScore + storyPointScore);
	}

	private calculateCollaborationScore(github: GitHubMetrics): number {
		const reviewScore = Math.min((github.totalReviews / 20) * 50, 50);
		const qualityBonus = Math.min((github.reviewQualityScore / 100) * 50, 50);

		return Math.round(reviewScore + qualityBonus);
	}

	private calculateQualityScore(
		github: GitHubMetrics,
		jira: JiraMetrics,
	): number {
		const reviewQualityScore = (github.reviewQualityScore / 100) * 40;

		const prSizeScore =
			github.avgPRSize > 0 && github.avgPRSize < 500 ? 30 : 15;

		const bugRatio =
			jira.totalTickets > 0 ? jira.bugCount / jira.totalTickets : 0;
		const bugScore = Math.max(0, (1 - bugRatio) * 30);

		return Math.round(reviewQualityScore + prSizeScore + bugScore);
	}

	private async calculateVelocityTrend(
		userId: string,
		currentRange: TimeRange,
	): Promise<"up" | "down" | "stable"> {
		const rangeDuration =
			currentRange.endDate.getTime() - currentRange.startDate.getTime();

		const previousRange: TimeRange = {
			startDate: new Date(currentRange.startDate.getTime() - rangeDuration),
			endDate: currentRange.startDate,
		};

		const currentJira = await this.getJiraMetrics(userId, currentRange);
		const previousJira = await this.getJiraMetrics(userId, previousRange);

		const diff = currentJira.velocity - previousJira.velocity;
		const threshold = 0.1;

		if (Math.abs(diff) < threshold) return "stable";
		return diff > 0 ? "up" : "down";
	}

	async createSnapshot(userId: string): Promise<void> {
		const now = new Date();
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		const timeRange: TimeRange = {
			startDate: thirtyDaysAgo,
			endDate: now,
		};

		const metrics = await this.getAggregatedMetrics(userId, timeRange);

		await db.insert(metricsSnapshots).values({
			userId,
			snapshotDate: now,
			period: "30d",
			prsMerged: metrics.github.mergedPRs,
			prsCreated: metrics.github.totalPRs,
			reviewsCompleted: metrics.github.totalReviews,
			commitsCount: metrics.github.totalCommits,
			linesAdded: metrics.github.linesAdded,
			linesDeleted: metrics.github.linesDeleted,
			ticketsCompleted: metrics.jira.completedTickets,
			storyPointsCompleted: metrics.jira.completedStoryPoints,
			bugsFixed: metrics.jira.bugCount,
			featuresDelivered: metrics.jira.featureCount,
		});
	}

	async getTrendData(
		userId: string,
		metricType: "productivity" | "collaboration" | "quality",
		days: number = 90,
	): Promise<Array<{ date: Date; value: number }>> {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		const snapshots = await db
			.select()
			.from(metricsSnapshots)
			.where(
				and(
					eq(metricsSnapshots.userId, userId),
					gte(metricsSnapshots.snapshotDate, startDate),
				),
			)
			.orderBy(desc(metricsSnapshots.snapshotDate));

		return snapshots.map((snapshot) => {
			let value = 0;

			if (metricType === "productivity") {
				value = snapshot.prsMerged + snapshot.ticketsCompleted;
			} else if (metricType === "collaboration") {
				value = snapshot.reviewsCompleted;
			} else if (metricType === "quality") {
				const totalWork = snapshot.prsMerged + snapshot.ticketsCompleted;
				const bugs = snapshot.bugsFixed;
				value = totalWork > 0 ? ((totalWork - bugs) / totalWork) * 100 : 0;
			}

			return {
				date: snapshot.snapshotDate,
				value: Math.round(value),
			};
		});
	}
}

export const metricsService = new MetricsService();

