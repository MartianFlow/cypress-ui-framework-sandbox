import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@ecommerce/shared';
import { useCartStore } from '../../stores/cart';
import { useAuthStore } from '../../stores/auth';
import { toast } from 'sonner';
import type { Product } from '@ecommerce/shared';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart({ productId: product.id, quantity: 1 });
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  return (
    <Link
      to={`/products/${product.id}`}
      data-testid="product-card"
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          data-testid="product-image"
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 data-testid="product-name" className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600">
          {product.name}
        </h3>

        <div data-testid="product-rating" className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span data-testid="product-price" className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span data-testid="product-original-price" className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            data-testid="add-to-cart"
            onClick={handleAddToCart}
            disabled={isLoading || product.stock === 0}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
