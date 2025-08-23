import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShoppingCart, ShieldCheck, Lock, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PurchaseButtonProps {
  isLoggedIn: boolean;
  onPurchase: () => void;
  nftId: string;
  price?: string | number;
  name?: string;
  image?: string;
  balance?: number | null;
}
export const PurchaseButton = ({ isLoggedIn, onPurchase, nftId, price, name, image, balance }: PurchaseButtonProps) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [open, setOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const priceNum = useMemo(() => (price ? Number(price) : 0), [price]);
  const networkFee = 0.0007;
  const total = useMemo(() => +(priceNum + networkFee).toFixed(6), [priceNum]);
  const hasBalance = balance == null ? true : Number(balance) >= total;

  const handlePurchase = async () => {
    if (!isLoggedIn) return;
    
    try {
      setIsPurchasing(true);
      
      const { data, error } = await supabase.rpc('purchase_nft', {
        nft_id: nftId
      });
      
      if (error) {
        throw error;
      }
      
      // Handle the response safely with type checking
      if (data && typeof data === 'object' && 'success' in data) {
        if (!data.success && 'message' in data) {
          toast({
            title: "Purchase Failed",
            description: String(data.message),
            variant: "destructive",
          });
          return;
        }
      } else {
        throw new Error("Unexpected response format");
      }
      
      toast({
        title: "Purchase Successful",
        description: "The NFT has been added to your collection!",
      });
      
      onPurchase();
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Error",
        description: error.message || "An error occurred during purchase",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleLoginRedirect = () => {
    // Store current NFT page URL to redirect back after login
    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);
    
    // Navigate to login page
    navigate('/login');
  };

  return isLoggedIn ? (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button 
        onClick={() => setOpen(true)} 
        variant="default"
        className="flex-1"
        size="lg"
        disabled={isPurchasing}
      >
        {isPurchasing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Purchase Now
          </>
        )}
      </Button>
      <AlertDialogContent className="border-border/50 bg-card/90 sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm your purchase</AlertDialogTitle>
          <AlertDialogDescription>
            Review the details below before confirming. This action is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4 p-3 rounded-lg border border-border/50 bg-background/40">
            <img
              src={image || "/placeholder.svg"}
              alt={name ? `${name} preview` : "NFT preview"}
              className="h-16 w-16 rounded-md object-cover"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground truncate">{name || "Selected NFT"}</div>
              <div className="text-sm text-muted-foreground mt-0.5">Price</div>
              <div className="text-lg font-semibold">{priceNum} ETH</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-md bg-muted/20 border border-border/50">
              <div className="text-xs text-muted-foreground">Estimated network fee</div>
              <div className="text-sm font-medium">~ {networkFee} ETH</div>
            </div>
            <div className="p-3 rounded-md bg-muted/20 border border-border/50">
              <div className="text-xs text-muted-foreground">You will pay</div>
              <div className="text-sm font-semibold">{total} ETH</div>
            </div>
            {typeof balance !== 'undefined' && balance !== null && (
              <div className="col-span-2 p-3 rounded-md border border-border/50 flex items-center justify-between bg-background/40">
                <div className="text-sm text-muted-foreground">Your balance</div>
                <div className={`text-sm font-medium ${hasBalance ? 'text-foreground' : 'text-destructive'}`}>{Number(balance).toFixed(6)} ETH</div>
              </div>
            )}
          </div>

          {!hasBalance && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <Info className="h-4 w-4 text-destructive mt-0.5" />
              <div className="text-sm text-destructive">Insufficient balance to complete this purchase.
                <button className="ml-2 underline underline-offset-2" onClick={() => navigate('/deposit')}>Add funds</button>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
            <Label htmlFor="agree" className="text-sm leading-relaxed">
              I confirm that I’ve reviewed the details and agree to the Terms of Service. Refunds are not available for confirmed blockchain transactions.
            </Label>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Secure checkout</div>
            <div className="flex items-center gap-1.5"><Lock className="h-4 w-4" /> Encrypted processing</div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPurchasing}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={async () => { await handlePurchase(); setOpen(false); }} disabled={isPurchasing || !agree || !hasBalance}>
              {isPurchasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Purchasing...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Confirm Purchase
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Button 
      onClick={handleLoginRedirect}
      variant="default"
      className="flex-1"
      size="lg"
    >
      Login to Purchase
    </Button>
  );
};
