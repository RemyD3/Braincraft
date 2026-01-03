
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile, TestCategory } from '../types';
import { ALL_TESTS } from '../constants';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

interface DashboardProps {
  user: UserProfile | null;
  onAuthRequired: () => void;
  onDailyComplete: (score: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onAuthRequired, onDailyComplete }) => {
  const navigate = useNavigate();
  const [showPulseModal, setShowPulseModal] = useState(false);
  const [pulseStep, setPulseStep] = useState(0);
  const [pulseAnswers, setPulseAnswers] = useState<number[]>([]);
  const [showRewardCelebration, setShowRewardCelebration] = useState(false);

  useEffect(() => {
    if (!user) onAuthRequired();
    // Check if user just hit 30 day streak
    if (user?.streak === 30) {
      setShowRewardCelebration(true);
    }
  }, [user]);

  if (!user) return null;

  const radarData = Object.values(TestCategory).map(cat => {
    const scores = user.history
      .filter(h => ALL_TESTS.find(t => t.id === h.testId)?.category === cat)
      .map(h => (h.score / h.maxScore) * 100);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { subject: cat, A: avg };
  });

  const dailyTrendData = user.dailyHistory.slice(-7).map(d => ({
    day: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }),
    vibe: d.score
  }));

  const today = new Date().toISOString().split('T')[0];
  const lastDaily = user.lastDailyTestDate?.split('T')[0];
  const canDoDaily = today !== lastDaily;
  const streakProgress = (user.streak % 30) / 30 * 100;

  const pulseQuestions = [
    { q: "How deep is your focus right now?", icons: ["🌑", "🌙", "🌗", "🌖", "☀️"] },
    { q: "Rate your emotional resilience today.", icons: ["🌧️", "☁️", "🌤️", "☀️", "🌈"] },
    { q: "Current energy level for complex tasks?", icons: ["🪫", "🔋", "⚡", "🔥", "🚀"] }
  ];

  const handlePulseSubmit = () => {
    const avg = pulseAnswers.reduce((a, b) => a + b, 0) / pulseAnswers.length;
    onDailyComplete(Math.round(avg * 20)); 
    setShowPulseModal(false);
    setPulseStep(0);
    setPulseAnswers([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* 30-Day Reward Celebration Overlay */}
      {showRewardCelebration && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-gray-900/90 backdrop-blur-2xl text-center">
          <div className="max-w-md animate-in zoom-in duration-500">
            <div className="text-8xl mb-8 animate-bounce">🏆</div>
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Neural Mastery</h2>
            <p className="text-[#0055FF] font-bold text-xl mb-10">
              You've maintained a 30-day streak! As promised, a Premium Test Credit has been added to your profile.
            </p>
            <button 
              onClick={() => setShowRewardCelebration(false)}
              className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-lg shadow-2xl hover:bg-gray-50 transition-all"
            >
              Continue My Journey
            </button>
          </div>
        </div>
      )}

      {/* Mind-Pulse Modal */}
      {showPulseModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-2xl">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-12 shadow-2xl relative overflow-hidden border border-white/20">
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
              <div className="h-full bg-[#0055FF] transition-all duration-500" style={{ width: `${((pulseStep + 1) / 3) * 100}%` }}></div>
            </div>
            
            <div className="text-center mb-12">
              <span className="text-5xl mb-6 block transition-all">{pulseQuestions[pulseStep].icons[2]}</span>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                {pulseQuestions[pulseStep].q}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-4">Psychometric Check-in</p>
            </div>

            <div className="flex justify-between gap-3 mb-12">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  onClick={() => {
                    const newAns = [...pulseAnswers, val];
                    if (pulseStep < 2) {
                      setPulseAnswers(newAns);
                      setPulseStep(pulseStep + 1);
                    } else {
                      setPulseAnswers(newAns);
                    }
                  }}
                  className={`flex-1 h-24 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                    pulseAnswers[pulseStep] === val ? 'bg-gray-900 border-gray-900 text-white' : 'bg-gray-50 border-gray-50 text-gray-400 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-2xl font-black">{val}</span>
                  <span className="text-xs font-bold">{pulseQuestions[pulseStep].icons[val-1]}</span>
                </button>
              ))}
            </div>

            {pulseAnswers.length === 3 && (
              <button 
                onClick={handlePulseSubmit}
                className="w-full py-6 bg-[#0055FF] text-white rounded-3xl font-black text-xl hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95"
              >
                Sync Neural State
              </button>
            )}
            
            <button onClick={() => setShowPulseModal(false)} className="w-full mt-8 text-gray-300 font-bold text-xs uppercase tracking-[0.2em] hover:text-gray-500 transition-colors">Abort Pulse session</button>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
             <div className="w-3 h-10 bg-[#FFD100] rounded-full" />
             <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Neural Overview</h1>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Registry Snapshot • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
           <Link to="/tests" className="px-6 py-3 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-[#0055FF] transition-colors">Catalog</Link>
           <button onClick={() => navigate('/tests')} className="px-10 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">Take New Test</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-10">
          
          {/* Rewards Path Road */}
          <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="max-w-lg">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-20 h-20 bg-[#0055FF] rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl shadow-blue-200 transform hover:rotate-6 transition-transform">🎁</div>
                   <div>
                     <h3 className="text-3xl font-black text-gray-900 tracking-tight">The 30-Day Protocol</h3>
                     <p className="text-[#0055FF] font-black uppercase text-[10px] tracking-widest">Momentum Track: {user.streak} Days Active</p>
                   </div>
                </div>
                
                <p className="text-gray-500 font-medium text-xl leading-relaxed mb-10">
                  Consistency is the craft. Reach day 30 to unlock any <span className="text-gray-900 font-black underline decoration-[#0055FF]">Premium Evaluation</span> instantly.
                </p>

                <div className="relative pt-4">
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0055FF] transition-all duration-1000 shadow-[0_0_20px_rgba(0,85,255,0.5)]" style={{ width: `${streakProgress}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Day 0</span>
                    <span className="text-[10px] font-black text-[#0055FF] uppercase tracking-widest">Day 30: Unlocked</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                {canDoDaily ? (
                   <button 
                    onClick={() => setShowPulseModal(true)}
                    className="relative px-12 py-8 bg-gray-900 text-white rounded-[2rem] font-black text-2xl hover:bg-[#0055FF] shadow-2xl shadow-gray-300 transition-all hover:scale-105 active:scale-95"
                   >
                     Log Daily Pulse
                     <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FF6D00] rounded-full border-4 border-white animate-pulse"></div>
                   </button>
                ) : (
                  <div className="p-10 rounded-[2.5rem] bg-blue-50 border-2 border-blue-100 text-center">
                    <p className="text-[#0055FF] font-black text-[10px] uppercase tracking-[0.2em] mb-3">Sync Status: Active</p>
                    <p className="text-2xl font-black text-blue-900">Protocol Complete</p>
                    <p className="text-[10px] font-bold text-[#0055FF] mt-2">Next check-in available in 24h</p>
                  </div>
                )}
              </div>
            </div>
            {/* Background Aesthetic */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-40"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-12 text-center">Biometric Resilience (7D)</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyTrendData}>
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="vibe" radius={[10, 10, 10, 10]} barSize={36}>
                       {dailyTrendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 6 ? '#0055FF' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-12 text-center">Trait Equilibrium</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} />
                    <Radar name="User" dataKey="A" stroke="#FF6D00" fill="#FF6D00" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Test History */}
          <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-12 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Diagnostic Ledger</h3>
              <span className="bg-white border border-gray-100 px-6 py-2 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">{user.history.length} Valid Records</span>
            </div>
            <div className="divide-y divide-gray-50">
              {user.history.map((h, i) => (
                <div key={i} className="p-10 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center text-white text-3xl font-black group-hover:bg-[#0055FF] transition-all duration-500 shadow-xl shadow-gray-200">
                      {ALL_TESTS.find(t => t.id === h.testId)?.title.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">{ALL_TESTS.find(t => t.id === h.testId)?.title}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(h.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right hidden md:block">
                       <p className="text-3xl font-black text-gray-900 leading-none">{Math.round((h.score/h.maxScore)*100)}%</p>
                       <p className="text-[9px] font-black text-[#0055FF] uppercase mt-2 tracking-widest">Consistency Index</p>
                    </div>
                    <Link 
                      to={`/report/${h.testId}/${encodeURIComponent(h.date)}`}
                      className="px-12 py-5 bg-white border-2 border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-all shadow-sm active:scale-95"
                    >
                      Audit Insights
                    </Link>
                  </div>
                </div>
              ))}
              {user.history.length === 0 && (
                <div className="p-32 text-center">
                   <div className="text-6xl mb-6">📂</div>
                   <p className="text-gray-300 font-black text-xl mb-6 tracking-tight">No assessment data detected.</p>
                   <Link to="/tests" className="inline-block px-10 py-4 bg-[#0055FF] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all">Start Protocol</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-10">
          <div className="bg-gray-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#FFD100] mb-10">Neural Portfolio</h3>
            <div className="space-y-12">
               <div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Assessment Credits</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-7xl font-black text-white">{user.credits}</p>
                    <span className="text-xs font-bold text-gray-600 uppercase">Tokens</span>
                  </div>
               </div>
               <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 group-hover:border-[#0055FF]/30 transition-colors">
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Member Status</p>
                  <p className="text-xl font-black text-[#0055FF]">{user.isSubscribed ? 'Premium Elite' : 'Standard Node'}</p>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#0055FF]/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-10 text-center">Ascension Roadmap</h3>
             <div className="space-y-6">
                {[
                  { id: 7, label: "The Habitual", icon: "🌱", color: "bg-blue-50 border-blue-100" },
                  { id: 15, label: "Core Resilience", icon: "🌊", color: "bg-orange-50 border-orange-100" },
                  { id: 30, label: "Neural Master", icon: "💎", color: "bg-gray-900 border-gray-900 text-white" }
                ].map((tier) => (
                  <div key={tier.id} className={`p-8 rounded-[2rem] border-2 flex items-center gap-6 transition-all ${
                    user.streak >= tier.id ? tier.color : 'bg-gray-50 border-gray-50 opacity-40 grayscale'
                  }`}>
                    <span className="text-3xl">{tier.icon}</span>
                    <div>
                       <p className="font-black leading-tight text-lg">{tier.label}</p>
                       <p className="text-[9px] font-black opacity-50 uppercase mt-1 tracking-widest">{tier.id} Day Milestone</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Daily Reflection</p>
             <p className="text-xl font-bold italic leading-relaxed text-gray-700">
               "Self-awareness is not just a trait; it is a craft built through repetition."
             </p>
             <div className="mt-8 flex items-center gap-3">
               <div className="w-10 h-1 bg-[#FFD100] rounded-full"></div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MyBrainCraft Editorial</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
