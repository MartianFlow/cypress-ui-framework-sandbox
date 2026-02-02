import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type { Category } from '@ecommerce/shared';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy: string;
  onCategoryChange: (categoryId?: number) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onSortChange: (sortBy: string) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  sortBy,
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
  });
  const [localMinPrice, setLocalMinPrice] = useState(minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice?.toString() || '');

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceApply = () => {
    onPriceChange(
      localMinPrice ? parseFloat(localMinPrice) : undefined,
      localMaxPrice ? parseFloat(localMaxPrice) : undefined
    );
  };

  const hasActiveFilters = selectedCategory || minPrice || maxPrice;

  return (
    <div data-testid="sidebar" className="space-y-6">
      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          data-testid="form-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Best Rated</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center text-sm text-red-600 hover:text-red-700"
        >
          <X className="h-4 w-4 mr-1" />
          Clear all filters
        </button>
      )}

      {/* Categories */}
      <div>
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Categories
          {expandedSections.categories ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {expandedSections.categories && (
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange(undefined)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                !selectedCategory
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  selectedCategory === category.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Price Range
          {expandedSections.price ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={handlePriceApply}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
