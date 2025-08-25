
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

  // Setup GSAP animations only for new NFTs
  useEffect(() => {
    if (!gridRef.current || nfts.length === 0) return;

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    // Find new NFTs that haven't been animated yet
    const newNFTs = nfts.filter(nft => !animatedNFTs.has(nft.id));
    const newNFTIds = new Set(newNFTs.map(nft => nft.id));

    if (newNFTs.length === 0) return;

    // Get only the cards for new NFTs
    const newCards = cards.filter((card, index) => {
      const nftId = nfts[index]?.id;
      return nftId && newNFTIds.has(nftId);
    });

    if (newCards.length === 0) return;

    // Clear previous animations only for new cards
    gsap.killTweensOf(newCards);

    // Initial state for new cards only
    gsap.set(newCards, {
      opacity: 0,
      y: 60,
      scale: 0.8,
      rotationX: 15,
    });

    // Stagger animation for new cards only
    const tl = gsap.timeline();
    tl.to(newCards, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: {
        amount: 0.4,
        from: "start",
      },
    });

    // Update animated NFTs set
    setAnimatedNFTs(prev => new Set([...prev, ...newNFTIds]));

    // Setup hover animations for all cards (existing and new)
    cards.forEach((card, index) => {
      if (!card) return;

      // Remove existing event listeners to avoid duplicates
      const existingEnter = card.getAttribute('data-mouse-enter');
      const existingLeave = card.getAttribute('data-mouse-leave');
      
      if (!existingEnter) {
        // Hover animations
        const handleMouseEnter = () => {
          gsap.to(card, {
            y: -12,
            scale: 1.03,
            rotationY: 2,
            duration: 0.4,
            ease: "power2.out",
          });
          
          const glow = card.querySelector('.card-glow');
          if (glow) {
            gsap.to(glow, {
              opacity: 1,
              scale: 1.1,
              duration: 0.4,
              ease: "power2.out",
            });
          }
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 0.4,
            ease: "power2.out",
          });
          
          const glow = card.querySelector('.card-glow');
          if (glow) {
            gsap.to(glow, {
              opacity: 0,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            });
          }
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
        card.setAttribute('data-mouse-enter', 'true');
        card.setAttribute('data-mouse-leave', 'true');
      }
    });

    // Smooth scroll behavior
    if (scrollAreaRef.current && previousNFTCount === 0) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        gsap.set(scrollContainer, {
          scrollBehavior: "smooth",
        });
      }
    }

    setPreviousNFTCount(nfts.length);

    return () => {
      gsap.killTweensOf(newCards);
    };
  }, [nfts, animatedNFTs, previousNFTCount]);

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
    <div className="relative px-2 md:px-0">
      <ScrollArea 
        ref={scrollAreaRef}
        className={`${isMobile ? 'h-[calc(100vh-350px)]' : 'h-[calc(100vh-400px)]'} rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm relative`}
      >
        <div className="p-4 md:p-6">
          <div 
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 marketplace-nft-grid"
          >
            {nfts.map((nft, index) => (
              <div
                key={nft.id}
                ref={addToRefs}
                className="gsap-card"
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d"
                }}
              >
                <div className="relative h-full">
                  <div 
                    className="card-glow absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2), hsl(var(--secondary) / 0.2))"
                    }}
                  />
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
