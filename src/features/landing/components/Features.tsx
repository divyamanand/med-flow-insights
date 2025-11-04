import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Calendar, UserCog } from "lucide-react";

export function Features() {
	const css = {
		section: "container mx-auto px-4 py-20",
		head: "text-center mb-12",
		h3: "text-3xl md:text-4xl font-bold mb-4",
		sub: "text-lg text-muted-foreground max-w-2xl mx-auto",
		grid: "grid md:grid-cols-3 gap-6 max-w-5xl mx-auto",
		card: "group hover:shadow-lg transition-all duration-300 hover:border-primary/50 border",
		content: "pt-6 space-y-3",
		iconWrap: "h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors",
		icon: "h-6 w-6 text-primary",
		title: "font-semibold text-lg",
		descr: "text-sm text-muted-foreground",
	};

	const items = [
		{
			icon: Stethoscope,
			title: "Doctor Scheduling",
			description: "Manage doctor availability, sessions, and appointments.",
		},
		{
			icon: Calendar,
			title: "Appointments",
			description: "Schedule visits with reminders and waitlist support.",
		},
		{
			icon: UserCog,
			title: "Staff Management",
			description: "Track availability, duties, and room assignments.",
		},
	];

	return (
		<section className={css.section}>
			<div className={css.head}>
				<h3 className={css.h3}>Everything You Need</h3>
				<p className={css.sub}>Comprehensive, designed for modern healthcare facilities.</p>
			</div>
			<div className={css.grid}>
				{items.map((f, i) => (
					<Card key={i} className={css.card}>
						<CardContent className={css.content}>
							<div className={css.iconWrap}>
								<f.icon className={css.icon} />
							</div>
							<h4 className={css.title}>{f.title}</h4>
							<p className={css.descr}>{f.description}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}

