import { TransactionHistory } from "./TransactionHistory";
import { WalletBalance } from "./WalletBalance";
import { TransactionButtons } from "./TransactionButtons";
import { Panel } from "./Panel";
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
    <div className="space-y-6">
      <Panel title="Wallet" actions={<TransactionButtons />}>
        <WalletBalance
          userData={userData}
          frozenBalanceDetails={frozenBalanceDetails}
          showFrozenDetails={showFrozenDetails}
          setShowFrozenDetails={setShowFrozenDetails}
          setIsExchangeDialogOpen={setIsExchangeDialogOpen}
          setExchangeType={setExchangeType}
        />
      </Panel>

      <TransactionHistory
        transactions={transactions}
        onLoadMore={onLoadMore}
        isFetchingNext={isFetchingNext}
        hasMore={hasMore}
      />
    </div>
  );
};
