interface PeriodSelectorProps {
	period: string;
	onChange: (period: string) => void;
}

export function PeriodSelector({ period, onChange }: PeriodSelectorProps) {
	const periods = [
		{ value: "7", label: "7d" },
		{ value: "30", label: "30d" },
		{ value: "90", label: "90d" },
	];

	return (
		<div className="flex gap-2">
			{periods.map((p) => (
				<button
					key={p.value}
					onClick={() => onChange(p.value)}
					className={`px-3 py-1 rounded transition-colors ${
						period === p.value
							? "bg-primary text-primary-foreground"
							: "bg-secondary hover:bg-secondary/80"
					}`}
				>
					{p.label}
				</button>
			))}
		</div>
	);
}

