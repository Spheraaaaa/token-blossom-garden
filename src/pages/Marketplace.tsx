
import { useEffect, useState, Suspense, lazy } from "react";
import { useInView } from "react-intersection-observer";
import { supabase } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MarketplaceStats } from "@/components/marketplace/MarketplaceStats";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { useIsMobile } from "@/hooks/use-mobile";

// Conditional imports based on device type
const NFTGrid = lazy(() => import("@/components/marketplace/NFTGrid").then(module => ({ default: module.NFTGrid })));
const SimpleMobileNFTGrid = lazy(() => import("@/components/marketplace/SimpleMobileNFTGrid").then(module => ({ default: module.SimpleMobileNFTGrid })));

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
  const isMobile = useIsMobile();
  
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

  // Mobile version - simple and fast
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-4">
          <div className="mb-6 pt-4">
            <h1 className="font-display text-3xl font-bold text-foreground">NFT Marketplace</h1>
            <p className="mt-2 text-muted-foreground">Discover amazing digital art</p>
          </div>

          <div className="mb-6">
            <MarketplaceSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
          
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
              <span className="ml-2 text-sm">Loading...</span>
            </div>
          }>
            <SimpleMobileNFTGrid
              nfts={allNFTs}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              lastElementRef={ref}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  // Desktop version - full features
  return (
    <div className="relative min-h-screen bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{ background: "radial-gradient(55% 100% at 50% 0%, hsl(263 84% 74% / 0.12), transparent 70%)" }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 pt-12 pb-16 md:pt-16">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground">
            NFT Marketplace
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Discover extraordinary digital art and collectibles from visionary creators worldwide.{" "}
            <span className="text-foreground">Join the future of digital ownership</span>
          </p>
        </div>

        <div className="mt-10">
          <MarketplaceStats />
        </div>

        <div className="mt-10">
          <MarketplaceSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center gap-3 p-12 text-muted-foreground">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              Loading NFTs...
            </div>
          }
        >
          <div className="mt-4 min-h-[300px]">
            <NFTGrid
              nfts={allNFTs}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              lastElementRef={ref}
            />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default Marketplace;
