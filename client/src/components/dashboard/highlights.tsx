import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { GitHubMetrics, JiraMetrics } from "shared";

interface GitHubHighlightsProps {
	metrics: GitHubMetrics;
}

export function GitHubHighlights({ metrics }: GitHubHighlightsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>GitHub Highlights</CardTitle>
				<CardDescription>Key metrics from your GitHub activity</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex justify-between">
					<span className="text-sm text-muted-foreground">Average PR Size</span>
					<span className="font-semibold">{metrics.avgPRSize} lines</span>
				</div>
				<div className="flex justify-between">
					<span className="text-sm text-muted-foreground">
						Review Quality Score
					</span>
					<span className="font-semibold">{metrics.reviewQualityScore}%</span>
				</div>
				<div className="flex justify-between">
					<span className="text-sm text-muted-foreground">Total PRs</span>
					<span className="font-semibold">{metrics.totalPRs}</span>
				</div>
			</CardContent>
		</Card>
	);
}

interface JiraHighlightsProps {
	metrics: JiraMetrics;
}

export function JiraHighlights({ metrics }: JiraHighlightsProps) {
	const completionRate =
		metrics.totalTickets > 0
			? Math.round((metrics.completedTickets / metrics.totalTickets) * 100)
			: 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Jira Highlights</CardTitle>
				<CardDescription>Key metrics from your Jira activity</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex justify-between">
					<span className="text-sm text-muted-foreground">
						Average Cycle Time
					</span>
					<span className="font-semibold">{metrics.avgCycleTime} days</span>
				</div>
				<div className="flex justify-between">
					<span className="text-sm text-muted-foreground">Velocity</span>
					<span className="font-semibold">{metrics.velocity} SP/week</span>
				</div>
				<div className="flex justify-between">
					<span className="text-sm text-muted-foreground">Completion Rate</span>
					<span className="font-semibold">{completionRate}%</span>
				</div>
			</CardContent>
		</Card>
	);
}

