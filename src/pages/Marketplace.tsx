
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
      {/* Simplified animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating orbs - reduced complexity */}
        <div className="absolute top-1/4 -left-8 w-72 h-72 optimized-gradient rounded-full mix-blend-multiply filter blur-2xl animate-simple-float opacity-60" />
        <div className="absolute top-3/4 -right-8 w-64 h-64 bg-gradient-to-l from-secondary/4 to-accent/3 rounded-full mix-blend-multiply filter blur-xl animate-simple-float opacity-50" style={{ animationDelay: '3s' }} />
        
        {/* Simplified grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.01]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Reduced floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-simple-float opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${6 + Math.random() * 3}s`
            }}
          >
            <div className="relative">
              <Sparkles className="w-3 h-3 text-primary/20" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative container mx-auto py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            <ScrollAnimation animation="zoom-in" delay={100}>
              <Card className="marketplace-hero-card relative overflow-hidden border-border/30 shadow-xl transition-all duration-500 light-blur rounded-3xl group hover:shadow-primary/10 hover:border-primary/20 hw-accelerated">
                {/* Simplified glow effect */}
                <div className="absolute inset-0 optimized-gradient opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl" />
                
                <CardHeader className="relative pb-10">
                  <div className="relative z-10">
                    <h1 className="sr-only">NFT Marketplace</h1>
                    <CardTitle className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-foreground flex items-center justify-center gap-4 group-hover:scale-[1.01] transition-all duration-300 hw-accelerated">
                      <div className="relative p-4 rounded-2xl optimized-gradient border border-primary/30 shadow-lg ring-1 ring-inset ring-primary/20 group-hover:shadow-xl transition-all duration-500 hw-accelerated">
                        <Store className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="text-center">
                        <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent font-extrabold">
                          NFT
                        </span>
                        <span className="block text-2xl md:text-3xl lg:text-4xl text-foreground font-light tracking-wider">
                          Marketplace
                        </span>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-base md:text-lg text-center text-muted-foreground mt-6 group-hover:text-foreground/90 transition-colors duration-300 max-w-2xl mx-auto leading-relaxed">
                      Discover extraordinary digital art and collectibles from visionary creators worldwide. 
                      <span className="block mt-2 text-primary/80 font-medium">Join the future of digital ownership</span>
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-10 p-8 pt-0">
                  <ScrollAnimation animation="slide-up" delay={200}>
                    <div className="relative">
                      <MarketplaceStats />
                    </div>
                  </ScrollAnimation>
                  
                  <ScrollAnimation animation="slide-up" delay={300}>
                    <div className="relative">
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
                          <div className="relative animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary hw-accelerated"></div>
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
