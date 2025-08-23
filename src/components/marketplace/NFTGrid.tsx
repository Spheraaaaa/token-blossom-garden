
import { NFTCard } from "@/components/NFTCard";
import { Loader2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

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
      
      <ScrollArea className={`${isMobile ? 'h-[calc(100vh-350px)]' : 'h-[calc(100vh-400px)]'} rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm relative`}>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 marketplace-nft-grid">
            {nfts.map((nft, index) => (
              <div
                key={nft.id}
                className="opacity-0 animate-[fadeIn_1s_ease-out_forwards] group"
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              >
                <div className="relative transition-transform duration-700 group-hover:translate-y-[-8px] group-hover:scale-[1.02]">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
