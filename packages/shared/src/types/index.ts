// User types
export type UserRole = 'user' | 'admin' | 'moderator';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'locked';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
}

// Auth types
export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: number | null;
}

// Product types
export type ProductStatus = 'active' | 'inactive' | 'draft';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  categoryId: number;
  category?: Category;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  status: ProductStatus;
  createdAt: string;
}

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'rating' | 'newest';
}

export interface ProductCreateInput {
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  categoryId: number;
  stock: number;
  images: string[];
  featured?: boolean;
  status?: ProductStatus;
}

// Cart types
export interface CartItem {
  id: number;
  productId: number;
  product?: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface AddToCartInput {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

// Order types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  notes?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  notes?: string;
}

// Review types
export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  title: string;
  comment: string;
  user?: Pick<User, 'firstName' | 'lastName' | 'avatar'>;
  createdAt: string;
}

export interface CreateReviewInput {
  rating: number;
  title: string;
  comment: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
