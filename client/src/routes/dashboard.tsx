import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getDashboardMetrics, getTrendData } from "../lib/api/metrics/metrics.get";
import type { AggregatedMetrics, TrendData } from "shared";
import { MetricCard } from "../components/dashboard/metric-card";
import { PerformanceScores } from "../components/dashboard/performance-scores";
import { WorkDistribution } from "../components/dashboard/work-distribution";
import { ActivityTrends } from "../components/dashboard/activity-trends";
import { GitHubHighlights, JiraHighlights } from "../components/dashboard/highlights";
import { PeriodSelector } from "../components/dashboard/period-selector";
import {
	GitPullRequest,
	MessageSquare,
	GitCommit,
	CheckCircle2,
	Activity,
} from "lucide-react";

const Dashboard = () => {
	const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);
	const [productivityTrend, setProductivityTrend] = useState<TrendData | null>(null);
	const [collaborationTrend, setCollaborationTrend] = useState<TrendData | null>(null);
	const [loading, setLoading] = useState(true);
	const [period, setPeriod] = useState("30");

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [metricsData, prodTrend, collabTrend] = await Promise.all([
					getDashboardMetrics(period),
					getTrendData("productivity", "90"),
					getTrendData("collaboration", "90"),
				]);
				setMetrics(metricsData);
				setProductivityTrend(prodTrend);
				setCollaborationTrend(collabTrend);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [period]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
					<p className="text-muted-foreground">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	if (!metrics) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<p className="text-muted-foreground">No data available</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground">
						Your career progress at a glance
					</p>
				</div>
				<PeriodSelector period={period} onChange={setPeriod} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<MetricCard
					title="PRs Merged"
					value={metrics.github.mergedPRs}
					subtitle={`${metrics.github.openPRs} open PRs`}
					icon={GitPullRequest}
				/>
				<MetricCard
					title="Reviews"
					value={metrics.github.totalReviews}
					subtitle={`${metrics.github.actionableReviews} actionable`}
					icon={MessageSquare}
				/>
				<MetricCard
					title="Commits"
					value={metrics.github.totalCommits}
					subtitle={`+${metrics.github.linesAdded} / -${metrics.github.linesDeleted} lines`}
					icon={GitCommit}
				/>
				<MetricCard
					title="Tickets"
					value={metrics.jira.completedTickets}
					subtitle={`${metrics.jira.completedStoryPoints} story points`}
					icon={CheckCircle2}
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<PerformanceScores metrics={metrics.overall} />
				<WorkDistribution metrics={metrics.jira} />
			</div>

			{productivityTrend && productivityTrend.trends.length > 0 && (
				<ActivityTrends
					productivityTrend={productivityTrend}
					collaborationTrend={collaborationTrend}
				/>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<GitHubHighlights metrics={metrics.github} />
				<JiraHighlights metrics={metrics.jira} />
			</div>
		</div>
	);
};

export const Route = createFileRoute("/dashboard")({
	component: () => <Dashboard />,
});

