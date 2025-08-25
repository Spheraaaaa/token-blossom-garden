
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
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl animate-float" />
        <div className="absolute top-3/4 -right-4 w-72 h-72 bg-secondary/5 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-up"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-primary/20" />
          </div>
        ))}
      </div>

      <div className="relative container mx-auto py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            <ScrollAnimation animation="zoom-in" delay={100}>
              <Card className="relative overflow-hidden border-border/50 shadow-2xl transition-all duration-500 backdrop-blur-xl bg-card/80 rounded-2xl group hover:shadow-primary/10">
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <CardHeader className="relative pb-8 bg-gradient-to-r from-transparent via-card/50 to-transparent">
                  <div className="relative z-10">
                    <h1 className="sr-only">NFT Marketplace</h1>
                    <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground flex items-center gap-3 group-hover:scale-[1.02] transition-transform duration-300">
                      <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-lg ring-1 ring-inset ring-primary/30 group-hover:shadow-primary/20 transition-all duration-300">
                        <Store className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <span className="bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent animate-gradient">
                        NFT Marketplace
                      </span>
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base text-muted-foreground mt-3 group-hover:text-foreground/80 transition-colors duration-300">
                      Discover and collect extraordinary NFTs from talented creators around the world
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-8 p-6 pt-8">
                  <ScrollAnimation animation="slide-up" delay={200}>
                    <MarketplaceStats />
                  </ScrollAnimation>
                  
                  <ScrollAnimation animation="slide-up" delay={300}>
                    <MarketplaceSearch
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                    />
                  </ScrollAnimation>
                  
                  <ScrollAnimation animation="fade-in" delay={400}>
                    <Suspense fallback={
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
