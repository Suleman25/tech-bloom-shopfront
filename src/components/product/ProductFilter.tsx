
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductFilterProps {
  categories: string[];
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ categories, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const toggleFilter = () => setIsOpen(!isOpen);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked 
        ? [...prev, category] 
        : prev.filter(cat => cat !== category)
    );
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(selectedRating === rating ? null : rating);
  };

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      priceRange,
      rating: selectedRating
    });
    
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 2000]);
    setSelectedRating(null);
    
    onFilterChange({
      categories: [],
      priceRange: [0, 2000],
      rating: null
    });
  };

  return (
    <div className="relative">
      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <Button
          onClick={toggleFilter}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter Container */}
      <div className={`
        ${isOpen ? 'block fixed inset-0 z-50 bg-white p-4 overflow-y-auto' : 'hidden'} 
        md:block md:static md:bg-transparent
      `}>
        <div className="md:sticky md:top-20">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button variant="ghost" size="icon" onClick={toggleFilter}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={category} 
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                  />
                  <label htmlFor={category} className="text-sm cursor-pointer">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Price Range</h3>
            <Slider 
              defaultValue={[0, 2000]} 
              min={0} 
              max={2000} 
              step={10}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={handlePriceChange}
              className="my-6"
            />
            <div className="flex items-center justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleRatingClick(rating)}
                  className={`flex items-center w-full p-2 rounded ${
                    selectedRating === rating ? 'bg-brand-soft-purple' : ''
                  }`}
                >
                  <div className="flex mr-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${
                          index < rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm">{rating} & up</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Button onClick={applyFilters} className="bg-brand-purple hover:bg-brand-purple-dark">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
