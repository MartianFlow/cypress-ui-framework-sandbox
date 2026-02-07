import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, formatDate } from '@ecommerce/shared';
import { api } from '../services/api';
import Breadcrumb from '../components/common/Breadcrumb';
import Pagination from '../components/common/Pagination';
import type { Order, PaginatedResponse } from '@ecommerce/shared';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, statusFilter, searchQuery, sortBy],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (statusFilter) params.append('status', statusFilter);
      return api.get<PaginatedResponse<Order>>(`/orders?${params.toString()}`);
    },
  });

  if (isLoading) {
    return (
      <div data-testid="loading" className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  let orders = data?.data || [];
  const pagination = data?.pagination;

  // Client-side search filtering (since backend might not support it yet)
  if (searchQuery) {
    orders = orders.filter((order) =>
      order.id.toString().includes(searchQuery) ||
      `ORD-${order.id.toString().padStart(3, '0')}`.includes(searchQuery)
    );
  }

  // Client-side sorting
  if (sortBy === 'date-desc') {
    orders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === 'date-asc') {
    orders = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy === 'total-desc') {
    orders = [...orders].sort((a, b) => b.total - a.total);
  } else if (sortBy === 'total-asc') {
    orders = [...orders].sort((a, b) => a.total - b.total);
  }

  const handleClearFilters = () => {
    setStatusFilter('');
    setSearchQuery('');
    setSortBy('date-desc');
  };

  return (
    <div data-testid="orders-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Orders' }]} />

      <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-8">My Orders</h1>

      {/* Filters and Search */}
      {(orders.length > 0 || statusFilter || searchQuery) && (
        <div className="bg-white rounded-lg p-4 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                data-testid="filter-order-search"
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                data-testid="filter-order-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                data-testid="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="total-desc">Highest Amount</option>
                <option value="total-asc">Lowest Amount</option>
              </select>
            </div>
          </div>

          {(statusFilter || searchQuery || sortBy !== 'date-desc') && (
            <button
              data-testid="clear-filters"
              onClick={handleClearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {orders.length === 0 ? (
        <div data-testid="orders-empty" className="text-center py-16 bg-white rounded-lg">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link
            to="/products"
            data-testid="shop-now-button"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <>
          <div data-testid="orders-list" className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                data-testid="order-item"
                className="block bg-white rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h3 data-testid="order-number" className="font-semibold text-gray-900">
                        ORD-{order.id.toString().padStart(3, '0')}
                      </h3>
                      <span
                        data-testid="order-status"
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p data-testid="order-date" className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p data-testid="order-total" className="text-lg font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                    <p data-testid="order-items-count" className="text-sm text-gray-500">
                      {order.items.length} items
                    </p>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    data-testid="view-order-details"
                    className="ml-4 text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                  >
                    View
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>

                <div className="mt-4 flex gap-4 flex-wrap">
                  {order.items.slice(0, 4).map((item, index) => (
                    <div key={item.id || index} className="text-sm text-gray-600">
                      {item.name} x{item.quantity}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <span className="text-sm text-gray-500">+{order.items.length - 4} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div data-testid="table-pagination" className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
