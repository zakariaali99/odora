import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, Globe, Shield, Store } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';

export const Navbar = () => {
  const navigate = useNavigate();
  const { cart, openCart } = useCartStore();
  const { user, isAuthenticated, isStaff, logout } = useAuthStore();
  const { language, toggleLanguage, t } = useLanguageStore();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-cream/90 backdrop-blur-md border-b border-stone-200/60 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <img
              src="/odora-logo.png"
              alt="odora"
              className="h-6 sm:h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="hidden md:inline-block text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-brand-muted font-poppins border-r border-stone-300 pr-3 mr-2">
              SCENT OF ATMOSPHERE
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[14px] lg:text-[15px] font-medium text-brand-ink">
            <Link to="/products" className="hover:text-brand-sage transition-colors">
              {t('nav.shop')}
            </Link>
            <Link to="/fragrances" className="hover:text-brand-sage transition-colors">
              {t('nav.fragrances')}
            </Link>
            <Link to="/technology" className="hover:text-brand-sage transition-colors">
              {t('nav.technology')}
            </Link>
            <Link to="/about" className="hover:text-brand-sage transition-colors">
              {t('nav.about')}
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
            
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 sm:p-2 text-brand-ink hover:text-brand-sage transition-colors rounded-lg"
              title={t('nav.search')}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium border border-stone-300 hover:border-brand-sage transition-all text-brand-ink"
              title="تغيير اللغة / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-sage shrink-0" />
              <span className="hidden sm:inline">{language === 'ar' ? 'English' : 'عربي'}</span>
              <span className="sm:hidden font-mono uppercase text-[10px]">{language === 'ar' ? 'EN' : 'ع'}</span>
            </button>

            {/* User Account / Admin Badge */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full hover:bg-stone-200/50 transition-colors text-brand-ink"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-sage text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-1.5 sm:p-2 text-brand-ink hover:text-brand-sage transition-colors"
                  title={t('nav.login')}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* User Dropdown */}
              {userDropdownOpen && isAuthenticated && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="font-semibold text-brand-ink">{user?.first_name || user?.email}</p>
                    <p className="text-xs text-brand-muted truncate">{user?.email}</p>
                  </div>

                  {isStaff && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-brand-sage font-semibold bg-brand-pale/20 hover:bg-brand-pale/40 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span>لوحة التحكم الإدارية</span>
                    </Link>
                  )}

                  <Link
                    to="/account/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-brand-ink hover:bg-stone-50 transition-colors text-xs"
                  >
                    طلباتي ومشترياتي
                  </Link>
                  <Link
                    to="/account/addresses"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-brand-ink hover:bg-stone-50 transition-colors text-xs"
                  >
                    عناوين التوصيل
                  </Link>
                  <Link
                    to="/account/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-brand-ink hover:bg-stone-50 transition-colors text-xs"
                  >
                    الملف الشخصي
                  </Link>
                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-xs"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-1.5 sm:p-2 text-brand-ink hover:text-brand-sage transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.total_items > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-brand-dark text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {cart.total_items}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-brand-ink hover:bg-stone-200/50 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="bg-white border-t border-b border-stone-200/80 px-4 py-3 animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-brand-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن أجهزة التعطير، الزيوت، الموديلات (مثل A316)..."
                className="w-full bg-transparent border-none text-sm sm:text-base text-brand-ink placeholder-brand-muted focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full bg-brand-sage text-white text-xs sm:text-sm font-medium hover:bg-brand-olive transition-colors shrink-0"
              >
                بحث
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
          <div className="md:hidden bg-brand-cream border-t border-stone-200 px-5 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <nav className="space-y-3">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-brand-ink hover:text-brand-sage py-1"
              >
                {t('nav.shop')}
              </Link>
              <Link
                to="/fragrances"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-brand-ink hover:text-brand-sage py-1"
              >
                {t('nav.fragrances')}
              </Link>
              <Link
                to="/technology"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-brand-ink hover:text-brand-sage py-1"
              >
                {t('nav.technology')}
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-brand-ink hover:text-brand-sage py-1"
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-brand-ink hover:text-brand-sage py-1"
              >
                {t('nav.contact')}
              </Link>
            </nav>

            <div className="pt-3 border-t border-stone-200/80 space-y-2">
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-bold text-brand-olive bg-brand-pale/50 px-3 py-2 rounded-xl"
              >
                <Shield className="w-4 h-4" />
                <span>لوحة التحكم الإدارية (Admin Dashboard)</span>
              </Link>

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center w-full py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold"
                >
                  تسجيل الدخول / إنشاء حساب
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center py-2 text-xs text-red-600 bg-red-50 rounded-xl font-medium"
                >
                  تسجيل الخروج
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
