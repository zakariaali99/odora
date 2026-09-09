import React, { useEffect, Suspense, lazy } from 'react';
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

// Critical Storefront (Instant LCP)
import HomePage from './pages/store/HomePage';

// Lazy Loaded Storefront Pages
const ShopPage = lazy(() => import('./pages/store/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/store/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/store/CartPage'));
const CheckoutPage = lazy(() => import('./pages/store/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/store/OrderConfirmationPage'));
const OrderTrackingPage = lazy(() => import('./pages/store/OrderTrackingPage'));
const SearchPage = lazy(() => import('./pages/store/SearchPage'));
const NotFoundPage = lazy(() => import('./pages/store/NotFoundPage'));

// Lazy Loaded Account Pages
const LoginPage = lazy(() => import('./pages/account/LoginPage'));
const RegisterPage = lazy(() => import('./pages/account/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/account/ForgotPasswordPage'));
const AccountDashboardPage = lazy(() => import('./pages/account/AccountDashboardPage'));
const MyOrdersPage = lazy(() => import('./pages/account/MyOrdersPage'));
const AddressesPage = lazy(() => import('./pages/account/AddressesPage'));
const ProfileSettingsPage = lazy(() => import('./pages/account/ProfileSettingsPage'));

// Lazy Loaded Content Pages
const AboutPage = lazy(() => import('./pages/content/AboutPage'));
const TechnologyPage = lazy(() => import('./pages/content/TechnologyPage'));
const FragranceLibraryPage = lazy(() => import('./pages/content/FragranceLibraryPage'));
const ContactPage = lazy(() => import('./pages/content/ContactPage'));
const FaqPage = lazy(() => import('./pages/content/FaqPage'));
const LegalPage = lazy(() => import('./pages/content/LegalPage'));

// Lazy Loaded Admin Pages
const DashboardOverviewPage = lazy(() => import('./pages/admin/DashboardOverviewPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminCmsPage = lazy(() => import('./pages/admin/AdminCmsPage'));

// Accessible, branded page loading fallback
const PageLoadingFallback: React.FC = () => (
  <div 
    className="min-h-[50vh] flex flex-col items-center justify-center py-24"
    role="status"
    aria-live="polite"
    aria-label="Loading"
  >
    <div className="relative w-12 h-12 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-brand-sage/20 border-t-brand-sage animate-spin" />
    </div>
    <span className="sr-only">جاري تحميل الصفحة...</span>
  </div>
);

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

      {/* Main Content Area protected by ErrorBoundary & Suspense */}
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoadingFallback />}>
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
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Show Standard Footer only on non-admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
