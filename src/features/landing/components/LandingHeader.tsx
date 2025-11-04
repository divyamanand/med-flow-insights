import { Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

export function LandingHeader() {
  const navigate = useNavigate();

  const css = {
    header: "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50",
    wrap: "container mx-auto px-4 py-4 flex justify-between items-center",
    brand: "flex items-center gap-2",
    logo: "h-8 w-8 text-primary",
    title: "text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
    right: "flex items-center gap-2",
  };

  return (
    <header className={css.header}>
      <div className={css.wrap}>
        <div className={css.brand}>
          <Activity className={css.logo} />
          <h1 className={css.title}>HealthCare Pro</h1>
        </div>
        <div className={css.right}>
          <ThemeToggle />
          <Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
