import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CTA() {
	const navigate = useNavigate();

	const css = {
		section: "container mx-auto px-4 py-20",
		card: "max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2",
		content: "pt-12 pb-12 text-center space-y-6",
		h3: "text-3xl md:text-4xl font-bold",
		sub: "text-lg text-muted-foreground max-w-2xl mx-auto",
	};

	return (
		<section className={css.section}>
			<Card className={css.card}>
				<CardContent className={css.content}>
					<h3 className={css.h3}>Ready to Transform Your Healthcare Operations?</h3>
					<p className={css.sub}>Join healthcare facilities throughout the world for efficient management</p>
					<Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
						Start Now <ArrowRight className="h-4 w-4" />
					</Button>
				</CardContent>
			</Card>
		</section>
	);
}

