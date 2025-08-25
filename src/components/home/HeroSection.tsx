
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Rocket, Star, Shield, CheckCircle2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollAnimation, StaggeredAnimation } from "@/components/ScrollAnimation";
import React from "react";

export const HeroSection = () => {
  const isMobile = useIsMobile();

  const trustBadges = [
    { icon: Shield, text: "Escrow Protection" },
    { icon: CheckCircle2, text: "Verified Creators" },
    { icon: Star, text: "Trusted Platform" }
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "$100M+", label: "Trading Volume" },
    { value: "1M+", label: "NFTs Created" }
  ];

  return (
    <div className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-background/98 to-background/95">
      {/* Clean minimalist background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-accent/2 to-secondary/2" />
      
      {/* Subtle floating orbs - referencing the green circle from logo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/8 via-accent/6 to-transparent rounded-full blur-3xl animate-simple-float opacity-60" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-br from-accent/6 via-secondary/4 to-transparent rounded-full blur-2xl animate-simple-float opacity-40" style={{ animationDelay: '3s' }} />
        
        {/* Geometric elements inspired by the logo */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-secondary/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center space-y-12 pt-20 md:pt-0">
          
          {/* Brand badge inspired by logo */}
          <ScrollAnimation animation="fade-in" delay={100}>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-xl rounded-2xl px-6 py-3 border border-primary/20 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group">
              <div className="w-6 h-6 bg-gradient-to-br from-primary via-accent to-secondary rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300" />
              <span className="text-base font-semibold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Digital Marketplace
              </span>
            </div>
          </ScrollAnimation>

          {/* Main headline - cleaner typography */}
          <ScrollAnimation animation="slide-up" delay={200}>
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                <span className="block text-foreground">Buy & Sell</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Digital NFTs
                </span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto" />
            </div>
          </ScrollAnimation>

          {/* Clean subtitle */}
          <ScrollAnimation animation="fade-in" delay={300}>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              The most trusted NFT marketplace with verified creators, 
              <span className="text-primary font-medium"> low fees</span>, and 
              <span className="text-accent font-medium"> secure transactions</span>.
            </p>
          </ScrollAnimation>
          
          {/* Trust indicators - minimalist design */}
          <ScrollAnimation animation="fade-in" delay={400}>
            <div className="flex flex-wrap justify-center gap-8 py-4">
              {trustBadges.map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 group">
                  <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </ScrollAnimation>

          {/* CTA Button - premium design */}
          <ScrollAnimation animation="zoom-in" delay={500}>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Link to="/marketplace" className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
                <Button 
                  size="lg"
                  className="relative bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white font-bold px-8 py-4 h-14 text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 border-0"
                >
                  <Rocket className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/create-nft" className="group">
                <Button 
                  variant="outline"
                  size="lg"
                  className="bg-card/50 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/40 text-foreground font-semibold px-8 py-4 h-14 text-lg rounded-2xl hover:bg-primary/5 transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Create NFT</span>
                </Button>
              </Link>
            </div>
          </ScrollAnimation>

          {/* Stats section - elegant design */}
          <ScrollAnimation animation="fade-in" delay={600}>
            <div className="pt-16 pb-8">
              <div className="bg-gradient-to-r from-card/40 via-card/60 to-card/40 backdrop-blur-2xl rounded-3xl border border-border/30 p-8 shadow-2xl">
                <div className="grid grid-cols-3 gap-8 md:gap-16">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center group cursor-default">
                      <div className="space-y-2">
                        <p className="text-3xl md:text-5xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                          {stat.value}
                        </p>
                        <p className="text-sm md:text-base text-muted-foreground font-medium">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Bottom accent - referencing logo style */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
