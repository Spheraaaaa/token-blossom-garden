
import { Share2, Heart, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useState } from "react";

interface NFTImageProps {
  image: string;
  name: string;
}

export const NFTImage = ({ image, name }: NFTImageProps) => {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "NFT link has been copied to clipboard",
    });
  };

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "Removed from favorites" : "Added to favorites",
      description: liked 
        ? "NFT has been removed from your favorites" 
        : "NFT has been added to your favorites",
    });
  };

  return (
    <div className="relative group">
      <div className="rounded-xl overflow-hidden">
        <div className="aspect-square w-full overflow-hidden flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute top-4 right-4 flex gap-2"
          >
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 bg-black/60 backdrop-blur-xl hover:bg-black/80 border border-white/20 rounded-xl shadow-lg"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className={`h-10 w-10 ${liked ? 'bg-pink-600/80 border-pink-500/50' : 'bg-black/60 border-white/20'} backdrop-blur-xl hover:bg-black/80 border rounded-xl shadow-lg transition-colors`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 text-white ${liked ? 'fill-white' : ''}`} />
            </Button>
          </motion.div>
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};
