import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { formatPrice, formatDate } from '@ecommerce/shared';
import { api } from '../services/api';
import type { Order } from '@ecommerce/shared';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get<{ order: Order }>(`/orders/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div data-testid="loading" className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  const order = data?.order;

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
        <Link to="/orders" className="text-primary-600 hover:text-primary-700">
          View all orders
        </Link>
      </div>
    );
  }

  // Calculate estimated delivery date (7-10 business days from now)
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

  return (
    <div data-testid="order-confirmation" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>

      {/* Order Info */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <div className="border-b pb-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Order Number:</span>
            <span data-testid="confirmation-order-number" className="font-semibold text-gray-900">
              ORD-{order.id.toString().padStart(3, '0')}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Order Date:</span>
            <span className="text-gray-900">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold text-gray-900">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div data-testid="estimated-delivery" className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Truck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Estimated Delivery</h3>
            <p className="text-blue-700">
              Your order will arrive by {formatDate(estimatedDeliveryDate.toISOString())}
            </p>
          </div>
        </div>

        {/* Email Notice */}
        <div data-testid="confirmation-email-notice" className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
          <Package className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Confirmation Email Sent</h3>
            <p className="text-gray-600 text-sm">
              We've sent a confirmation email with your order details and tracking information.
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={item.id || index} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t space-y-2">
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
          <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to={`/orders/${order.id}`}
          data-testid="view-order"
          className="flex-1 py-3 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 text-center"
        >
          View Order Details
        </Link>
        <Link
          to="/products"
          data-testid="continue-shopping"
          className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 text-center"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Need help with your order?</p>
        <Link to="/help/support" className="text-primary-600 hover:text-primary-700">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
