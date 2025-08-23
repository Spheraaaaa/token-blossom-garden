
import React from "react";
import { Loader2, Info, Wallet } from "lucide-react";

interface ExchangeDetailsProps {
  exchangeDirection: 'eth_to_usdt' | 'usdt_to_eth';
  exchangeRate: number | null;
  reverseExchangeRate: number | null;
  isLoadingRate: boolean;
  availableBalance: string;
  accentColor?: string;
}

export const ExchangeDetails = ({
  exchangeDirection,
  exchangeRate,
  reverseExchangeRate,
  isLoadingRate,
  availableBalance,
  accentColor = 'purple'
}: ExchangeDetailsProps) => {
  const isAmber = accentColor === 'amber';
  const getBackgroundGradient = () => {
    return 'bg-muted/20';
  };

  return (
    <div className={`space-y-3 p-4 rounded-lg ${getBackgroundGradient()} border border-border/50`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-muted/30">
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <span className="text-sm text-white/90 font-medium">Exchange Rate</span>
        </div>
        
        {isLoadingRate ? (
          <div className="flex items-center gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <span className="text-sm font-medium text-foreground">
            {exchangeDirection === 'eth_to_usdt' 
              ? `1 ETH ≈ ${exchangeRate?.toFixed(2)} USDT` 
              : `1 USDT ≈ ${reverseExchangeRate?.toFixed(6)} ETH`
            }
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-muted/30">
            <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <span className="text-sm text-white/90 font-medium">Available Balance</span>
        </div>
        
        <span className="text-sm font-medium text-foreground px-2 py-1 rounded-md bg-muted/20 border border-border/50">
          {availableBalance}
        </span>
      </div>
    </div>
  );
};
