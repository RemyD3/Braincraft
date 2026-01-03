
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { UserProfile, UserTestResult } from './types';
import { ALL_TESTS, PRICING_PLANS } from './constants';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import TestCatalog from './components/TestCatalog';
import Questionnaire from './components/Questionnaire';
import Dashboard from './components/Dashboard';
import ReportView from './components/ReportView';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import WellnessHub from './components/WellnessHub';
import BusinessHub from './components/BusinessHub'; // Updated Import
import PricingModal from './components/PricingModal';
import AuthModal from './components/AuthModal';
import Logo from './components/Logo';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('braincraft_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.lastDailyTestDate) {
        const lastDate = new Date(parsed.lastDailyTestDate);
        const today = new Date();
        const diffHours = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
        if (diffHours > 48) parsed.streak = 0;
      }
      setUser(parsed);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('braincraft_user', JSON.stringify(user));
  }, [user]);

  const handleLogin = (email: string) => {
    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      completedTests: [],
      unlockedTests: [],
      credits: 0,
      isSubscribed: false,
      history: [],
      streak: 0,
      dailyHistory: []
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('braincraft_user');
  };

  const completeDailyPulse = (vibeScore: number) => {
    if (!user) return;
    const today = new Date().toISOString();
    setUser(prev => {
      if (!prev) return prev;
      const newStreak = prev.streak + 1;
      let newCredits = prev.credits;
      if (newStreak === 30) newCredits += 1;
      return {
        ...prev,
        streak: newStreak,
        lastDailyTestDate: today,
        credits: newCredits,
        dailyHistory: [...prev.dailyHistory, { date: today, score: vibeScore }].slice(-14)
      };
    });
  };

  const handlePurchase = (planId: string) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    setUser(prev => {
      if (!prev) return prev;
      let newCredits = prev.credits;
      let isSubscribed = prev.isSubscribed;
      if (planId === 'single') newCredits += 1;
      else if (planId === 'bundle5') newCredits += 5;
      else if (planId === 'bundle10') newCredits += 10;
      else if (planId === 'all_access') isSubscribed = true;
      return { ...prev, credits: newCredits, isSubscribed };
    });
    setIsPricingModalOpen(false);
  };

  const saveTestResult = (result: UserTestResult) => {
    setUser(prev => {
      if (!prev) return prev;
      const test = ALL_TESTS.find(t => t.id === result.testId);
      let newCredits = prev.credits;
      if (test?.isPremium && !prev.completedTests.includes(result.testId) && !prev.isSubscribed) {
        newCredits = Math.max(0, prev.credits - 1);
      }
      return {
        ...prev,
        completedTests: [...new Set([...prev.completedTests, result.testId])],
        history: [result, ...prev.history],
        credits: newCredits
      };
    });
  };

  if (isLoading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#FFD100] text-gray-900 font-bold">
      <div className="text-4xl tracking-tight mb-4 font-black">MyBrainCraft</div>
      <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
        <Navbar user={user} onLoginClick={() => setIsAuthModalOpen(true)} onLogout={handleLogout} onPricingClick={() => setIsPricingModalOpen(true)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tests" element={<TestCatalog user={user} onUnlock={() => setIsPricingModalOpen(true)} />} />
            <Route path="/test/:id" element={<Questionnaire user={user} onComplete={saveTestResult} onAuthRequired={() => setIsAuthModalOpen(true)} />} />
            <Route path="/dashboard" element={<Dashboard user={user} onAuthRequired={() => setIsAuthModalOpen(true)} onDailyComplete={completeDailyPulse} />} />
            <Route path="/business" element={<BusinessHub />} />
            <Route path="/report/:testId/:date" element={<ReportView user={user} />} />
            <Route path="/wellness" element={<WellnessHub />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        
        {/* Footer redesigned to match the beige aesthetic */}
        <footer className="bg-[#F9F7F2] text-gray-900 py-20 px-6 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <Logo className="w-8 h-8" />
                  <span className="text-xl font-bold tracking-tight">MyBrainCraft</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4">Get some BrainCraft</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><Link to="/tests" className="hover:text-[#0055FF]">Assessments</Link></li>
                  <li><button onClick={() => setIsPricingModalOpen(true)} className="hover:text-[#0055FF]">Redeem a code</button></li>
                  <li><button onClick={() => setIsPricingModalOpen(true)} className="hover:text-[#0055FF]">Subscribe</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">About Us</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><Link to="/business" className="hover:text-[#0055FF]">For Business</Link></li>
                  <li><Link to="/blog" className="hover:text-[#0055FF]">The Science</Link></li>
                  <li><Link to="/contact" className="hover:text-[#0055FF]">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">MyBrainCraft</h4>
                <Link to="/dashboard" className="inline-block bg-[#0055FF] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors">
                  Login
                </Link>
                <div className="mt-8">
                  <h4 className="font-bold mb-4">Get the app</h4>
                  <div className="flex flex-col gap-2">
                    <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center cursor-pointer w-32">
                      <span className="text-xs font-bold">App Store</span>
                    </div>
                    <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center cursor-pointer w-32">
                       <span className="text-xs font-bold">Google Play</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
              <div>
                © 2024 MyBrainCraft Inc.
              </div>
              <div className="flex gap-6">
                 <Link to="/privacy" className="hover:underline">Terms & Conditions</Link>
                 <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                 <Link to="/privacy" className="hover:underline">Cookie Policy</Link>
              </div>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#0055FF] hover:text-white transition-colors cursor-pointer">IG</div>
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#0055FF] hover:text-white transition-colors cursor-pointer">TW</div>
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#0055FF] hover:text-white transition-colors cursor-pointer">FB</div>
              </div>
            </div>
          </div>
        </footer>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />
        <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} onSelect={handlePurchase} />
      </div>
    </HashRouter>
  );
};

export default App;
