import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'motion/react';
import {
  Aperture,
  LayoutDashboard,
  LogOut,
  Loader2,
  FolderPlus,
  ArrowLeft,
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const navItems = [
    {
      to: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Galeries',
    },
    {
      to: '/admin/gallery/new',
      icon: FolderPlus,
      label: 'Nouvelle galerie',
    },
  ];

  return (
    <div className="min-h-screen bg-background-dark text-white">
      {/* Top Bar */}
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 text-white hover:text-primary transition-colors"
            >
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <Aperture className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-sm tracking-widest uppercase hidden md:block">
                Admin
              </span>
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon size={14} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: User + Logout */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs font-bold transition-colors"
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">Voir le site</span>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <span className="text-white/40 text-xs hidden md:block">
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors text-xs font-bold cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Quitter</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
