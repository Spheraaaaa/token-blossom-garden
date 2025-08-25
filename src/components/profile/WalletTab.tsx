
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
    <Card className="bg-card/60 backdrop-blur-xl border border-border/30 shadow-lg rounded-2xl">
      <CardHeader className="pb-4 md:pb-6 px-4 md:px-6 pt-4 md:pt-6">
        <CardTitle className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          Wallet
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 md:space-y-8 px-4 md:px-6 pb-4 md:pb-6">
        <WalletBalance 
          userData={userData}
          frozenBalanceDetails={frozenBalanceDetails}
          showFrozenDetails={showFrozenDetails}
          setShowFrozenDetails={setShowFrozenDetails}
          setIsExchangeDialogOpen={setIsExchangeDialogOpen}
          setExchangeType={setExchangeType}
        />
        
        <TransactionButtons />
        
        <TransactionHistory 
          transactions={transactions} 
          onLoadMore={onLoadMore} 
          isFetchingNext={isFetchingNext} 
          hasMore={hasMore} 
        />
      </CardContent>
    </Card>
  );
};
