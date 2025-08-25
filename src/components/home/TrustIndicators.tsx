
import { Shield, Award, CheckCircle2, BadgeCheck, Lock, ArrowRight } from "lucide-react";

const trustFeatures = [
  {
    icon: Shield,
    title: "Secure Trading",
    description: "Advanced blockchain security and escrow system protects every transaction"
  },
  {
    icon: Award,
    title: "Verified Artists",
    description: "All creators are thoroughly vetted to ensure authentic, high-quality NFTs"
  },
  {
    icon: CheckCircle2,
    title: "100% Ownership",
    description: "Full digital rights and provable ownership of all purchased collectibles"
  },
  {
    icon: BadgeCheck,
    title: "Authenticity Guaranteed",
    description: "Every NFT is verified with blockchain certification of authenticity"
  },
  {
    icon: Lock,
    title: "Privacy Protected",
    description: "Your personal information is always secure and never shared"
  }
];

export const TrustIndicators = () => {
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
            <span className="text-sm font-medium text-muted-foreground">Why Trust PureNFT</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Secure &</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Trusted</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-4" />
          <p className="text-lg text-muted-foreground font-light">
            Your security and trust are our highest priorities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustFeatures.slice(0, 5).map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 hover:border-primary/20 transition-all duration-300 hover:bg-card/60 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-lg font-bold mb-3 text-foreground">
                {feature.title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
