import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter, Plus, Search } from "lucide-react";

type FilterOption = { label: string; value: string };

type ResourceToolbarProps = {
  search?: { value: string; onChange: (v: string) => void; placeholder?: string };
  filter?: { label?: string; value: string | null; onChange: (v: string | null) => void; options: FilterOption[] };
  primaryAction?: { label: string; onClick: () => void; icon?: ReactNode };
  children?: ReactNode; // for extra inline controls
};

export function ResourceToolbar({ search, filter, primaryAction, children }: ResourceToolbarProps) {
  const css = {
    root: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-in fade-in-50 duration-200",
    left: "flex flex-1 items-center gap-3",
    searchWrap: "relative w-full max-w-[420px]",
    searchIcon: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground",
    searchInput: "pl-9",
  };

  return (
    <div className={css.root}>
      <div className={css.left}>
        {search && (
          <div className={css.searchWrap}>
            <Search className={css.searchIcon} />
            <Input
              type="search"
              placeholder={search.placeholder ?? "Search..."}
              className={css.searchInput}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
            />
          </div>
        )}
        {filter && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                {filter.label ?? "Filter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Filter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => filter.onChange(null)}>All</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filter.value ?? undefined} onValueChange={(v) => filter.onChange(v)}>
                {filter.options.map((opt) => (
                  <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {children}
      </div>
      {primaryAction && (
        <Button onClick={primaryAction.onClick}>
          {primaryAction.icon ?? <Plus className="mr-2 h-4 w-4" />} {primaryAction.label}
        </Button>
      )}
    </div>
  );
}
