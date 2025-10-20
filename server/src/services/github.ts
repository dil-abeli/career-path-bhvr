import { db } from "../db";
import {
	githubPullRequests,
	githubReviews,
	githubCommits,
	type NewGithubPullRequest,
	type NewGithubReview,
	type NewGithubCommit,
} from "../db/schema";
import { eq, and, gte } from "drizzle-orm";

const GITHUB_API_BASE = "https://api.github.com";

interface GitHubPR {
	id: number;
	number: number;
	title: string;
	state: string;
	html_url: string;
	user: { login: string };
	created_at: string;
	updated_at: string;
	merged_at: string | null;
	closed_at: string | null;
	additions: number;
	deletions: number;
	changed_files: number;
	comments: number;
	review_comments: number;
}

interface GitHubReview {
	id: number;
	user: { login: string };
	state: string;
	submitted_at: string;
	body: string | null;
	html_url: string;
}

interface GitHubCommit {
	sha: string;
	commit: {
		message: string;
		author: {
			name: string;
			date: string;
		};
	};
	stats?: {
		additions: number;
		deletions: number;
	};
	html_url: string;
}

export class GitHubService {
	private token: string;
	private username: string;

	constructor(token: string, username: string) {
		this.token = token;
		this.username = username;
	}

	private async fetch(path: string): Promise<any> {
		const response = await fetch(`${GITHUB_API_BASE}${path}`, {
			headers: {
				Authorization: `token ${this.token}`,
				Accept: "application/vnd.github.v3+json",
			},
		});

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.statusText}`);
		}

		return response.json();
	}

	async getUserInfo(): Promise<{ login: string; name: string; avatar_url: string }> {
		return this.fetch("/user");
	}

	async syncPullRequests(userId: string, since?: Date): Promise<number> {
		const prs: GitHubPR[] = await this.fetch(
			`/search/issues?q=author:${this.username}+type:pr${
				since ? `+created:>=${since.toISOString().split("T")[0]}` : ""
			}&per_page=100`
		).then((data) => data.items);

		let synced = 0;

		for (const pr of prs) {
			const urlParts = pr.html_url
				.replace("https://github.com/", "")
				.split("/pull/");
			const repoFullName = urlParts[0];
			if (!repoFullName) continue;

			const prDetails = await this.fetch(
				`/repos/${repoFullName}/pulls/${pr.number}`
			);

			const reviews = await this.fetch(
				`/repos/${repoFullName}/pulls/${pr.number}/reviews`
			);

			const existing = await db.query.githubPullRequests.findFirst({
				where: and(
					eq(githubPullRequests.userId, userId),
					eq(githubPullRequests.githubId, pr.id)
				),
			});

			const prData: NewGithubPullRequest = {
				userId,
				githubId: pr.id,
				number: pr.number,
				title: pr.title,
				state: pr.state,
				repository: repoFullName,
				author: pr.user.login,
				createdAt: new Date(pr.created_at),
				updatedAt: new Date(pr.updated_at),
				mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
				closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
				additions: prDetails.additions || 0,
				deletions: prDetails.deletions || 0,
				changedFiles: prDetails.changed_files || 0,
				reviewCount: reviews.length || 0,
				commentCount: (pr.comments || 0) + (pr.review_comments || 0),
				url: pr.html_url,
				syncedAt: new Date(),
			};

			if (existing) {
				await db
					.update(githubPullRequests)
					.set(prData)
					.where(eq(githubPullRequests.id, existing.id));
			} else {
				await db.insert(githubPullRequests).values(prData);
			}

			synced++;
		}

		return synced;
	}

	async syncReviews(userId: string, since?: Date): Promise<number> {
		const searchQuery = `reviewed-by:${this.username}+type:pr${
			since ? `+created:>=${since.toISOString().split("T")[0]}` : ""
		}`;

		const prs = await this.fetch(
			`/search/issues?q=${searchQuery}&per_page=100`
		).then((data) => data.items);

		let synced = 0;

		for (const pr of prs) {
			const urlParts = pr.html_url
				.replace("https://github.com/", "")
				.split("/pull/");
			const repoFullName = urlParts[0];
			if (!repoFullName) continue;

			const reviews: GitHubReview[] = await this.fetch(
				`/repos/${repoFullName}/pulls/${pr.number}/reviews`
			);

			const userReviews = reviews.filter((r) => r.user.login === this.username);

			for (const review of userReviews) {
				const existing = await db.query.githubReviews.findFirst({
					where: and(
						eq(githubReviews.userId, userId),
						eq(githubReviews.githubId, review.id)
					),
				});

				const comments = await this.fetch(
					`/repos/${repoFullName}/pulls/${pr.number}/comments`
				);
				const userComments = comments.filter(
					(c: any) => c.user.login === this.username
				);

				const reviewData: NewGithubReview = {
					userId,
					githubId: review.id,
					pullRequestNumber: pr.number,
					repository: repoFullName,
					state: review.state,
					reviewer: review.user.login,
					submittedAt: new Date(review.submitted_at),
					commentCount: userComments.length,
					body: review.body,
					url: review.html_url,
					syncedAt: new Date(),
				};

				if (existing) {
					await db
						.update(githubReviews)
						.set(reviewData)
						.where(eq(githubReviews.id, existing.id));
				} else {
					await db.insert(githubReviews).values(reviewData);
				}

				synced++;
			}
		}

		return synced;
	}

	async syncCommits(userId: string, since?: Date): Promise<number> {
		const events = await this.fetch(
			`/users/${this.username}/events?per_page=100`
		);

		const pushEvents = events.filter((e: any) => e.type === "PushEvent");

		let synced = 0;

		for (const event of pushEvents) {
			const repo = event.repo.name;
			const headSha = event.payload.head;

			if (!headSha) continue;

			try {
				const commitDetails: GitHubCommit = await this.fetch(
					`/repos/${repo}/commits/${headSha}`
				);

				const existing = await db.query.githubCommits.findFirst({
					where: and(
						eq(githubCommits.userId, userId),
						eq(githubCommits.sha, headSha)
					),
				});

				if (existing) {
					continue;
				}

				const commitData: NewGithubCommit = {
					userId,
					sha: headSha,
					repository: repo,
					message: commitDetails.commit.message,
					author: commitDetails.commit.author.name,
					committedAt: new Date(commitDetails.commit.author.date),
					additions: commitDetails.stats?.additions || 0,
					deletions: commitDetails.stats?.deletions || 0,
					url: commitDetails.html_url,
					syncedAt: new Date(),
				};

				await db.insert(githubCommits).values(commitData);
				synced++;
			} catch (error) {
				console.error(`Error syncing commit ${headSha}:`, error);
			}
		}

		return synced;
	}

	async syncAll(userId: string, since?: Date): Promise<{
		prs: number;
		reviews: number;
		commits: number;
	}> {
		const [prs, reviews, commits] = await Promise.all([
			this.syncPullRequests(userId, since),
			this.syncReviews(userId, since),
			this.syncCommits(userId, since),
		]);

		return { prs, reviews, commits };
	}
}

export async function createGitHubService(
	token: string
): Promise<GitHubService> {
	const tempService = new GitHubService(token, "");
	const userInfo = await tempService.getUserInfo();
	return new GitHubService(token, userInfo.login);
}

