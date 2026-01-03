
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_TESTS } from '../constants';
import { UserProfile, TestCategory } from '../types';

interface TestCatalogProps {
  user: UserProfile | null;
  onUnlock: () => void;
}

const TestCatalog: React.FC<TestCatalogProps> = ({ user, onUnlock }) => {
  const [filter, setFilter] = useState<TestCategory | 'All'>('All');
  const navigate = useNavigate();

  const filteredTests = ALL_TESTS.filter(t => filter === 'All' || t.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Assessment Registry</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Select a diagnostic protocol to continue</p>
        </div>
        
        <div className="flex flex-wrap gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          {['All', ...Object.values(TestCategory)].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === cat 
                ? 'bg-gray-900 text-white shadow-xl' 
                : 'bg-transparent text-gray-400 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTests.map((test) => {
          const isCompleted = user?.completedTests.includes(test.id);
          const isUnlocked = !test.isPremium || user?.isSubscribed || user?.unlockedTests.includes(test.id) || (user?.credits || 0) > 0;

          return (
            <div 
              key={test.id} 
              className="bg-white rounded-[2.5rem] border border-gray-100 p-0 flex flex-col hover:shadow-2xl hover:shadow-gray-200 transition-all group relative overflow-hidden h-full"
            >
              <div className="h-48 w-full relative overflow-hidden">
                <img 
                  src={test.image} 
                  alt={test.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    test.category === TestCategory.PERSONALITY ? 'bg-purple-100 text-purple-600' :
                    test.category === TestCategory.WELLNESS ? 'bg-blue-100 text-[#0055FF]' :
                    'bg-orange-100 text-[#FF6D00]'
                  }`}>
                    {test.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest">
                  {test.durationMinutes}m
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight group-hover:text-[#0055FF] transition-colors">
                  {test.title}
                </h3>
                
                <p className="text-gray-500 text-sm font-medium mb-8 flex-grow leading-relaxed line-clamp-3">
                  {test.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Access</span>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${test.isPremium ? 'text-[#FF6D00]' : 'text-[#0055FF]'}`}>
                        {test.isPremium ? 'Premium' : 'Unrestricted'}
                     </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (!isUnlocked) {
                        onUnlock();
                      } else {
                        navigate(`/test/${test.id}`);
                      }
                    }}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      isCompleted 
                        ? 'bg-gray-100 text-gray-400'
                        : isUnlocked 
                          ? 'bg-[#0055FF] text-white hover:bg-blue-700 shadow-xl shadow-blue-100'
                          : 'bg-gray-900 text-white hover:bg-gray-800 shadow-xl'
                    }`}
                  >
                    {isCompleted ? 'Repeat' : isUnlocked ? 'Launch' : 'Unlock'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestCatalog;
