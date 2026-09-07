import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: (active: boolean) => (
    <svg className={`w-5 h-5 ${active ? 'text-violet-600' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )},
  { to: '/tasks', label: 'Tasks', icon: (active: boolean) => (
    <svg className={`w-5 h-5 ${active ? 'text-violet-600' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )},
];

export const MainLayout = ({ children, fullWidth }: MainLayoutProps) => {
  const { logout, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Top Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30">
                <span className="text-white text-sm font-black">T</span>
              </div>
              <span className="font-black text-lg bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
                TaskHub
              </span>
            </Link>

            {/* Center nav — desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive(item.to)
                      ? 'text-violet-700 bg-violet-50'
                      : 'text-gray-600 hover:text-violet-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="px-4 py-2 rounded-lg text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-all">
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Right actions (Desktop) */}
            <div className="hidden md:flex items-center gap-2.5">
              {isAdmin ? (
                <>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700">
                    👑 Admin
                  </span>
                  <button
                    onClick={logout}
                    className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/admin/login" className="text-xs text-gray-500 hover:text-violet-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-violet-50">
                  Admin Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -mr-2 text-gray-600 hover:text-violet-600 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute top-full left-0 right-0 z-40">
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive(item.to)
                      ? 'text-violet-700 bg-violet-50'
                      : 'text-gray-600 hover:text-violet-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon(isActive(item.to))}
                    {item.label}
                  </div>
                </Link>
              ))}
              
              <div className="pt-4 mt-2 border-t border-gray-100">
                {isAdmin ? (
                  <div className="flex flex-col gap-2">
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-bold text-orange-700 bg-orange-50 border border-orange-100">
                      👑 Admin Panel
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full px-4 py-3 text-center text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 text-center rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors">
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className={`flex-1 ${fullWidth ? '' : 'max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-24'}`}>
        {children}
      </main>
    </div>
  );
};
