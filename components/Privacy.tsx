
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 font-sans">
      <h1 className="text-5xl font-black text-gray-900 mb-12 tracking-tighter">Privacy & <span className="text-[#0055FF]">Confidentiality.</span></h1>
      
      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-widest text-[12px]">01 Data Encryption Standards</h2>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            All psychometric data processed by MyBrainCraft is encrypted using 2048-bit standards both at rest and in transit. Your responses are anonymized before being processed by our AI synthesis engine to ensure zero identifiable leakage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-widest text-[12px]">02 Non-Diagnostic Disclosure</h2>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            MyBrainCraft is a self-awareness platform, not a clinical diagnostic tool. We do not sell user data to third-party medical or insurance providers. Your results are your property, intended for personal growth and organizational development.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-widest text-[12px]">03 HIPAA & GDPR Compliance</h2>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            We adhere to strict data residency protocols. Users in the EEA have full right-to-be-forgotten access, allowing for immediate deletion of neural profiles and assessment history upon request via the Registry portal.
          </p>
        </section>

        <section className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-4">Questions about your data?</h3>
          <p className="text-gray-500 font-medium mb-8">Contact our Data Protection Officer for a full audit of your neural registry information.</p>
          <button className="px-8 py-3 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-700 transition-colors">Request Data Audit</button>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
