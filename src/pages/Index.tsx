import { Hero } from "@/components/Hero";
import { NFTGallery } from "@/components/NFTGallery";
import { About } from "@/components/About";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <NFTGallery />
      <About />
      
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">
              <span className="bg-nft-gradient bg-clip-text text-transparent">
                CyberVault
              </span>
            </h3>
            <p className="text-muted-foreground">
              The future of digital art ownership
            </p>
          </div>
          
          <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Discord
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              OpenSea
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Etherscan
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2024 CyberVault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
