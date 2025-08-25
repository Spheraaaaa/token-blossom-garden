
import { User } from "lucide-react";
import { motion } from "framer-motion";

interface NFTHeaderProps {
  name: string;
  creator: string;
}

export const NFTHeader = ({ name, creator }: NFTHeaderProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
        <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {name}
        </span>
      </h1>
      
      <div className="flex items-center gap-3 bg-card/60 backdrop-blur-xl px-6 py-3 rounded-xl border border-border/30 shadow-lg hover:bg-card/80 hover:border-primary/20 transition-all duration-300 inline-flex">
        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Created by</p>
          <p className="text-foreground font-bold">{creator}</p>
        </div>
      </div>
    </div>
  );
};
