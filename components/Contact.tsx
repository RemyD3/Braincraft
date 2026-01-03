
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <h1 className="text-6xl font-black text-gray-900 mb-8 tracking-tighter">Connect with the <span className="text-[#0055FF]">Registry.</span></h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
            Have questions about our psychometric logic or enterprise solutions? Our team of clinical designers and data scientists is here to help.
          </p>
          
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-xl font-bold">M</div>
              <div>
                <h4 className="text-lg font-black text-gray-900">Email Protocol</h4>
                <p className="text-gray-500 font-medium">registry@mybraincraft.io</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-[#FF6D00] text-white rounded-2xl flex items-center justify-center text-xl font-bold">L</div>
              <div>
                <h4 className="text-lg font-black text-gray-900">Headquarters</h4>
                <p className="text-gray-500 font-medium">Neural Heights, Silicon Valley, CA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Identity</label>
                <input type="text" placeholder="Full Name" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#0055FF] outline-none transition-all font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Access Email</label>
                <input type="email" placeholder="email@address.com" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#0055FF] outline-none transition-all font-bold" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Inquiry Type</label>
              <select className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#0055FF] outline-none transition-all font-bold appearance-none cursor-pointer">
                <option>General Support</option>
                <option>Enterprise Solutions</option>
                <option>Psychometric Validation Inquiry</option>
                <option>Media & Partnership</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Message Body</label>
              <textarea rows={5} placeholder="State your objective..." className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#0055FF] outline-none transition-all font-bold resize-none"></textarea>
            </div>
            <button className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-[#0055FF] transition-all shadow-xl active:scale-95">
              Transmit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
