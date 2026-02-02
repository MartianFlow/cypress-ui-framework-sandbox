import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { formatPrice } from '@ecommerce/shared';
import { useCartStore } from '../stores/cart';
import CartItem from '../components/cart/CartItem';
import Breadcrumb from '../components/common/Breadcrumb';

export default function CartPage() {
  const { items, subtotal, itemCount, isLoading, fetchCart, clearCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const tax = subtotal * 0.08;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Cart' }]} />

      <h1 className="text-2xl font-bold text-gray-900 mt-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="mt-8 text-center py-16 bg-white rounded-lg">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
          <Link
            to="/products"
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
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

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
