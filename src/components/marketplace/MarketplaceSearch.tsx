import { Search, ArrowDownWideNarrow } from "lucide-react";
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

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export const MarketplaceSearch = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}: MarketplaceSearchProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <label className="relative flex-1">
        <span className="sr-only">Search NFTs</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder={isMobile ? "Search NFTs..." : "Search by name, creator, or collection..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 rounded-full border-border bg-card pl-11 pr-5 text-base text-foreground placeholder:text-muted-foreground transition-colors hover:border-primary/30 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-0"
        />
      </label>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger
          aria-label="Sort NFTs"
          className="h-12 w-full gap-2 rounded-full border-border bg-card px-5 text-sm font-medium transition-colors hover:border-primary/30 focus:ring-2 focus:ring-primary/25 focus:ring-offset-0 md:w-[230px]"
        >
          <ArrowDownWideNarrow className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border bg-popover">
          {sortOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
