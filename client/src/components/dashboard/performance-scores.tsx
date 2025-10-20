import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { OverallMetrics } from "shared";

interface PerformanceScoresProps {
	metrics: OverallMetrics;
}

export function PerformanceScores({ metrics }: PerformanceScoresProps) {
	const getTrendIcon = (trend: "up" | "down" | "stable") => {
		if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
		if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
		return <Minus className="h-4 w-4 text-gray-500" />;
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Performance Scores</CardTitle>
				<CardDescription>Your overall performance metrics</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium">Productivity</span>
						<Badge variant="secondary">
							{metrics.productivityScore}/100
						</Badge>
					</div>
					<div className="w-full bg-secondary rounded-full h-2">
						<div
							className="bg-blue-600 h-2 rounded-full transition-all"
							style={{ width: `${metrics.productivityScore}%` }}
						/>
					</div>
				</div>

				<div>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium">Collaboration</span>
						<Badge variant="secondary">
							{metrics.collaborationScore}/100
						</Badge>
					</div>
					<div className="w-full bg-secondary rounded-full h-2">
						<div
							className="bg-purple-600 h-2 rounded-full transition-all"
							style={{ width: `${metrics.collaborationScore}%` }}
						/>
					</div>
				</div>

				<div>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium">Quality</span>
						<Badge variant="secondary">
							{metrics.qualityScore}/100
						</Badge>
					</div>
					<div className="w-full bg-secondary rounded-full h-2">
						<div
							className="bg-green-600 h-2 rounded-full transition-all"
							style={{ width: `${metrics.qualityScore}%` }}
						/>
					</div>
				</div>

				<Separator />

				<div className="flex items-center justify-between">
					<span className="text-sm font-medium">Velocity Trend</span>
					<div className="flex items-center gap-2">
						{getTrendIcon(metrics.velocityTrend)}
						<Badge variant="outline" className="capitalize">
							{metrics.velocityTrend}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

