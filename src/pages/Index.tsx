import { useEffect, useRef, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { HeroSection } from "@/components/home/HeroSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollAnimation, StaggeredAnimation } from "@/components/ScrollAnimation";

// Lazy load non-critical components to improve TTI
const StatsSection = lazy(() => import("@/components/home/StatsSection").then(module => ({ default: module.StatsSection })));
const HowItWorksSection = lazy(() => import("@/components/home/HowItWorksSection").then(module => ({ default: module.HowItWorksSection })));
const TrustIndicators = lazy(() => import("@/components/home/TrustIndicators").then(module => ({ default: module.TrustIndicators })));
const Testimonials = lazy(() => import("@/components/home/Testimonials").then(module => ({ default: module.Testimonials })));
const Carousel = lazy(() => import("@/components/ui/carousel").then(module => ({ default: module.Carousel })));
const CarouselContent = lazy(() => import("@/components/ui/carousel").then(module => ({ default: module.CarouselContent })));
const CarouselItem = lazy(() => import("@/components/ui/carousel").then(module => ({ default: module.CarouselItem })));
const CarouselNext = lazy(() => import("@/components/ui/carousel").then(module => ({ default: module.CarouselNext })));
const CarouselPrevious = lazy(() => import("@/components/ui/carousel").then(module => ({ default: module.CarouselPrevious })));
const NFTCard = lazy(() => import("@/components/NFTCard").then(module => ({ default: module.NFTCard })));

// Lazy load GSAP to defer animation initialization
const initializeAnimations = async () => {
  const gsap = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  return { gsap: gsap.default, ScrollTrigger };
};

const Index = () => {
  useEffect(() => {
    const prevTitle = document.title;
    const title = "PureNFT: Buy & Sell NFTs | NFT Marketplace";
    document.title = title;

    const descContent = "Discover, buy and sell NFTs on PureNFT — a secure NFT marketplace with verified artists and low fees.";
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = descContent;

    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = window.location.origin + '/';

    const ldJson = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "PureNFT",
      url: window.location.origin + "/",
      potentialAction: {
        "@type": "SearchAction",
        target: window.location.origin + "/marketplace?query={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    } as const;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(ldJson);
    document.head.appendChild(script);

    return () => {
      document.title = prevTitle;
      if (script && script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuredRef = useRef(null);
  const howItWorksRef = useRef(null);
  const trustRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Defer featured NFTs query to not block initial render
  const { data: featuredNFTs, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-nfts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Defer GSAP animations to improve TTI
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let animationsInitialized = false;

    const setupAnimations = async () => {
      try {
        const { gsap, ScrollTrigger } = await initializeAnimations();
        gsap.registerPlugin(ScrollTrigger);
        
        // Kill existing triggers
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        
        // Initialize animations with a slight delay to not block initial render
        const refs = [heroRef, statsRef, featuredRef, howItWorksRef, trustRef, testimonialsRef];
        
        refs.forEach((ref, index) => {
          if (ref.current) {
            gsap.fromTo(ref.current,
              { opacity: 0, y: 30 },
              { 
                opacity: 1, 
                y: 0, 
                duration: 1.5, 
                ease: "power2.out",
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top 80%",
                  end: "bottom center",
                  toggleActions: "play none none reverse"
                }
              }
            );
          }
        });
        
        animationsInitialized = true;
      } catch (error) {
        console.warn('Failed to initialize animations:', error);
      }
    };

    // Delay animation setup to after critical rendering
    timeoutId = setTimeout(setupAnimations, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationsInitialized) {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        });
      }
    };
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background/98 to-background/95" role="main">
      {/* Clean background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-accent/2 to-secondary/2" />
      
      {/* Subtle floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary/6 via-accent/4 to-transparent rounded-full blur-3xl animate-simple-float opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-accent/4 via-secondary/3 to-transparent rounded-full blur-2xl animate-simple-float opacity-40" style={{ animationDelay: '3s' }} />
        
        {/* Minimalist particles */}
        <div className="absolute top-20 right-20 w-3 h-3 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-16 w-2 h-2 bg-accent/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-secondary/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <ScrollAnimation animation="fade-in" delay={200}>
        <section id="hero" ref={heroRef} aria-label="Hero">
          <HeroSection />
        </section>
      </ScrollAnimation>

      <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading sections...</div></div>}>
        <ScrollAnimation animation="slide-up" delay={100}>
          <section id="how-it-works" ref={howItWorksRef} aria-label="How it works" className="py-16 bg-gradient-to-r from-card/5 via-card/10 to-card/5">
            <HowItWorksSection />
          </section>
        </ScrollAnimation>
        
        <ScrollAnimation animation="slide-left" delay={150}>
          <section id="trust" ref={trustRef} aria-label="Trust indicators" className="py-16">
            <TrustIndicators />
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="zoom-in" delay={200}>
          <section id="stats" ref={statsRef} aria-label="Platform statistics" className="py-16 bg-gradient-to-r from-card/5 via-card/10 to-card/5">
            <StatsSection />
          </section>
        </ScrollAnimation>
        
        <ScrollAnimation animation="slide-right" delay={100}>
          <section id="testimonials" ref={testimonialsRef} aria-label="Community testimonials" className="py-16">
            <Testimonials />
          </section>
        </ScrollAnimation>
      </Suspense>

      {/* Enhanced Featured Collections Section */}
      <ScrollAnimation animation="fade-in" delay={300} className="py-24 bg-gradient-to-br from-card/10 via-card/5 to-card/10 relative overflow-hidden">
        <div ref={featuredRef} className="absolute inset-0 bg-gradient-to-br from-primary/3 via-accent/2 to-secondary/3" />
        
        <div className="container mx-auto px-6 relative">
          <ScrollAnimation animation="slide-up" delay={100}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-xl rounded-2xl px-6 py-3 border border-primary/20 shadow-xl mb-8">
                <div className="w-4 h-4 bg-gradient-to-br from-primary via-accent to-secondary rounded-full shadow-lg" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Featured Collections
                </span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">
                <span className="block text-foreground">Discover</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Unique Digital Art
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6" />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
                Explore extraordinary NFTs from talented creators around the world
              </p>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation animation="zoom-in" delay={200}>
            <div className="bg-gradient-to-r from-card/40 via-card/60 to-card/40 backdrop-blur-2xl rounded-3xl border border-border/30 p-8 shadow-2xl">
              <Suspense fallback={
                <div className="w-full max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="rounded-2xl border border-border/30 bg-card/50 p-6">
                        <Skeleton className="aspect-square w-full rounded-xl mb-4" />
                        <div className="space-y-3">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }>
                <Carousel className="w-full max-w-6xl mx-auto">
                  <CarouselContent>
                    {featuredLoading
                      ? [...Array(5)].map((_, i) => (
                          <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 p-3">
                            <div className="rounded-2xl border border-border/30 bg-card/50 p-6">
                              <Skeleton className="aspect-square w-full rounded-xl mb-4" />
                              <div className="space-y-3">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                              </div>
                            </div>
                          </CarouselItem>
                        ))
                      : featuredNFTs?.map((nft) => (
                          <CarouselItem key={nft.id} className="md:basis-1/2 lg:basis-1/3 p-3">
                            <div className="group h-full hover:scale-105 transition-transform duration-300">
                              <NFTCard {...nft} />
                            </div>
                          </CarouselItem>
                        ))}
                  </CarouselContent>
                  <CarouselPrevious className="bg-card/80 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 -left-6 lg:-left-12 shadow-xl" />
                  <CarouselNext className="bg-card/80 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 -right-6 lg:-right-12 shadow-xl" />
                </Carousel>
              </Suspense>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation animation="zoom-in" delay={300}>
            <div className="mt-16 text-center">
              <Link to="/marketplace" className="group relative inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
                <Button 
                  size="lg" 
                  className="relative bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white font-bold px-10 py-4 h-16 text-xl rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 border-0"
                >
                  <span className="mr-3">Explore All Collections</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </ScrollAnimation>
    </main>
  );
};

export default Index;
