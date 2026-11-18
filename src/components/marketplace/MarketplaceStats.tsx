
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import { useLiveStats } from "@/hooks/useLiveStats";
import { cn } from "@/lib/utils";

export const MarketplaceStats = () => {
  const { stats, animatingStats } = useLiveStats();

  const statsData = [
    { 
      label: "Total NFTs", 
      value: stats.totalNFTs.toLocaleString(), 
      icon: Sparkles,
      isAnimating: animatingStats.totalNFTs
    },
    { 
      label: "Trending", 
      value: `${stats.totalSales.toLocaleString()} Sales`, 
      icon: TrendingUp,
      isAnimating: animatingStats.totalSales
    },
    { 
      label: "Latest Drop", 
      value: stats.latestDropTime, 
      icon: Clock,
      isAnimating: false
    },
  ];
  
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
      {statsData.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 md:px-6 md:py-5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-inset ring-primary/20">
            <stat.icon
              className={cn("h-5 w-5 transition-colors duration-500", stat.isAnimating ? "text-accent" : "text-primary")}
              aria-hidden="true"
            />
          </span>
          <div className="flex min-w-0 flex-col-reverse">
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd
              className={cn(
                "font-display text-xl md:text-2xl font-semibold tabular-nums transition-colors duration-500",
                stat.isAnimating ? "text-accent" : "text-foreground"
              )}
            >
              {stat.value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
};
