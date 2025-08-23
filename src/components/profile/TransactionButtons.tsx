
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TransactionButtons = () => {
  const navigate = useNavigate();
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Button onClick={() => navigate('/deposit')} variant="outline" size="actionCard" className="group relative rounded-2xl border border-border/50 bg-card/90 shadow-xl hover:bg-accent transition-all duration-300">
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl border border-green-500/30 bg-gradient-to-br from-emerald-500/15 to-green-600/10">
              <Wallet className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold mb-1 text-foreground">Deposit</span>
              <span className="text-xs text-muted-foreground hidden md:inline-block">Add funds to your wallet</span>
            </div>
          </div>
          <div className="hidden md:flex h-10 w-10 rounded-full border border-green-500/30 bg-emerald-500/10 items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
            <ArrowDownCircle className="h-6 w-6 text-emerald-400" strokeWidth={1.5} />
          </div>
        </div>
      </Button>

      <Button onClick={() => navigate('/withdraw')} variant="outline" size="actionCard" className="group relative rounded-2xl border border-border/50 bg-card/90 shadow-xl hover:bg-accent transition-all duration-300">
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-red-600/10">
              <Wallet className="w-8 h-8 text-orange-400" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold mb-1 text-foreground">Withdraw</span>
              <span className="text-xs text-muted-foreground hidden md:inline-block">Transfer funds to your account</span>
            </div>
          </div>
          <div className="hidden md:flex h-10 w-10 rounded-full border border-orange-500/30 bg-orange-500/10 items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
            <ArrowUpCircle className="h-6 w-6 text-orange-400" strokeWidth={1.5} />
          </div>
        </div>
      </Button>
    </div>;
};
