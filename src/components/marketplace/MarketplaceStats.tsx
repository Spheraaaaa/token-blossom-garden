
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLiveStats } from "@/hooks/useLiveStats";
import { cn } from "@/lib/utils";

export const MarketplaceStats = () => {
  const isMobile = useIsMobile();
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto px-3">
      {statsData.map((stat, index) => (
        <div
          key={stat.label}
          className="relative group"
          style={{
            animationDelay: `${index * 200}ms`,
            opacity: 0,
            animation: "fadeIn 1s ease-out forwards",
          }}
        >
          <div className="relative overflow-hidden p-4 md:p-6 rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 via-background/50 to-secondary/5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-primary/30">
            {/* Глянцевый эффект */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
            
            {/* Анимированный фон для обновляющихся значений */}
            {stat.isAnimating && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent animate-pulse" />
            )}
            
            <div className="relative flex items-center justify-center space-x-3 md:space-x-4">
              <div className="relative">
                <stat.icon className={cn(
                  isMobile ? 'w-6 h-6' : 'w-8 h-8',
                  "text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-12",
                  stat.isAnimating && "animate-bounce text-accent"
                )} />
                {stat.isAnimating && (
                  <div className="absolute inset-0 animate-ping">
                    <stat.icon className={cn(
                      isMobile ? 'w-6 h-6' : 'w-8 h-8',
                      "text-primary opacity-30"
                    )} />
                  </div>
                )}
              </div>
              <div className="text-left">
                <p className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {stat.label}
                </p>
                <p className={cn(
                  "text-lg md:text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105",
                  stat.isAnimating && "text-accent animate-pulse scale-110"
                )}>
                  {stat.value}
                </p>
                {stat.isAnimating && (
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-accent rounded-full animate-ping" />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
