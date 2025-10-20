import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "../ui/chart";
import type { JiraMetrics } from "shared";

interface WorkDistributionProps {
	metrics: JiraMetrics;
}

export function WorkDistribution({ metrics }: WorkDistributionProps) {
	const workDistributionData = [
		{ name: "Features", value: metrics.featureCount, color: "#10b981" },
		{ name: "Bugs", value: metrics.bugCount, color: "#ef4444" },
		{ name: "Tech Debt", value: metrics.techDebtCount, color: "#f59e0b" },
	];

	return (
		<Card className="lg:col-span-2">
			<CardHeader>
				<CardTitle>Work Distribution</CardTitle>
				<CardDescription>
					Breakdown of your Jira work by type
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<ResponsiveContainer width="100%" height={200}>
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
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<ChartTooltip content={<ChartTooltipContent />} />
							</PieChart>
						</ResponsiveContainer>
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
			</CardContent>
		</Card>
	);
}

