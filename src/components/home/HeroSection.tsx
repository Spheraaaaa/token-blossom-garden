
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
    { icon: CheckCircle2, text: "Verified Smart Contracts" },
    { icon: Star, text: "Trusted by 50,000+ Users" }
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "$100M+", label: "Trading Volume" },
    { value: "1M+", label: "NFTs Created" }
  ];

  const trustIndicators = [
    { icon: Shield, text: "100% Secure Payments" },
    { icon: CheckCircle2, text: "Verified Artists" },
    { icon: Star, text: "5-Star Support" }
  ];

  return (
    <div className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81')] bg-cover bg-center bg-no-repeat opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 animate-gradient"></div>
      
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[150px] animate-[pulse_6s_ease-in-out_infinite] parallax-slow animate-morph"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite] delay-1000 parallax-slow animate-morph"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-[150px] animate-[pulse_7s_ease-in-out_infinite] delay-500 parallax-slow animate-morph"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary/30 rounded-full animate-float-up" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-purple-500/40 rounded-full animate-float-up" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-pink-500/20 rounded-full animate-float-up" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-8 pt-16 md:pt-0">
          
          <ScrollAnimation animation="bounce-in" delay={100}>
            <div className="inline-block animate-[bounce_3s_ease-in-out_infinite] bg-primary/20 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-6 md:py-2 text-xs md:text-sm mb-4 md:mb-8 flex items-center gap-2 border border-primary/20 shadow-lg hover:bg-primary/30 transition-colors duration-500 magnetic-hover">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary animate-pulse" /> 
              <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold">
                Welcome to the Future of Digital Art
              </span>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="slide-up" delay={200}>
            <div className="min-h-[80px] md:min-h-[100px] flex items-center justify-center">
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 animate-fade-in animate-text-glow drop-shadow-2xl py-2 md:py-6">
                Buy & Sell NFTs on PureNFT — Secure NFT Marketplace
              </h1>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-in" delay={300}>
            <p className="text-base md:text-xl lg:text-2xl text-muted-foreground/90 animate-fade-in backdrop-blur-sm max-w-2xl mx-auto leading-relaxed px-4">
              Buy and sell verified NFTs safely. Low fees, escrow protection, and top creators.
            </p>
          </ScrollAnimation>
          
          {/* New trust indicators above CTA */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-3 md:pt-6">
            <StaggeredAnimation animation="slide-up" staggerDelay={100}>
              {trustIndicators.map((item, index) => (
                <div key={index} className="flex items-center gap-1 md:gap-2">
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  <span className="text-xs md:text-sm text-muted-foreground/90">{item.text}</span>
                </div>
              ))}
            </StaggeredAnimation>
          </div>

          <ScrollAnimation animation="zoom-in" delay={400}>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in pt-4 md:pt-8">
              <Link 
                to="/marketplace" 
                className="group relative overflow-hidden"
              >
                <Button 
                  size={isMobile ? "default" : "lg"} 
                  className="bg-primary/90 hover:bg-primary backdrop-blur-sm md:h-14 px-5 md:px-8 text-sm md:text-lg shadow-lg hover:shadow-primary/20 transition-all duration-700 magnetic-hover animate-glow button-magnetic"
                >
                  <Rocket className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:rotate-12 transition-transform duration-700" />
                  <span className="relative z-10 transition-all duration-700 group-hover:scale-105 group-hover:font-semibold group-active:scale-95">Explore NFTs</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-shimmer"></div>
                </Button>
              </Link>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="flip-in" delay={500}>
            <div className="pt-8 md:pt-20 flex justify-center gap-6 md:gap-10 animate-fade-in">
              {stats.map((stat, index) => (
                <React.Fragment key={index}>
                  <div className="text-center space-y-0.5 md:space-y-1 magnetic-hover">
                    <p className="text-xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">{stat.value}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="h-8 md:h-10 w-px bg-gradient-to-b from-primary/5 to-primary/30"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </ScrollAnimation>

          {/* New trust badges */}
          <ScrollAnimation animation="slide-up" delay={600}>
            <div className="pt-6 md:pt-8 flex flex-wrap justify-center gap-2 md:gap-6 animate-fade-in">
              {trustBadges.map((badge, index) => (
                <div key={index} className="bg-background/30 backdrop-blur-sm border border-primary/10 rounded-full px-3 py-1 md:px-4 md:py-1 flex items-center gap-1 md:gap-2 magnetic-hover card-3d glass-card">
                  <badge.icon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  <span className="text-[10px] md:text-xs font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </ScrollAnimation>

          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-t from-primary/10 to-transparent blur-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
