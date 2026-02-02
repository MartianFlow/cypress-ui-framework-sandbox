import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, Users, ShoppingBag, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { formatPrice } from '@ecommerce/shared';
import { api } from '../../services/api';
import type { Order, User, PaginatedResponse } from '@ecommerce/shared';

export default function AdminDashboardPage() {
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get<PaginatedResponse<Order>>('/orders/admin?pageSize=5'),
    retry: false,
    staleTime: 0,
  });

  const { data: usersData, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<PaginatedResponse<User>>('/users?pageSize=5'),
    retry: false,
    staleTime: 0,
  });

  const totalOrders = ordersData?.pagination?.total || 0;
  const totalUsers = usersData?.pagination?.total || 0;
  const recentOrders = ordersData?.data || [];

  // Calculate revenue from orders
  const totalRevenue = recentOrders.reduce((sum, order) => sum + (order?.total || 0), 0);

  return (
    <div data-testid="admin-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <aside data-testid="admin-sidebar" className="hidden md:block w-64 flex-shrink-0">
          <nav className="bg-white rounded-lg shadow-sm p-4">
            <Link
              to="/admin"
              data-testid="admin-nav-dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
            >
              <DollarSign className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              data-testid="admin-nav-products"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Package className="h-5 w-5" />
              Products
            </Link>
            <Link
              to="/admin/orders"
              data-testid="admin-nav-orders"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <ShoppingBag className="h-5 w-5" />
              Orders
            </Link>
            <Link
              to="/admin/users"
              data-testid="admin-nav-users"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Users className="h-5 w-5" />
              Users
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div data-testid="stats-total-revenue" className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% from last month
              </div>
            </div>

            <div data-testid="stats-total-orders" className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div data-testid="stats-total-users" className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div data-testid="stats-total-products" className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Products</p>
                  <p className="text-2xl font-bold text-gray-900">30</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/admin/products"
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Products</h3>
              <p className="text-sm text-gray-500">Add, edit, or remove products</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Orders</h3>
              <p className="text-sm text-gray-500">View and process orders</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-500">View and manage users</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </Link>
      </div>

          {/* Recent Orders */}
          <div data-testid="recent-orders" className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            <div data-testid="table" className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link to={`/orders/${order.id}`} className="text-primary-600 hover:text-primary-700">
                          #{order.id}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-600">User #{order.userId}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{formatPrice(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div data-testid="recent-activity" className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="text-gray-900">New order #123 placed</p>
                  <p className="text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="text-gray-900">Product "Wireless Headphones" updated</p>
                  <p className="text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="text-gray-900">New user registered</p>
                  <p className="text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
