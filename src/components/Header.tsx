
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserBalances } from "@/hooks/useBalances";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchExchangeRate } from "@/utils/exchangeRate";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-gradient-to-r from-card/95 via-card/90 to-card/95 backdrop-blur-2xl border-b border-primary/20 py-2 shadow-xl shadow-primary/5' 
          : 'bg-gradient-to-r from-card/80 via-card/70 to-card/80 backdrop-blur-xl border-b border-border/30 py-3'
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/3 to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-3 group relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-primary/30 via-accent/20 to-secondary/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary shadow-2xl shadow-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-primary/50" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary group-hover:from-accent group-hover:via-primary group-hover:to-secondary transition-all duration-1000 header-logo">
                  PureNFT
                </span>
                <span className="text-xs text-muted-foreground/60 font-light tracking-wider -mt-1 group-hover:text-primary/60 transition-colors duration-500">
                  Digital Marketplace
                </span>
              </div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            {navLinks.map((link, index) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`relative text-sm font-medium transition-all duration-500 group ${
                  isActive(link.path) ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="relative z-10 px-4 py-2 rounded-xl transition-all duration-300 group-hover:bg-primary/10">{link.label}</span>
                
                {/* Animated underline */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-500 ${
                  isActive(link.path) ? 'w-8 opacity-100' : 'w-0 opacity-0'
                } group-hover:w-8 group-hover:opacity-100`} />
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              </Link>
            ))}

            {/* Enhanced Balance Display */}
            {user && (
              <div className="flex items-center gap-3 ml-6">
                {balancesLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-24 rounded-2xl bg-gradient-to-r from-muted/20 to-muted/10 animate-pulse shadow-inner" />
                  </div>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-accent/40 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
                          <div className="relative px-4 py-2.5 rounded-2xl bg-gradient-to-r from-card/90 via-card/80 to-card/90 border-2 border-primary/20 ring-1 ring-white/5 text-sm flex items-center gap-2.5 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-105 backdrop-blur-xl">
                            <div className="relative">
                              <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                              <div className="absolute -inset-1 bg-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <span className="font-bold text-primary tabular-nums text-base tracking-wide">
                              {fmt(balances?.eth, 3)}
                            </span>
                            <span className="text-xs font-medium text-muted-foreground/80 group-hover:text-primary/60 transition-colors duration-300">
                              ETH
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-card/95 backdrop-blur-xl border border-primary/20 shadow-2xl">
                        <p className="font-medium">
                          {rate ? `≈ $${(Number(balances?.eth ?? 0) * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'ETH balance'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}

            {/* Enhanced Profile/Login Button */}
            {user ? (
              <Link to="/profile">
                <Button className="group relative overflow-hidden bg-gradient-to-r from-primary via-accent to-secondary hover:from-accent hover:via-secondary hover:to-primary transition-all duration-700 text-white font-medium px-6 py-2.5 h-auto rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/20 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="relative flex items-center gap-2.5">
                    <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-wide">{user.user_metadata.login || 'ADMIN'}</span>
                  </div>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="group relative overflow-hidden bg-gradient-to-r from-primary/80 via-accent/80 to-secondary/80 hover:from-primary hover:via-accent hover:to-secondary border-2 border-primary/30 hover:border-primary/50 text-white font-medium px-6 py-2.5 h-auto rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-500 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="relative flex items-center gap-2.5">
                    <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-wide">Login</span>
                  </div>
                </Button>
              </Link>
            )}
          </nav>

          {/* Enhanced Mobile Menu Button */}
          <button
            className="md:hidden group relative p-3 rounded-2xl bg-gradient-to-r from-card/80 to-card/60 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-6 h-6">
              <X className={`text-primary absolute inset-0 transition-all duration-300 ${
                isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'
              }`} />
              <Menu className={`text-primary absolute inset-0 transition-all duration-300 ${
                isMenuOpen ? 'opacity-0 -rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-card/98 via-card/95 to-card/90 backdrop-blur-2xl border-b border-primary/20 mobile-menu transition-all duration-500 overflow-hidden shadow-2xl shadow-primary/10 ${
        isMenuOpen 
          ? 'max-h-[500px] opacity-100 pointer-events-auto translate-y-0' 
          : 'max-h-0 opacity-0 pointer-events-none -translate-y-4'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/3 to-secondary/5" />
            
        <div className="container mx-auto px-4 py-6 relative">
          {/* Mobile Balance Display */}
          {user && (
            <div className="flex items-center justify-center mb-6">
              {balancesLoading ? (
                <div className="h-12 w-32 rounded-2xl bg-gradient-to-r from-muted/20 to-muted/10 animate-pulse shadow-inner" />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-accent/40 rounded-2xl blur opacity-75" />
                        <div className="relative px-5 py-3 rounded-2xl bg-gradient-to-r from-card/90 via-card/80 to-card/90 border-2 border-primary/30 ring-1 ring-white/5 text-base flex items-center gap-3 shadow-xl backdrop-blur-xl">
                          <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-6 w-6" />
                          <span className="font-bold text-primary tabular-nums text-lg tracking-wide">
                            {fmt(balances?.eth, 3)}
                          </span>
                          <span className="text-sm font-medium text-muted-foreground/80">
                            ETH
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card/95 backdrop-blur-xl border border-primary/20 shadow-2xl">
                      <p className="font-medium">
                        {rate ? `≈ $${(Number(balances?.eth ?? 0) * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'ETH balance'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}

          {/* Mobile Navigation */}
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link, index) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`group relative text-base py-4 px-5 rounded-2xl transition-all duration-500 ${
                  isActive(link.path) 
                    ? 'bg-gradient-to-r from-primary/20 via-accent/15 to-secondary/20 text-primary font-semibold border-2 border-primary/30 shadow-lg'
                    : 'hover:bg-gradient-to-r hover:from-primary/10 hover:via-accent/5 hover:to-secondary/10 border-2 border-transparent hover:border-primary/20 font-medium'
                }`}
                onClick={() => setIsMenuOpen(false)}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: isMenuOpen ? 1 : 0,
                  transition: `all 0.5s ease ${index * 100}ms`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">{link.label}</span>
              </Link>
            ))}
            
            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-4 mx-4"></div>
            
            {/* Mobile Profile/Login Button */}
            {user ? (
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full group relative overflow-hidden bg-gradient-to-r from-primary via-accent to-secondary hover:from-accent hover:via-secondary hover:to-primary transition-all duration-700 text-white font-semibold py-4 h-auto rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="relative flex items-center gap-3 justify-center">
                    <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-lg tracking-wide">{user.user_metadata.login || 'ADMIN'}</span>
                  </div>
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full group relative overflow-hidden bg-gradient-to-r from-primary/80 via-accent/80 to-secondary/80 hover:from-primary hover:via-accent hover:to-secondary border-2 border-primary/30 hover:border-primary/50 text-white font-semibold py-4 h-auto rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="relative flex items-center gap-3 justify-center">
                    <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-lg tracking-wide">Login</span>
                  </div>
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
