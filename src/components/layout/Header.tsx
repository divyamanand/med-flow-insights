
import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

export function Header() {
  return (
    <div className="flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[300px] pl-9"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </Button>
      </div>
    </div>
  );
}
