import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, Package, LayoutDashboard, Bell } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount, openCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header data-testid="header" className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            data-testid="header-logo"
            className="flex items-center space-x-2 text-xl font-bold text-primary-600"
          >
            <ShoppingCart className="h-8 w-8" />
            <span>E-Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav data-testid="nav-menu" className="hidden md:flex items-center space-x-8">
            <Link to="/products" data-testid="nav-item" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link to="/category/electronics" data-testid="nav-item" className="text-gray-600 hover:text-gray-900">
              Electronics
            </Link>
            <Link to="/category/clothing" data-testid="nav-item" className="text-gray-600 hover:text-gray-900">
              Clothing
            </Link>
            <Link to="/category/home-garden" data-testid="nav-item" className="text-gray-600 hover:text-gray-900">
              Home & Garden
            </Link>
          </nav>

          {/* Search, Cart, User */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <input
                type="text"
                data-testid="header-search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 px-4 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                data-testid="search-button"
                className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Notifications (only when logged in) */}
            {isAuthenticated && (
              <button
                data-testid="notification-bell"
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <Bell className="h-6 w-6" />
                <span
                  data-testid="notification-badge"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full"
                >
                  3
                </span>
              </button>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              data-testid="cart-icon"
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary-600 text-white text-xs font-bold rounded-full">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  data-testid="user-menu-trigger"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900"
                >
                  {user?.avatar ? (
                    <img
                      data-testid="user-avatar"
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      data-testid="user-avatar"
                      className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center"
                    >
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                  )}
                  <span data-testid="user-name" className="hidden lg:block font-medium">
                    {user?.firstName}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div
                    data-testid="user-menu"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
                  >
                    <Link
                      to="/dashboard"
                      data-testid="dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      data-testid="dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </Link>
                    <Link
                      to="/profile"
                      data-testid="dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      data-testid="dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        data-testid="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      data-testid="logout-button"
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                data-testid="login-button"
                className="flex items-center space-x-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="flex mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-r-lg"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
            <nav className="space-y-2">
              <Link
                to="/products"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/category/electronics"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Electronics
              </Link>
              <Link
                to="/category/clothing"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Clothing
              </Link>
              <Link
                to="/category/home-garden"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home & Garden
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
