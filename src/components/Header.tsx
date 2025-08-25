
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-card/90 backdrop-blur-xl border-b border-border/50 py-2' 
          : 'bg-card/70 backdrop-blur-md border-b border-border/40 py-3'
      }`}
    >
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative flex items-center space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary to-purple-400 shadow-lg shadow-primary/20 transition-transform duration-200 hover:scale-110 hover:rotate-1" />
              <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 group-hover:opacity-80 transition-all duration-1000 header-logo">
                PureNFT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm hover:text-primary transition-all duration-300 relative group ${
                  isActive(link.path) ? 'text-primary' : ''
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <div className={`absolute bottom-[-8px] left-0 w-full h-[2px] bg-gradient-to-r from-primary to-purple-400 transform origin-left transition-transform duration-300 ${
                  isActive(link.path) ? 'scale-x-100' : 'scale-x-0'
                } group-hover:scale-x-100 rounded-full`} />
              </Link>
            ))}

            {user && (
              <div className="flex items-center gap-2 mr-2">
                {balancesLoading ? (
                  <>
                    <div className="h-7 w-16 rounded-full bg-muted/20 animate-pulse" />
                    <div className="h-7 w-16 rounded-full bg-muted/20 animate-pulse" />
                  </>
                ) : (
                  <TooltipProvider>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="px-3 py-1.5 rounded-full bg-card/90 border border-border/50 ring-1 ring-primary/10 text-xs flex items-center gap-1.5 shadow-sm hover:shadow-md">
                            <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-4 w-4" />
                            <span className="tabular-nums">{fmt(balances?.eth, 3)} ETH</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {rate ? `≈ $${(Number(balances?.eth ?? 0) * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'ETH balance'}
                          </p>
                        </TooltipContent>
                      </Tooltip>

                    </div>
                  </TooltipProvider>
                )}
              </div>
            )}

            {user ? (
              <Link to="/profile">
                <Button variant="outline" className="flex items-center gap-2 bg-card border border-border/50 hover:bg-accent transition-all duration-300 shadow-sm h-9 md:h-10">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">{user.user_metadata.login || 'Profile'}</span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2 bg-card border border-border/50 hover:bg-accent transition-all duration-300 shadow-sm h-9 md:h-10">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">Login</span>
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {/* CSS-only icon transition to avoid forced reflows */}
            <div className="relative w-6 h-6">
              <X className={`text-primary absolute inset-0 transition-all duration-200 ${
                isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
              }`} />
              <Menu className={`text-primary absolute inset-0 transition-all duration-200 ${
                isMenuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Using CSS-only animation to prevent forced reflows */}
      <div className={`md:hidden absolute top-14 left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border/50 mobile-menu transition-all duration-300 overflow-hidden ${
        isMenuOpen 
          ? 'max-h-96 opacity-100 pointer-events-auto' 
          : 'max-h-0 opacity-0 pointer-events-none'
      }`}>
            
            <div className="container mx-auto px-4 py-4 relative">
              {user && (
                <div className="flex items-center gap-2 mb-3">
                  {balancesLoading ? (
                    <>
                      <div className="h-7 w-20 rounded-full bg-muted/20 animate-pulse" />
                      <div className="h-7 w-20 rounded-full bg-muted/20 animate-pulse" />
                    </>
                  ) : (
                    <TooltipProvider>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="px-3 py-1.5 rounded-full bg-card/90 border border-border/50 ring-1 ring-primary/10 text-xs flex items-center gap-1.5 shadow-sm">
                              <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-4 w-4" />
                              <span className="tabular-nums">{fmt(balances?.eth, 3)} ETH</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {rate ? `≈ $${(Number(balances?.eth ?? 0) * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'ETH balance'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  )}
                </div>
              )}
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`text-sm py-2 px-3 rounded-md transition-colors duration-300 ${
                      isActive(link.path) 
                        ? 'bg-accent text-foreground font-medium'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-2"></div>
                
                {user ? (
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full flex items-center gap-2 justify-center bg-card border border-border/50 hover:bg-accent transition-all duration-300 min-h-[42px]">
                      <User className="w-4 h-4 text-primary" />
                      <span className="username-truncate font-medium">{user.user_metadata.login || 'Profile'}</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full flex items-center gap-2 justify-center bg-card border border-border/50 hover:bg-accent transition-all duration-300 min-h-[42px]">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-medium">Login</span>
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
      </div>
    </header>
  );
};
