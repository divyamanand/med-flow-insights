import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Hero() {
	const navigate = useNavigate();

	const css = {
		section: "container mx-auto px-4 py-20 text-center",
		wrap: "max-w-4xl mx-auto space-y-6 animate-in fade-in-50",
		h2: "text-5xl md:text-6xl font-bold tracking-tight",
		accent: "block text-primary mt-2",
		sub: "text-xl text-muted-foreground max-w-2xl mx-auto",
		ctas: "flex gap-4 justify-center pt-6",
	};

	return (
		<section className={css.section}>
			<div className={css.wrap}>
				<h2 className={css.h2}>
					Modern Healthcare
					<span className={css.accent}>Management System</span>
				</h2>
				<p className={css.sub}>
					Streamline hospital operations with our comprehensive platform. From patient reservations to pharmacy care, inventory control — everything in its place.
				</p>
				<div className={css.ctas}>
					<Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
						Request Sign Up <ArrowRight className="h-4 w-4" />
					</Button>
					<Button onClick={() => navigate("/auth")} variant="outline" size="lg">
						Request Demo
					</Button>
				</div>
			</div>
		</section>
	);
}

