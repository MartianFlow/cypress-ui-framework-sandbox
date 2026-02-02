import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@ecommerce/shared';
import { useCartStore } from '../../stores/cart';
import { useAuthStore } from '../../stores/auth';
import CartItem from './CartItem';

export default function CartDrawer() {
  const { items, subtotal, itemCount, isOpen, isLoading, closeCart, fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        data-testid="modal-overlay"
        className="fixed inset-0 bg-black/50 z-50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        data-testid="cart-drawer"
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Shopping Cart ({itemCount})
          </h2>
          <button
            data-testid="modal-close"
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Please login to view your cart</p>
              <Link
                to="/login"
                onClick={closeCart}
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Login
              </Link>
            </div>
          ) : isLoading && items.length === 0 ? (
            <div data-testid="loading" className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link
                to="/products"
                onClick={closeCart}
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span data-testid="cart-total">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={closeCart}
              data-testid="checkout-button"
              className="block w-full py-3 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/cart"
              onClick={closeCart}
              className="block w-full py-3 bg-gray-100 text-gray-700 text-center font-medium rounded-lg hover:bg-gray-200"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
