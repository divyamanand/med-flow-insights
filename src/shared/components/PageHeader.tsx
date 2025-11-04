import { ReactNode } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: Crumb[];
};

export function PageHeader({ title, description, actions, breadcrumbs }: PageHeaderProps) {
  const css = {
    root: "mb-4 flex flex-col gap-3 md:mb-6 animate-in slide-in-from-bottom-2 duration-300",
    head: "flex items-start justify-between gap-4",
    title: "text-3xl font-bold tracking-tight",
    descr: "text-muted-foreground",
    actions: "flex-shrink-0",
  };

  return (
    <div className={css.root}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((c, i) => (
              <>
                <BreadcrumbItem key={c.label}>
                  {c.href ? (
                    <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className={css.head}>
        <div>
          <h1 className={css.title}>{title}</h1>
          {description && <p className={css.descr}>{description}</p>}
        </div>
        {actions && <div className={css.actions}>{actions}</div>}
      </div>
    </div>
  );
}
