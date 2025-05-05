
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ObstacleDisplayProps {
  obstacles: {
    left: number;
    mid: number;
    right: number;
  };
  className?: string;
}

export function ObstacleDisplay({ obstacles, className }: ObstacleDisplayProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation effect when obstacles change
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [obstacles]);

  const hasObstacle = obstacles.left > 0 || obstacles.mid > 0 || obstacles.right > 0;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="text-lg font-medium mb-2">Obstacle Detection</div>
      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg w-full">
        <ObstacleIndicator 
          value={obstacles.left} 
          label="Left" 
          animate={animate} 
        />
        <ObstacleIndicator 
          value={obstacles.mid} 
          label="Middle" 
          animate={animate} 
        />
        <ObstacleIndicator 
          value={obstacles.right} 
          label="Right" 
          animate={animate} 
        />
      </div>
      {hasObstacle && (
        <div className={cn(
          "mt-4 py-1 px-3 bg-red-100 text-red-700 rounded-full text-sm font-medium",
          animate && "animate-pulse"
        )}>
          Obstacle Detected!
        </div>
      )}
    </div>
  );
}

interface ObstacleIndicatorProps {
  value: number;
  label: string;
  animate: boolean;
}

function ObstacleIndicator({ value, label, animate }: ObstacleIndicatorProps) {
  const hasObstacle = value > 0;
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div 
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 mt-2",
          hasObstacle 
            ? "bg-red-100 text-red-700 border-2 border-red-300" 
            : "bg-green-100 text-green-700",
          animate && hasObstacle && "scale-110"
        )}
      >
        <span className="text-lg font-bold">{value}</span>
      </div>
    </div>
  );
}
