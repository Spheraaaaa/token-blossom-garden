
import { NFTCard } from "@/components/NFTCard";
import { Loader2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NFT {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
  created_at: string;
  owner_id?: string | null;
  for_sale?: boolean;
}

interface NFTGridProps {
  nfts: NFT[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  lastElementRef: (node?: Element | null) => void;
}

export const NFTGrid = ({
  nfts,
  isLoading,
  isFetchingNextPage,
  lastElementRef,
}: NFTGridProps) => {
  const isMobile = useIsMobile();
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [animatedNFTs, setAnimatedNFTs] = useState<Set<string>>(new Set());
  const [previousNFTCount, setPreviousNFTCount] = useState(0);

  // Setup animations - mobile optimized
  useEffect(() => {
    if (!gridRef.current || nfts.length === 0) return;

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    // Skip heavy animations on mobile for performance
    if (isMobile) {
      // Simple fade-in for mobile
      cards.forEach((card, index) => {
        const nftId = nfts[index]?.id;
        if (nftId && !animatedNFTs.has(nftId)) {
          gsap.set(card, { opacity: 0 });
          gsap.to(card, {
            opacity: 1,
            duration: 0.3,
            delay: index * 0.1,
            ease: "power1.out"
          });
        }
      });
      setAnimatedNFTs(new Set(nfts.map(nft => nft.id)));
      return;
    }

    // Desktop animations
    const newNFTs = nfts.filter(nft => !animatedNFTs.has(nft.id));
    const newNFTIds = new Set(newNFTs.map(nft => nft.id));

    if (newNFTs.length > 0) {
      const newCards = cards.filter((card, index) => {
        const nftId = nfts[index]?.id;
        return nftId && newNFTIds.has(nftId);
      });

      if (newCards.length > 0) {
        gsap.set(newCards, {
          opacity: 0,
          y: 20,
          scale: 0.98
        });

        gsap.to(newCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.1
        });

        setAnimatedNFTs(prev => new Set([...prev, ...newNFTIds]));
      }
    }

    // Hover effects only on desktop
    if (!isMobile) {
      cards.forEach((card) => {
        if (!card || card.getAttribute('data-hover-setup')) return;

        const handleMouseEnter = () => {
          gsap.to(card, {
            y: -5,
            scale: 1.02,
            duration: 0.2,
            ease: "power2.out"
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
          });
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
        card.setAttribute('data-hover-setup', 'true');
      });
    }
  }, [nfts, isMobile, animatedNFTs.size]);

  // Reset animated NFTs when starting fresh (e.g., new search)
  useEffect(() => {
    if (nfts.length === 0) {
      setAnimatedNFTs(new Set());
      setPreviousNFTCount(0);
    }
  }, [nfts.length === 0]);

  // Clear and rebuild refs array when NFTs change
  useEffect(() => {
    cardsRef.current = [];
  }, [nfts]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-md animate-pulse" />
          <Loader2 className="h-8 w-8 animate-[spin_2s_linear_infinite] text-primary relative" />
        </div>
        <p className="text-muted-foreground animate-pulse">Loading NFTs...</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-16 space-y-4 animate-fade-in">
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-md" />
          <Search className="w-12 h-12 text-muted-foreground" />
        </div>
        <p className="text-2xl font-semibold text-muted-foreground">No NFTs found</p>
        <p className="text-muted-foreground/60">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="relative px-1 md:px-2">
      <ScrollArea 
        ref={scrollAreaRef}
        className={`marketplace-scroll-area ${
          isMobile 
            ? 'h-[calc(100vh-240px)] max-h-[700px]' 
            : 'h-[calc(100vh-320px)] max-h-[800px]'
        } rounded-xl md:rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm relative`}
      >
        <div className="p-2 md:p-4 lg:p-6">
          <div 
            ref={gridRef}
            className={`grid gap-3 marketplace-nft-grid ${
              isMobile 
                ? 'grid-cols-1 justify-items-center' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6'
            }`}
          >
            {nfts.map((nft, index) => (
              <div
                key={nft.id}
                ref={addToRefs}
                className="gsap-card"
                style={!isMobile ? {
                  perspective: "1000px", 
                  transformStyle: "preserve-3d"
                } : {}}
              >
                <div className="relative h-full">
                  {/* Disable glow effects on mobile for performance */}
                  {!isMobile && (
                    <div 
                      className="card-glow absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2), hsl(var(--secondary) / 0.2))"
                      }}
                    />
                  )}
                  <NFTCard {...nft} for_sale={nft.for_sale} />
                </div>
              </div>
            ))}
          </div>

          {isFetchingNextPage && (
            <div className="flex justify-center py-12">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-md animate-pulse" />
                <Loader2 className="h-8 w-8 animate-[spin_2s_linear_infinite] text-primary relative" />
              </div>
            </div>
          )}

          <div ref={lastElementRef} className="w-full h-20" />
        </div>
      </ScrollArea>
    </div>
  );
};
