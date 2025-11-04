import { Card, CardContent } from "@/components/ui/card";

export function Results() {
  const css = {
    section: "container mx-auto px-4 py-16",
    wrap: "max-w-6xl mx-auto grid gap-6 md:grid-cols-4",
    card: "rounded-xl border bg-card/60 backdrop-blur shadow-sm",
    big: "text-3xl font-bold",
    label: "text-sm text-muted-foreground",
  };

  const items = [
    { value: "+15%", label: "Faster Flow of Care" },
    { value: "+10%", label: "Reduced Wait Times" },
    { value: "99%", label: "Data Accuracy" },
    { value: "120%", label: "Return on Investment" },
  ];

  return (
    <section className={css.section}>
      <div className={css.wrap}>
        {items.map((x, i) => (
          <Card key={i} className={css.card}>
            <CardContent className="p-6 text-center">
              <div className={css.big}>{x.value}</div>
              <div className={css.label}>{x.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
