import React, { useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowUpRight, ArrowDownLeft, RotateCw, ShoppingCart, Tag, Calendar } from "lucide-react";
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
        className: "text-purple-400 bg-purple-500/10"
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
      <div className="mt-6 text-center p-8 rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="mt-4 md:mt-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
            <RotateCw className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-foreground">Transaction History</h3>
        </div>
        
        {transactions.length > 0 && (
          <span className="text-xs md:text-sm text-muted-foreground bg-muted/40 px-2 md:px-3 py-1 rounded-xl border border-border/30">
            {transactions.length} transactions
          </span>
        )}
      </div>
      
      <div className="overflow-hidden rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl shadow-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Date</TableHead>
                {!isMobile && <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Type</TableHead>}
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground text-right">Amount</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(transaction => {
                const typeDetails = getTypeDetails(transaction.type);
                const statusDetails = getStatusDetails(transaction.status, transaction.is_frozen || false, transaction.is_frozen_exchange || false, transaction.type);
                const currencyBadge = getCurrencyBadge(transaction.currency_type || 'eth');
                
                return (
                  <TableRow key={transaction.id} className="transaction-row border-b border-border/20 hover:bg-muted/10">
                    <TableCell className="py-3 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{transaction.created_at}</span>
                      </div>
                    </TableCell>
                    
                    {!isMobile && (
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-full ${typeDetails.className}`}>
                            {typeDetails.icon}
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {typeDetails.label}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {isMobile && (
                          <div className={`p-1 rounded-full ${typeDetails.className}`}>
                            {typeDetails.icon}
                          </div>
                        )}
                        <span className={`text-sm font-medium ${
                          transaction.type === 'deposit' || transaction.type === 'sale' ? 'text-green-500' : 
                          transaction.type === 'withdraw' || transaction.type === 'purchase' ? 'text-red-500' : 
                          'text-foreground'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'sale' ? '+' : 
                           transaction.type === 'withdraw' || transaction.type === 'purchase' ? '-' : ''}
                          {parseFloat(transaction.amount).toFixed(transaction.currency_type === 'eth' ? 3 : 2)}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-3 text-right">
                      <Badge variant={statusDetails.variant} className={`text-xs px-2 py-1 ${statusDetails.className}`}>
                        {statusDetails.text}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div ref={sentinelRef} className="h-4" />
        
        {isFetchingNext && (
          <div className="py-4 flex items-center justify-center gap-2 text-sm text-muted-foreground border-t border-border/30">
            <Spinner className="h-4 w-4" />
            <span>Loading...</span>
          </div>
        )}
        
        {!hasMore && transactions.length > 0 && (
          <div className="py-4 text-center text-sm text-muted-foreground border-t border-border/30">
            End of history
          </div>
        )}
      </div>
    </div>
  );
};