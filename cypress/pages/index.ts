/**
 * Page Factory - Central registry for all Page Objects
 * @description Factory pattern implementation for creating and managing page instances
 * @module PageFactory
 */

// Base Classes
import BasePage from './base/BasePage';
import BaseComponent from './base/BaseComponent';

// Auth Page Objects
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';

// E-Commerce Page Objects
import ProductsPage from './products/ProductsPage';
import ProductDetailPage from './products/ProductDetailPage';
import CartPage from './cart/CartPage';
import CheckoutPage from './checkout/CheckoutPage';
import OrdersPage from './orders/OrdersPage';
import OrderDetailPage from './orders/OrderDetailPage';

// User Page Objects
import DashboardPage from './user/DashboardPage';
import ProfilePage from './user/ProfilePage';

// Admin Page Objects
import AdminProductsPage from './admin/AdminProductsPage';
import AdminOrdersPage from './admin/AdminOrdersPage';
import AdminUsersPage from './admin/AdminUsersPage';

// Components
import HeaderComponent from './components/HeaderComponent';
import ModalComponent from './components/ModalComponent';
import TableComponent from './components/TableComponent';
import ProductCardComponent from './components/ProductCardComponent';
import CartDrawerComponent from './components/CartDrawerComponent';
import PaginationComponent from './components/PaginationComponent';

/**
 * PageFactory - Singleton factory for page object management
 * @class
 */
class PageFactory {
  static instance;

  constructor() {
    if (PageFactory.instance) {
      return PageFactory.instance;
    }

    this._pageCache = new Map();
    PageFactory.instance = this;
  }

  /**
   * Get or create a page instance
   * @param {Function} PageClass - Page class constructor
   * @param {boolean} [cached=true] - Whether to cache the instance
   * @returns {BasePage} Page instance
   * @private
   */
  _getPage(PageClass, cached = true) {
    const className = PageClass.name;

    if (cached && this._pageCache.has(className)) {
      return this._pageCache.get(className);
    }

    const instance = new PageClass();

    if (cached) {
      this._pageCache.set(className, instance);
    }

    return instance;
  }

  /**
   * Clear all cached page instances
   * @returns {PageFactory} This factory instance for chaining
   */
  clearCache() {
    this._pageCache.clear();
    return this;
  }

  /**
   * Clear specific page from cache
   * @param {Function} PageClass - Page class to clear
   * @returns {PageFactory} This factory instance for chaining
   */
  clearPage(PageClass) {
    this._pageCache.delete(PageClass.name);
    return this;
  }

  // =================================
  // Auth Page Getters
  // =================================

  get loginPage() {
    return this._getPage(LoginPage);
  }

  get registerPage() {
    return this._getPage(RegisterPage);
  }

  // =================================
  // E-Commerce Page Getters
  // =================================

  get productsPage() {
    return this._getPage(ProductsPage);
  }

  getProductDetailPage(productSlug) {
    return new ProductDetailPage(productSlug);
  }

  get cartPage() {
    return this._getPage(CartPage);
  }

  get checkoutPage() {
    return this._getPage(CheckoutPage);
  }

  get ordersPage() {
    return this._getPage(OrdersPage);
  }

  getOrderDetailPage(orderId) {
    return new OrderDetailPage(orderId);
  }

  // =================================
  // User Page Getters
  // =================================

  get dashboardPage() {
    return this._getPage(DashboardPage);
  }

  get profilePage() {
    return this._getPage(ProfilePage);
  }

  // =================================
  // Admin Page Getters
  // =================================

  get adminProductsPage() {
    return this._getPage(AdminProductsPage);
  }

  get adminOrdersPage() {
    return this._getPage(AdminOrdersPage);
  }

  get adminUsersPage() {
    return this._getPage(AdminUsersPage);
  }

  // =================================
  // Component Getters
  // =================================

  getHeader(selector) {
    if (selector) {
      return new HeaderComponent(selector);
    }
    return this._getPage(HeaderComponent);
  }

  getModal(selector) {
    if (selector) {
      return new ModalComponent(selector);
    }
    return new ModalComponent();
  }

  getTable(selector) {
    if (selector) {
      return new TableComponent(selector);
    }
    return new TableComponent();
  }

  // =================================
  // Factory Methods
  // =================================

  createPage(PageClass, ...args) {
    return new PageClass(...args);
  }

  createComponent(ComponentClass, selector) {
    return new ComponentClass(selector);
  }
}

// Create singleton instance
const pageFactory = new PageFactory();

// =================================
// Convenience Functions
// =================================

function getPageFactory() {
  return pageFactory;
}

// Auth Pages
function loginPage() {
  return pageFactory.loginPage;
}

function registerPage() {
  return pageFactory.registerPage;
}

// E-Commerce Pages
function productsPage() {
  return pageFactory.productsPage;
}

function productDetailPage(productSlug) {
  return pageFactory.getProductDetailPage(productSlug);
}

function cartPage() {
  return pageFactory.cartPage;
}

function checkoutPage() {
  return pageFactory.checkoutPage;
}

function ordersPage() {
  return pageFactory.ordersPage;
}

function orderDetailPage(orderId) {
  return pageFactory.getOrderDetailPage(orderId);
}

// User Pages
function dashboardPage() {
  return pageFactory.dashboardPage;
}

function profilePage() {
  return pageFactory.profilePage;
}

// Admin Pages
function adminProductsPage() {
  return pageFactory.adminProductsPage;
}

function adminOrdersPage() {
  return pageFactory.adminOrdersPage;
}

function adminUsersPage() {
  return pageFactory.adminUsersPage;
}

// Components
function header(selector) {
  return pageFactory.getHeader(selector);
}

function modal(selector) {
  return pageFactory.getModal(selector);
}

function table(selector) {
  return pageFactory.getTable(selector);
}

// =================================
// Exports
// =================================

export {
  // Factory
  PageFactory,
  pageFactory,
  getPageFactory,

  // Base Classes
  BasePage,
  BaseComponent,

  // Auth Pages
  LoginPage,
  RegisterPage,
  loginPage,
  registerPage,

  // E-Commerce Pages
  ProductsPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  OrdersPage,
  OrderDetailPage,
  productsPage,
  productDetailPage,
  cartPage,
  checkoutPage,
  ordersPage,
  orderDetailPage,

  // User Pages
  DashboardPage,
  ProfilePage,
  dashboardPage,
  profilePage,

  // Admin Pages
  AdminProductsPage,
  AdminOrdersPage,
  AdminUsersPage,
  adminProductsPage,
  adminOrdersPage,
  adminUsersPage,

  // Components
  HeaderComponent,
  ModalComponent,
  TableComponent,
  ProductCardComponent,
  CartDrawerComponent,
  PaginationComponent,
  header,
  modal,
  table,
};
