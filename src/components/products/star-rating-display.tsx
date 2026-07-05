import { Star } from "lucide-react";

type StarRatingDisplayProps = {
  avgRating: number;
  reviewCount: number;
  size?: "sm" | "md";
  showCount?: boolean;
};

export function StarRatingDisplay({
  avgRating,
  reviewCount,
  size = "sm",
  showCount = true,
}: StarRatingDisplayProps) {
  if (reviewCount === 0) return null;

  const starClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const textClass = size === "sm" ? "text-xs" : "text-sm";
  const rounded = Math.round(avgRating);

  return (
    <div className="flex items-center gap-1 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${starClass} ${
            i < rounded ? "fill-current" : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
      {showCount && (
        <span className={`ml-1 font-medium text-slate-400 ${textClass}`}>
          ({avgRating.toFixed(1)})
        </span>
      )}
    </div>
  );
}
