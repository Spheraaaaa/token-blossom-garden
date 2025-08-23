
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
    <footer className="relative pb-10 overflow-hidden bg-card/80 border-t border-border/50">
      
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20"></div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  PureNFT
                </span>
              </div>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
              Discover, collect, and sell extraordinary NFTs on the world's first & largest NFT marketplace
            </p>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-primary">
                Stay connected with us
              </h4>
              <form onSubmit={handleSubscribe} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="bg-card border border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground rounded-full"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-200 shadow-sm"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Marketplace
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/marketplace" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="relative">
                    <span className="absolute -inset-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 h-px bg-gradient-to-r from-primary/50 to-purple-500/50"></span>
                    All NFTs
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/help" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="relative">
                    <span className="absolute -inset-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 h-px bg-gradient-to-r from-primary/50 to-purple-500/50"></span>
                    Help Center
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/partners" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="relative">
                    <span className="absolute -inset-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 h-px bg-gradient-to-r from-primary/50 to-purple-500/50"></span>
                    Partners
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="relative">
                    <span className="absolute -inset-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 h-px bg-gradient-to-r from-primary/50 to-purple-500/50"></span>
                    Blog
                  </span>
                </Link>
              </li>
              <li className="pb-2">
                <a 
                  href="https://t.me/purenftsupport" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="relative">
                    <span className="absolute -inset-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 h-px bg-gradient-to-r from-primary/50 to-purple-500/50"></span>
                    Telegram Support
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
