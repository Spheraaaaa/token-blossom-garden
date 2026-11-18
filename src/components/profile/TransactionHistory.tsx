import React, { useEffect, useRef } from "react";
import { Panel } from "./Panel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowUpRight, ArrowDownLeft, RotateCw, ShoppingCart, Tag } from "lucide-react";
import type { Transaction } from "@/types/user";
import { Spinner } from "@/components/ui/spinner";

// Function to determine status color and text
const getStatusDetails = (status: string, isFrozen: boolean, isFrozenExchange: boolean, type: string) => {
  // For exchange transactions, check if it's pending first
  if (type === 'exchange' && status === 'pending') {
    return {
      variant: "outline" as const,
      className: "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-400",
      text: "Pending"
    };
  }

  // For sale transactions, they should be shown as frozen if funds go to hold
  if (type === 'sale' && isFrozen) {
    return {
      variant: "outline" as const,
      className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-400",
      text: "Frozen"
    };
  }

  // For frozen balance but not frozen exchange, show as Frozen
  if (isFrozen && !isFrozenExchange) {
    return {
      variant: "outline" as const,
      className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-400",
      text: "Frozen"
    };
  }

  // For exchange transactions from frozen balance, they're pending not frozen
  if (isFrozenExchange) {
    return {
      variant: "outline" as const,
      className: "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-400",
      text: "Pending"
    };
  }
  switch (status) {
    case "completed":
      return {
        variant: "outline" as const,
        className: "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-400",
        text: "Completed"
      };
    case "pending":
      return {
        variant: "outline" as const,
        className: "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-400",
        text: "Pending"
      };
    case "processing":
      return {
        variant: "outline" as const,
        className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-400",
        text: "Processing"
      };
    case "cancelled":
    case "failed":
      return {
        variant: "outline" as const,
        className: "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-400",
        text: status === "cancelled" ? "Cancelled" : "Failed"
      };
    default:
      return {
        variant: "outline" as const,
        className: "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
        text: status.charAt(0).toUpperCase() + status.slice(1)
      };
  }
};

// Function to determine transaction type icon and label
const getTypeDetails = (type: string) => {
  switch (type) {
    case "deposit":
      return {
        icon: <ArrowDownLeft className="h-4 w-4" />,
        label: "Deposit",
        className: "text-green-400 bg-green-500/10"
      };
    case "withdraw":
      return {
        icon: <ArrowUpRight className="h-4 w-4" />,
        label: "Withdrawal",
        className: "text-red-400 bg-red-500/10"
      };
    case "exchange":
      return {
        icon: <RotateCw className="h-4 w-4" />,
        label: "Exchange",
        className: "text-blue-400 bg-blue-500/10"
      };
    case "purchase":
      return {
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "Purchase",
        className: "text-primary bg-primary/10"
      };
    case "sale":
      return {
        icon: <Tag className="h-4 w-4" />,
        label: "Sale",
        className: "text-amber-400 bg-amber-500/10"
      };
    default:
      return {
        icon: <RotateCw className="h-4 w-4" />,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        className: "text-gray-400 bg-gray-500/10"
      };
  }
};

// Function to get currency badge style
const getCurrencyBadge = (currencyType: string) => {
  if (currencyType === 'usdt') {
    return {
      text: "USDT",
      className: "border-green-500/20 bg-green-500/5 text-green-400"
    };
  } else {
    return {
      text: "ETH",
      className: "border-blue-500/20 bg-blue-500/5 text-blue-400"
    };
  }
};
interface TransactionHistoryProps {
  transactions: Transaction[];
  onLoadMore?: () => void;
  isFetchingNext?: boolean;
  hasMore?: boolean;
}
export const TransactionHistory = ({
  transactions,
  onLoadMore,
  isFetchingNext = false,
  hasMore = false
}: TransactionHistoryProps) => {
  const isMobile = useIsMobile();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!onLoadMore || !hasMore) return;
    const node = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isFetchingNext) {
          onLoadMore();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, [onLoadMore, hasMore, isFetchingNext]);

  if (!transactions || transactions.length === 0) {
    return (
      <Panel title="Transaction History">
        <div className="py-8 text-center">
          <p className="font-medium text-foreground">No transactions found</p>
          <p className="mt-1 text-sm text-muted-foreground">Deposits, withdrawals, purchases and sales will appear here.</p>
        </div>
      </Panel>
    );
  }

  const cellX = "first:pl-5 last:pr-5 md:first:pl-7 md:last:pr-7";

  return (
    <Panel
      title="Transaction History"
      actions={
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
          {transactions.length} transactions
        </span>
      }
      bodyClassName="p-0 md:p-0"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className={`h-11 text-xs font-medium text-muted-foreground ${cellX}`}>Date</TableHead>
              {!isMobile && <TableHead className={`h-11 text-xs font-medium text-muted-foreground ${cellX}`}>Type</TableHead>}
              <TableHead className={`h-11 text-right text-xs font-medium text-muted-foreground ${cellX}`}>Amount</TableHead>
              <TableHead className={`h-11 text-right text-xs font-medium text-muted-foreground ${cellX}`}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(transaction => {
              const typeDetails = getTypeDetails(transaction.type);
              const statusDetails = getStatusDetails(transaction.status, transaction.is_frozen || false, transaction.is_frozen_exchange || false, transaction.type);
              const isCredit = transaction.type === 'deposit' || transaction.type === 'sale';
              const isDebit = transaction.type === 'withdraw' || transaction.type === 'purchase';

              return (
                <TableRow key={transaction.id} className="border-b border-border/60 transition-colors hover:bg-muted/40">
                  <TableCell className={`py-3.5 text-sm tabular-nums text-muted-foreground ${cellX}`}>
                    {transaction.created_at}
                  </TableCell>

                  {!isMobile && (
                    <TableCell className={`py-3.5 ${cellX}`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${typeDetails.className}`}>
                          {typeDetails.icon}
                        </span>
                        <span className="text-sm font-medium text-foreground">{typeDetails.label}</span>
                      </div>
                    </TableCell>
                  )}

                  <TableCell className={`py-3.5 text-right ${cellX}`}>
                    <div className="flex items-center justify-end gap-2">
                      {isMobile && (
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${typeDetails.className}`}>
                          {typeDetails.icon}
                        </span>
                      )}
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          isCredit ? 'text-accent' : isDebit ? 'text-red-400' : 'text-foreground'
                        }`}
                      >
                        {isCredit ? '+' : isDebit ? '-' : ''}
                        {parseFloat(transaction.amount).toFixed(transaction.currency_type === 'eth' ? 3 : 2)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className={`py-3.5 text-right ${cellX}`}>
                    <Badge variant={statusDetails.variant} className={`rounded-full px-2.5 py-0.5 text-xs ${statusDetails.className}`}>
                      {statusDetails.text}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div ref={sentinelRef} className="h-px" />

      {isFetchingNext && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
          <Spinner className="h-4 w-4" />
          <span>Loading...</span>
        </div>
      )}

      {!hasMore && transactions.length > 0 && (
        <div className="py-4 text-center text-sm text-muted-foreground">End of history</div>
      )}
    </Panel>
  );
};
