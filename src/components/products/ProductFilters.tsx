import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  maxPrice: number;
  filters: {
    category: string;
    brand: string;
    priceRange: number[];
    rating: number;
  };
  onFilterChange: (newFilters: Partial<ProductFiltersProps['filters']>) => void;
  onSortChange: (sortKey: string) => void;
  disabled?: boolean;
}

export default function ProductFilters({
  categories,
  brands,
  maxPrice,
  filters,
  onFilterChange,
  onSortChange,
  disabled = false,
}: ProductFiltersProps) {
  
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <fieldset disabled={disabled} className="space-y-6">
          <div>
            <Label className="text-base font-medium">Sort By</Label>
            <Select onValueChange={onSortChange} defaultValue="newest">
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium">Category</Label>
            <Select onValueChange={(value) => onFilterChange({ category: value })} defaultValue="all">
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium">Brand</Label>
            <Select onValueChange={(value) => onFilterChange({ brand: value })} defaultValue="all">
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand} className="capitalize">
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
              <div className="flex justify-between items-center">
                  <Label className="text-base font-medium">Price Range</Label>
                  <span className="text-sm font-medium text-muted-foreground">${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
              </div>
              <Slider
                  defaultValue={[0, maxPrice]}
                  max={maxPrice}
                  step={1}
                  value={filters.priceRange}
                  onValueChange={(value) => onFilterChange({ priceRange: value })}
                  className="mt-3"
              />
          </div>

          <div>
            <Label className="text-base font-medium">Rating</Label>
            <Select onValueChange={(value) => onFilterChange({ rating: Number(value) })} defaultValue="0">
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Minimum rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Ratings</SelectItem>
                <SelectItem value="4">4 Stars & Up</SelectItem>
                <SelectItem value="3">3 Stars & Up</SelectItem>
                <SelectItem value="2">2 Stars & Up</SelectItem>
                <SelectItem value="1">1 Star & Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
}
