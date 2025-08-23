
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { NFT } from "@/types/nft";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SellNFTConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [marketplace, setMarketplace] = useState<string | null>(null);
  const [marketplaceName, setMarketplaceName] = useState<string>("selected marketplace");
  const [marketplaceLogo, setMarketplaceLogo] = useState<string | null>(null);

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

    if (savedMarketplace === 'purenft') {
      setMarketplaceName('PureNFT.io');
      setMarketplaceLogo('/lovable-uploads/1a4506f1-61ef-49dd-a8e8-0ef41959d79d.png');
    }
    if (savedMarketplace === 'rarible') {
      setMarketplaceName('Rarible.com');
      setMarketplaceLogo('/lovable-uploads/4079ebe1-e8eb-4d32-b629-1baaaa70558f.png');
    }
    if (savedMarketplace === 'opensea') {
      setMarketplaceName('OpenSea.io');
      setMarketplaceLogo('/lovable-uploads/607e13eb-1487-4c92-9043-c1a7c6be55b0.png');
    }
  }, []);

  const handleNo = () => {
    navigate(`/sell-nft/${id}`);
  };

  const handleYes = () => {
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      navigate(`/sell-nft/${id}/price`);
    }, 10000);
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

  return (
    <div className="container mx-auto py-8 px-4 mt-16 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="border-border/50 shadow-xl transition-all duration-300 backdrop-blur-xl bg-card/90 overflow-hidden rounded-2xl">
              <CardHeader className="relative pb-2">
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <div className="p-2 rounded-md bg-muted/30 border border-border/50">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                    </div>
                    Confirm Listing
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Verify the details before proceeding with {marketplaceName}
                  </CardDescription>
                </div>
              </CardHeader>

              {isVerifying ? (
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Verification in progress</h3>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    Connecting to {marketplaceName}. Verifying wallet signature...
                  </p>
                  <div className="w-full max-w-md relative mb-2 h-2">
                    <div className="absolute inset-0 rounded-full bg-muted/30"></div>
                    <div className="h-2 rounded-full bg-primary/40 animate-[progress_10s_ease-in-out_forwards]"></div>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="w-40 h-40 rounded-xl overflow-hidden border border-border/50">
                      <img src={nft?.image} alt={nft?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">{nft?.name}</h3>
                      <p className="text-sm text-muted-foreground">Created by {nft?.creator}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Listing on {marketplaceName}</span>
                        {marketplaceLogo && (
                          <div className="w-5 h-5 rounded-full overflow-hidden">
                            <img src={marketplaceLogo} alt={marketplaceName} className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end mt-6">
                    <Button variant="outline" onClick={handleNo}>Go Back</Button>
                    <Button onClick={handleYes}>Continue to Pricing</Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          <div>
            <Card className="border-border/50 bg-card/80 backdrop-blur-xl rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                  <Shield className="h-4 w-4" /> Listing guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <div className="flex items-start gap-2"><span className="mt-0.5">1.</span><p>Select a marketplace.</p></div>
                  <div className="flex items-start gap-2"><span className="mt-0.5">2.</span><p>Confirm listing details.</p></div>
                  <div className="flex items-start gap-2"><span className="mt-0.5">3.</span><p>Set your price and publish.</p></div>
                </div>
                <div className="h-px bg-border" />
                <div className="space-y-2">
                  
                  <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Platform fee may apply</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellNFTConfirmation;
