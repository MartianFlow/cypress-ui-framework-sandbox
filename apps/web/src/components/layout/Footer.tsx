import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer data-testid="footer" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 text-white text-xl font-bold mb-4">
              <ShoppingCart className="h-8 w-8" />
              <span>E-Store</span>
            </Link>
            <p className="text-sm mb-4">
              Your one-stop shop for quality products at great prices. Shop with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-white">All Products</Link>
              </li>
              <li>
                <Link to="/category/electronics" className="hover:text-white">Electronics</Link>
              </li>
              <li>
                <Link to="/category/clothing" className="hover:text-white">Clothing</Link>
              </li>
              <li>
                <Link to="/category/home-garden" className="hover:text-white">Home & Garden</Link>
              </li>
              <li>
                <Link to="/category/sports" className="hover:text-white">Sports</Link>
              </li>
              <li>
                <Link to="/category/books" className="hover:text-white">Books</Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-white">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white">Register</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white">Order History</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white">Cart</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white">My Profile</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 E-Commerce St, Digital City</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@estore.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} E-Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
