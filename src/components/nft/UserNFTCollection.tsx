
import { useState, useEffect } from "react";
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

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              My NFT Collection
            </h2>
            <p className="text-sm text-white/70 mt-0.5">
              {nfts.length} {nfts.length === 1 ? 'item' : 'items'} in your collection
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-[#2E2243]/80 rounded-lg border border-[#65539E]/30">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-md ${viewMode === 'grid' ? 'bg-[#65539E]/50 text-white' : 'text-purple-300/70'}`}
              onClick={() => setViewMode('grid')}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-md ${viewMode === 'list' ? 'bg-[#65539E]/50 text-white' : 'text-purple-300/70'}`}
              onClick={() => setViewMode('list')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Help tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-[#65539E]/30 bg-[#65539E]/20 hover:bg-[#65539E]/30">
                  <Info className="h-4 w-4 text-purple-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[280px] p-4 bg-[#2E2243] border border-[#65539E]/30">
                <div className="space-y-2">
                  <p className="font-medium text-white">Managing Your NFTs:</p>
                  <ul className="list-disc pl-4 text-sm space-y-1 text-purple-300/80">
                    <li>Click <span className="text-purple-300 font-semibold">Edit</span> to edit the price of a listed NFT</li>
                    <li>Click <span className="text-purple-300 font-semibold">Cancel</span> to cancel a listing</li>
                    <li>Click <span className="text-purple-300 font-semibold">View Bids</span> to see offers on your NFTs</li>
                    <li>Click on any NFT to view its details</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Active bids popup */}
      {showBids && selectedNft && (
        <Card className="border-[#65539E]/20 bg-[#23193A] overflow-hidden relative rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/50 via-primary/40 to-purple-600/50"></div>
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#65539E]/20 pb-4 relative z-10">
            <div>
              <CardTitle className="text-xl font-medium text-white">Active Bids</CardTitle>
              <CardDescription className="text-purple-300/70">Review and accept bids for your NFT</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBids(false)}
              className="text-purple-300/70 hover:text-white"
            >
              Close
            </Button>
          </CardHeader>
          
          <CardContent className="p-6 relative z-10">
            <ActiveBids 
              nftId={selectedNft}
              ownerId={user?.id}
              currentUserId={user?.id}
              onBidAccepted={handleBidAccepted}
              onBidDeclined={handleBidDeclined}
            />
          </CardContent>
        </Card>
      )}
      
      {/* Main content area */}
      <div className="relative">
        {isLoading ? (
          <div className="bg-card/90 min-h-[300px] rounded-2xl border border-border/50 p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-2 w-1/3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-40 w-full rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16 rounded-md" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : nfts.length > 0 ? (
          <div className="space-y-8">
            {/* Listed NFTs section */}
            {hasListedNFTs && (
              <Card className="border-border/50 shadow-xl transition-all duration-300 backdrop-blur-xl bg-card/90 overflow-hidden rounded-2xl">
                <CardHeader className="relative pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-md bg-muted/30 border border-border/50">
                      <Wallet className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">Currently Listed</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">NFTs you've put up for sale in the marketplace</CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
                    : "flex flex-col gap-4 md:gap-5"
                  }>
                    {listedNFTs.map(nft => (
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Unlisted NFTs section */}
            {hasUnlistedNFTs && (
              <Card className="border-border/50 shadow-xl transition-all duration-300 backdrop-blur-xl bg-card/90 overflow-hidden rounded-2xl">
                <CardHeader className="relative pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-md bg-muted/30 border border-border/50">
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">Your Collection</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">NFTs you own that aren't currently listed for sale</CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
                    : "flex flex-col gap-4 md:gap-5"
                  }>
                    {unlistedNFTs.map(nft => (
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="border-[#65539E]/20 bg-[#23193A] overflow-hidden relative p-6 rounded-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/50 via-primary/40 to-purple-600/50"></div>
            <EmptyNFTState />
          </Card>
        )}
      </div>
    </div>
  );
};
