
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
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-6xl mx-auto px-4 mb-4">
      <div className="flex-1 relative group">
        {/* Enhanced glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-accent/20 to-secondary/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:duration-300 animate-pulse" />
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-accent/30 to-secondary/40 rounded-xl blur opacity-0 group-hover:opacity-80 transition-all duration-500" />
        
        <div className="relative">
          <Input
            type="text"
            placeholder={isMobile ? "Search NFTs..." : "Search by name, creator, or collection..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input pl-12 pr-6 py-4 rounded-2xl bg-gradient-to-r from-card/95 to-card/90 backdrop-blur-lg border-2 border-border/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 text-foreground placeholder:text-muted-foreground/70 h-14 text-base font-medium group-hover:scale-[1.02] group-hover:shadow-primary/20"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
            <Search className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          {/* Search highlight effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      </div>
      
      <div className="relative group">
        {/* Sort dropdown glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/25 to-primary/25 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="sort-trigger w-full md:w-[240px] rounded-2xl bg-gradient-to-r from-card/95 to-card/90 backdrop-blur-lg border-2 border-border/30 focus:border-accent/50 focus:ring-4 focus:ring-accent/20 shadow-xl hover:shadow-2xl transition-all duration-500 h-14 text-base font-medium group-hover:scale-[1.02] group-hover:shadow-accent/20">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-2xl border-2 border-border/40 rounded-xl shadow-2xl">
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
