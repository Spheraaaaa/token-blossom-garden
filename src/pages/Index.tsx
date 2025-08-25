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
    <main className="min-h-screen relative overflow-hidden" role="main">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-purple-500/5 to-pink-500/5 -z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/60 -z-10"></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite] delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/5 rounded-full blur-[150px] animate-[pulse_15s_ease-in-out_infinite] delay-500"></div>
      </div>

      <ScrollAnimation animation="fade-in" delay={200}>
        <section id="hero" ref={heroRef} aria-label="Hero">
          <HeroSection />
        </section>
      </ScrollAnimation>

      <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-pulse">Loading...</div></div>}>
        <ScrollAnimation animation="slide-up" delay={100}>
          <section id="how-it-works" ref={howItWorksRef} aria-label="How it works">
            <HowItWorksSection />
          </section>
        </ScrollAnimation>
        
        <ScrollAnimation animation="slide-left" delay={150}>
          <section id="trust" ref={trustRef} aria-label="Trust indicators">
            <TrustIndicators />
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="zoom-in" delay={200}>
          <section id="stats" ref={statsRef} aria-label="Platform statistics">
            <StatsSection />
          </section>
        </ScrollAnimation>
        
        <ScrollAnimation animation="slide-right" delay={100}>
          <section id="testimonials" ref={testimonialsRef} aria-label="Community testimonials">
            <Testimonials />
          </section>
        </ScrollAnimation>
      </Suspense>

      <ScrollAnimation animation="bounce-in" delay={300} className="py-24 bg-background/50 relative overflow-hidden">
        <div ref={featuredRef} className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-purple-500/5 to-pink-500/5"></div>
        
        <div className="container mx-auto px-4 relative">
          <ScrollAnimation animation="slide-up" delay={100}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div className="mb-6 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-purple-400 animate-gradient bg-300% py-2">
                  Featured Collections
                </h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Discover unique digital art from top creators around the world
                </p>
              </div>
              
              <Link to="/marketplace">
                <Button 
                  variant="outline" 
                  className="border-primary/20 hover:border-primary/50 backdrop-blur-sm hover:bg-primary/10 transition-all duration-500 group magnetic-hover"
                >
                  View All Collections 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation animation="flip-in" delay={200}>
            <Card className="border-border/50 shadow-xl transition-all duration-300 backdrop-blur-xl bg-card/90 overflow-hidden rounded-2xl card-3d">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-foreground">Featured Collections</CardTitle>
                <CardDescription className="text-muted-foreground">Discover unique digital art from top creators around the world</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Suspense fallback={
                  <div className="w-full max-w-5xl mx-auto">
                    <div className="flex gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex-1 rounded-xl border border-border/50 bg-card/70 p-4 animate-shimmer">
                          <Skeleton className="aspect-square w-full rounded-lg" />
                          <div className="mt-3 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                }>
                  <Carousel className="w-full max-w-5xl mx-auto">
                    <CarouselContent>
                      {featuredLoading
                        ? [...Array(5)].map((_, i) => (
                            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 p-1">
                              <div className="p-1 h-full">
                                <div className="rounded-xl border border-border/50 bg-card/70 p-4 animate-shimmer">
                                  <Skeleton className="aspect-square w-full rounded-lg" />
                                  <div className="mt-3 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                  </div>
                                </div>
                              </div>
                            </CarouselItem>
                          ))
                        : featuredNFTs?.map((nft) => (
                            <CarouselItem key={nft.id} className="md:basis-1/2 lg:basis-1/3 p-1">
                              <div className="p-1 h-full">
                                <div className="magnetic-hover">
                                  <NFTCard {...nft} />
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/20 transition-colors duration-300 -left-6 lg:-left-12 magnetic-hover" />
                    <CarouselNext className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/20 transition-colors duration-300 -right-6 lg:-right-12 magnetic-hover" />
                  </Carousel>
                </Suspense>
              </CardContent>
            </Card>
          </ScrollAnimation>
          
          <ScrollAnimation animation="zoom-in" delay={300}>
            <div className="mt-16 text-center">
              <Link to="/marketplace" className="inline-block">
                <Button 
                  size="lg" 
                  className="relative overflow-hidden bg-primary/90 hover:bg-primary backdrop-blur-sm px-8 text-lg shadow-lg hover:shadow-primary/20 transition-all duration-700 group magnetic-hover animate-glow"
                >
                  <span className="relative z-10">Explore Marketplace</span>
                  <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-shimmer"></div>
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
