
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const stats = [
  { label: "Total NFTs", value: "1,116,891", icon: Sparkles },
  { label: "Trending", value: "331,951 Sales", icon: TrendingUp },
  { label: "Latest Drop", value: "~2m ago", icon: Clock },
];

export const MarketplaceStats = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto px-3">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="relative group"
          style={{
            animationDelay: `${index * 200}ms`,
            opacity: 0,
            animation: "fadeIn 1s ease-out forwards",
          }}
        >
          <div className="relative p-4 md:p-6 rounded-xl border border-border/50 bg-gradient-to-br from-primary/10 to-background/5 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-center space-x-3 md:space-x-4">
              <stat.icon className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-primary transition-all duration-300 group-hover:scale-110`} />
              <div className="text-left">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-lg md:text-2xl font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
