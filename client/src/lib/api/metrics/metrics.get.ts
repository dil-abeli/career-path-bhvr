import { apiRequest } from "../fetch-client";
import type { AggregatedMetrics, GitHubMetrics, JiraMetrics, TrendData } from "shared";

interface ApiResponse<T> {
	success: boolean;
	data: T;
}

export async function getDashboardMetrics(period: string = "30"): Promise<AggregatedMetrics> {
	const response = await apiRequest<ApiResponse<AggregatedMetrics>>(
		`/api/metrics/dashboard?period=${period}`
	);
	return response.data;
}

export async function getGitHubMetrics(period: string = "30"): Promise<GitHubMetrics> {
	const response = await apiRequest<ApiResponse<GitHubMetrics>>(
		`/api/metrics/github?period=${period}`
	);
	return response.data;
}

export async function getJiraMetrics(period: string = "30"): Promise<JiraMetrics> {
	const response = await apiRequest<ApiResponse<JiraMetrics>>(
		`/api/metrics/jira?period=${period}`
	);
	return response.data;
}

export async function getTrendData(
	type: "productivity" | "collaboration" | "quality",
	period: string = "90"
): Promise<TrendData> {
	const response = await apiRequest<ApiResponse<TrendData>>(
		`/api/metrics/trends?type=${type}&period=${period}`
	);
	return response.data;
}

