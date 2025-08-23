
import React from "react";
import { ArrowDownIcon } from "lucide-react";

interface EstimatedResultProps {
  estimatedResult: number | null;
  exchangeDirection: 'eth_to_usdt' | 'usdt_to_eth';
  accentColor?: string;
}

export const EstimatedResult = ({
  estimatedResult,
  exchangeDirection,
  accentColor = 'purple'
}: EstimatedResultProps) => {
  const getGlowEffect = () => {
    return accentColor === 'amber' 
      ? 'shadow-[0_0_15px_rgba(245,158,11,0.25)]'
      : 'shadow-[0_0_15px_rgba(147,51,234,0.25)]';
  };

  const getTextColor = () => {
    return accentColor === 'amber' ? 'text-amber-200' : 'text-indigo-200';
  };

  // Add stronger glow effect for improved visibility
  const getStrongGlow = () => {
    return accentColor === 'amber'
      ? 'shadow-[0_0_20px_rgba(245,158,11,0.3)]'
      : 'shadow-[0_0_20px_rgba(147,51,234,0.3)]';
  };
  
  const getBackgroundGradient = () => {
    return accentColor === 'amber'
      ? 'bg-gradient-to-br from-black/80 to-amber-950/80'
      : 'bg-gradient-to-br from-black/80 to-purple-950/80';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="h-8 w-8 rounded-md bg-muted/30 flex items-center justify-center mb-2">
        <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="w-full p-4 rounded-lg bg-muted/20 border border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {exchangeDirection === 'eth_to_usdt' ? (
            <div className="h-8 w-8 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-sm">
              $
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-background/70 p-1 flex items-center justify-center">
              <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-6 w-6" />
            </div>
          )}
          <span className="text-sm text-muted-foreground">You'll receive</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-foreground">
            {estimatedResult ? parseFloat(estimatedResult.toFixed(6)) : '0.00'}
          </span>
          <span className="text-sm text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
            {exchangeDirection === 'eth_to_usdt' ? 'USDT' : 'ETH'}
          </span>
        </div>
      </div>
    </div>
  );
};
