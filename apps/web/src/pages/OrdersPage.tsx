import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight } from 'lucide-react';
import { formatPrice, formatDate } from '@ecommerce/shared';
import { api } from '../services/api';
import Breadcrumb from '../components/common/Breadcrumb';
import type { Order, PaginatedResponse } from '@ecommerce/shared';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get<PaginatedResponse<Order>>('/orders'),
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

  const orders = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Orders' }]} />

      <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{formatPrice(order.total)}</p>
                  <p className="text-sm text-gray-500">{order.items.length} items</p>
                </div>

                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>

              <div className="mt-4 flex gap-4">
                {order.items.slice(0, 4).map((item) => (
                  <div key={item.id} className="text-sm text-gray-600">
                    {item.name} x{item.quantity}
                  </div>
                ))}
                {order.items.length > 4 && (
                  <span className="text-sm text-gray-500">+{order.items.length - 4} more</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
