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
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [obstacles]);

  const hasObstacle = obstacles.left > 0 || obstacles.mid > 0 || obstacles.right > 0;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="text-xl font-semibold text-slate-800 mb-4">Obstacle Detection</div>

      <div className="grid grid-cols-3 gap-6 p-6 bg-white rounded-xl shadow-md w-full max-w-md">
        <ObstacleIndicator value={obstacles.left} label="Left" animate={animate} />
        <ObstacleIndicator value={obstacles.mid} label="Center" animate={animate} />
        <ObstacleIndicator value={obstacles.right} label="Right" animate={animate} />
      </div>

      {hasObstacle && (
        <div
          className={cn(
            "mt-5 py-2 px-5 bg-red-100 text-red-800 rounded-full text-sm font-semibold shadow-sm transition-all duration-300",
            animate && "animate-pulse"
          )}
        >
          ⚠️ Obstacle Detected
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
    <div className="flex flex-col items-center space-y-2">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-inner border transition-all duration-300",
          hasObstacle
            ? "bg-red-50 border-red-300 text-red-700 font-bold"
            : "bg-green-50 border-green-300 text-green-700 font-semibold",
          animate && hasObstacle && "scale-110"
        )}
      >
        {value}
      </div>
    </div>
  );
}
