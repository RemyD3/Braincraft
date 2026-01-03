
import React, { useState } from 'react';
import { PRICING_PLANS } from '../constants';
import PaymentGateway from './PaymentGateway';
import { PricingPlan } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (planId: string) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [view, setView] = useState<'individual' | 'business'>('individual');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  if (!isOpen) return null;

  const filteredPlans = PRICING_PLANS.filter(p => view === 'business' ? p.isBusiness : !p.isBusiness);

  const handlePlanClick = (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };

  const handlePaymentSuccess = () => {
    if (selectedPlan) {
        onSelect(selectedPlan.id);
        setSelectedPlan(null);
        // Ensure parent closes (handled by onSelect wrapper usually, but good measure)
    }
  };

  return (
    <>
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
        <div className="md:w-1/3 bg-gray-900 p-12 text-white flex flex-col">
          <h2 className="text-3xl font-bold mb-6">Invest in {view === 'business' ? 'Your Team' : 'Your Growth'}.</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {view === 'business' 
              ? "Empower your organization with data-driven wellness insights and create a culture of resilience." 
              : "MyBrainCraft provides professional-grade insights at a fraction of the cost of therapy. Unlock your potential today."}
          </p>
          
          <div className="space-y-6 mb-8">
             {view === 'business' ? (
                <>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 bg-[#FFD100] text-gray-900 rounded-full flex items-center justify-center font-bold">✓</div>
                     <p className="text-sm">Admin Dashboard & Analytics</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 bg-[#FFD100] text-gray-900 rounded-full flex items-center justify-center font-bold">✓</div>
                     <p className="text-sm">Weekly Team Pulse Assignments</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 bg-[#FFD100] text-gray-900 rounded-full flex items-center justify-center font-bold">✓</div>
                     <p className="text-sm">Priority Support & Onboarding</p>
                  </div>
                </>
             ) : (
                <>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 bg-[#0055FF]/20 text-[#0055FF] rounded-full flex items-center justify-center font-bold">✓</div>
                     <p className="text-sm">Unlimited retakes on all assessments while subscribed.</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 bg-[#0055FF]/20 text-[#0055FF] rounded-full flex items-center justify-center font-bold">✓</div>
                     <p className="text-sm">Downloadable PDF reports for every test.</p>
                  </div>
                </>
             )}
          </div>

          <div className="mt-auto">
             <p className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-widest">Switch View</p>
             <div className="bg-white/10 p-1 rounded-xl flex">
                <button 
                  onClick={() => setView('individual')}
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${view === 'individual' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'}`}
                >
                  Individual
                </button>
                <button 
                  onClick={() => setView('business')}
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${view === 'business' ? 'bg-[#FFD100] text-gray-900' : 'text-gray-400 hover:text-white'}`}
                >
                  For Business
                </button>
             </div>
          </div>
        </div>

        <div className="md:w-2/3 p-8 sm:p-12 bg-gray-50 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`p-6 rounded-3xl bg-white border-2 transition-all cursor-pointer group flex flex-col ${
                  plan.id === 'all_access' || plan.id === 'biz_growth' ? 'border-[#0055FF] ring-4 ring-blue-50' : 'border-gray-100 hover:border-blue-300'
                }`}
                onClick={() => handlePlanClick(plan)}
              >
                {(plan.id === 'all_access' || plan.id === 'biz_growth') && (
                  <span className="text-[10px] font-bold text-[#0055FF] uppercase tracking-widest mb-2">Most Popular</span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-xs mb-4">
                  {plan.value} {plan.billingPeriod === 'monthly' ? '/ month' : ''}
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-gray-900">${plan.priceUSD}</span>
                  <span className="text-xs text-gray-400 ml-2">≈ ₹{plan.priceINR}</span>
                </div>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                
                {plan.features && (
                   <ul className="mb-6 space-y-2">
                     {plan.features.map(f => (
                       <li key={f} className="text-xs text-gray-500 flex items-center gap-2">
                         <span className="w-1 h-1 bg-gray-900 rounded-full"></span> {f}
                       </li>
                     ))}
                   </ul>
                )}

                <button className={`w-full mt-auto py-3 rounded-xl font-bold transition-all ${
                  plan.id === 'all_access' || plan.id === 'biz_growth' ? 'bg-[#0055FF] text-white shadow-lg' : 'bg-gray-900 text-white'
                }`}>
                  Select Plan
                </button>
              </div>
            ))}
          </div>
          <button 
            onClick={onClose}
            className="w-full mt-8 text-gray-400 font-bold text-sm hover:text-gray-600"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
    
    {/* Nested Payment Gateway */}
    {selectedPlan && (
      <PaymentGateway 
        plan={selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
        onSuccess={handlePaymentSuccess} 
      />
    )}
    </>
  );
};

export default PricingModal;
