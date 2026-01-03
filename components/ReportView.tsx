
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserProfile } from '../types';
import { ALL_TESTS } from '../constants';
import Logo from './Logo';
import ReactMarkdown from 'react-markdown';

interface ReportViewProps {
  user: UserProfile | null;
}

const ReportView: React.FC<ReportViewProps> = ({ user }) => {
  const { testId, date } = useParams<{ testId: string; date: string }>();
  
  if (!user) return <div className="p-12 text-center font-bold text-gray-500">Please login to view reports.</div>;

  const decodedDate = decodeURIComponent(date || '');
  const result = user.history.find(h => h.testId === testId && h.date === decodedDate);
  const test = ALL_TESTS.find(t => t.id === testId);

  if (!result || !test) return <div className="p-12 text-center font-bold text-gray-500">Report not found.</div>;

  const healthPercentage = Math.round((result.score / result.maxScore) * 100);

  const getFriendlyStatus = (percent: number) => {
    if (percent > 80) return { text: 'Thriving', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    if (percent > 60) return { text: 'Balanced', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percent > 40) return { text: 'Doing Okay', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'Needs Care', color: 'text-red-500', bg: 'bg-red-100' };
  };

  const status = getFriendlyStatus(healthPercentage);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8 flex justify-between items-center no-print">
        <Link to="/dashboard" className="text-gray-500 font-bold hover:text-blue-600 flex items-center gap-2 transition-colors">
          ← Back to Dashboard
        </Link>
        <button 
          onClick={() => window.print()}
          className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-all"
        >
          Save Results
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 print:shadow-none">
        
        {/* Header */}
        <div className="bg-[#FFD100] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5 z-0">
             <img src={test.image} alt="bg" className="w-full h-full object-cover opacity-10 mix-blend-multiply" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2">{test.category}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{test.title}</h1>
            <p className="text-gray-800 font-medium opacity-80">{new Date(result.date).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Score Hero */}
        <div className="p-10 md:p-14 text-center -mt-10 relative z-20">
          <div className="inline-flex flex-col items-center justify-center bg-white rounded-full w-48 h-48 shadow-2xl mb-8 border-8 border-white">
            <span className={`text-6xl font-black ${status.color}`}>{healthPercentage}%</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Your Score</span>
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${status.color}`}>{status.text}</h2>
          <p className="text-gray-500 max-w-lg mx-auto font-medium">
            Based on your answers, here is a simple breakdown of where you stand today.
          </p>
        </div>

        {/* AI Insights - Formatted */}
        <div className="px-10 md:px-14 pb-14">
          <div className="bg-[#F9F7F2] rounded-[2.5rem] p-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">💡</span>
              <h3 className="text-2xl font-bold text-gray-900">Your Personal Insights</h3>
            </div>
            
            <div className="text-gray-600 leading-relaxed font-medium">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h2 className="text-2xl font-black text-gray-900 mb-4 mt-8 first:mt-0" {...props} />,
                  h2: ({node, ...props}) => <h3 className="text-xl font-black text-gray-900 mb-4 mt-8" {...props} />,
                  h3: ({node, ...props}) => <h4 className="text-lg font-bold text-gray-900 mb-2 mt-6" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-gray-600 leading-relaxed text-lg" {...props} />,
                  ul: ({node, ...props}) => <ul className="space-y-4 mb-6 list-none mt-4" {...props} />,
                  li: ({node, ...props}) => (
                    <li className="flex gap-4 items-start" {...props}>
                       <div className="mt-2 w-2 h-2 bg-[#0055FF] rounded-full flex-shrink-0 shadow-sm"></div>
                       <span className="text-lg">{props.children}</span>
                    </li>
                  ),
                  strong: ({node, ...props}) => <strong className="font-black text-gray-800" {...props} />,
                }}
              >
                {result.aiInterpretation || "No insights available."}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Recommended Practices (Activities) */}
        {test.activities && test.activities.length > 0 && (
           <div className="px-10 md:px-14 pb-14">
             <div className="flex items-center gap-3 mb-8">
               <span className="text-2xl">⚡</span>
               <h3 className="text-2xl font-bold text-gray-900">Recommended Practices</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {test.activities.map((activity, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-shadow">
                     <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                           activity.type === 'Mental' ? 'bg-purple-100 text-purple-600' :
                           activity.type === 'Physical' ? 'bg-orange-100 text-orange-600' :
                           'bg-blue-100 text-blue-600'
                        }`}>
                           {activity.type}
                        </span>
                        <span className="text-xs font-bold text-gray-400">{activity.duration}</span>
                     </div>
                     <h4 className="text-xl font-black text-gray-900 mb-2">{activity.title}</h4>
                     <p className="text-sm text-gray-500 font-medium">
                        Incorporating this into your routine can help regulate the neural patterns identified in this assessment.
                     </p>
                  </div>
                ))}
             </div>
           </div>
        )}

        {/* Simple Breakdown Bars */}
        <div className="px-10 md:px-14 pb-14">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Topic Breakdown</h3>
          <div className="space-y-6">
            {Object.entries(result.breakdown).map(([key, val]) => {
              const facetPercent = Math.min(100, Math.round((val as number) * 5)); // Approx scaling
              return (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-700 capitalize">{key}</span>
                    <span className="font-bold text-gray-400">{facetPercent > 66 ? 'High' : facetPercent > 33 ? 'Medium' : 'Low'}</span>
                  </div>
                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0055FF] rounded-full transition-all duration-1000" 
                      style={{ width: `${facetPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps / CTA */}
        <div className="bg-[#0055FF] p-10 md:p-14 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">What's next?</h3>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Small steps lead to big changes. Check out our Wellness Hub for quick tips to improve this score.
          </p>
          <Link to="/wellness" className="inline-block bg-white text-[#0055FF] px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl active:scale-95">
            Go to Wellness Hub
          </Link>
        </div>

        {/* Disclaimer Footer */}
        <div className="bg-gray-50 p-8 text-center border-t border-gray-100">
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Important Note</p>
           <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
             This result is for self-discovery and educational purposes only. It is not a medical diagnosis. 
             If you are feeling overwhelmed or need support, please contact a professional healthcare provider.
           </p>
        </div>

      </div>
    </div>
  );
};

export default ReportView;
