import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, Users, Building, PlusCircle, CreditCard, 
  MessageSquare, User, Shield, LogOut, Menu, X, ArrowLeftRight
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine navigation items based on user role
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
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="bg-slate-900 text-white p-4 flex md:hidden items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-violet-400" />
          <span className="font-bold tracking-tight">EventPro</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform md:translate-x-0 md:static
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">EventPro</span>
            </div>
            {/* Close button for mobile menu */}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 hover:bg-slate-800 rounded-lg text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                    ${isActive 
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-800/10' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile footer & Log out */}
        <div className="p-4 border-t border-slate-850 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-350 font-bold border border-slate-700 uppercase">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400 bg-violet-950/50 border border-violet-800/30 px-2 py-0.5 rounded-full inline-block mt-0.5">
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl text-sm font-semibold transition-all"
          >
            <LogOut className="w-5 h-5 text-slate-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Navbar */}
        <header className="hidden md:flex bg-white h-16 border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-30 shadow-sm shadow-slate-100/50">
          <h1 className="text-lg font-bold text-slate-800">
            {navLinks.find(l => location.pathname.startsWith(l.path))?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">{user?.role} Workspace</span>
              <span className="text-sm text-slate-700 font-bold">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* Page content wrapper */}
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
