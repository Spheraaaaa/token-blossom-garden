
import { Wallet, Star, Shield, ArrowRight, Landmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up and set up your profile to begin your NFT journey with PureNFT.",
    icon: User,
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "Create Wallet",
    description: "Create your crypto wallet to securely buy, sell and manage your digital assets.",
    icon: Wallet,
    color: "from-purple-500 to-indigo-500"
  },
  {
    title: "Discover NFTs",
    description: "Browse through our curated collection of unique digital assets from top creators.",
    icon: Star,
    color: "from-amber-500 to-orange-400"
  },
  {
    title: "Make Transactions",
    description: "Buy, sell, or trade NFTs with confidence using our secure blockchain technology.",
    icon: Shield,
    color: "from-emerald-500 to-green-400"
  },
  {
    title: "Manage Portfolio",
    description: "Track your digital asset performance and manage your growing NFT collection.",
    icon: Landmark,
    color: "from-rose-500 to-pink-500"
  },
  {
    title: "Connect & Earn",
    description: "Join our community, connect with other collectors, and earn rewards.",
    icon: ArrowRight,
    color: "from-fuchsia-500 to-purple-400"
  }
];

export const HowItWorksSection = () => {
  return (
    <div className="py-20 relative overflow-hidden bg-gradient-to-br from-background via-background/98 to-background/95">
      {/* Clean background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-accent/1 to-secondary/1" />
      
      {/* Elegant floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] bg-gradient-to-br from-primary/6 via-accent/4 to-transparent rounded-full blur-3xl animate-simple-float opacity-40" />
        <div className="absolute bottom-1/4 left-1/4 w-[150px] h-[150px] bg-gradient-to-br from-accent/4 via-secondary/3 to-transparent rounded-full blur-2xl animate-simple-float opacity-30" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-xl rounded-xl px-4 py-2 border border-primary/10 shadow-lg mb-6">
            <div className="w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full" />
            <span className="text-sm font-medium text-muted-foreground">How It Works</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Simple</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Process</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-4" />
          <p className="text-lg text-muted-foreground font-light">
            Get started with NFTs in just a few simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 hover:border-primary/20 transition-all duration-300 hover:bg-card/60 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300">
                <step.icon className={`w-6 h-6 text-primary`} />
              </div>
              
              <h3 className="text-lg font-bold mb-3 text-foreground">
                {step.title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/register" className="group relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
            <Button 
              size="lg"
              className="relative bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white font-bold px-8 py-4 h-14 text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 border-0"
            >
              <span>Get Started Today</span>
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
