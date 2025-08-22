import { Button } from "@/components/ui/button";
import heroImage from "@/assets/nft-hero.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/60" />
      </div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
          <span className="bg-nft-gradient bg-clip-text text-transparent">
            CyberVault
          </span>
          <br />
          <span className="text-foreground">Collection</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in">
          Explore the future of digital art with our exclusive NFT collection.
          <br />
          Unique, rare, and absolutely stunning.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Button variant="default" size="lg" className="bg-nft-gradient hover:shadow-nft-glow transition-all duration-300">
            Explore Collection
          </Button>
          <Button variant="outline" size="lg" className="border-primary/50 hover:border-primary hover:shadow-nft-border-glow transition-all duration-300">
            Connect Wallet
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-fade-in">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">Unique NFTs</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">5.2Ξ</div>
            <div className="text-muted-foreground">Floor Price</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">2.5K</div>
            <div className="text-muted-foreground">Owners</div>
          </div>
        </div>
      </div>
    </section>
  );
};