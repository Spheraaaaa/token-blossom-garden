
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { TransactionHistory } from "./TransactionHistory";
import { WalletBalance } from "./WalletBalance";
import { TransactionButtons } from "./TransactionButtons";
import type { UserData, Transaction, FrozenBalanceInfo } from "@/types/user";

interface WalletTabProps {
  userData: UserData | null;
  frozenBalanceDetails: FrozenBalanceInfo[];
  showFrozenDetails: boolean;
  setShowFrozenDetails: (show: boolean) => void;
  setIsExchangeDialogOpen: (open: boolean) => void;
  transactions: Transaction[];
  setExchangeType: (type: 'regular' | 'frozen') => void;
  onLoadMore?: () => void;
  isFetchingNext?: boolean;
  hasMore?: boolean;
}

export const WalletTab = ({
  userData,
  frozenBalanceDetails,
  showFrozenDetails,
  setShowFrozenDetails,
  setIsExchangeDialogOpen,
  transactions,
  setExchangeType,
  onLoadMore,
  isFetchingNext,
  hasMore
}: WalletTabProps) => {
  return (
    <Card className="border-border/50 shadow-xl transition-all duration-300 backdrop-blur-xl bg-card/90 overflow-hidden relative rounded-2xl">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/50 via-primary/40 to-purple-600/50"></div>
      <CardHeader className="space-y-2 border-b border-border/50 pb-4 relative z-10 px-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          Wallet
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 relative z-10">
        <WalletBalance 
          userData={userData}
          frozenBalanceDetails={frozenBalanceDetails}
          showFrozenDetails={showFrozenDetails}
          setShowFrozenDetails={setShowFrozenDetails}
          setIsExchangeDialogOpen={setIsExchangeDialogOpen}
          setExchangeType={setExchangeType}
        />
        
        <TransactionButtons />
        
        <TransactionHistory transactions={transactions} onLoadMore={onLoadMore} isFetchingNext={isFetchingNext} hasMore={hasMore} />
      </CardContent>
    </Card>
  );
};
