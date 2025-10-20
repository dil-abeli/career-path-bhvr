import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import type { TrendData } from "shared";

interface ActivityTrendsProps {
	productivityTrend: TrendData;
	collaborationTrend: TrendData | null;
}

const chartConfig = {
	productivity: {
		label: "Productivity",
		color: "#3b82f6",
	},
	collaboration: {
		label: "Collaboration",
		color: "#8b5cf6",
	},
};

export function ActivityTrends({ productivityTrend, collaborationTrend }: ActivityTrendsProps) {
	const chartData = productivityTrend.trends.map((item, index) => ({
		date: new Date(item.date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		}),
		productivity: item.value,
		collaboration: collaborationTrend?.trends[index]?.value || 0,
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Activity Trends</CardTitle>
				<CardDescription>
					Your productivity and collaboration over the last 90 days
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Legend />
							<Line
								type="monotone"
								dataKey="productivity"
								stroke={chartConfig.productivity.color}
								strokeWidth={2}
								name="Productivity"
							/>
							<Line
								type="monotone"
								dataKey="collaboration"
								stroke={chartConfig.collaboration.color}
								strokeWidth={2}
								name="Collaboration"
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

