
import { useEffect, useState, Suspense, lazy } from "react";
import { useInView } from "react-intersection-observer";
import { supabase } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MarketplaceStats } from "@/components/marketplace/MarketplaceStats";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Store, Sparkles } from "lucide-react";
import { ScrollAnimation } from "@/components/ScrollAnimation";

// Lazy load NFTGrid for better performance
const NFTGrid = lazy(() => import("@/components/marketplace/NFTGrid").then(module => ({
  default: module.NFTGrid
})));

interface NFT {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
  created_at: string;
  owner_id: string | null;
}

const ITEMS_PER_PAGE = 4; // Reduced items per page for better mobile experience

const Marketplace = () => {
  useEffect(() => {
    document.title = "PureNFT - Marketplace";
    return () => {
      document.title = "PureNFT";
    };
  }, []);

  const { ref, inView } = useInView();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchNFTs = async ({ pageParam = 0 }) => {
    const from = pageParam * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    // Создаем базовый запрос
    let query = supabase
      .from('nfts')
      .select('*', { count: 'exact' })
      .or('owner_id.is.null,for_sale.eq.true'); // Show NFTs without owner OR with for_sale=true
    
    // Если есть поисковый запрос, добавляем фильтрацию
    if (searchQuery) {
      query = query
        .or(`name.ilike.%${searchQuery}%,creator.ilike.%${searchQuery}%`);
    }
    
    // Добавляем сортировку в зависимости от выбранного параметра
    switch (sortBy) {
      case "newest":
        query = query.order('created_at', { ascending: false });
        break;
      case "oldest":
        query = query.order('created_at', { ascending: true });
        break;
      case "price-asc":
        query = query.order('price', { ascending: true });
        break;
      case "price-desc":
        query = query.order('price', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }
    
    // Добавляем пагинацию
    query = query.range(from, to);
    
    // Выполняем запрос
    const { data, error, count } = await query;

    if (error) throw error;
    return { data, count, nextPage: to < (count || 0) ? pageParam + 1 : undefined };
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['nfts', searchQuery, sortBy],
    queryFn: fetchNFTs,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 300000,
    gcTime: 3600000,
  });

  // При изменении параметров сортировки или поиска, делаем новый запрос
  useEffect(() => {
    refetch();
  }, [sortBy, searchQuery, refetch]);

  useEffect(() => {
    if (inView && !isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center text-red-500">
          Error loading NFTs. Please try again later.
        </div>
      </div>
    );
  }

  const allNFTs = data?.pages.flatMap(page => page.data) || [];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/3 overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating orbs */}
        <div className="absolute top-1/4 -left-8 w-96 h-96 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute top-3/4 -right-8 w-80 h-80 bg-gradient-to-l from-secondary/6 via-accent/4 to-transparent rounded-full mix-blend-multiply filter blur-2xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-br from-accent/5 via-primary/3 to-transparent rounded-full mix-blend-multiply filter blur-xl animate-morph" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Animated gradient mesh */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/2 via-transparent to-accent/2 animate-gradient opacity-30" />
        
        {/* Enhanced floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-up opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 6}s`
            }}
          >
            <div className="relative">
              <Sparkles className={`w-${3 + Math.floor(Math.random() * 3)} h-${3 + Math.floor(Math.random() * 3)} text-primary/30`} />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse" />
            </div>
          </div>
        ))}
        
        {/* Light rays */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent transform rotate-12 animate-shimmer" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent/8 to-transparent transform -rotate-12 animate-shimmer" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative container mx-auto py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            <ScrollAnimation animation="zoom-in" delay={100}>
              <Card className="marketplace-hero-card relative overflow-hidden border-border/30 shadow-2xl transition-all duration-700 backdrop-blur-2xl bg-gradient-to-br from-card/90 via-card/70 to-card/90 rounded-3xl group hover:shadow-primary/20 hover:border-primary/30">
                {/* Dynamic glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-accent/6 to-secondary/8 opacity-0 group-hover:opacity-100 transition-all duration-1000 rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm animate-gradient" />
                
                <CardHeader className="relative pb-10 bg-gradient-to-r from-transparent via-card/30 to-transparent">
                  <div className="relative z-10">
                    <h1 className="sr-only">NFT Marketplace</h1>
                    <CardTitle className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-foreground flex items-center justify-center gap-4 group-hover:scale-[1.02] transition-all duration-500">
                      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/30 shadow-xl ring-1 ring-inset ring-primary/40 group-hover:shadow-2xl group-hover:shadow-primary/30 transition-all duration-700 hover:rotate-3">
                        <Store className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/40 to-accent/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
                      </div>
                      <div className="text-center">
                        <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient font-extrabold">
                          NFT
                        </span>
                        <span className="block text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent font-light tracking-wider">
                          Marketplace
                        </span>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-base md:text-lg text-center text-muted-foreground mt-6 group-hover:text-foreground/90 transition-colors duration-500 max-w-2xl mx-auto leading-relaxed">
                      Discover extraordinary digital art and collectibles from visionary creators worldwide. 
                      <span className="block mt-2 text-primary/80 font-medium">Join the future of digital ownership</span>
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-10 p-8 pt-0">
                  <ScrollAnimation animation="slide-up" delay={200}>
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl opacity-50" />
                      <MarketplaceStats />
                    </div>
                  </ScrollAnimation>
                  
                  <ScrollAnimation animation="slide-up" delay={300}>
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-accent/8 to-secondary/8 rounded-2xl blur-lg opacity-40" />
                      <MarketplaceSearch
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                      />
                    </div>
                  </ScrollAnimation>
                  
                  <ScrollAnimation animation="fade-in" delay={400}>
                    <Suspense fallback={
                      <div className="flex items-center justify-center p-12">
                        <div className="relative">
                          <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-lg animate-pulse" />
                          <div className="relative animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                        </div>
                      </div>
                    }>
                      <NFTGrid
                        nfts={allNFTs}
                        isLoading={isLoading}
                        isFetchingNextPage={isFetchingNextPage}
                        lastElementRef={ref}
                      />
                    </Suspense>
                  </ScrollAnimation>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
