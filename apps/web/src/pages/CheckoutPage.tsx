import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { formatPrice } from '@ecommerce/shared';
import { api, ApiError } from '../services/api';
import { useCartStore } from '../stores/cart';
import Breadcrumb from '../components/common/Breadcrumb';
import { toast } from 'sonner';
import type { Order } from '@ecommerce/shared';

const checkoutSchema = z.object({
  shipping: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
  }),
  shippingAddress: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code is required'),
    country: z.string().min(2, 'Country is required'),
  }),
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  sameAsShipping: z.boolean(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  card: z.object({
    number: z.string().optional(),
    name: z.string().optional(),
    expiry: z.string().optional(),
    cvv: z.string().optional(),
  }),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.sameAsShipping) {
    const addr = data.billingAddress;
    if (addr.street.length < 5) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['billingAddress', 'street'], message: 'Street address is required' });
    if (addr.city.length < 2) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['billingAddress', 'city'], message: 'City is required' });
    if (addr.state.length < 2) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['billingAddress', 'state'], message: 'State is required' });
    if (addr.zipCode.length < 5) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['billingAddress', 'zipCode'], message: 'ZIP code is required' });
    if (addr.country.length < 2) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['billingAddress', 'country'], message: 'Country is required' });
  }
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, fetchCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tax = subtotal * 0.08;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping: { firstName: '', lastName: '', email: '', phone: '' },
      shippingAddress: { street: '', city: '', state: '', zipCode: '', country: 'USA' },
      billingAddress: { street: '', city: '', state: '', zipCode: '', country: 'USA' },
      sameAsShipping: true,
      paymentMethod: 'credit_card',
      card: { number: '', name: '', expiry: '', cvv: '' },
      notes: '',
    },
  });

  const sameAsShipping = watch('sameAsShipping');
  const shippingAddress = watch('shippingAddress');
  const paymentMethod = watch('paymentMethod');

  useEffect(() => {
    if (sameAsShipping) {
      setValue('billingAddress', shippingAddress);
    }
  }, [sameAsShipping, shippingAddress, setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const orderData = {
        shippingAddress: data.shippingAddress,
        billingAddress: data.sameAsShipping ? data.shippingAddress : data.billingAddress,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      };

      const response = await api.post<{ order: Order }>('/orders', orderData);

      // Process payment — include card details when paying by credit card
      const paymentDetails =
        data.paymentMethod === 'credit_card'
          ? {
              cardNumber: data.card.number,
              expiryMonth: data.card.expiry?.split('/')[0],
              expiryYear: data.card.expiry?.split('/')[1],
              cvv: data.card.cvv,
            }
          : {};

      await api.post('/payments/process', {
        orderId: response.order.id,
        paymentDetails,
      });

      setCompletedOrder(response.order);
      setOrderComplete(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to process order';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Order confirmed ────────────────────────────────────────────
  if (orderComplete && completedOrder) {
    return (
      <div data-testid="checkout-page" className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div data-testid="order-confirmation">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
          <p className="text-gray-600 mb-8">
            Order #{completedOrder.id} has been placed successfully.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(`/orders/${completedOrder.id}`)}
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
            >
              View Order Details
            </button>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty cart ─────────────────────────────────────────────────
  if (items.length === 0 && !errorMessage) {
    return (
      <div data-testid="checkout-page" className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  // ── Checkout form ──────────────────────────────────────────────
  return (
    <div data-testid="checkout-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

      <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-8">Checkout</h1>

      {/* Inline error banner (shown on order / payment failure) */}
      {errorMessage && (
        <div data-testid="checkout-error" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {errorMessage}
        </div>
      )}

      <form data-testid="checkout-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column: form sections ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Shipping Information */}
            <div data-testid="shipping-form" className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-6">Shipping Information</h2>

              {/* Personal details row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    data-testid="shipping-first-name"
                    {...register('shipping.firstName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.shipping?.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.shipping.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    data-testid="shipping-last-name"
                    {...register('shipping.lastName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.shipping?.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.shipping.lastName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    data-testid="shipping-email"
                    type="email"
                    {...register('shipping.email')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.shipping?.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.shipping.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    data-testid="shipping-phone"
                    {...register('shipping.phone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Address fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    data-testid="shipping-address"
                    {...register('shippingAddress.street')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.shippingAddress?.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.street.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    data-testid="shipping-city"
                    {...register('shippingAddress.city')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.shippingAddress?.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    data-testid="shipping-state"
                    {...register('shippingAddress.state')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.shippingAddress?.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.state.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    data-testid="shipping-zip"
                    {...register('shippingAddress.zipCode')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.shippingAddress?.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    data-testid="shipping-country"
                    {...register('shippingAddress.country')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Billing Address</h2>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('sameAsShipping')}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Same as shipping</span>
                </label>
              </div>
              {!sameAsShipping && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      {...register('billingAddress.street')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      {...register('billingAddress.city')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      {...register('billingAddress.state')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      {...register('billingAddress.zipCode')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      {...register('billingAddress.country')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div data-testid="payment-form" className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-6">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="credit_card"
                    data-testid="payment-credit-card"
                    {...register('paymentMethod')}
                    className="h-4 w-4 text-primary-600"
                  />
                  <CreditCard className="h-5 w-5 ml-3 mr-2" />
                  <span>Credit Card</span>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="paypal"
                    data-testid="payment-paypal"
                    {...register('paymentMethod')}
                    className="h-4 w-4 text-primary-600"
                  />
                  <span className="ml-3">PayPal</span>
                </label>
              </div>

              {/* Credit card fields — visible only when credit_card is selected */}
              {paymentMethod === 'credit_card' && (
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        data-testid="card-number"
                        {...register('card.number')}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                      <input
                        data-testid="card-name"
                        {...register('card.name')}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        data-testid="card-expiry"
                        {...register('card.expiry')}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        data-testid="card-cvv"
                        type="password"
                        {...register('card.cvv')}
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order Notes (Optional)</h2>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Special instructions for delivery..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* ── Right column: order summary ── */}
          <div className="lg:col-span-1">
            <div data-testid="order-summary" className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product?.images[0] || '/placeholder.jpg'}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">
                        {formatPrice((item.product?.price || 0) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <div className="space-y-3">
                <div data-testid="summary-subtotal" className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div data-testid="summary-shipping" className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div data-testid="summary-tax" className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <hr />
                <div data-testid="summary-total" className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                data-testid="place-order"
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  `Pay ${formatPrice(total)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
