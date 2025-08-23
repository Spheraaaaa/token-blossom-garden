
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, Store, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { NFT } from "@/types/nft";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const marketplaces = [
  { 
    id: "purenft", 
    name: "PureNFT.io", 
    logo: "/lovable-uploads/1a4506f1-61ef-49dd-a8e8-0ef41959d79d.png" 
  },
  { 
    id: "rarible", 
    name: "Rarible.com", 
    logo: "/lovable-uploads/4079ebe1-e8eb-4d32-b629-1baaaa70558f.png" 
  },
  { 
    id: "opensea", 
    name: "OpenSea.io", 
    logo: "/lovable-uploads/607e13eb-1487-4c92-9043-c1a7c6be55b0.png" 
  },
];

const SellNFTMarketplace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedMarketplace, setSelectedMarketplace] = useState<string | null>(null);

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

  const handleContinue = () => {
    if (!selectedMarketplace) {
      toast({
        title: "Select marketplace",
        description: "Please select a marketplace to continue",
        variant: "destructive",
      });
      return;
    }

    sessionStorage.setItem('sellNFT_marketplace', selectedMarketplace);
    navigate(`/sell-nft/${id}/confirm`);
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
                      <Store className="w-5 h-5 text-muted-foreground" />
                    </div>
                    Select Marketplace
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Choose where you want to list your NFT for sale
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-border/50">
                    <img src={nft?.image} alt={nft?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="self-center">
                    <h2 className="text-lg font-medium text-foreground">{nft?.name}</h2>
                    <p className="text-sm text-muted-foreground">Created by {nft?.creator}</p>
                  </div>
                </div>

                <RadioGroup 
                  value={selectedMarketplace || ""} 
                  onValueChange={setSelectedMarketplace}
                  className="space-y-3"
                >
                  {marketplaces.map((marketplace) => (
                    <div key={marketplace.id} className="relative">
                      <RadioGroupItem value={marketplace.id} id={marketplace.id} className="peer sr-only" />
                      <Label
                        htmlFor={marketplace.id}
                        className="flex items-center justify-between w-full p-4 rounded-lg border border-border/50 bg-background/60 hover:bg-muted/20 peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:border-primary/30 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-muted/30">
                            <img src={marketplace.logo} alt={marketplace.name} className="w-full h-full object-contain" />
                          </div>
                          <span className="text-foreground">{marketplace.name}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleContinue} 
                    disabled={!selectedMarketplace}
                    className="relative overflow-hidden group bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/80 text-primary-foreground shadow-sm"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Continue to Confirmation
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  </Button>
                </div>
              </CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellNFTMarketplace;
