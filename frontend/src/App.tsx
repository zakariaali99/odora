import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';

// Layout & Common Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import CartDrawer from './components/common/CartDrawer';
import AdminLayout from './components/admin/AdminLayout';
import ErrorBoundary from './components/common/ErrorBoundary';

// Storefront Pages
import HomePage from './pages/store/HomePage';
import ShopPage from './pages/store/ShopPage';
import ProductDetailPage from './pages/store/ProductDetailPage';
import CartPage from './pages/store/CartPage';
import CheckoutPage from './pages/store/CheckoutPage';
import OrderConfirmationPage from './pages/store/OrderConfirmationPage';
import OrderTrackingPage from './pages/store/OrderTrackingPage';
import SearchPage from './pages/store/SearchPage';
import NotFoundPage from './pages/store/NotFoundPage';

// Account Pages
import LoginPage from './pages/account/LoginPage';
import RegisterPage from './pages/account/RegisterPage';
import ForgotPasswordPage from './pages/account/ForgotPasswordPage';
import AccountDashboardPage from './pages/account/AccountDashboardPage';
import MyOrdersPage from './pages/account/MyOrdersPage';
import AddressesPage from './pages/account/AddressesPage';
import ProfileSettingsPage from './pages/account/ProfileSettingsPage';

// Content Pages
import AboutPage from './pages/content/AboutPage';
import TechnologyPage from './pages/content/TechnologyPage';
import FragranceLibraryPage from './pages/content/FragranceLibraryPage';
import ContactPage from './pages/content/ContactPage';
import FaqPage from './pages/content/FaqPage';
import LegalPage from './pages/content/LegalPage';

// Admin Pages
import DashboardOverviewPage from './pages/admin/DashboardOverviewPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminCmsPage from './pages/admin/AdminCmsPage';

// Scroll Restoration
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export const App: React.FC = () => {
  const { i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const isRtl = language === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const { fetchCart } = useCartStore();
  const { fetchProfile, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Initialize Language, Direction & Cart on Mount
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    fetchCart();
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [language, dir, isAuthenticated, fetchCart, fetchProfile]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div 
      className={`min-h-screen flex flex-col bg-brand-cream text-brand-ink selection:bg-brand-sage selection:text-white ${
        isRtl ? 'font-arabic' : 'font-sans'
      }`}
      dir={dir}
    >
      <ScrollToTop />
      
      {/* Show Standard Navbar and Cart Drawer only on non-admin routes */}
      {!isAdminRoute && (
        <>
          <Navbar />
          <CartDrawer />
        </>
      )}

      {/* Main Content Area protected by ErrorBoundary */}
      <main className="flex-1">
        <ErrorBoundary>
          <Routes>
            {/* Storefront Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/products" element={<ShopPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
            <Route path="/order-tracking" element={<OrderTrackingPage />} />
            <Route path="/track" element={<OrderTrackingPage />} />
            <Route path="/track/:orderNumber" element={<OrderTrackingPage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Account Portal Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/account" element={<AccountDashboardPage />} />
            <Route path="/account/orders" element={<MyOrdersPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/account/addresses" element={<AddressesPage />} />
            <Route path="/account/profile" element={<ProfileSettingsPage />} />

            {/* Content & Trust Routes */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/technology" element={<TechnologyPage />} />
            <Route path="/fragrances" element={<FragranceLibraryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/faqs" element={<FaqPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />

            {/* Admin Management Routes (Protected by AdminLayout) */}
            <Route path="/admin" element={<AdminLayout><DashboardOverviewPage /></AdminLayout>} />
            <Route path="/admin/dashboard" element={<AdminLayout><DashboardOverviewPage /></AdminLayout>} />
            <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
            <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
            <Route path="/admin/customers" element={<AdminLayout><AdminCustomersPage /></AdminLayout>} />
            <Route path="/admin/cms" element={<AdminLayout><AdminCmsPage /></AdminLayout>} />

            {/* 404 System Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* Show Standard Footer only on non-admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
