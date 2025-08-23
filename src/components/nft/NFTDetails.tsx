
import { Info, Award, Gem } from "lucide-react";
import { Property } from "@/types/nft";
import { motion } from "framer-motion";

interface NFTDetailsProps {
  tokenStandard?: string;
  properties?: Property[];
}

export const NFTDetails = ({ tokenStandard, properties }: NFTDetailsProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Details</h2>
      </div>
      
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6">
        <div className="p-6 rounded-2xl bg-card/90 border border-border/50 transition-transform duration-300 hover:scale-[1.02] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">Token Standard</div>
          </div>
          <div className="font-medium text-lg pl-3">{tokenStandard || 'ERC-721'}</div>
        </div>
      </motion.div>
      
      {properties && properties.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <Gem className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xl font-semibold text-foreground">Properties</div>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 gap-4" 
            variants={containerVariants}
          >
            {properties.map((prop, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="p-6 rounded-2xl bg-card/90 border border-border/50 transition-transform duration-300 hover:scale-[1.02] shadow-sm"
              >
                <div className="text-sm text-primary mb-2 bg-primary/10 px-3 py-1 rounded-full w-fit">{prop.key}</div>
                <div className="font-medium text-lg pl-2">{prop.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
