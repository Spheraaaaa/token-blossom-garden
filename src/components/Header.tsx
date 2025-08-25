
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Search } from "lucide-react";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserBalances } from "@/hooks/useBalances";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchExchangeRate } from "@/utils/exchangeRate";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useSecureAuth();
  const isMobile = useIsMobile();
  const { data: balances, isLoading: balancesLoading } = useUserBalances();
  const [rate, setRate] = useState<number | null>(null);
  const fmt = (v?: number, d: number = 2) => Number(v ?? 0).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Add scroll detection for header styling - optimized to prevent reflows
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldBeScrolled = window.scrollY > 20;
          if (shouldBeScrolled !== scrolled) {
            setScrolled(shouldBeScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Fetch ETH→USD rate periodically for tooltip estimates
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const r = await fetchExchangeRate();
        if (active) setRate(r);
      } catch {}
    };
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => { active = false; clearInterval(id); };
  }, []);


  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/marketplace", label: "Marketplace" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-card/95 backdrop-blur-xl border-b border-border/20 py-3 shadow-sm' 
          : 'bg-card/90 backdrop-blur-xl border-b border-border/10 py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-primary to-accent shadow-md transition-all duration-200 group-hover:scale-105" />
            <span className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
              PureNFT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path) ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Balance Display */}
            {user && (
              <div className="ml-6">
                {balancesLoading ? (
                  <div className="h-9 w-20 rounded-xl bg-muted/30 animate-pulse" />
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="px-3 py-2 rounded-xl bg-card border border-border/30 text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-4 w-4" />
                          <span className="font-semibold text-foreground tabular-nums">
                            {fmt(balances?.eth, 3)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ETH
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-card border border-border/30 shadow-lg">
                        <p className="text-sm">
                          {rate ? `≈ $${(Number(balances?.eth ?? 0) * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'ETH balance'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}

            {/* Profile/Login Button */}
            {user ? (
              <Link to="/profile">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                  <User className="w-4 h-4 mr-2" />
                  {user.user_metadata.login || 'ADMIN'}
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="font-medium px-4 py-2 rounded-xl border-border/30 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <X className={`text-foreground w-5 h-5 transition-all duration-200 ${
              isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
            }`} />
            <Menu className={`text-foreground w-5 h-5 absolute transition-all duration-200 ${
              isMenuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border/20 transition-all duration-300 overflow-hidden shadow-lg ${
        isMenuOpen 
          ? 'max-h-[400px] opacity-100 pointer-events-auto translate-y-0' 
          : 'max-h-0 opacity-0 pointer-events-none -translate-y-2'
      }`}>
        <div className="container mx-auto px-4 py-4">
          {/* Mobile Balance Display */}
          {user && (
            <div className="flex items-center justify-center mb-4">
              {balancesLoading ? (
                <div className="h-10 w-24 rounded-xl bg-muted/30 animate-pulse" />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="px-4 py-2.5 rounded-xl bg-card border border-border/30 text-sm flex items-center gap-2.5 shadow-sm">
                        <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-5 w-5" />
                        <span className="font-semibold text-foreground tabular-nums text-base">
                          {fmt(balances?.eth, 3)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ETH
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border border-border/30 shadow-lg">
                      <p className="text-sm">
                        {rate ? `≈ $${(Number(balances?.eth ?? 0) * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'ETH balance'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}

          {/* Mobile Navigation */}
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-base py-3 px-4 rounded-xl transition-colors duration-200 ${
                  isActive(link.path) 
                    ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                    : 'hover:bg-muted/50 font-medium text-foreground/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="h-px bg-border/30 my-3 mx-2"></div>
            
            {/* Mobile Profile/Login Button */}
            {user ? (
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium py-3 rounded-xl shadow-md">
                  <User className="w-4 h-4 mr-2" />
                  {user.user_metadata.login || 'ADMIN'}
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full font-medium py-3 rounded-xl border-border/30 hover:bg-primary/10 hover:border-primary/30">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
