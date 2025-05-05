
import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Direction = "straight" | "left" | "right" | "backward";

interface DirectionIndicatorProps {
  direction: Direction;
  className?: string;
}

export function DirectionIndicator({ direction, className }: DirectionIndicatorProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation effect when direction changes
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [direction]);

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="text-lg font-medium mb-2">Robot Direction</div>
      <div className={cn(
        "p-6 bg-slate-100 rounded-full transition-all duration-300",
        animate && "scale-110",
        direction === "left" && "bg-blue-100",
        direction === "right" && "bg-green-100",
        direction === "straight" && "bg-purple-100",
        direction === "backward" && "bg-orange-100"
      )}>
        {direction === "straight" && (
          <ArrowUp 
            size={48} 
            className={cn(
              "text-purple-600 transition-all duration-300", 
              animate && "animate-pulse"
            )} 
          />
        )}
        {direction === "left" && (
          <ArrowLeft 
            size={48} 
            className={cn(
              "text-blue-600 transition-all duration-300", 
              animate && "animate-pulse"
            )} 
          />
        )}
        {direction === "right" && (
          <ArrowRight 
            size={48} 
            className={cn(
              "text-green-600 transition-all duration-300", 
              animate && "animate-pulse"
            )} 
          />
        )}
        {direction === "backward" && (
          <ArrowDown 
            size={48} 
            className={cn(
              "text-orange-600 transition-all duration-300", 
              animate && "animate-pulse"
            )} 
          />
        )}
      </div>
    </div>
  );
}
