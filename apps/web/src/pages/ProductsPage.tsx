import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, X } from 'lucide-react';
import { api } from '../services/api';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import Pagination from '../components/common/Pagination';
import Breadcrumb from '../components/common/Breadcrumb';
import type { Product, Category, PaginatedResponse } from '@ecommerce/shared';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined;
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
  const sortBy = searchParams.get('sortBy') || 'newest';
  const featured = searchParams.get('featured') === 'true';

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<{ categories: Category[] }>('/categories'),
  });

  const queryParams = new URLSearchParams();
  queryParams.set('page', page.toString());
  queryParams.set('pageSize', '12');
  queryParams.set('sortBy', sortBy);
  if (categoryId) queryParams.set('categoryId', categoryId.toString());
  if (minPrice) queryParams.set('minPrice', minPrice.toString());
  if (maxPrice) queryParams.set('maxPrice', maxPrice.toString());
  if (featured) queryParams.set('featured', 'true');

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', queryParams.toString()],
    queryFn: () => api.get<PaginatedResponse<Product>>(`/products?${queryParams.toString()}`),
  });

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (catId?: number) => {
    updateParams({ categoryId: catId?.toString() });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    updateParams({
      minPrice: min?.toString(),
      maxPrice: max?.toString(),
    });
  };

  const handleSortChange = (sort: string) => {
    updateParams({ sortBy: sort });
  };

  const handleClearFilters = () => {
    setSearchParams({ page: '1', sortBy: 'newest' });
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Products' }]} />

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {featured ? 'Featured Products' : 'All Products'}
          </h1>
          {productsData && (
            <p className="text-gray-500 mt-1">
              {productsData.pagination.total} products found
            </p>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
        >
          <Filter className="h-5 w-5" />
          Filters
        </button>
      </div>

      <div className="mt-8 flex gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`${
            showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'
          } lg:block lg:static lg:w-64 lg:shrink-0`}
        >
          <div className="lg:hidden flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          <ProductFilters
            categories={categoriesData?.categories || []}
            selectedCategory={categoryId}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sortBy={sortBy}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid products={productsData?.data || []} isLoading={isLoading} />

          {productsData && productsData.pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={productsData.pagination.page}
                totalPages={productsData.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
