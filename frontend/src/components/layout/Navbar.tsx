import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, Globe, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { cart, openCart } = useCartStore();
  const { user, isAuthenticated, isStaff, logout } = useAuthStore();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const toggleLanguage = () => {
    const next = language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  };
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-canvas/95 backdrop-blur-md transition-colors duration-300">
        <div className="editorial-container h-[72px] sm:h-24 flex items-center justify-between border-b border-brand-ink/10">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <img
              src="/odora-logo.png"
              alt="odora"
              className="h-6 sm:h-8 w-auto object-contain transition-opacity duration-300 group-hover:opacity-75"
            />
            <span className="hidden lg:inline-block text-[9px] tracking-[0.22em] uppercase text-brand-muted font-poppins border-s border-brand-ink/15 ps-4 ms-2">
              {t('common.taglineEn', 'SCENT OF ATMOSPHERE')}
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-9 text-[13px] lg:text-[14px] font-normal text-brand-ink">
            <Link to="/products" className="hover:text-brand-sage transition-colors">
              {t('nav.shop', 'المتجر')}
            </Link>
            <Link to="/fragrances" className="hover:text-brand-sage transition-colors">
              {t('nav.fragrances', 'مكتبة الروائح')}
            </Link>
            <Link to="/technology" className="hover:text-brand-sage transition-colors">
              {t('nav.technology', 'التقنية الهندسية')}
            </Link>
            <Link to="/about" className="hover:text-brand-sage transition-colors">
              {t('nav.about', 'عن أودورا')}
            </Link>
            <Link to="/contact" className="hover:text-brand-sage transition-colors">
              {t('nav.contact', 'تواصل معنا')}
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-brand-ink hover:text-brand-olive transition-colors rounded-full"
              title={t('common.search', 'بحث')}
              aria-label={t('common.search', 'بحث')}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2 py-2 text-[11px] font-medium text-brand-muted hover:text-brand-ink transition-colors"
              title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{language === 'ar' ? 'English' : 'عربي'}</span>
              <span className="sm:hidden font-mono uppercase text-[10px]">{language === 'ar' ? 'EN' : 'ع'}</span>
            </button>

            {/* User Account / Admin Badge */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full hover:bg-stone-100 transition-colors text-brand-ink"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-sage text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-brand-ink hover:text-brand-olive transition-colors rounded-full"
                  title={t('nav.login', 'تسجيل الدخول')}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* User Dropdown */}
              {userDropdownOpen && isAuthenticated && (
                <div className="absolute end-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="font-semibold text-brand-ink">{user?.first_name || user?.email}</p>
                    <p className="text-xs text-brand-muted truncate">{user?.email}</p>
                  </div>

                  {isStaff && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-brand-sage font-semibold bg-brand-pale/40 hover:bg-brand-pale/70 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span>{t('nav.adminDashboard', 'لوحة التحكم الإدارية')}</span>
                    </Link>
                  )}

                  <Link
                    to="/account/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-brand-ink hover:bg-stone-50 transition-colors text-xs"
                  >
                    {language === 'ar' ? 'طلباتي ومشترياتي' : 'My Orders'}
                  </Link>
                  <Link
                    to="/account/addresses"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-brand-ink hover:bg-stone-50 transition-colors text-xs"
                  >
                    {language === 'ar' ? 'عناوين التوصيل' : 'Delivery Addresses'}
                  </Link>
                  <Link
                    to="/account/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-brand-ink hover:bg-stone-50 transition-colors text-xs"
                  >
                    {language === 'ar' ? 'الملف الشخصي' : 'Profile Settings'}
                  </Link>
                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-start px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-xs font-medium"
                    >
                      {t('nav.logout', 'تسجيل الخروج')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-brand-ink hover:text-brand-olive transition-colors rounded-full"
              aria-label={t('nav.cart', 'سلة المشتريات')}
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.total_items > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-dark text-brand-surface text-[9px] font-medium flex items-center justify-center">
                  {cart.total_items}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-brand-ink hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="bg-brand-surface border-b border-brand-ink/10 px-4 py-4 animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-brand-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search', 'ابحث عن أجهزة التعطير، الزيوت، الموديلات...')}
                className="w-full bg-transparent border-none text-sm sm:text-base text-brand-ink placeholder-brand-muted focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-brand-dark text-brand-surface text-xs sm:text-sm font-medium hover:bg-brand-olive transition-colors shrink-0"
              >
                {t('common.search', 'بحث')}
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-brand-muted hover:text-brand-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-brand-surface border-b border-brand-ink/10 px-6 py-6 space-y-5 shadow-soft-card animate-in slide-in-from-top-2 duration-200">
            <nav className="space-y-3">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-brand-ink hover:text-brand-sage py-1"
              >
                {t('nav.shop', 'المتجر')}
              </Link>
              <Link
                to="/fragrances"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-brand-ink hover:text-brand-sage py-1"
              >
                {t('nav.fragrances', 'مكتبة الروائح')}
              </Link>
              <Link
                to="/technology"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-brand-ink hover:text-brand-sage py-1"
              >
                {t('nav.technology', 'التقنية الهندسية')}
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-brand-ink hover:text-brand-sage py-1"
              >
                {t('nav.about', 'عن أودورا')}
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-brand-ink hover:text-brand-sage py-1"
              >
                {t('nav.contact', 'تواصل معنا')}
              </Link>
            </nav>

            <div className="pt-3 border-t border-stone-200 space-y-2">
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-bold text-brand-olive bg-brand-pale/50 px-3 py-2 rounded-xl"
              >
                <Shield className="w-4 h-4" />
                <span>{t('nav.adminDashboard', 'لوحة التحكم الإدارية')}</span>
              </Link>

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center w-full py-2.5 bg-brand-ink text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
                >
                  {language === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Login / Register'}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center py-2 text-xs text-red-600 bg-red-50 rounded-xl font-medium"
                >
                  {t('nav.logout', 'تسجيل الخروج')}
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
