import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination';
import Breadcrumb from '../components/common/Breadcrumb';
import type { Product, PaginatedResponse } from '@ecommerce/shared';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['search', query, page],
    queryFn: () => api.get<PaginatedResponse<Product>>(`/products/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=12`),
    enabled: query.length >= 2,
  });

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Search' }]} />

      <div className="mt-8">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-6 w-6 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900">
            {query ? `Search results for "${query}"` : 'Search Products'}
          </h1>
        </div>

        {productsData && (
          <p className="text-gray-500">
            {productsData.pagination.total} products found
          </p>
        )}
      </div>

      {!query || query.length < 2 ? (
        <div className="mt-8 text-center py-16">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Enter at least 2 characters to search</p>
        </div>
      ) : (
        <>
          <div className="mt-8">
            <ProductGrid products={productsData?.data || []} isLoading={isLoading} />
          </div>

          {productsData && productsData.pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={productsData.pagination.page}
                totalPages={productsData.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
