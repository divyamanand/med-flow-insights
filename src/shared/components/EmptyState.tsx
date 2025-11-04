import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
};

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-2">{action.label}</Button>
      )}
    </div>
  );
}
