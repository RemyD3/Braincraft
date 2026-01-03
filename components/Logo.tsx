
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <div className={`${className} flex items-center justify-center`}>
    {/* Organic Orange Circle Logo */}
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#FF6D00" />
      <path d="M50 25C63.8071 25 75 36.1929 75 50" stroke="white" strokeWidth="8" strokeLinecap="round" />
    </svg>
  </div>
);

export default Logo;
