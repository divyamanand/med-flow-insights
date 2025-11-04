import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();

  const css = {
    btn: "relative inline-flex items-center justify-center",
    sun: "h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0",
    moon: "absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100",
  };

  const current = theme === "system" ? systemTheme : theme;
  const next = current === "dark" ? "light" : "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className={css.btn}
      onClick={() => setTheme(next as "light" | "dark")}
    >
      <Sun className={css.sun} />
      <Moon className={css.moon} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
