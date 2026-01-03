
import React, { useState } from 'react';
import Logo from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-8 sm:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-black mb-2">
            <span className="text-gray-900">{isRegistering ? 'Join ' : 'Welcome to '}</span>
            <span className="text-gray-900">MyBrain</span>
            <span className="text-[#0055FF]">Craft</span>
          </h2>
          <p className="text-gray-400 font-medium">Your psychological profile awaits.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(email); }} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Work Email</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@visionary.com"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#0055FF] transition-all font-medium"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#0055FF] transition-all font-medium"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-[#0055FF] text-white rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            {isRegistering ? 'Start My Journey' : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 text-center text-sm">
          <span className="text-gray-400 font-medium">
            {isRegistering ? 'Existing member?' : "New to the platform?"}
          </span>{' '}
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[#0055FF] font-black hover:underline"
          >
            {isRegistering ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-300 leading-relaxed font-bold uppercase tracking-tight">
            Encrypted & HIPAA Compliant Data Standards
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
