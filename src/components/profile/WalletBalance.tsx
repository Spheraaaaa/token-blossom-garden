
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

const AssetRow = ({
  icon,
  name,
  symbol,
  amount,
  tone = "default",
}: {
  icon: React.ReactNode;
  name: string;
  symbol: string;
  amount: string;
  tone?: "default" | "hold";
}) => (
  <div className="flex items-center justify-between gap-4 py-4">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">{icon}</span>
      <div>
        <p className="font-medium text-foreground">{symbol}</p>
        <p className="text-sm text-muted-foreground">{name}</p>
      </div>
    </div>
    <p
      className={`font-display text-xl font-semibold tabular-nums ${
        tone === "hold" ? "text-orange-400" : "text-foreground"
      }`}
    >
      {amount}
    </p>
  </div>
);

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

  const hasHold = Number(userData?.frozen_balance || 0) > 0;


  const usdtIcon = (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-usdt text-xs font-bold text-white">$</span>
  );

  return (
    <div className={`grid gap-8 ${hasHold ? "md:grid-cols-2 md:gap-0 md:divide-x md:divide-border" : ""}`}>
      {/* Available Balance */}
      <div className={hasHold ? "md:pr-7" : ""}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
            Available Balance
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-primary hover:bg-primary/10 hover:text-primary"
            onClick={handleRegularExchange}
            aria-label="Exchange currencies"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Exchange
          </Button>
        </div>
        <div className="mt-2 divide-y divide-border">
          <AssetRow
            icon={<img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="" className="h-6 w-6" />}
            name="Ethereum"
            symbol="ETH"
            amount={formatEth(userData?.balance)}
          />
          <AssetRow
            icon={usdtIcon}
            name="Tether"
            symbol="USDT"
            amount={Number(userData?.usdt_balance || 0).toFixed(2)}
          />
        </div>
      </div>

      {/* Hold Balance */}
      {hasHold && (
        <div className="md:pl-7">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <LockIcon className="h-4 w-4 text-orange-400" aria-hidden="true" />
              Hold Balance
            </h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-full px-3 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                onClick={handleFrozenExchange}
                aria-label="Exchange frozen currencies"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Exchange
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setShowFrozenDetails(!showFrozenDetails)}
                aria-expanded={showFrozenDetails}
              >
                {showFrozenDetails ? "Hide" : "Show"} Details
              </Button>
            </div>
          </div>
          <div className="mt-2 divide-y divide-border">
            <AssetRow
              icon={<img alt="" className="h-6 w-6" src="/lovable-uploads/7d7924fa-23c2-468e-b4e6-439e242022e9.png" />}
              name="Ethereum"
              symbol="ETH"
              amount={formatEth(userData?.frozen_balance)}
              tone="hold"
            />
            <AssetRow
              icon={usdtIcon}
              name="Tether"
              symbol="USDT"
              amount={Number(userData?.frozen_usdt_balance || 0).toFixed(2)}
              tone="hold"
            />
          </div>

          {showFrozenDetails && frozenBalanceDetails.length > 0 && (
            <div className="mt-4 rounded-xl bg-orange-500/5 p-4 ring-1 ring-inset ring-orange-500/15">
              <p className="text-sm font-medium text-orange-400">Upcoming Releases:</p>
              <ul className="mt-3 max-h-[150px] space-y-2 overflow-y-auto">
                {frozenBalanceDetails.map((item) => (
                  <li key={item.transaction_id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-orange-300">
                      <LockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {item.days_left} days remaining
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-semibold tabular-nums text-orange-400">{item.amount.toFixed(2)}</span>
                      <span className="text-xs text-orange-400/70">{item.unfreeze_date}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
