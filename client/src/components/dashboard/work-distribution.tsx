import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";
import type { JiraMetrics } from "shared";

interface WorkDistributionProps {
	metrics: JiraMetrics;
}

export function WorkDistribution({ metrics }: WorkDistributionProps) {
	const workDistributionData = [
		{ name: "Features", value: metrics.featureCount, fill: "#10b981" },
		{ name: "Bugs", value: metrics.bugCount, fill: "#ef4444" },
		{ name: "Tech Debt", value: metrics.techDebtCount, fill: "#f59e0b" },
	];

	const hasData = metrics.totalTickets > 0;

	const chartConfig = {
		Features: {
			label: "Features",
			color: "#10b981",
		},
		Bugs: {
			label: "Bugs",
			color: "#ef4444",
		},
		"Tech Debt": {
			label: "Tech Debt",
			color: "#f59e0b",
		},
	} satisfies ChartConfig;

	return (
		<Card className="lg:col-span-2">
			<CardHeader>
				<CardTitle>Work Distribution</CardTitle>
				<CardDescription>
					Breakdown of your Jira work by type
				</CardDescription>
			</CardHeader>
		<CardContent>
			{!hasData ? (
				<div className="flex items-center justify-center h-[200px] text-muted-foreground">
					<p>No work data available for this period</p>
				</div>
			) : (
			<div className="grid grid-cols-2 gap-4">
				<div className="h-[200px]">
					<ChartContainer config={chartConfig} className="h-full w-full">
						<PieChart>
							<Pie
								data={workDistributionData}
								cx="50%"
								cy="50%"
								labelLine={false}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value"
							>
								{workDistributionData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.fill} />
								))}
							</Pie>
							<ChartTooltip content={<ChartTooltipContent />} />
						</PieChart>
					</ChartContainer>
				</div>
					<div className="flex flex-col justify-center space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-green-500" />
								<span className="text-sm">Features</span>
							</div>
							<span className="font-semibold">{metrics.featureCount}</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-red-500" />
								<span className="text-sm">Bugs</span>
							</div>
							<span className="font-semibold">{metrics.bugCount}</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-amber-500" />
								<span className="text-sm">Tech Debt</span>
							</div>
							<span className="font-semibold">{metrics.techDebtCount}</span>
						</div>
						<Separator />
						<div className="flex items-center justify-between font-semibold">
							<span>Total Tickets</span>
							<span>{metrics.totalTickets}</span>
						</div>
				</div>
			</div>
			)}
		</CardContent>
	</Card>
	);
}

