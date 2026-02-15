/**
 * 🎨 Enhanced Header Component - Professional Design
 */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.me()
        .then((res) => {
          // Handle both response formats
          const userData = res.data?.data || res.data;
          if (userData) {
            setUser(userData);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
    }
  }, []);

  const handleLogout = () => {
    authApi.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsProfileOpen(false);
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/genome-browser', label: 'Genome', icon: '🧬' },
    { href: '/datasets', label: 'Data', icon: '📊' },
    { href: '/tools/blast', label: 'BLAST', icon: '🔬' },
    { href: '/pedigree', label: 'Pedigree', icon: '🌳' },
    { href: '/export', label: 'Export', icon: '📤' },
    { href: '/stats', label: 'Stats', icon: '📈' },
    { href: '/help', label: 'Help', icon: '❓' },
    { href: '/api-docs', label: 'API', icon: '📚' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                🐼
              </span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 group-hover:w-full" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-neutral-900 tracking-tight">
                Panda Portal
              </span>
              <p className="text-xs text-neutral-500 -mt-1">Genomic Research Center</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  router.pathname === link.href
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-200 ${
                    isProfileOpen ? 'bg-primary-50' : 'hover:bg-neutral-100'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold shadow-md">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block font-medium text-neutral-700">
                    {user.username}
                  </span>
                  <svg
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 animate-scale-in origin-top-right">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="font-semibold text-neutral-900">{user.username}</p>
                      <p className="text-sm text-neutral-500">{user.email}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full capitalize">
                        {user.role || 'User'}
                      </span>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                      >
                        <span>👤</span>
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                      >
                        <span>📊</span>
                        <span>Dashboard</span>
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                        >
                          <span>⚙️</span>
                          <span>Admin</span>
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-neutral-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-100 animate-fade-in">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    router.pathname === link.href
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
