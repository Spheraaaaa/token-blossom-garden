
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Check, X, ExternalLink, Edit, Tag, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
  owner_id?: string | null;
  for_sale?: boolean;
  marketplace?: string | null;
  isProfileView?: boolean;
  viewMode?: 'grid' | 'list';
  onCancelSale?: (id: string) => Promise<void>;
  onUpdatePrice?: (id: string, price: string) => Promise<void>;
  onViewBids?: (id: string) => void;
}

export const NFTCard = ({ 
  id, 
  name, 
  image, 
  price, 
  creator, 
  owner_id, 
  for_sale,
  marketplace,
  isProfileView = false,
  viewMode = 'grid',
  onCancelSale,
  onUpdatePrice,
  onViewBids
}: NFTCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(price);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const isOwner = user?.id === owner_id;
  const isForSale = for_sale === true;
  const isGridView = viewMode === 'grid';

  // Handle sell NFT
  const handleSellNFT = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/sell-nft/${id}`);
  };

  const handleEditPrice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditingPrice(true);
  };

  const handleSavePrice = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newPrice || parseFloat(newPrice) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive"
      });
      return;
    }
    
    if (onUpdatePrice) {
      await onUpdatePrice(id, newPrice);
      setIsEditingPrice(false);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditingPrice(false);
    setNewPrice(price);
  };

  const openCancelDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCancelDialog(true);
  };

  const handleCancelSale = async () => {
    if (onCancelSale) {
      await onCancelSale(id);
      setShowCancelDialog(false);
    }
  };

  const handleViewBids = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewBids) {
      onViewBids(id);
    }
  };

  const getMarketplaceDisplay = () => {
    if (!marketplace) return null;
    
    const marketplaceMap: Record<string, string> = {
      'purenft': 'PureNFT',
      'rarible': 'Rarible',
      'opensea': 'OpenSea',
      'looksrare': 'LooksRare',
      'dappradar': 'DappRadar',
      'debank': 'DeBank'
    };
    
    return marketplaceMap[marketplace] || marketplace;
  };

  if (isGridView) {
    return (
      <>
        <Link to={`/nft/${id}`} className="block group">
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden nft-card-enhanced hover-elastic hw-accelerated">
            <div className="relative">
              {/* Simplified backdrop */}
              <div className="absolute inset-0 light-blur" />
              
              {/* Marketplace badge */}
              {marketplace && isForSale && (
                <div className="absolute top-2 md:top-3 left-2 md:left-3 z-20">
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 md:gap-1.5 bg-background/80 text-foreground border-border/50 px-2 md:px-3 py-1 md:py-1.5 text-xs rounded-lg md:rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hw-accelerated"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-pulse" />
                    <span className="hidden sm:inline">{getMarketplaceDisplay()}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Badge>
                </div>
              )}
              
              {/* For Sale badge */}
              {isForSale && (
                <div className="absolute top-2 md:top-3 right-2 md:right-3 z-20">
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 md:gap-1.5 optimized-gradient text-primary border-primary/30 px-2 md:px-3 py-1 md:py-1.5 text-xs rounded-lg md:rounded-xl font-medium shadow-lg"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full animate-ping" />
                    For Sale
                  </Badge>
                </div>
              )}
              
              {/* NFT Image with optimized container */}
              <div className="aspect-square w-full overflow-hidden flex items-center justify-center relative nft-image-container rounded-t-xl md:rounded-t-2xl">
                <img
                  src={image}
                  alt={name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-300 will-change-transform"
                />
              </div>
              
              {/* NFT Info with optimized styling */}
              <div className="relative p-3 md:p-4 space-y-2 md:space-y-3 light-blur">
                <div className="space-y-1 md:space-y-2">
                  <h3 className="font-bold text-base md:text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">
                    {name}
                  </h3>
                  
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground/80 transition-colors duration-300">
                    by <span className="font-medium text-accent">{creator}</span>
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-border/30 group-hover:border-primary/30 transition-colors duration-300">
                  {isEditingPrice ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Input 
                        type="number" 
                        value={newPrice} 
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="h-7 md:h-8 w-16 md:w-20 text-xs md:text-sm border-primary/30 focus:border-primary"
                        min="0.01"
                        step="0.01"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button 
                        size="icon" 
                        className="h-6 w-6 md:h-7 md:w-7 bg-accent hover:bg-accent/80"
                        variant="default"
                        onClick={handleSavePrice}
                      >
                        <Check className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      </Button>
                      <Button 
                        size="icon" 
                        className="h-6 w-6 md:h-7 md:w-7 bg-destructive/20 hover:bg-destructive/30 text-destructive"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="price-badge">
                      <img 
                        src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                        alt="ETH"
                        className="h-4 w-4 md:h-5 md:w-5"
                      />
                      <span className="text-sm md:text-base font-bold text-primary">
                        {price}
                      </span>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  {isProfileView && (
                    <div className="flex gap-1 md:gap-2" onClick={(e) => e.stopPropagation()}>
                      {isForSale ? (
                        <>
                          {!isEditingPrice && (
                            <Button 
                              onClick={handleEditPrice} 
                              size="sm"
                              variant="secondary"
                              className="h-6 md:h-8 px-2 md:px-3 text-xs rounded-md md:rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all duration-200 hover:scale-105 hw-accelerated"
                              title="Edit Price"
                            >
                              <Edit className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            </Button>
                          )}
                          <Button 
                            onClick={openCancelDialog} 
                            size="sm"
                            variant="secondary"
                            className="h-6 md:h-8 px-2 md:px-3 text-xs rounded-md md:rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-all duration-200 hover:scale-105 hw-accelerated"
                            title="Cancel Sale"
                          >
                            <X className="h-3 w-3 md:h-3.5 md:w-3.5" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={handleSellNFT} 
                          size="sm"
                          variant="default"
                          className="h-6 md:h-8 px-2 md:px-3 text-xs rounded-md md:rounded-lg optimized-gradient hover:from-accent/80 hover:to-primary/80 transition-all duration-200 hover:scale-105 hw-accelerated"
                          title="Sell NFT"
                        >
                          <Tag className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                          <span className="hidden sm:inline">Sell</span>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* View Bids button with optimized styling */}
                {isProfileView && isForSale && (
                  <div className="mt-2 md:mt-3" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewBids}
                      className="w-full text-xs md:text-sm justify-center light-blur hover:bg-primary/10 border-border/50 hover:border-primary/30 text-foreground hover:text-primary transition-all duration-200 rounded-md md:rounded-lg hw-accelerated h-7 md:h-auto"
                    >
                      <span>View Bids</span>
                      <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
        
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent className="light-blur border-2 border-border/50 rounded-2xl shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-primary">
                Cancel NFT Sale
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground leading-relaxed">
                Are you sure you want to cancel the sale of <span className="text-primary font-medium">"{name}"</span>? 
                <br />
                <span className="text-sm">This will remove the NFT from all marketplaces.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-4">
              <AlertDialogCancel 
                onClick={(e) => e.stopPropagation()}
                className="border-border/50 bg-card hover:bg-accent/10 hover:border-accent/30 transition-all duration-200 rounded-xl hw-accelerated"
              >
                Keep Listed
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelSale();
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 rounded-xl hw-accelerated"
              >
                Cancel Sale
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
  
  // List view card
  return (
    <>
      <Link to={`/nft/${id}`} className="block group">
        <div className="relative rounded-xl overflow-hidden">
          <div className="rounded-2xl border border-border/50 bg-card/90 text-foreground shadow-xl backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row">
              {/* Image section */}
              <div className="sm:w-1/4 lg:w-1/5 relative">
                <div className="aspect-square h-full overflow-hidden flex items-center justify-center rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover object-center md:group-hover:scale-105"
                  />
                </div>
                
                {/* Marketplace badge */}
                {marketplace && isForSale && (
                  <div className="absolute bottom-2 left-2 z-10">
                    <Badge 
                      variant="outline" 
                      className="flex items-center gap-1 bg-background/60 text-foreground border-border/30 px-2 py-0.5 text-xs"
                    >
                      {getMarketplaceDisplay()}
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Badge>
                  </div>
                )}
                
                {/* For Sale badge */}
                {isForSale && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge 
                      variant="outline" 
                      className="bg-primary/15 text-primary border-primary/30 px-2 py-1 text-xs"
                    >
                      For Sale
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Content section */}
              <div className="sm:w-3/4 lg:w-4/5 p-4 flex flex-col sm:flex-row justify-between">
                <div className="space-y-1 sm:w-1/2">
                  <h3 className="font-medium text-base md:text-lg text-white">
                    {name}
                  </h3>
                  
                  <p className="text-xs text-purple-300/80">
                    by {creator}
                  </p>
                  
                  <div className="flex items-center gap-1 mt-2">
                    <img 
                      src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                      alt="ETH"
                      className="h-4 w-4"
                    />
                    <span className="text-base font-medium text-white">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Input 
                            type="number" 
                            value={newPrice} 
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="h-8 w-24 text-xs"
                            min="0.01"
                            step="0.01"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button 
                            size="icon" 
                            className="h-8 w-8"
                            variant="ghost"
                            onClick={handleSavePrice}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            className="h-8 w-8"
                            variant="ghost"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : price}
                    </span>
                  </div>
                  
                  {/* View Bids button for list view */}
                  {isProfileView && isForSale && (
                    <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewBids}
                        className="text-xs bg-card hover:bg-accent border-border/50 text-foreground"
                      >
                        <span>View Bids</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-4 sm:mt-0">
                  {isProfileView && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        {isForSale ? (
                          <>
                            {!isEditingPrice && (
                              <Button 
                                onClick={handleEditPrice} 
                                variant="secondary"
                                className="h-8 px-3 text-xs rounded-md bg-primary/10 text-primary"
                                title="Edit Price"
                              >
                                <Edit className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>
                            )}
                            <Button 
                              onClick={openCancelDialog} 
                              variant="secondary"
                              className="h-8 px-3 text-xs rounded-md bg-destructive/10 text-destructive"
                              title="Cancel Sale"
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={handleSellNFT} 
                            variant="nftSell"
                            className="h-8 px-3 text-xs"
                            title="Sell NFT"
                          >
                            <Tag className="h-3.5 w-3.5 mr-1" />
                            Sell
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-card border border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">Cancel NFT Sale</AlertDialogTitle>
            <AlertDialogDescription className="text-purple-300/80">
              Are you sure you want to cancel the sale of <span className="text-purple-300 font-medium">"{name}"</span>? This will remove the NFT from all marketplaces.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              onClick={(e) => e.stopPropagation()}
              className="border-border/50 bg-card hover:bg-accent"
            >
              No, keep it listed
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.stopPropagation();
                handleCancelSale();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, cancel sale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
