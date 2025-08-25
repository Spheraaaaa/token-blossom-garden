import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Tag, CheckCircle, Sparkles, FileCheck, Shield } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { NFT } from "@/types/nft";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SellNFTPrice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSecureAuth();
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [marketplace, setMarketplace] = useState<string | null>(null);
  const [marketplaceName, setMarketplaceName] = useState<string>("selected marketplace");
  const queryClient = useQueryClient();
  
  const PLATFORM_FEE_PERCENT = 2.5;

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

  useEffect(() => {
    const savedMarketplace = sessionStorage.getItem('sellNFT_marketplace');
    setMarketplace(savedMarketplace);

    if (savedMarketplace === 'purenft') setMarketplaceName('PureNFT.io');
    if (savedMarketplace === 'rarible') setMarketplaceName('Rarible.com');
    if (savedMarketplace === 'opensea') setMarketplaceName('OpenSea.io');
    if (savedMarketplace === 'looksrare') setMarketplaceName('LooksRare.org');
    if (savedMarketplace === 'dappradar') setMarketplaceName('DappRadar.com');
    if (savedMarketplace === 'debank') setMarketplaceName('DeBank.com');
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^(\d+)?(\.\d{0,6})?$/.test(value) || value === "") {
      setPrice(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!price || parseFloat(price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const priceValue = parseFloat(price);
      const sellerReceives = priceValue * (1 - PLATFORM_FEE_PERCENT / 100);
      
      const { error } = await supabase
        .from('nfts')
        .update({
          price: priceValue,
          marketplace: marketplace,
          for_sale: true
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      queryClient.invalidateQueries({ queryKey: ['nft', id] });
      queryClient.invalidateQueries({ queryKey: ['nfts'] });
      
      toast({
        title: "NFT listed for sale",
        description: `Your NFT is now listed for sale on ${marketplaceName} for ${price} ETH`,
      });
      
      setTimeout(() => {
        navigate("/marketplace");
      }, 3000);
      
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error listing NFT:", error);
      toast({
        title: "Error listing NFT",
        description: "There was an error listing your NFT for sale. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  if (nft.owner_id !== user?.id) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">You don't own this NFT</h2>
          <Link to="/profile" className="text-primary hover:underline">
            Go back to your profile
          </Link>
        </div>
      </div>
    );
  }

  if (!marketplace) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No marketplace selected</h2>
          <Link to={`/sell-nft/${id}`} className="text-primary hover:underline">
            Go back to select a marketplace
          </Link>
        </div>
      </div>
    );
  }

  const calculateSellerProceeds = () => {
    if (!price) return "0.0000";
    const priceValue = parseFloat(price);
    const sellerReceives = priceValue * (1 - PLATFORM_FEE_PERCENT / 100);
    return sellerReceives.toFixed(4);
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-16 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {isSuccess ? (
              <Card className="border-border/50 shadow-xl transition-all duration-300 backdrop-blur-xl bg-card/90 overflow-hidden rounded-2xl">
                <CardHeader className="relative pb-2">
                  <CardTitle className="text-xl font-semibold text-foreground">Listing created</CardTitle>
                  <CardDescription className="text-muted-foreground">You're being redirected to the marketplace...</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">Your NFT is now listed for sale on {marketplaceName} for {price} ETH</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 shadow-xl transition-all duration-300 backdrop-blur-xl bg-card/90 overflow-hidden rounded-2xl">
                <CardHeader className="relative pb-2">
                  <div>
                    <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <div className="p-2 rounded-md bg-muted/30 border border-border/50">
                        <Tag className="w-5 h-5 text-muted-foreground" />
                      </div>
                      Set Your Price
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                      Enter the amount you want to sell your NFT for on {marketplaceName}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label htmlFor="price" className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Tag className="h-4 w-4" />
                          Price
                        </label>
                        <div className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded-full border border-border/50">
                          <span className="font-medium">Current Floor:</span> 0.24 ETH
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          id="price"
                          type="text"
                          value={price}
                          onChange={handlePriceChange}
                          placeholder="0.00"
                          className="py-6 text-lg border-border/50 bg-background/60 focus-visible:ring-2 focus-visible:ring-ring"
                          required
                        />
                      </div>

                      <div className="space-y-3 mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <p className="text-muted-foreground">Platform fee ({PLATFORM_FEE_PERCENT}%):</p>
                          {price && (
                            <p className="text-muted-foreground">{(parseFloat(price) * PLATFORM_FEE_PERCENT / 100).toFixed(4)} ETH</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <p className="text-muted-foreground">You'll receive:</p>
                          {price && (
                            <p className="text-foreground font-medium">{calculateSellerProceeds()} ETH</p>
                          )}
                        </div>
                        <div className="h-px bg-border" />
                      </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting || !price} className="w-full py-6">
                      {isSubmitting ? (
                        <>
                          <span className="h-5 w-5 border-2 border-foreground/30 border-t-foreground/90 rounded-full animate-spin mr-2"></span>
                          Processing...
                        </>
                      ) : (
                        "List NFT for Sale"
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">By confirming, you agree to our Terms of Service and NFT Listing Policy</p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="border-border/50 bg-card/80 backdrop-blur-xl rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                  <FileCheck className="h-4 w-4" /> Pricing guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <div className="flex items-start gap-2"><span className="mt-0.5">1.</span><p>Choose marketplace.</p></div>
                  <div className="flex items-start gap-2"><span className="mt-0.5">2.</span><p>Confirm listing.</p></div>
                  <div className="flex items-start gap-2"><span className="mt-0.5">3.</span><p>Set price and publish.</p></div>
                </div>
                <div className="h-px bg-border" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground"><Shield className="h-4 w-4" /> Secure listing</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellNFTPrice;
