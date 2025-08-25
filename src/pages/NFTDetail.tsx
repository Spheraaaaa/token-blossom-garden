
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Flag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { NFTImage } from "@/components/nft/NFTImage";
import { NFTHeader } from "@/components/nft/NFTHeader";
import { NFTDetails } from "@/components/nft/NFTDetails";
import { PurchaseButton } from "@/components/nft/PurchaseButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActiveBids from "@/components/nft/ActiveBids";
import type { NFT } from "@/types/nft";
import { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
import FraudWarningDialog from "@/components/FraudWarningDialog";

const NFTDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showFraudWarning, setShowFraudWarning] = useState(false);

  const { data: nft, isLoading } = useQuery({
    queryKey: ['nft', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as NFT;
    },
  });

  const { data: userData } = useQuery({
    queryKey: ['user-balance', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (nft?.name) {
      document.title = `${nft.name} | NFT Detail`;
    }
  }, [nft?.name]);

  const handlePurchaseComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['nft', id] });
    queryClient.invalidateQueries({ queryKey: ['user-balance', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['nfts'] });
    
    navigate('/profile');
  };

  const handleBidDeclined = () => {
    queryClient.invalidateQueries({ queryKey: ['nft', id] });
    queryClient.invalidateQueries({ queryKey: ['user-balance', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['nfts'] });
    queryClient.invalidateQueries({ queryKey: ['nft_bids'] });
    
    toast({
      title: "Bid Declined",
      description: "The bid has been successfully declined."
    });
  };

  const getMarketplaceDisplay = () => {
    if (!nft?.marketplace) return null;
    
    const marketplaceMap: Record<string, string> = {
      'purenft': 'PureNFT.io',
      'rarible': 'Rarible.com',
      'opensea': 'OpenSea.io',
      'looksrare': 'LooksRare.org',
      'dappradar': 'DappRadar.com',
      'debank': 'DeBank.com'
    };
    
    return marketplaceMap[nft.marketplace] || nft.marketplace;
  };

  const isOwned = nft?.owner_id === user?.id;
  
  const isForSale = nft?.for_sale === true;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary/50 rounded w-1/4 mx-auto"></div>
            <div className="h-96 bg-secondary/50 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">NFT not found</div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.8
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-background/95 relative">
      {/* Clean background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-accent/1 to-secondary/1" />
      
      {/* Elegant floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-primary/6 via-accent/4 to-transparent rounded-full blur-3xl animate-simple-float opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-gradient-to-br from-accent/4 via-secondary/3 to-transparent rounded-full blur-2xl animate-simple-float opacity-30" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-card/60 backdrop-blur-xl rounded-xl border border-border/30 shadow-lg hover:bg-card/80 hover:border-primary/20 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium">Back to Marketplace</span>
            </div>
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <motion.div variants={itemVariants} className="relative">
            <div className="rounded-2xl overflow-hidden border border-border/30 bg-card/60 backdrop-blur-xl shadow-2xl hover:shadow-primary/10 transition-all duration-500">
              <NFTImage image={nft.image} name={nft.name} />
            </div>
            
            {nft.marketplace && isForSale && (
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-card/80 backdrop-blur-xl text-foreground border border-border/30 px-4 py-2 text-sm font-medium rounded-xl shadow-lg">
                  Listed on {getMarketplaceDisplay()}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div variants={containerVariants} className="space-y-8">
            <motion.div variants={itemVariants}>
              <NFTHeader name={nft.name} creator={nft.creator} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="bg-card/60 backdrop-blur-xl p-8 rounded-2xl border border-border/30 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Current price</p>
                    <div className="flex items-center gap-3">
                      <img 
                        src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                        alt="ETH"
                        className="h-6 w-6"
                      />
                      <span className="text-3xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                        {nft.price} ETH
                      </span>
                    </div>
                  </div>
                  {nft.owner_id && !isForSale && (
                    <div className="bg-muted/40 px-4 py-2 rounded-xl border border-border/30 text-sm">
                      <p className="text-muted-foreground">Already purchased</p>
                    </div>
                  )}
                  {isOwned && (
                    <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 rounded-xl border border-primary/30 text-sm">
                      <p className="text-primary font-medium">You own this</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {nft.description && (
              <motion.div variants={itemVariants}>
                <div className="bg-card/60 backdrop-blur-xl p-8 rounded-2xl border border-border/30 shadow-lg">
                  <p className="text-muted-foreground leading-relaxed">{nft.description}</p>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="flex gap-4">
              {isOwned ? (
                <div className="w-full py-5 px-8 text-center bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-2xl backdrop-blur-xl shadow-lg">
                  <p className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    You own this NFT
                  </p>
                </div>
              ) : (nft.owner_id && !isForSale) ? (
                <div className="w-full py-5 px-8 text-center bg-muted/20 border border-border/30 rounded-2xl backdrop-blur-xl">
                  <p className="text-xl text-muted-foreground">This NFT has already been purchased</p>
                </div>
              ) : (
                <>
                  <PurchaseButton 
                    isLoggedIn={!!user}
                    onPurchase={handlePurchaseComplete}
                    nftId={nft.id}
                    price={nft.price}
                    name={nft.name}
                    image={nft.image}
                    balance={userData?.balance as unknown as number}
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-card/60 backdrop-blur-xl border border-border/30 hover:border-primary/20 hover:bg-card/80 transition-all duration-300"
                    onClick={() => setShowFraudWarning(true)}
                    aria-label="Report this NFT"
                    title="Report this NFT"
                  >
                    <Flag className="h-5 w-5" />
                  </Button>
                </>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <NFTDetails 
                tokenStandard={nft.token_standard}
                properties={nft.properties}
              />
            </motion.div>
            
            {isOwned && (
              <motion.div variants={itemVariants}>
                <ActiveBids
                  nftId={nft.id}
                  ownerId={nft.owner_id}
                  currentUserId={user?.id}
                  onBidAccepted={handlePurchaseComplete}
                  onBidDeclined={handleBidDeclined}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
      
      <FraudWarningDialog 
        isOpen={showFraudWarning} 
        onClose={() => setShowFraudWarning(false)} 
      />
    </div>
  );
};

export default NFTDetail;
