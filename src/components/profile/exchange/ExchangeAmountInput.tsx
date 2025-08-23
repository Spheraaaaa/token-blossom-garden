
import React from "react";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExchangeAmountInputProps {
  exchangeAmount: string;
  exchangeDirection: 'eth_to_usdt' | 'usdt_to_eth';
  setExchangeAmount: (value: string) => void;
  accentColor?: string;
}

export const ExchangeAmountInput = ({
  exchangeAmount,
  exchangeDirection,
  setExchangeAmount,
  accentColor = 'purple'
}: ExchangeAmountInputProps) => {
  const getInputClass = () => {
    return "pl-12 pr-4 h-12 text-base bg-background/60 border border-border/50 focus-visible:ring-2 focus-visible:ring-ring text-foreground placeholder:text-muted-foreground";
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        Amount to Exchange
      </Label>
      <div className="relative">
        <Input 
          type="number" 
          step="0.0001" 
          min="0.0001" 
          value={exchangeAmount} 
          onChange={e => setExchangeAmount(e.target.value)} 
          placeholder={`Enter amount in ${exchangeDirection === 'eth_to_usdt' ? 'ETH' : 'USDT'}`} 
          className={getInputClass()} 
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {exchangeDirection === 'eth_to_usdt' ? (
            <div className="w-7 h-7 bg-background/70 rounded-full p-0.5 flex items-center justify-center">
              <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-5 w-5" />
            </div>
          ) : (
            <div className="h-7 w-7 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-xs">
              $
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
