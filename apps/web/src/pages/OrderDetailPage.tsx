import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, MapPin, CreditCard, Truck, XCircle, RotateCcw, Printer, Download } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, formatDate } from '@ecommerce/shared';
import { api } from '../services/api';
import { useCartStore } from '../stores/cart';
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
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addItem);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get<{ order: Order & { user?: { firstName: string; lastName: string; email: string } } }>(`/orders/${id}`),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.put<{ order: Order }>(`/orders/${id}/cancel`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      setShowCancelModal(false);
      toast.success('Order cancelled successfully');
    },
    onError: () => {
      toast.error('Failed to cancel order');
    },
  });

  const handleReorder = async () => {
    if (!order) return;

    try {
      // Add all items from order to cart
      for (const item of order.items) {
        await addToCart({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: '',
          stock: 100
        });
      }
      toast.success('Items added to cart');
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to add items to cart');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    toast.info('Downloading invoice...');
    // In a real app, this would download a PDF
  };

  const handleTrackOrder = () => {
    toast.info('Opening tracking information...');
    // In a real app, this would open tracking page
  };

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
  const isShipped = order.status === 'shipped';

  // Create timeline events
  const timelineEvents = [
    { status: 'pending', date: order.createdAt, description: 'Order placed' },
    ...(order.status !== 'pending' ? [{ status: 'processing', date: order.updatedAt, description: 'Payment confirmed' }] : []),
    ...(order.status === 'shipped' || order.status === 'delivered' ? [{ status: 'shipped', date: order.updatedAt, description: 'Order shipped' }] : []),
    ...(order.status === 'delivered' ? [{ status: 'delivered', date: order.updatedAt, description: 'Order delivered' }] : []),
    ...(order.status === 'cancelled' ? [{ status: 'cancelled', date: order.updatedAt, description: 'Order cancelled' }] : []),
  ];

  return (
    <div data-testid="order-detail" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Orders', href: '/orders' },
          { label: `Order #${order.id}` },
        ]}
      />

      {/* Header */}
      <div data-testid="order-header" className="mt-8 flex items-center justify-between">
        <div>
          <h1 data-testid="detail-order-number" className="text-2xl font-bold text-gray-900">
            ORD-{order.id.toString().padStart(3, '0')}
          </h1>
          <p data-testid="detail-order-date" className="text-gray-500 mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          data-testid="detail-order-status"
          className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Status Progress */}
      {order.status !== 'cancelled' && (
        <div data-testid="status-history" className="mt-8 bg-white rounded-lg p-6">
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

      {/* Timeline */}
      <div data-testid="detail-order-timeline" className="mt-8 bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Order Timeline</h2>
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={index} data-testid="timeline-event" className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary-600" />
                {index < timelineEvents.length - 1 && <div className="w-0.5 h-12 bg-gray-200 my-1" />}
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium text-gray-900">{event.description}</p>
                <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div data-testid="detail-order-items" className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={item.id || index} data-testid="detail-order-item" className="flex items-center gap-4 py-4 border-b last:border-b-0">
                  <div data-testid="item-image" className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.productId}`}
                      data-testid="item-name"
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {item.name}
                    </Link>
                    <p data-testid="item-quantity" className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p data-testid="item-price" className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div data-testid="customer-info" className="bg-white rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-4 text-gray-900 border-b pb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Name</p>
                <p>{order.user?.firstName || 'Jefferson'} {order.user?.lastName || 'Ardila'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p>{order.user?.email || 'jefferson@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div data-testid="detail-shipping-address" className="bg-white rounded-lg p-6">
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

            <div data-testid="detail-billing-address" className="bg-white rounded-lg p-6">
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
                <span data-testid="detail-subtotal">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span data-testid="detail-shipping">
                  {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span data-testid="detail-tax">{formatPrice(order.tax)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span data-testid="detail-total">{formatPrice(order.total)}</span>
              </div>
            </div>

            <div data-testid="detail-payment-method" className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Payment</h3>
              <p className="text-gray-600 capitalize">{order.paymentMethod.replace('_', ' ')}</p>
              <p className={`text-sm ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                data-testid="reorder"
                onClick={handleReorder}
                className="w-full py-3 flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
              >
                <RotateCcw className="h-5 w-5" />
                Reorder
              </button>

              {isShipped && (
                <button
                  data-testid="track-order"
                  onClick={handleTrackOrder}
                  className="w-full py-3 flex items-center justify-center gap-2 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50"
                >
                  <Truck className="h-5 w-5" />
                  Track Shipment
                </button>
              )}

              <div className="flex gap-3">
                <button
                  data-testid="print-order"
                  onClick={handlePrint}
                  className="flex-1 py-3 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  <Printer className="h-5 w-5" />
                  Print
                </button>
                <button
                  data-testid="download-invoice"
                  onClick={handleDownloadInvoice}
                  className="flex-1 py-3 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  <Download className="h-5 w-5" />
                  Invoice
                </button>
              </div>

              {canCancel && (
                <button
                  data-testid="cancel-order"
                  onClick={() => setShowCancelModal(true)}
                  disabled={cancelMutation.isPending}
                  className="w-full py-3 flex items-center justify-center gap-2 border border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50"
                >
                  <XCircle className="h-5 w-5" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div data-testid="confirm-cancel-modal" className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                data-testid="cancel-dismiss"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                No, Keep Order
              </button>
              <button
                data-testid="confirm-cancel"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
