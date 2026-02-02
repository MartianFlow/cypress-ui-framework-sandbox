import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@ecommerce/shared';
import { useCartStore } from '../../stores/cart';
import { toast } from 'sonner';
import type { CartItem as CartItemType } from '@ecommerce/shared';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, isLoading } = useCartStore();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (item.product && newQuantity > item.product.stock) {
      toast.error('Not enough stock available');
      return;
    }

    setLocalQuantity(newQuantity);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch {
      setLocalQuantity(item.quantity);
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      await removeItem(item.id);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  if (!item.product) return null;

  return (
    <div data-testid="cart-item" className="flex gap-4 py-4 border-b last:border-b-0">
      <Link to={`/products/${item.product.id}`} className="shrink-0">
        <img
          src={item.product.images[0] || '/placeholder.jpg'}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.product.id}`}
          className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
        >
          {item.product.name}
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          {formatPrice(item.product.price)} each
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => handleQuantityChange(localQuantity - 1)}
              disabled={isLoading || localQuantity <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              data-testid="cart-quantity"
              value={localQuantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              min="1"
              max={item.product.stock}
              className="w-12 text-center border-x py-1 focus:outline-none"
            />
            <button
              onClick={() => handleQuantityChange(localQuantity + 1)}
              disabled={isLoading || localQuantity >= item.product.stock}
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            data-testid="remove-from-cart"
            onClick={handleRemove}
            disabled={isLoading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-gray-900">
          {formatPrice(item.product.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
