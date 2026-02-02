import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, MapPin, CreditCard, Truck, XCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@ecommerce/shared';
import { api } from '../services/api';
import Breadcrumb from '../components/common/Breadcrumb';
import { toast } from 'sonner';
import type { Order } from '@ecommerce/shared';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get<{ order: Order }>(`/orders/${id}`),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.put<{ order: Order }>(`/orders/${id}/cancel`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      toast.success('Order cancelled successfully');
    },
    onError: () => {
      toast.error('Failed to cancel order');
    },
  });

  if (isLoading) {
    return (
      <div data-testid="loading" className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const order = data?.order;

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
        <Link to="/orders" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          View all orders
        </Link>
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(order.status);
  const canCancel = ['pending', 'processing'].includes(order.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Orders', href: '/orders' },
          { label: `Order #${order.id}` },
        ]}
      />

      {/* Header */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
          <p className="text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Status Progress */}
      {order.status !== 'cancelled' && (
        <div className="mt-8 bg-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index === 0 && <Package className="h-5 w-5" />}
                    {index === 1 && <CreditCard className="h-5 w-5" />}
                    {index === 2 && <Truck className="h-5 w-5" />}
                    {index === 3 && <Package className="h-5 w-5" />}
                  </div>
                  <span className="mt-2 text-sm text-gray-600 capitalize">{step}</span>
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-0.5 ${
                      index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold">Shipping Address</h3>
              </div>
              <address className="text-gray-600 not-italic">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </address>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold">Billing Address</h3>
              </div>
              <address className="text-gray-600 not-italic">
                {order.billingAddress.street}<br />
                {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}<br />
                {order.billingAddress.country}
              </address>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Payment</h3>
              <p className="text-gray-600 capitalize">{order.paymentMethod.replace('_', ' ')}</p>
              <p className={`text-sm ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </p>
            </div>

            {canCancel && (
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="w-full mt-6 py-3 flex items-center justify-center gap-2 border border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50"
              >
                <XCircle className="h-5 w-5" />
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
