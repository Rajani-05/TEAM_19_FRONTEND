import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogoWithText, LogoIcon } from '../common/Logo';
import { 
  Calendar, Users, Building, PlusCircle, CreditCard, 
  User, Shield, LogOut, Menu, X, Sun, Moon, Phone
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'PLANNER':
        return [
          { name: 'Dashboard', path: '/planner/dashboard', icon: Calendar },
          { name: 'Vendor Directory', path: '/planner/vendors', icon: Building },
          { name: 'Create Event', path: '/planner/create-event', icon: PlusCircle },
          { name: 'Payment History', path: '/planner/payments', icon: CreditCard },
        ];
      case 'VENDOR':
        return [
          { name: 'Dashboard', path: '/vendor/dashboard', icon: Calendar },
          { name: 'Edit Profile', path: '/vendor/profile', icon: User },
          { name: 'Vendor Payments', path: '/vendor/payments', icon: CreditCard },
        ];
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: Shield },
          { name: 'User Management', path: '/admin/users', icon: Users },
          { name: 'Vendor Moderation', path: '/admin/vendors', icon: Building },
        ];
      case 'CLIENT':
        return [
          { name: 'My Bookings', path: '/client/dashboard', icon: Calendar },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] flex flex-col md:flex-row event-bg-atmosphere transition-colors duration-300">
      {/* Mobile Top Bar */}
      <div className="bg-slate-900 text-white p-4 flex md:hidden items-center justify-between shadow-md border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <LogoIcon className="w-6 h-6" />
          <span className="font-bold tracking-tight text-white">EventPro</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 backdrop-blur-xl text-slate-300 flex flex-col justify-between border-r border-slate-800/80 transition-transform md:translate-x-0 md:static
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <LogoIcon className="w-8 h-8" />
              <div>
                <span className="font-bold text-white text-lg tracking-tight block">EventPro</span>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Event Hub</span>
              </div>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-emerald-600 to-pink-600 text-white shadow-md' 
                      : 'hover:bg-slate-800/70 text-slate-400 hover:text-slate-100'}
                  `}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer Card - Combines Profile, Theme Toggle & Sign Out in One Single Box */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm border border-emerald-400/30 shrink-0">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate" title={user?.name}>{user?.name || 'User'}</p>
                  <span className="text-[9px] uppercase font-black tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-800/30 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {user?.role}
                  </span>
                </div>
              </div>
              
              {/* Quick Actions Panel inside the Card */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 hover:bg-slate-750 rounded-lg text-slate-400 hover:text-white transition-all"
                  title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-slate-750 rounded-lg text-rose-400 hover:text-rose-300 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Extended user metadata */}
            {(user?.phoneNo || user?.gender) && (
              <div className="border-t border-slate-700/40 pt-2 flex flex-col gap-1 text-[10px] text-slate-400">
                {user.phoneNo && (
                  <p className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3 h-3 text-emerald-400 shrink-0" /> 
                    <span>{user.phoneNo}</span>
                  </p>
                )}
                {user.gender && (
                  <p className="flex items-center gap-1.5 capitalize">
                    <User className="w-3 h-3 text-pink-400 shrink-0" /> 
                    <span>{user.gender}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header - No theme button (moved to Sidebar Footer card) */}
        <header className="hidden md:flex bg-[var(--bg-surface-glass)] backdrop-blur-md h-16 border-b border-[var(--border-color)] px-8 items-center justify-between sticky top-0 z-30 transition-colors duration-300">
          <h1 className="text-lg font-bold text-[var(--text-main)]">
            {navLinks.find(l => location.pathname.startsWith(l.path))?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-[var(--text-muted)] font-semibold block uppercase tracking-wider">{user?.role} WORKSPACE</span>
              <span className="text-sm font-bold text-[var(--text-main)]">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
