
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserProfile } from '../types';
import Logo from './Logo';

interface NavbarProps {
  user: UserProfile | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onPricingClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogout, onPricingClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // If on home, allow the yellow background to shine through.
  // Otherwise white.
  const bgClass = isHome ? 'bg-[#FFD100]' : 'bg-white border-b border-gray-100';

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 ${bgClass} px-6 py-4`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side: Logo & Brand */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="w-10 h-10" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">MyBrainCraft</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 font-medium text-gray-800">
            <Link to="/tests" className="hover:opacity-70 transition-opacity">Tests</Link>
            <Link to="/wellness" className="hover:opacity-70 transition-opacity">Wellness</Link>
            <Link to="/dashboard" className="hover:opacity-70 transition-opacity">Dashboard</Link>
            <Link to="/business" className="hover:opacity-70 transition-opacity">For Business</Link>
            <Link to="/blog" className="hover:opacity-70 transition-opacity">The Science</Link>
          </div>
        </div>

        {/* Right Side: Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4 text-sm font-medium">
               <span>Hi, {user.name}</span>
               <button onClick={onLogout} className="hover:underline text-gray-600">Log out</button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="text-sm font-bold text-gray-900 hover:opacity-70"
            >
              Sign In
            </button>
          )}
          
          <button 
            onClick={onPricingClick}
            className="bg-[#0055FF] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            Get a demo
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="lg:hidden p-2 text-gray-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
             <span className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
             <span className={`block w-6 h-0.5 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
             <span className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl lg:hidden flex flex-col animate-in slide-in-from-top-2 duration-200">
           <div className="flex flex-col p-6 space-y-6 font-medium text-lg text-gray-900">
              <Link to="/tests" className="py-2 border-b border-gray-100">Tests</Link>
              <Link to="/wellness" className="py-2 border-b border-gray-100">Wellness Hub</Link>
              <Link to="/dashboard" className="py-2 border-b border-gray-100">Dashboard</Link>
              <Link to="/business" className="py-2 border-b border-gray-100">For Business</Link>
              <Link to="/blog" className="py-2 border-b border-gray-100">The Science</Link>
              
              <div className="pt-4 flex flex-col gap-4">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500">Signed in as {user.name}</span>
                    <button onClick={onLogout} className="text-left font-bold text-red-500">Log out</button>
                  </div>
                ) : (
                  <button onClick={() => { setIsMobileMenuOpen(false); onLoginClick(); }} className="text-left font-bold">Sign In</button>
                )}
                
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); onPricingClick(); }}
                  className="bg-[#0055FF] text-white w-full py-4 rounded-full font-bold shadow-lg"
                >
                  Get a demo
                </button>
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
