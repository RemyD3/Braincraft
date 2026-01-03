
import React from 'react';
import { Link } from 'react-router-dom';

const WellnessHub: React.FC = () => {
  const meditations = [
    { title: "2-Minute Reset", duration: "2 min", color: "bg-[#FFD100]", icon: "⚡" },
    { title: "Deep Focus", duration: "10 min", color: "bg-[#0055FF] text-white", icon: "🧠" },
    { title: "Stress Melter", duration: "5 min", color: "bg-[#FF6D00] text-white", icon: "😌" },
    { title: "Sleep Soundly", duration: "15 min", color: "bg-purple-600 text-white", icon: "🌙" },
  ];

  const tips = [
    { title: "The 20-20-20 Rule", text: "Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain." },
    { title: "Box Breathing", text: "Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat 4 times." },
    { title: "Hydrate First", text: "Drink a glass of water before your morning coffee to boost cognitive function." },
    { title: "Gratitude Snap", text: "Take one photo daily of something that makes you happy. Review them on Sundays." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans text-gray-900">
      
      {/* Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">Your Wellness Toolkit</h1>
        <p className="text-xl text-gray-500 font-medium">
          Simple tools to help you find balance, focus, and calm in your daily life.
        </p>
      </div>

      {/* Quick Meditations */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-3xl">🧘</span>
          <h2 className="text-3xl font-bold text-gray-900">Quick Meditations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {meditations.map((med, idx) => (
            <div key={idx} className={`rounded-[2.5rem] p-8 ${med.color} relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-xl`}>
               <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest opacity-70 border border-current px-2 py-1 rounded-lg">
                 Audio
               </div>
               <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{med.icon}</div>
               <h3 className="text-2xl font-bold mb-2">{med.title}</h3>
               <p className="font-medium opacity-80">{med.duration} • Guided</p>
               <div className="mt-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Tips */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-3xl">🌱</span>
          <h2 className="text-3xl font-bold text-gray-900">Daily Mindful Tips</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-lg flex gap-6 items-start hover:shadow-2xl transition-shadow">
               <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#0055FF] font-bold text-lg flex-shrink-0">
                 {idx + 1}
               </div>
               <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h3>
                 <p className="text-gray-500 font-medium leading-relaxed">{tip.text}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-[#F9F7F2] rounded-[3rem] p-12 text-center mb-16">
         <h2 className="text-3xl font-bold mb-4">Ready to measure your progress?</h2>
         <p className="text-gray-500 mb-8 max-w-xl mx-auto">Take a quick check-in to see how these tips are impacting your mental well-being.</p>
         <Link to="/tests" className="inline-block bg-[#0055FF] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors">
           Take a Check-in
         </Link>
      </section>

      {/* Disclaimer Section */}
      <section className="border-t border-gray-200 pt-12">
        <div className="bg-orange-50 rounded-3xl p-8 max-w-4xl mx-auto flex gap-6 items-start">
           <div className="text-3xl">⚠️</div>
           <div>
             <h3 className="text-lg font-bold text-orange-800 mb-2">Important Health Disclaimer</h3>
             <p className="text-sm text-orange-900/70 leading-relaxed font-medium">
               The content provided in MyBrainCraft, including meditations, tips, and assessments, is for educational and informational purposes only. 
               It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. 
               Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
               Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
               <br/><br/>
               <strong>If you are in crisis or you think you may have an emergency, call your doctor or 911 immediately.</strong>
             </p>
           </div>
        </div>
      </section>

    </div>
  );
};

export default WellnessHub;
