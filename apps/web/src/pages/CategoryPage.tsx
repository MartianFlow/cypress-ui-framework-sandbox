import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination';
import Breadcrumb from '../components/common/Breadcrumb';
import type { Product, Category, PaginatedResponse } from '@ecommerce/shared';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sortBy') || 'newest';

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => api.get<{ category: Category }>(`/categories/${slug}`),
    enabled: !!slug,
  });

  const queryParams = new URLSearchParams();
  queryParams.set('page', page.toString());
  queryParams.set('pageSize', '12');
  queryParams.set('sortBy', sortBy);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['category-products', slug, queryParams.toString()],
    queryFn: () => api.get<PaginatedResponse<Product>>(`/categories/${slug}/products?${queryParams.toString()}`),
    enabled: !!slug,
  });

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', e.target.value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  if (categoryLoading) {
    return (
      <div data-testid="loading" className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  const category = categoryData?.category;

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Category not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          { label: category.name },
        ]}
      />

      {/* Category Header */}
      <div className="mt-8 relative rounded-xl overflow-hidden h-48 md:h-64">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-center p-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{category.name}</h1>
            <p className="text-white/80 mt-2 max-w-md">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-gray-500">
          {productsData?.pagination.total || 0} products
        </p>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Best Rated</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="mt-8">
        <ProductGrid products={productsData?.data || []} isLoading={productsLoading} />
      </div>

      {/* Pagination */}
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
  );
}
