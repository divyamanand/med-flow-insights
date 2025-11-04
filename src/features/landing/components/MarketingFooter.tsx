import { Twitter, Youtube } from "lucide-react";

export function MarketingFooter() {
	const css = {
		footer: "mt-20 border-t bg-muted/30",
		wrap: "container mx-auto px-4 py-16 grid gap-8 md:grid-cols-5",
		colHead: "text-sm font-semibold mb-3",
		link: "text-sm text-muted-foreground hover:text-foreground transition-colors",
		brand: "md:col-span-2",
		bottom: "container mx-auto px-4 pb-8 text-center text-xs text-muted-foreground",
		socials: "mt-4 flex gap-3",
		icon: "h-5 w-5",
	};

	const links = {
		Solutions: ["Patients", "Appointments", "Inventory", "Rooms"],
		Company: ["About", "Careers", "Contact"],
		Resources: ["Docs", "API", "Support"],
	} as const;

	return (
		<footer className={css.footer}>
			<div className={css.wrap}>
				<div className={css.brand}>
					<div className="text-lg font-bold">HealthCare Pro</div>
					<p className="mt-2 text-sm text-muted-foreground">
						A modern platform to streamline healthcare operations.
					</p>
					<div className={css.socials}>
						<a className={css.link} href="#" aria-label="Twitter"><Twitter className={css.icon} /></a>
						<a className={css.link} href="#" aria-label="YouTube"><Youtube className={css.icon} /></a>
					</div>
				</div>
				{Object.entries(links).map(([title, items]) => (
					<div key={title}>
						<div className={css.colHead}>{title}</div>
						<ul className="space-y-2">
							{items.map((l) => (
								<li key={l}><a className={css.link} href="#">{l}</a></li>
							))}
						</ul>
					</div>
				))}
			</div>
			<div className={css.bottom}>© 2025 HealthCare Pro. All rights reserved.</div>
		</footer>
	);
}

