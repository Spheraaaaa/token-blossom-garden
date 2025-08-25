
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TransactionButtons = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
      <Button 
        onClick={() => navigate('/deposit')} 
        variant="outline" 
        className="group relative rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl shadow-lg hover:bg-card/80 hover:border-primary/20 transition-all duration-300 h-16 md:h-20 p-0"
      >
        <div className="flex items-center justify-between w-full px-4 md:px-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border border-green-500/30 bg-gradient-to-br from-emerald-500/20 to-green-600/10">
              <Wallet className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
            </div>
            <div className="text-left">
              <span className="text-lg md:text-xl font-bold text-foreground">Deposit</span>
              <div className="text-xs md:text-sm text-muted-foreground">Add funds to your wallet</div>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full border border-green-500/30 bg-emerald-500/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
            <ArrowDownCircle className="h-5 w-5 text-emerald-400" />
          </div>
        </div>
      </Button>

      <Button 
        onClick={() => navigate('/withdraw')} 
        variant="outline" 
        className="group relative rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl shadow-lg hover:bg-card/80 hover:border-primary/20 transition-all duration-300 h-16 md:h-20 p-0"
      >
        <div className="flex items-center justify-between w-full px-4 md:px-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-red-600/10">
              <Wallet className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
            </div>
            <div className="text-left">
              <span className="text-lg md:text-xl font-bold text-foreground">Withdraw</span>
              <div className="text-xs md:text-sm text-muted-foreground">Transfer funds to your account</div>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
            <ArrowUpCircle className="h-5 w-5 text-orange-400" />
          </div>
        </div>
      </Button>
    </div>
  );
};
