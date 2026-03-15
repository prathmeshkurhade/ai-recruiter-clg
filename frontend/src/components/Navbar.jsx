import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // If we are on the dashboard or internal pages, we might want to just show a simpler navbar
  // but user requested "navbar ... should be in each routing page" so we'll show a unified one.

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-primeBlue text-white p-2 rounded-lg">
          <Award className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">AI Recruiter</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
        <Link to="/platform" className="hover:text-primeBlue transition-colors">PLATFORM</Link>
        <Link to="/solutions" className="hover:text-primeBlue transition-colors">SOLUTIONS</Link>
        <a href="/#features" className="hover:text-primeBlue transition-colors">RESUME PARSER</a>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-primeBlue font-semibold hover:text-blue-700 transition">
              Dashboard
            </Link>
            <button 
              onClick={logout} 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-full font-semibold transition-all shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-primeBlue font-semibold hover:text-blue-700 transition">
              Log In
            </Link>
            <Link to="/login" className="bg-primeBlue hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}