
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Footer = () => {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    
    toast.success("Thanks for subscribing!", {
      description: "You've been added to our newsletter list.",
    });
    
    e.currentTarget.reset();
  };

  return (
    <footer className="relative bg-gradient-to-br from-background via-background/98 to-background/95 border-t border-border/30">
      {/* Clean background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/1 via-accent/0.5 to-secondary/0.5" />
      
      {/* Elegant floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-gradient-to-br from-primary/3 via-accent/2 to-transparent rounded-full blur-3xl animate-simple-float opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] bg-gradient-to-br from-accent/2 via-secondary/1 to-transparent rounded-full blur-2xl animate-simple-float opacity-20" style={{ animationDelay: '3s' }} />
      </div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                PureNFT
              </span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              Discover, collect, and sell extraordinary NFTs on the world's premier digital marketplace
            </p>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">
                Stay Updated
              </h4>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="bg-card/60 backdrop-blur-xl border border-border/30 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 rounded-xl"
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/20"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground">
              Marketplace
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/marketplace" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                >
                  All NFTs
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/help" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/partners" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                >
                  Partners
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <a 
                  href="https://t.me/purenftsupport" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                >
                  Telegram Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom divider and copyright */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 PureNFT. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
