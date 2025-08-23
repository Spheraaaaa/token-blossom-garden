
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { supabase } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MarketplaceStats } from "@/components/marketplace/MarketplaceStats";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { NFTGrid } from "@/components/marketplace/NFTGrid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Store } from "lucide-react";

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
    <div className="container mx-auto py-8 px-4 mt-16 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Card className="border-border/50 shadow-xl transition-all duration-300 backdrop-blur-xl bg-card/90 overflow-hidden rounded-2xl">
              <CardHeader className="relative pb-8">
                <div>
                  <h1 className="sr-only">NFT Marketplace</h1>
                  <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-card/70 border border-border/50 shadow-sm ring-1 ring-inset ring-primary/20">
                      <Store className="w-6 h-6 text-primary" />
                    </div>
                    NFT Marketplace
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base text-muted-foreground mt-2">
                    Discover and collect extraordinary NFTs from talented creators around the world
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6 pt-8">
                <MarketplaceStats />
                <MarketplaceSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
                <NFTGrid
                  nfts={allNFTs}
                  isLoading={isLoading}
                  isFetchingNextPage={isFetchingNextPage}
                  lastElementRef={ref}
                />
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Marketplace;
