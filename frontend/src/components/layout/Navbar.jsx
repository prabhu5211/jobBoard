import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Briefcase, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, isCandidate, isRecruiter, logout } = useAuth();

  const dashboardPath = isCandidate
    ? '/dashboard/candidate'
    : isRecruiter
    ? '/dashboard/recruiter'
    : '/dashboard/recruiter';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Find Jobs' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <Briefcase className="w-6 h-6" />
            <span>JobBoard</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  {user?.name}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              {label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700">
                Dashboard
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block text-sm text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-sm text-primary-600 font-medium">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
