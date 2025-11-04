import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export function Testimonials() {
	const css = {
		section: "container mx-auto px-4 py-20",
		head: "text-center mb-10",
		h3: "text-3xl font-bold",
		sub: "text-sm text-muted-foreground mt-1",
		grid: "grid gap-6 md:grid-cols-3 max-w-6xl mx-auto",
		card: "border bg-card/60 backdrop-blur hover:shadow-md transition-all",
		content: "p-6 space-y-3",
		quote: "text-muted-foreground",
		author: "text-sm font-medium",
		role: "text-xs text-muted-foreground",
		icon: "h-6 w-6 text-primary",
	};

	const items = [
		{
			text: "MedFlow streamlined our admissions and cut wait times significantly.",
			author: "Dr. Alex Carter",
			role: "Chief Medical Officer",
		},
		{
			text: "Inventory automation and dashboards made daily ops effortless.",
			author: "Priya Sharma",
			role: "Head Nurse",
		},
		{
			text: "Scheduling and patient records are finally in one place.",
			author: "Michael Johnson",
			role: "Hospital Admin",
		},
	];

	return (
		<section className={css.section}>
			<div className={css.head}>
				<h3 className={css.h3}>Client Testimonials</h3>
				<p className={css.sub}>What our partners say about HealthCare Pro</p>
			</div>
			<div className={css.grid}>
				{items.map((t, i) => (
					<Card key={i} className={css.card}>
						<CardContent className={css.content}>
							<Quote className={css.icon} />
							<p className={css.quote}>“{t.text}”</p>
							<div className={css.author}>{t.author}</div>
							<div className={css.role}>{t.role}</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}

