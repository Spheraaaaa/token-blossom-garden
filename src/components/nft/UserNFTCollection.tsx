
import { useState, useEffect } from "react";
import { Panel } from "@/components/profile/Panel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingBag, ImageIcon, Info, Wallet, Grid3X3, GridIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { NFTCard } from "@/components/NFTCard";
import { EmptyNFTState } from "@/components/EmptyNFTState";
import { notifications } from "@/utils/notifications";
import { Button } from "@/components/ui/button";
import type { NFT } from "@/types/nft";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ActiveBids from "./ActiveBids";
import { Skeleton } from "@/components/ui/skeleton";

export const UserNFTCollection = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedNft, setSelectedNft] = useState<string | null>(null);
  const [showBids, setShowBids] = useState(false);
  const { user } = useSecureAuth();

  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('nfts')
          .select('*')
          .eq('owner_id', user.id);
        
        if (error) {
          throw error;
        }
        
        setNfts(data || []);
      } catch (error) {
        console.error("Error fetching user NFTs:", error);
        notifications.error.networkError();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserNFTs();
  }, [user]);

  const handleCancelSale = async (id: string) => {
    if (!user?.id) return;
    
    try {
      // Remove the marketplace_status field that doesn't exist in the database
      const { error } = await supabase
        .from('nfts')
        .update({ 
          for_sale: false,
          marketplace: null
        })
        .eq('id', id)
        .eq('owner_id', user.id);
      
      if (error) throw error;
      
      setNfts(prevNfts => 
        prevNfts.map(nft => 
          nft.id === id 
            ? { ...nft, for_sale: false, marketplace: null } 
            : nft
        )
      );
      
      notifications.success.nftCreated();
    } catch (error) {
      console.error("Error cancelling sale:", error);
      notifications.error.transactionFailed();
    }
  };

  const handleUpdatePrice = async (id: string, price: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('nfts')
        .update({ price })
        .eq('id', id)
        .eq('owner_id', user.id);
      
      if (error) throw error;
      
      setNfts(prevNfts => 
        prevNfts.map(nft => 
          nft.id === id ? { ...nft, price } : nft
        )
      );
      
      notifications.success.profileUpdated();
    } catch (error) {
      console.error("Error updating price:", error);
      notifications.error.profileUpdateFailed();
    }
  };
  
  const handleViewBids = async (nftId: string) => {
    // Check if the NFT is for sale before showing bids
    const nft = nfts.find(n => n.id === nftId);
    
    if (!nft) {
      notifications.error.networkError();
      return;
    }
    
    if (!nft.for_sale) {
      notifications.info.noBidsYet();
      return;
    }
    
    // Check if there are any bids for this NFT
    try {
      const { data, error } = await supabase
        .from('nft_bids')
        .select('*')
        .eq('nft_id', nftId);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        notifications.info.noBidsYet();
        return;
      }
      
      // Set the selected NFT and show bids
      setSelectedNft(nftId);
      setShowBids(true);
      
    } catch (error) {
      console.error("Error checking bids:", error);
      notifications.error.networkError();
    }
  };
  
  const handleBidAccepted = () => {
    // Refresh NFT data after a bid is accepted
    if (user?.id) {
      const fetchUserNFTs = async () => {
        try {
          const { data, error } = await supabase
            .from('nfts')
            .select('*')
            .eq('owner_id', user.id);
          
          if (error) throw error;
          setNfts(data || []);
        } catch (error) {
          console.error("Error refreshing NFTs:", error);
        }
      };
      
      fetchUserNFTs();
    }
    
    setShowBids(false);
    setSelectedNft(null);
    
    notifications.success.bidAccepted();
  };
  
  const handleBidDeclined = () => {
    setShowBids(false);
    setSelectedNft(null);
    
    notifications.success.bidDeclined();
  };

  // Filter NFTs by listing status
  const listedNFTs = nfts.filter(nft => nft.for_sale);
  const unlistedNFTs = nfts.filter(nft => !nft.for_sale);
  const hasListedNFTs = listedNFTs.length > 0;
  const hasUnlistedNFTs = unlistedNFTs.length > 0;

  const gridClass =
    viewMode === 'grid'
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      : "flex flex-col gap-4";

  const renderCards = (items: typeof nfts) =>
    items.map(nft => (
      <NFTCard
        key={nft.id}
        id={nft.id}
        name={nft.name}
        image={nft.image}
        price={nft.price}
        creator={nft.creator}
        owner_id={nft.owner_id}
        for_sale={nft.for_sale}
        marketplace={nft.marketplace}
        isProfileView={true}
        onCancelSale={handleCancelSale}
        onUpdatePrice={handleUpdatePrice}
        viewMode={viewMode}
        onViewBids={() => handleViewBids(nft.id)}
      />
    ));

  const toggleClass = (active: boolean) =>
    `h-8 w-8 rounded-md ${active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`;

  return (
    <div className="space-y-6">
      {showBids && selectedNft && (
        <Panel
          title="Active Bids"
          description="Review and accept bids for your NFT"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBids(false)}
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              Close
            </Button>
          }
          className="animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <ActiveBids
            nftId={selectedNft}
            ownerId={user?.id}
            currentUserId={user?.id}
            onBidAccepted={handleBidAccepted}
            onBidDeclined={handleBidDeclined}
          />
        </Panel>
      )}

      <Panel
        title="My NFT Collection"
        description={`${nfts.length} ${nfts.length === 1 ? 'item' : 'items'} in your collection`}
        actions={
          <>
            <div className="flex items-center rounded-lg border border-border bg-background/60 p-1" role="group" aria-label="View mode">
              <Button
                variant="ghost"
                size="icon"
                className={toggleClass(viewMode === 'grid')}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <GridIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={toggleClass(viewMode === 'list')}
                onClick={() => setViewMode('list')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-border bg-transparent hover:border-primary/40 hover:bg-primary/10"
                    aria-label="How to manage your NFTs"
                  >
                    <Info className="h-4 w-4 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[280px] border border-border bg-popover p-4">
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Managing Your NFTs:</p>
                    <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                      <li>Click <span className="font-semibold text-primary">Edit</span> to edit the price of a listed NFT</li>
                      <li>Click <span className="font-semibold text-primary">Cancel</span> to cancel a listing</li>
                      <li>Click <span className="font-semibold text-primary">View Bids</span> to see offers on your NFTs</li>
                      <li>Click on any NFT to view its details</li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        }
      >
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            ))}
          </div>
        ) : nfts.length > 0 ? (
          <div className="divide-y divide-border">
            {hasListedNFTs && (
              <section className="pb-8 last:pb-0">
                <h3 className="font-semibold text-foreground">Currently Listed</h3>
                <p className="mt-1 text-sm text-muted-foreground">NFTs you've put up for sale in the marketplace</p>
                <div className={`mt-5 ${gridClass}`}>{renderCards(listedNFTs)}</div>
              </section>
            )}

            {hasUnlistedNFTs && (
              <section className="pt-8 first:pt-0">
                <h3 className="font-semibold text-foreground">Your Collection</h3>
                <p className="mt-1 text-sm text-muted-foreground">NFTs you own that aren't currently listed for sale</p>
                <div className={`mt-5 ${gridClass}`}>{renderCards(unlistedNFTs)}</div>
              </section>
            )}
          </div>
        ) : (
          <EmptyNFTState />
        )}
      </Panel>
    </div>
  );
};
