export function HowItWorks() {
  const css = {
    section: "container mx-auto px-4 py-16",
    wrap: "max-w-5xl mx-auto",
    h3: "text-3xl font-bold mb-8 text-center",
    steps: "relative grid gap-8 md:grid-cols-3",
    line: "absolute left-1/2 top-12 hidden h-0.5 w-[66%] -translate-x-1/2 bg-primary/30 md:block",
    step: "relative rounded-lg border bg-card p-6 shadow-sm",
    badge: "mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold",
    title: "text-lg font-semibold",
    descr: "text-sm text-muted-foreground mt-1",
  };

  const steps = [
    { n: 1, title: "Integrate", descr: "Connect your data sources and users securely." },
    { n: 2, title: "Optimize", descr: "Automate workflows and reduce wait times." },
    { n: 3, title: "Grow", descr: "Scale operations while maintaining compliance." },
  ];

  return (
    <section className={css.section}>
      <div className={css.wrap}>
        <h3 className={css.h3}>How It Works</h3>
        <div className={css.steps}>
          <div className={css.line} />
          {steps.map((s) => (
            <div key={s.n} className={css.step}>
              <div className={css.badge}>{s.n}</div>
              <div className={css.title}>{s.title}</div>
              <div className={css.descr}>{s.descr}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
