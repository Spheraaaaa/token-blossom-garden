
import React from "react";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ExchangeDirectionSelectorProps {
  direction: 'eth_to_usdt' | 'usdt_to_eth';
  onToggleDirection: () => void;
  accentColor?: string;
}

export const ExchangeDirectionSelector = ({ 
  direction, 
  onToggleDirection,
  accentColor = 'purple'
}: ExchangeDirectionSelectorProps) => {
  const isAmber = accentColor === 'amber';
  return (
    <div className="p-4 rounded-xl bg-muted/20 border border-border/50 backdrop-blur-sm">
      <Label className="text-sm font-medium text-muted-foreground mb-3 block">Exchange Direction</Label>
      
      <div className="flex items-center justify-between">
        <div className={`flex-1 p-3 rounded-lg text-center transition-all duration-200 border ${direction === 'eth_to_usdt' ? 'bg-primary/10 border-primary/30' : 'bg-transparent border-transparent'}`}>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 bg-background/70 rounded-full p-0.5 flex items-center justify-center">
              <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-foreground/90">Ethereum</span>
          </div>
        </div>
        
        <Button 
          type="button"
          onClick={onToggleDirection}
          variant="outline"
          size="circleSmall"
          className="mx-2 bg-background/60 border border-border/50 hover:bg-accent/20"
        >
          <ArrowRightLeft className="h-5 w-5" />
        </Button>
        
        <div className={`flex-1 p-3 rounded-lg text-center transition-all duration-200 border ${direction === 'usdt_to_eth' ? 'bg-primary/10 border-primary/30' : 'bg-transparent border-transparent'}`}>
          <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-sm">
            $
          </div>
          <span className="text-sm font-medium text-foreground/90">USDT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
