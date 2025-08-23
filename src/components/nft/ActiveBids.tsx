import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface Bid {
  id: string;
  bidder_address: string;
  bid_amount: number;
  created_at: string;
  verified: boolean;
}

interface ActiveBidsProps {
  nftId?: string;
  ownerId?: string | null;
  currentUserId?: string | undefined;
  bids?: Bid[];
  onBidAccepted?: () => void;
  onBidDeclined?: () => void;
}

const ActiveBids = ({
  nftId,
  ownerId,
  currentUserId,
  bids: initialBids,
  onBidAccepted,
  onBidDeclined,
}: ActiveBidsProps = {}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [bids, setBids] = useState<Bid[]>(initialBids || []);
  const [isLoading, setIsLoading] = useState(true);
  const [processingBidId, setProcessingBidId] = useState<string | null>(null);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [processingDetails, setProcessingDetails] = useState<{
    amount: number;
    platformFee: number;
    receivedAmount: number;
    freezeDuration: number;
    currencyType: string;
  } | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
const [loadingStage, setLoadingStage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);

  useEffect(() => {
    const fetchUserBids = async () => {
      if (initialBids) {
        setBids(initialBids);
        setIsLoading(false);
        return;
      }
      
      if (!nftId && !user?.id) {
        setIsLoading(false);
        setBids([]);
        return;
      }

      try {
        setIsLoading(true);
        
        if (nftId) {
          const { data: bidData, error: bidError } = await supabase
            .from('nft_bids')
            .select('*')
            .eq('nft_id', nftId);
          
          if (bidError) throw bidError;
          
          setBids(bidData || []);
          setIsLoading(false);
          return;
        }
        
        if (user?.id) {
          const { data: userNfts, error: nftError } = await supabase
            .from('nfts')
            .select('id')
            .eq('owner_id', user.id);
          
          if (nftError) throw nftError;
          
          if (!userNfts || userNfts.length === 0) {
            setBids([]);
            setIsLoading(false);
            return;
          }
          
          const nftIds = userNfts.map(nft => nft.id);
          
          const { data: bidData, error: bidError } = await supabase
            .from('nft_bids')
            .select('*')
            .in('nft_id', nftIds);
          
          if (bidError) throw bidError;
          
          setBids(bidData || []);
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
        toast({
          title: "Error",
          description: "Failed to load bids",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBids();
  }, [initialBids, nftId, user?.id, toast]);
  
  const isOwner = currentUserId === ownerId || (user?.id && !ownerId);
  const hasBids = bids.length > 0;
  
  const PLATFORM_FEE_PERCENT = 2.5;

  const handleAcceptBid = async (bidId: string, bidAmount: number) => {
    try {
      setProcessingBidId(bidId);
      setIsTransactionLoading(true);
      
      const platformFee = bidAmount * (PLATFORM_FEE_PERCENT / 100);
      const receivedAmount = bidAmount - platformFee;
      
      const currencyType = "eth";
      
      setProcessingDetails({
        amount: bidAmount,
        platformFee: platformFee,
        receivedAmount: receivedAmount,
        freezeDuration: 15,
        currencyType: currencyType
      });
      
      setLoadingProgress(0);
      setLoadingStage(1);
      
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          
          if (prev >= 75 && loadingStage < 3) {
            setLoadingStage(3);
          } else if (prev >= 40 && loadingStage < 2) {
            setLoadingStage(2);
          }
          
          return prev + 1;
        });
      }, 200);
      
      const { data, error } = await supabase.rpc("accept_bid", {
        bid_id: bidId,
      });

      setTimeout(() => {
        clearInterval(progressInterval);
        setLoadingProgress(100);
        
        if (error) {
          console.error("Error accepting bid:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to accept bid",
            variant: "destructive",
          });
        } else if (data && typeof data === 'object' && 'success' in data) {
          toast({
            title: "Success",
            description: `The bid has been accepted. ${receivedAmount.toFixed(2)} ETH will be available in your wallet after a 15-day security period.`,
          });
          
          if (onBidAccepted) onBidAccepted();
          
          setBids(bids.filter(bid => bid.id !== bidId));
        } else {
          toast({
            title: "Error",
            description: (data && typeof data === 'object' && 'message' in data) 
              ? String(data.message) 
              : "Failed to accept bid",
            variant: "destructive",
          });
        }
        
        setTimeout(() => {
          setProcessingBidId(null);
          setIsTransactionLoading(false);
          setProcessingDetails(null);
          setLoadingStage(0);
        }, 1000);
      }, 5000);
      
    } catch (error: any) {
      console.error("Error accepting bid:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept bid",
        variant: "destructive",
      });
      setProcessingBidId(null);
      setIsTransactionLoading(false);
      setProcessingDetails(null);
    }
  };

  const handleDeclineBid = async (bidId: string) => {
    try {
      setProcessingBidId(bidId);
      
      console.log("Declining bid:", bidId);
      
      const { error } = await supabase
        .from('nft_bids')
        .delete()
        .eq('id', bidId);
      
      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
      
      setBids(prevBids => prevBids.filter(bid => bid.id !== bidId));
      
      toast({
        title: "Success",
        description: "Bid declined successfully",
      });
      
      if (onBidDeclined) onBidDeclined();
    } catch (error: any) {
      console.error("Error declining bid:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to decline bid",
        variant: "destructive",
      });
    } finally {
      setProcessingBidId(null);
    }
  };

  const getLoadingStageText = () => {
    switch (loadingStage) {
      case 1:
        return "Initiating transaction...";
      case 2:
        return "Processing bid acceptance...";
      case 3:
        return "Finalizing and securing funds...";
      default:
        return "Processing...";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card/90 border border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Active Bids</CardTitle>
          <CardDescription>Loading your bids...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card/70 p-4">
              <div className="flex items-center justify-between gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-9 w-32 rounded-lg" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!hasBids) {
    return (
      <Card className="bg-card/90 border border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Active Bids</CardTitle>
          <CardDescription>No active bids for this NFT</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-card/90 border border-border/50 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Active Bids</CardTitle>
        <CardDescription>
          {isOwner
            ? "Review and accept bids for your NFTs"
            : "Current bids for this NFT"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isTransactionLoading && processingDetails ? (
          <div className="bg-card/90 border border-border/50 rounded-xl p-6 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Processing Transaction</h3>
              <p className="text-muted-foreground">{getLoadingStageText()}</p>
            </div>
            
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-purple-400 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            
            <div className="border border-border/50 bg-accent/20 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Bid Amount:</span>
                <span className="font-medium text-right">{processingDetails.amount.toFixed(2)} ETH</span>
                
                <span className="text-muted-foreground">Platform Fee ({PLATFORM_FEE_PERCENT}%):</span>
                <span className="font-medium text-right text-destructive">-{processingDetails.platformFee.toFixed(2)} ETH</span>
                
                <span className="text-muted-foreground font-medium">You Receive:</span>
                <span className="font-bold text-right text-primary">{processingDetails.receivedAmount.toFixed(2)} {processingDetails.currencyType.toUpperCase()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-primary bg-primary/10 p-3 rounded-lg">
              <Clock className="h-5 w-5" />
              <p className="text-sm">
                Funds will be available in {processingDetails.freezeDuration} days after security verification
              </p>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              Please do not close this window during processing
            </p>
          </div>
        ) : (
          bids.map((bid) => (
            <div
              key={bid.id}
              className="group rounded-xl border border-border/50 bg-card/70 p-4 hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.3),0_10px_30px_-10px_hsl(var(--primary)/0.25)] transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm truncate max-w-[220px]">
                      {bid.bidder_address}
                    </span>
                    <Badge variant={bid.verified ? "secondary" : "outline"}>
                      {bid.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png"
                      alt="Ethereum logo"
                      className="h-4 w-4"
                    />
                    <span className="text-lg sm:text-xl font-semibold">
                      {bid.bid_amount.toFixed(2)} ETH
                    </span>
                  </div>
                  <div className="mt-1 flex items-center text-muted-foreground text-xs sm:text-sm">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {new Date(bid.created_at).toLocaleDateString()}
                  </div>
                </div>

                {isOwner && (
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => { setSelectedBid(bid); setConfirmOpen(true); }}
                      className="px-4"
                      disabled={!!processingBidId}
                    >
                      {processingBidId === bid.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Confirm Sale
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Sale</AlertDialogTitle>
              <AlertDialogDescription>
                Review the sale details before confirming.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {selectedBid && (
              <div className="mt-2 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Bid Amount</span>
                  <span className="text-right font-medium">{selectedBid.bid_amount.toFixed(4)} ETH</span>
                  <span className="text-muted-foreground">Platform Fee ({PLATFORM_FEE_PERCENT}%)</span>
                  <span className="text-right font-medium text-destructive">-{(selectedBid.bid_amount * (PLATFORM_FEE_PERCENT/100)).toFixed(4)} ETH</span>
                  <span className="text-muted-foreground">You Receive</span>
                  <span className="text-right font-semibold text-primary">{(selectedBid.bid_amount * (1 - PLATFORM_FEE_PERCENT/100)).toFixed(4)} ETH</span>
                </div>
                <div className="rounded-md bg-accent/20 border border-border/50 p-3 text-xs text-muted-foreground">
                  Funds will be available after a 15-day security period.
                </div>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!processingBidId}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedBid) {
                    handleAcceptBid(selectedBid.id, selectedBid.bid_amount);
                    setConfirmOpen(false);
                  }
                }}
                disabled={!!processingBidId}
              >
                Confirm Sale
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default ActiveBids;
