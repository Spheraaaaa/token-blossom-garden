
import { Info, Award, Gem } from "lucide-react";
import { Property } from "@/types/nft";
import { motion } from "framer-motion";

interface NFTDetailsProps {
  tokenStandard?: string;
  properties?: Property[];
}

export const NFTDetails = ({ tokenStandard, properties }: NFTDetailsProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-card/60 backdrop-blur-xl p-8 rounded-2xl border border-border/30 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Details</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Token Standard</p>
            <p className="text-lg font-bold text-foreground">{tokenStandard || 'ERC-721'}</p>
          </div>
        </div>
      </div>
      
      {properties && properties.length > 0 && (
        <div className="bg-card/60 backdrop-blur-xl p-8 rounded-2xl border border-border/30 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
              <Gem className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Properties</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {properties.map((prop, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 border border-border/20"
              >
                <p className="text-xs text-primary font-medium mb-1 bg-primary/10 px-2 py-1 rounded-lg w-fit">
                  {prop.key}
                </p>
                <p className="text-sm font-bold text-foreground">{prop.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
