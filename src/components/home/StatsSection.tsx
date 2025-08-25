
import { Users, TrendingUp, Star, Clock, Shield, Globe } from "lucide-react";

const stats = [
  { 
    label: "Active Users", 
    value: "50K+", 
    icon: Users,
    description: "Join our growing community of NFT enthusiasts from around the world."
  },
  { 
    label: "Total Volume", 
    value: "$100M+", 
    icon: TrendingUp,
    description: "Traders have exchanged millions in value across our secure platform."
  },
  { 
    label: "NFTs Created", 
    value: "1M+", 
    icon: Star,
    description: "Artists and creators have minted over a million unique digital collectibles."
  },
  { 
    label: "Platform Uptime", 
    value: "99.9%", 
    icon: Clock,
    description: "Our reliable infrastructure ensures your assets are always accessible."
  },
  { 
    label: "Secure Transactions", 
    value: "100%", 
    icon: Shield,
    description: "Every transaction is protected by advanced blockchain security."
  },
  { 
    label: "Global Reach", 
    value: "190+", 
    icon: Globe,
    description: "Connect with buyers and sellers from countries around the world."
  }
];

export const StatsSection = () => {
  return (
    <div className="py-20 relative overflow-hidden bg-gradient-to-br from-background via-background/98 to-background/95">
      {/* Clean background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-accent/1 to-secondary/1" />
      
      {/* Elegant floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-gradient-to-br from-primary/6 via-accent/4 to-transparent rounded-full blur-3xl animate-simple-float opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] bg-gradient-to-br from-accent/4 via-secondary/3 to-transparent rounded-full blur-2xl animate-simple-float opacity-30" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-xl rounded-xl px-4 py-2 border border-primary/10 shadow-lg mb-6">
            <div className="w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full" />
            <span className="text-sm font-medium text-muted-foreground">Platform Statistics</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Growing</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Community</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-4" />
          <p className="text-lg text-muted-foreground font-light">
            Join thousands of creators and collectors in our thriving marketplace
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 hover:border-primary/20 transition-all duration-300 hover:bg-card/60 group"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
