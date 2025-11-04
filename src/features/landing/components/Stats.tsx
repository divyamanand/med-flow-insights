import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, TrendingUp } from "lucide-react";

export function Stats() {
	const css = {
		section: "container mx-auto px-4 py-12",
		grid: "grid md:grid-cols-3 gap-6 max-w-4xl mx-auto",
		card: "border-2 hover:border-primary/50 transition-colors",
		content: "pt-6 text-center space-y-2",
		icon: "h-8 w-8 mx-auto text-primary",
		value: "text-2xl font-bold",
		label: "text-sm text-muted-foreground",
	};

	const items = [
		{ icon: Shield, label: "HIPAA-Ready", value: "Compliance" },
		{ icon: Clock, label: "24/7 Access", value: "Availability" },
		{ icon: TrendingUp, label: "Efficiency", value: "40% Faster" },
	];

	return (
		<section className={css.section}>
			<div className={css.grid}>
				{items.map((stat, i) => (
					<Card key={i} className={css.card}>
						<CardContent className={css.content}>
							<stat.icon className={css.icon} />
							<div className={css.value}>{stat.value}</div>
							<div className={css.label}>{stat.label}</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}

