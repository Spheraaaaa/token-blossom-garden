import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NFTCardProps {
  id: number;
  title: string;
  image: string;
  price: string;
  rarity: string;
  creator: string;
}

export const NFTCard = ({ id, title, image, price, rarity, creator }: NFTCardProps) => {
  return (
    <Card className="group bg-nft-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-nft-card hover:-translate-y-2 overflow-hidden">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            #{id}
          </Badge>
        </div>
        <div className="absolute top-4 left-4">
          <Badge 
            variant="outline" 
            className="bg-primary/20 border-primary/50 text-primary backdrop-blur-sm"
          >
            {rarity}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          Created by <span className="text-accent">{creator}</span>
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Current Price</p>
            <p className="text-lg font-bold text-primary">{price} ETH</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Last Sale</p>
            <p className="text-sm font-medium">{(parseFloat(price) * 0.85).toFixed(2)} ETH</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 bg-nft-gradient hover:shadow-nft-glow transition-all duration-300"
          >
            Buy Now
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-accent/50 hover:border-accent hover:shadow-nft-glow-accent transition-all duration-300"
          >
            Make Offer
          </Button>
        </div>
      </div>
    </Card>
  );
};