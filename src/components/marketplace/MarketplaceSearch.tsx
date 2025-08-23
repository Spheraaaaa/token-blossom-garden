
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface MarketplaceSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const MarketplaceSearch = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}: MarketplaceSearchProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 max-w-5xl mx-auto px-3 mb-2 md:mb-0">
      <div className="flex-1 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative">
          <Input
            type="text"
            placeholder={isMobile ? "Search NFTs..." : "Search by name or creator..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full bg-card border border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/40 shadow-sm transition-all duration-200 text-foreground placeholder:text-muted-foreground h-11"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-full md:w-[200px] rounded-full bg-card border border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/40 shadow-sm h-11">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur-md border border-border/50">
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
