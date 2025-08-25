
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
    <div className="flex flex-col gap-3 md:gap-4 max-w-6xl mx-auto mb-4">
      <div className="flex-1 relative group">
        {/* Simplified glow effect for mobile */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/15 to-secondary/20 rounded-xl blur opacity-60 group-hover:opacity-100 transition-all duration-300" />
        
        <div className="relative">
          <Input
            type="text"
            placeholder={isMobile ? "Search NFTs..." : "Search by name, creator, or collection..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input pl-10 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl bg-card/95 backdrop-blur-lg border border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 text-foreground placeholder:text-muted-foreground/70 h-12 md:h-14 text-sm md:text-base font-medium"
          />
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 p-1 bg-primary/10 rounded-lg">
            <Search className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
        </div>
      </div>
      
      <div className="relative group w-full md:w-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="sort-trigger w-full md:w-[240px] rounded-xl md:rounded-2xl bg-card/95 backdrop-blur-lg border border-border/30 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 h-12 md:h-14 text-sm md:text-base font-medium">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-2xl border border-border/40 rounded-xl shadow-2xl">
            <SelectItem value="newest" className="focus:bg-primary/10 focus:text-primary rounded-lg m-1 cursor-pointer transition-colors duration-200">
              🆕 Newest First
            </SelectItem>
            <SelectItem value="oldest" className="focus:bg-primary/10 focus:text-primary rounded-lg m-1 cursor-pointer transition-colors duration-200">
              📅 Oldest First
            </SelectItem>
            <SelectItem value="price-asc" className="focus:bg-accent/10 focus:text-accent rounded-lg m-1 cursor-pointer transition-colors duration-200">
              💰 Price: Low to High
            </SelectItem>
            <SelectItem value="price-desc" className="focus:bg-accent/10 focus:text-accent rounded-lg m-1 cursor-pointer transition-colors duration-200">
              💎 Price: High to Low
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
