import { NFTCard } from "@/components/NFTCard";
import { Loader2, Search } from "lucide-react";

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

interface SimpleMobileNFTGridProps {
  nfts: NFT[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  lastElementRef: (node?: Element | null) => void;
}

export const SimpleMobileNFTGrid = ({
  nfts,
  isLoading,
  isFetchingNextPage,
  lastElementRef,
}: SimpleMobileNFTGridProps) => {
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading NFTs...</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <Search className="w-12 h-12 text-muted-foreground mx-auto" />
        <p className="text-2xl font-semibold text-muted-foreground">No NFTs found</p>
        <p className="text-muted-foreground/60">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
        {nfts.map((nft) => (
          <div key={nft.id} className="w-full">
            <NFTCard {...nft} for_sale={nft.for_sale} />
          </div>
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      <div ref={lastElementRef} className="w-full h-10" />
    </div>
  );
};