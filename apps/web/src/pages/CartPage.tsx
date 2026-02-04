import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { formatPrice } from '@ecommerce/shared';
import { useCartStore } from '../stores/cart';
import { api } from '../services/api';
import CartItem from '../components/cart/CartItem';
import Breadcrumb from '../components/common/Breadcrumb';

export default function CartPage() {
  const { items, subtotal, itemCount, isLoading, fetchCart, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const tax = subtotal * 0.08;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const discount = appliedCoupon?.discount || 0;
  const total = subtotal - discount + tax + shipping;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const result = await api.post<{ discount: number }>('/coupons/apply', { code: couponCode });
      setAppliedCoupon({ code: couponCode, discount: result.discount });
      setCouponCode('');
    } catch (error: any) {
      setCouponError(error.message || 'Invalid coupon code');
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <div data-testid="loading" className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white rounded-lg">
              <div className="w-24 h-24 bg-gray-200 rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div data-testid="cart-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Cart' }]} />

      <h1 className="text-2xl font-bold text-gray-900 mt-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div data-testid="cart-empty" className="mt-8 text-center py-16 bg-white rounded-lg">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
          <Link
            to="/products"
            data-testid="continue-shopping"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            Start Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                </h2>
                <button
                  data-testid="clear-cart"
                  onClick={() => clearCart()}
                  className="flex items-center text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear Cart
                </button>
              </div>

              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span data-testid="cart-subtotal">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span data-testid="cart-shipping">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span data-testid="cart-tax">{formatPrice(tax)}</span>
                </div>

                {/* Coupon Code */}
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      data-testid="coupon-input"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      data-testid="coupon-apply"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p data-testid="coupon-error" className="text-red-600 text-sm mt-1">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <p data-testid="coupon-success" className="text-green-600 text-sm mt-1">
                      Coupon "{appliedCoupon.code}" applied!
                    </p>
                  )}
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span data-testid="cart-discount">-{formatPrice(appliedCoupon.discount)}</span>
                  </div>
                )}

                <hr />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span data-testid="cart-total">{formatPrice(total)}</span>
                </div>

                {subtotal < 100 && (
                  <p className="text-sm text-gray-500">
                    Add {formatPrice(100 - subtotal)} more for free shipping!
                  </p>
                )}

                <Link
                  to="/checkout"
                  data-testid="checkout-button"
                  className="block w-full py-3 bg-primary-600 text-white text-center font-semibold rounded-lg hover:bg-primary-700"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/products"
                  data-testid="continue-shopping"
                  className="block w-full py-3 bg-gray-100 text-gray-700 text-center font-semibold rounded-lg hover:bg-gray-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
