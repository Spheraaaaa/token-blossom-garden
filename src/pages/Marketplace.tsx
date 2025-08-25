
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
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background/98 to-background/95 overflow-hidden">
      {/* Clean background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-accent/1 to-secondary/1" />
      
      {/* Elegant floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary/4 via-accent/3 to-transparent rounded-full blur-3xl animate-simple-float opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-accent/3 via-secondary/2 to-transparent rounded-full blur-2xl animate-simple-float opacity-40" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative container mx-auto py-4 px-2 md:px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            <ScrollAnimation animation="zoom-in" delay={100}>
              <Card className="relative overflow-hidden border border-border/30 bg-card/80 backdrop-blur-xl shadow-2xl transition-all duration-500 rounded-2xl md:rounded-3xl group hover:shadow-primary/10 hover:border-primary/20">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/3 to-secondary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                <CardHeader className="relative pb-6 md:pb-10 px-4 md:px-6 pt-4 md:pt-6">
                  <div className="relative z-10">
                    <h1 className="sr-only">NFT Marketplace</h1>
                    <CardTitle className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-none text-foreground flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 group-hover:scale-[1.01] transition-all duration-300 hw-accelerated">
                      <div className="relative p-2 md:p-4 rounded-xl md:rounded-2xl optimized-gradient border border-primary/30 shadow-lg ring-1 ring-inset ring-primary/20 group-hover:shadow-xl transition-all duration-500 hw-accelerated">
                        <Store className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="text-center">
                        <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent font-extrabold">
                          NFT
                        </span>
                        <span className="block text-lg md:text-2xl lg:text-3xl xl:text-4xl text-foreground font-light tracking-wider">
                          Marketplace
                        </span>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base lg:text-lg text-center text-muted-foreground mt-4 md:mt-6 group-hover:text-foreground/90 transition-colors duration-300 max-w-2xl mx-auto leading-relaxed px-2">
                      Discover extraordinary digital art and collectibles from visionary creators worldwide. 
                      <span className="block mt-2 text-primary/80 font-medium">Join the future of digital ownership</span>
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-6 md:space-y-10 p-4 md:p-8 pt-0">
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
