import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@ecommerce/shared';
import { api } from '../services/api';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import Breadcrumb from '../components/common/Breadcrumb';
import { toast } from 'sonner';
import type { Product, Review, PaginatedResponse } from '@ecommerce/shared';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get<{ product: Product }>(`/products/${id}`),
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => api.get<PaginatedResponse<Review>>(`/products/${id}/reviews`),
    enabled: !!id,
  });

  const product = productData?.product;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (!product) return;

    try {
      await addToCart({ productId: product.id, quantity });
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div data-testid="loading" className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Link to="/products" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Browse all products
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          { label: product.category?.name || 'Category', href: `/category/${product.category?.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              data-testid="product-image"
              src={product.images[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 data-testid="product-name" className="text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <div data-testid="product-rating" className="flex items-center gap-2 mt-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-6">
            <span data-testid="product-price" className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span
                  data-testid="product-original-price"
                  className="ml-3 text-xl text-gray-500 line-through"
                >
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="ml-3 text-lg text-red-600 font-semibold">
                  -{discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-gray-600">{product.description}</p>

          {/* Stock Status */}
          <div className="mt-6">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100"
              >
                <Minus className="h-5 w-5" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                min="1"
                max={product.stock}
                className="w-16 text-center border-x py-2 focus:outline-none"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 hover:bg-gray-100"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <button
              data-testid="add-to-cart"
              onClick={handleAddToCart}
              disabled={cartLoading || product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>

            <button className="p-3 border rounded-lg hover:bg-gray-100">
              <Heart className="h-5 w-5" />
            </button>

            <button className="p-3 border rounded-lg hover:bg-gray-100">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="h-5 w-5" />
              Free Shipping
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-5 w-5" />
              Secure Payment
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RotateCcw className="h-5 w-5" />
              30-Day Returns
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        {reviewsData && reviewsData.data.length > 0 ? (
          <div className="space-y-6">
            {reviewsData.data.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.title}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      By {review.user?.firstName} {review.user?.lastName}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
}
