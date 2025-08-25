
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LockIcon, ArrowRightLeft } from "lucide-react";
import type { UserData, FrozenBalanceInfo } from "@/types/user";

interface WalletBalanceProps {
  userData: UserData | null;
  frozenBalanceDetails: FrozenBalanceInfo[];
  showFrozenDetails: boolean;
  setShowFrozenDetails: (show: boolean) => void;
  setIsExchangeDialogOpen: (open: boolean) => void;
  setExchangeType: (type: 'regular' | 'frozen') => void;
}

export const WalletBalance = ({ 
  userData, 
  frozenBalanceDetails, 
  showFrozenDetails, 
  setShowFrozenDetails,
  setIsExchangeDialogOpen,
  setExchangeType
}: WalletBalanceProps) => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setIsLoadingRate(true);
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        if (data && data.ethereum && data.ethereum.usd) {
          setExchangeRate(data.ethereum.usd);
        }
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setExchangeRate(2074);
      } finally {
        setIsLoadingRate(false);
      }
    };

    fetchExchangeRate();
    const intervalId = setInterval(fetchExchangeRate, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRegularExchange = () => {
    setExchangeType('regular');
    setIsExchangeDialogOpen(true);
  };

  const handleFrozenExchange = () => {
    setExchangeType('frozen');
    setIsExchangeDialogOpen(true);
  };

  const formatEth = (amount: string | number | null | undefined) => {
    const s = String(amount ?? '0');
    if (!s.includes('.')) return s;
    const [int, dec = ''] = s.split('.');
    const dec10 = dec.slice(0, 10);
    const decTrim = dec10.replace(/0+$/, '');
    return decTrim ? `${int}.${decTrim}` : int;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Available Balance */}
      <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Available Balance</h3>
            </div>
          </div>

          <div className="space-y-4">
            {/* ETH Balance */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                  <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ethereum</p>
                  <p className="font-medium text-foreground">ETH</p>
                </div>
              </div>
              <p className="text-lg font-bold text-foreground">
                {formatEth(userData?.balance)}
              </p>
            </div>

            {/* Exchange Button */}
            <div className="flex justify-center">
              <Button 
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-border/30 hover:border-primary/20 hover:bg-primary/5" 
                onClick={handleRegularExchange}
                aria-label="Exchange currencies"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* USDT Balance */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/10">
                  <div className="h-6 w-6 flex items-center justify-center bg-green-500 rounded-full text-white font-bold text-sm">
                    $
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tether</p>
                  <p className="font-medium text-foreground">USDT</p>
                </div>
              </div>
              <p className="text-lg font-bold text-foreground">
                {Number(userData?.usdt_balance || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Frozen Balance */}
      {Number(userData?.frozen_balance || 0) > 0 && (
        <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
                  <LockIcon className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Hold Balance</h3>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400" 
                onClick={() => setShowFrozenDetails(!showFrozenDetails)}
              >
                {showFrozenDetails ? "Hide" : "Show"} Details
              </Button>
            </div>

            <div className="space-y-4">
              {/* Frozen ETH */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-500/10">
                    <img alt="ETH" className="h-6 w-6" src="/lovable-uploads/7d7924fa-23c2-468e-b4e6-439e242022e9.png" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ethereum</p>
                    <p className="font-medium text-foreground">ETH</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-orange-400">
                  {formatEth(userData?.frozen_balance)}
                </p>
              </div>

              {/* Exchange Button */}
              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-orange-500/30 hover:border-orange-500/40 hover:bg-orange-500/10" 
                  onClick={handleFrozenExchange}
                  aria-label="Exchange frozen currencies"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* Frozen USDT */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/10">
                    <div className="h-6 w-6 flex items-center justify-center bg-green-500 rounded-full text-white font-bold text-sm">
                      $
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tether</p>
                    <p className="font-medium text-foreground">USDT</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-orange-400">
                  {Number(userData?.frozen_usdt_balance || 0).toFixed(2)}
                </p>
              </div>

              {/* Frozen Details */}
              {showFrozenDetails && frozenBalanceDetails.length > 0 && (
                <div className="mt-6 pt-6 space-y-3 border-t border-border/30">
                  <p className="text-orange-400 font-medium text-sm">Upcoming Releases:</p>
                  <div className="max-h-[150px] overflow-y-auto space-y-2">
                    {frozenBalanceDetails.map(item => (
                      <div key={item.transaction_id} className="p-3 rounded-xl bg-muted/20 border border-orange-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <LockIcon className="h-4 w-4 text-orange-400" />
                            <span className="text-sm text-orange-300 font-medium">
                              {item.days_left} days remaining
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-orange-400 font-bold">
                              {item.amount.toFixed(2)}
                            </span>
                            <span className="text-xs text-orange-400/70">
                              {item.unfreeze_date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
