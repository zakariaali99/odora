import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  ArrowRight,
  LogOut,
  Store,
  Menu,
  X,
  Shield,
  Lock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const { isStaff, isAuthenticated, user, logout, login } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [demoLoggingIn, setDemoLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navItems = [
    { label: 'نظرة عامة والتحليلات', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'إدارة المنتجات والمخزون', path: '/admin/products', icon: Package },
    { label: 'الطلبات والمبيعات', path: '/admin/orders', icon: ShoppingCart },
    { label: 'إدارة علاقات العملاء (CRM)', path: '/admin/customers', icon: Users },
    { label: 'المحتوى والبانرات (CMS)', path: '/admin/cms', icon: ImageIcon },
  ];

  // Quick 1-Click Demo Login Handler for testing/evaluation
  const handleQuickDemoLogin = async () => {
    setDemoLoggingIn(true);
    setLoginError('');
    try {
      const res = await login('admin@odora.ly', 'odora2026!');
      if (!res.success) {
        setLoginError(res.error || 'فشل تسجيل الدخول كمدير');
      }
    } catch (err) {
      setLoginError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setDemoLoggingIn(false);
    }
  };

  // If not authenticated or not staff, show the Admin Gate Card
  if (!isAuthenticated || !isStaff) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-slate-800 font-tajawal" dir="rtl">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-pale text-brand-olive flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
              منطقة المشرفين والإدارة
            </span>
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              لوحة التحكم الإدارية — Odora
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              هذه الصفحة مخصصة لمدراء النظام. يرجى تسجيل الدخول بحساب المشرف للمتابعة.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              {loginError}
            </div>
          )}

          <div className="space-y-3 pt-2">
            {/* Quick 1-Click Login Button */}
            <button
              onClick={handleQuickDemoLogin}
              disabled={demoLoggingIn}
              className="w-full py-3 px-4 bg-brand-sage hover:bg-brand-olive text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-pale" />
              <span>{demoLoggingIn ? 'جاري فتح لوحة التحكم...' : 'دخول سريع بحساب المدير (admin@odora.ly)'}</span>
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-2">
              <Link to="/login" className="hover:text-brand-olive font-medium">
                تسجيل الدخول بحساب آخر ←
              </Link>
              <Link to="/" className="hover:text-slate-700">
                العودة إلى المتجر
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-tajawal relative overflow-x-hidden" dir="rtl">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar (Desktop Permanent + Mobile Slide-Out Drawer) */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-slate-200 flex flex-col justify-between shadow-xl lg:shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Close Button on Mobile */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileSidebarOpen(false)}>
              <img src="/odora-logo.png" alt="odora" className="h-6 w-auto" />
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-pale text-brand-olive uppercase tracking-wider">
                الإدارة
              </span>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-brand-sage text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-brand-sage" />
              <span>العودة للمتجر</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        
        {/* Top bar (Responsive on Mobile & Desktop) */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-sm sm:text-base font-bold text-slate-800 truncate">
              لوحة التحكم الإدارية
            </h1>
            <span className="hidden sm:inline-block text-xs text-slate-300">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              متصل (Live API)
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-left text-xs hidden sm:block">
              <p className="font-semibold text-slate-800 truncate max-w-[140px]">{user?.first_name || user?.email}</p>
              <p className="text-slate-400 text-[10px]">مدير النظام (Admin)</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-sage text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-full">
          {children || <Outlet />}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
