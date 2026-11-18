import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Info } from "lucide-react";
import type { UserData, Transaction } from "@/types/user";
import { ExchangeDirectionSelector } from "./exchange/ExchangeDirectionSelector";
import { ExchangeAmountInput } from "./exchange/ExchangeAmountInput";
import { EstimatedResult } from "./exchange/EstimatedResult";
import { ExchangeDetails } from "./exchange/ExchangeDetails";
import { useExchange } from "@/hooks/useExchange";
import { useToast } from "@/hooks/use-toast";

interface ExchangeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userData: UserData | null;
  userId: string | undefined;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  exchangeType?: 'regular' | 'frozen';
}

export const ExchangeDialog = ({ 
  isOpen, 
  setIsOpen, 
  userData, 
  userId,
  setTransactions,
  exchangeType = 'regular'
}: ExchangeDialogProps) => {
  const { 
    exchangeAmount,
    setExchangeAmount,
    exchangeDirection,
    estimatedResult,
    exchangeRate,
    reverseExchangeRate,
    isLoadingRate,
    fetchCurrentExchangeRate,
    toggleExchangeDirection,
    getAvailableBalance,
    handleExchange
  } = useExchange({
    userData,
    userId,
    setTransactions,
    exchangeType
  });
  const { toast } = useToast();
  
  useEffect(() => {
    if (isOpen) {
      fetchCurrentExchangeRate();
    }
  }, [isOpen]);

  const onExchangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleExchange(e);
    if (success) {
      setIsOpen(false);
    }
  };

  // Determine color scheme based on exchangeType
  const getColors = () => {
    if (exchangeType === 'frozen') {
      return {
        gradient: 'from-amber-900/95 via-amber-800/95 to-amber-900/95',
        headerGradient: 'from-amber-300 to-yellow-300',
        accentColor: 'amber',
        buttonGradient: 'from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600',
        glow: 'shadow-[0_0_35px_rgba(245,158,11,0.25)]',
        topBorder: 'from-amber-600/70 via-amber-500/50 to-amber-600/70'
      };
    }
    return {
      gradient: 'from-card/95 via-card/95 to-background/95',
      headerGradient: 'from-primary to-accent',
      accentColor: 'purple',
      buttonGradient: 'from-primary to-accent hover:from-primary/90 hover:to-accent/90',
      glow: 'shadow-lg',
      topBorder: 'from-primary/70 via-accent/50 to-primary/70'
    };
  };

  const colors = getColors();
  const accent = colors.accentColor;
  const isAmber = accent === 'amber';
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="sm:max-w-md bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl rounded-2xl pt-8"
      >
        
        
        
        
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="p-2 rounded-md bg-muted/30 border border-border/50">
              <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
            </div>
            {exchangeType === 'frozen' ? 'Exchange Frozen Balance' : 'Exchange Currency'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1 text-sm">
            Convert between {exchangeType === 'frozen' ? 'frozen ' : ''}ETH and {exchangeType === 'frozen' ? 'frozen ' : ''}USDT with real-time rates
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onExchangeSubmit} className="space-y-5 relative">
          <ExchangeDirectionSelector 
            direction={exchangeDirection} 
            onToggleDirection={toggleExchangeDirection}
            accentColor={accent}
          />
          
          <ExchangeAmountInput 
            exchangeAmount={exchangeAmount} 
            exchangeDirection={exchangeDirection} 
            setExchangeAmount={setExchangeAmount} 
            accentColor={accent}
          />
          
          <EstimatedResult 
            estimatedResult={estimatedResult} 
            exchangeDirection={exchangeDirection} 
            accentColor={accent}
          />
          
          <ExchangeDetails 
            exchangeDirection={exchangeDirection}
            exchangeRate={exchangeRate}
            reverseExchangeRate={reverseExchangeRate}
            isLoadingRate={isLoadingRate}
            availableBalance={getAvailableBalance()}
            accentColor={accent}
          />
          
          <div className="pt-3">
            <Button type="submit" className="w-full h-12"> 
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              Confirm Exchange
            </Button>
          </div>
          
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/50">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>Exchange requests are processed manually and may take up to 24 hours to complete. The final exchange rate may differ slightly from the estimated rate.</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
