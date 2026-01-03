
import React, { useState, useEffect } from 'react';
import { PricingPlan } from '../types';

interface PaymentGatewayProps {
  plan: PricingPlan;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ plan, onClose, onSuccess }) => {
  const [currency, setCurrency] = useState<'USD' | 'INR' | 'EUR' | 'GBP'>('USD');
  const [conversionRate, setConversionRate] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'gpay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'method' | 'details' | 'success'>('method');

  // Simulate Geo-IP / Locale Detection
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone.includes('Calcutta') || timeZone.includes('Asia/Kolkata')) {
      setCurrency('INR');
      setConversionRate(83.5); // Mock rate
    } else if (timeZone.includes('Europe') || timeZone.includes('London') === false) {
      setCurrency('EUR');
      setConversionRate(0.92);
    } else if (timeZone.includes('London')) {
      setCurrency('GBP');
      setConversionRate(0.79);
    } else {
      setCurrency('USD');
      setConversionRate(1);
    }
  }, []);

  const finalPrice = currency === 'USD' ? plan.priceUSD : (plan.priceUSD * conversionRate).toFixed(2);
  const currencySymbol = { USD: '$', INR: '₹', EUR: '€', GBP: '£' }[currency];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API Call
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      setTimeout(onSuccess, 2000);
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
         <div className="bg-white rounded-[2.5rem] p-12 max-w-md text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">🎉</div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Confirmed</h2>
            <p className="text-gray-500 font-medium">Your access to <strong>{plan.name}</strong> has been unlocked.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden h-[85vh] md:h-auto">
        
        {/* Order Summary */}
        <div className="md:w-1/3 bg-gray-50 p-8 border-r border-gray-100">
           <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Order Summary</h3>
           <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h2>
              <p className="text-sm text-gray-500">{plan.description}</p>
           </div>
           
           <div className="flex justify-between items-center py-4 border-y border-gray-200 mb-4">
              <span className="font-bold text-gray-700">Total</span>
              <span className="text-3xl font-black text-[#0055FF]">{currencySymbol}{finalPrice}</span>
           </div>

           <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-1">Detected Region</p>
              <div className="flex justify-between items-center">
                 <span className="font-bold text-blue-900">{currency}</span>
                 <button onClick={() => setCurrency('USD')} className="text-xs underline text-blue-600">Change</button>
              </div>
           </div>
        </div>

        {/* Payment Form */}
        <div className="md:w-2/3 p-8 md:p-12 overflow-y-auto">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">Secure Checkout</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-xl font-bold">✕</button>
           </div>

           {/* Methods */}
           <div className="grid grid-cols-3 gap-4 mb-8">
              {['card', 'paypal', 'gpay'].map((m) => (
                 <button 
                   key={m}
                   onClick={() => setPaymentMethod(m as any)}
                   className={`py-4 rounded-xl border-2 flex items-center justify-center transition-all ${
                      paymentMethod === m 
                      ? 'border-[#0055FF] bg-blue-50 text-[#0055FF]' 
                      : 'border-gray-100 text-gray-400 hover:border-gray-300'
                   }`}
                 >
                    <span className="font-black uppercase tracking-widest text-xs">{m}</span>
                 </button>
              ))}
           </div>

           {paymentMethod === 'card' && (
              <form onSubmit={handlePayment} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Cardholder Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:border-[#0055FF] outline-none" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Card Number</label>
                    <div className="relative">
                       <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:border-[#0055FF] outline-none pl-12" />
                       <span className="absolute left-4 top-3.5 text-gray-400">💳</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Expiry Date</label>
                       <input required type="text" placeholder="MM/YY" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:border-[#0055FF] outline-none" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">CVC</label>
                       <input required type="text" placeholder="123" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:border-[#0055FF] outline-none" />
                    </div>
                 </div>
                 
                 <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isProcessing}
                      className="w-full py-5 bg-[#0055FF] text-white rounded-xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isProcessing ? (
                         <>
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           Processing...
                         </>
                      ) : (
                         `Pay ${currencySymbol}${finalPrice}`
                      )}
                    </button>
                    <p className="text-center text-[10px] font-bold text-gray-400 mt-4 flex items-center justify-center gap-2">
                       🔒 256-bit SSL Encrypted Payment
                    </p>
                 </div>
              </form>
           )}

           {paymentMethod !== 'card' && (
              <div className="text-center py-12">
                 <div className="text-4xl mb-4">🔗</div>
                 <h3 className="font-bold text-gray-900 mb-2">Redirecting to {paymentMethod === 'paypal' ? 'PayPal' : 'Google Pay'}...</h3>
                 <p className="text-sm text-gray-500 mb-6">A secure window will open to complete your transaction.</p>
                 <button onClick={handlePayment} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold">Continue</button>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
