import { useEffect, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { HeroSection } from "@/components/home/HeroSection";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load non-critical components to improve TTI
const StatsSection = lazy(() => import("@/components/home/StatsSection").then(module => ({ default: module.StatsSection })));
const HowItWorksSection = lazy(() => import("@/components/home/HowItWorksSection").then(module => ({ default: module.HowItWorksSection })));
const TrustIndicators = lazy(() => import("@/components/home/TrustIndicators").then(module => ({ default: module.TrustIndicators })));
const Carousel = lazy(() => import("@/components/ui/carousel").then(module => ({ default: module.Carousel })));
const CarouselContent = lazy(() => import("@/components/ui/carousel").then(module => ({ default: module.CarouselContent })));
const CarouselItem = lazy(() => import("@/components/ui/carousel").then(module => ({ default: module.CarouselItem })));
const CarouselNext = lazy(() => import("@/components/ui/carousel").then(module => ({ default: module.CarouselNext })));
const CarouselPrevious = lazy(() => import("@/components/ui/carousel").then(module => ({ default: module.CarouselPrevious })));
const NFTCard = lazy(() => import("@/components/NFTCard").then(module => ({ default: module.NFTCard })));

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

  return (
    <div className="relative min-h-screen bg-background">
      <section id="hero" aria-label="Hero">
        <HeroSection />
      </section>

      <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
        <section id="how-it-works" aria-label="How it works">
          <HowItWorksSection />
        </section>

        <section id="trust" aria-label="Trust indicators" className="border-y border-border/60 bg-card/40">
          <TrustIndicators />
        </section>

        <section id="stats" aria-label="Platform statistics">
          <StatsSection />
        </section>
      </Suspense>

      <section aria-labelledby="featured-heading" className="border-t border-border/60 bg-card/40">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 id="featured-heading" className="font-display text-3xl md:text-5xl font-bold text-foreground">
                Discover Unique Digital Art
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Explore extraordinary NFTs from talented creators around the world
              </p>
            </div>
            <Link
              to="/marketplace"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              Explore All Collections
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-12">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card p-4">
                      <Skeleton className="mb-4 aspect-square w-full rounded-xl" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="mt-3 h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              }
            >
              <Carousel className="w-full" opts={{ align: "start" }}>
                <CarouselContent className="-ml-5">
                  {featuredLoading
                    ? [...Array(3)].map((_, i) => (
                        <CarouselItem key={i} className="pl-5 md:basis-1/2 lg:basis-1/3">
                          <div className="rounded-2xl border border-border bg-card p-4">
                            <Skeleton className="mb-4 aspect-square w-full rounded-xl" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="mt-3 h-4 w-1/2" />
                          </div>
                        </CarouselItem>
                      ))
                    : featuredNFTs?.map((nft) => (
                        <CarouselItem key={nft.id} className="pl-5 md:basis-1/2 lg:basis-1/3">
                          <NFTCard {...nft} />
                        </CarouselItem>
                      ))}
                </CarouselContent>
                <div className="mt-8 flex justify-end gap-3">
                  <CarouselPrevious className="static translate-y-0 h-11 w-11 border-border bg-card hover:border-primary/50 hover:bg-card hover:text-primary" />
                  <CarouselNext className="static translate-y-0 h-11 w-11 border-border bg-card hover:border-primary/50 hover:bg-card hover:text-primary" />
                </div>
              </Carousel>
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
