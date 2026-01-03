
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col font-sans text-gray-900">
      {/* HERO SECTION - Yellow Background */}
      <section className="bg-[#FFD100] min-h-[90vh] px-6 pt-12 pb-24 relative overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-block bg-white/20 backdrop-blur-sm border border-black/5 px-4 py-2 rounded-full">
               <span className="text-xs font-bold uppercase tracking-widest text-gray-900">✨ The New Standard in Psychometrics</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tight text-gray-900">
              Your <br/>
              partner in <br/>
              <span className="text-white drop-shadow-sm">cognitive</span> <br/>
              evolution
            </h1>
            <p className="text-lg md:text-xl font-medium leading-relaxed max-w-md text-gray-800">
              MyBrainCraft creates an engaging employee experience, easy-to-use admin tools, and expert support that will make your workplace healthier.
            </p>
            <div className="flex gap-4">
              <Link to="/business" className="inline-block bg-[#0055FF] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                For Business
              </Link>
              <Link to="/tests" className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-lg active:scale-95">
                Take a test
              </Link>
            </div>
          </div>

          {/* Abstract Illustration */}
          <div className="relative h-[600px] hidden lg:block">
            {/* The Stack */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center perspective-1000">
               
               {/* Floating Elements with inline styles for custom animations */}
               
               {/* Blue Shape Image */}
               <div className="absolute top-0 right-10 w-48 h-48 rounded-[3rem] transform rotate-12 z-10 overflow-hidden shadow-2xl border-4 border-white">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Team meeting" />
               </div>

               {/* Pink Circle Image */}
               <div className="absolute top-20 left-10 w-40 h-40 rounded-full z-20 overflow-hidden shadow-lg border-4 border-white">
                   <img src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Meditating woman" />
               </div>

               {/* White Pill - Main Value */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[28rem] h-80 bg-white rounded-[3rem] z-30 shadow-2xl rotate-[-5deg] hover:rotate-0 transition-all duration-500 overflow-hidden border-8 border-white">
                   <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Happy employee" />
                   <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                      <p className="font-bold text-lg">Trusted by 500+ Companies</p>
                   </div>
               </div>

               {/* Orange Circle Bottom */}
               <div className="absolute bottom-10 right-20 w-56 h-56 rounded-full z-10 overflow-hidden shadow-xl border-4 border-white">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Brainstorming" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY SECTION */}
      <section className="bg-white py-10 border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by teams at</p>
           <div className="flex justify-center flex-wrap gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {['ACME INC', 'STARK IND', 'WAYNE ENT', 'MASSIVE DYNAMIC', 'CYBERDYNE'].map(logo => (
                 <div key={logo} className="text-xl md:text-2xl font-black text-gray-800 tracking-tighter cursor-default">{logo}</div>
              ))}
           </div>
        </div>
      </section>

      {/* WHAT YOU GET SECTION (REPLACES VIDEO) */}
      <section className="bg-[#F9F7F2] py-24 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Everything you need to <br/> build a <span className="text-[#FF6D00]">mindful culture.</span></h2>
               <p className="text-xl text-gray-600 font-medium">From clinical-grade assessments to daily pulse checks, we provide the complete toolkit for organizational and personal awareness.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Card 1 */}
               <div className="bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 group">
                  <div className="w-20 h-20 bg-blue-50 text-[#0055FF] rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform">📊</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Clinical Analytics</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Access 25+ validated psychometric assessments including Big Five, EQ, and Burnout indicators. Data you can trust.
                  </p>
               </div>
               
               {/* Card 2 */}
               <div className="bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 group">
                  <div className="w-20 h-20 bg-orange-50 text-[#FF6D00] rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform">🤖</div>
                  <div className="flex items-center gap-3 mb-4">
                     <h3 className="text-2xl font-bold text-gray-900">Gemini AI Coach</h3>
                     <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wide">New</span>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Instant, personalized interpretation of your scores provided by advanced AI. It's like having a psychologist in your pocket.
                  </p>
               </div>

               {/* Card 3 */}
               <div className="bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 group">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform">📈</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Growth Tracking</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Visualize your mental evolution over time with our 30-day streak system and longitudinal graphs. Watch yourself grow.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* FEATURE 1: Support for every mind (Yellow) */}
      <section className="bg-[#FFD100] py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
             <div className="inline-block bg-black/5 px-4 py-2 rounded-lg mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-800">For Employees</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-[0.95] tracking-tight">Support for every mind.</h2>
             <p className="text-lg leading-relaxed mb-8 font-medium text-gray-800">
               Your team will have complete access to the MyBrainCraft app — including hundreds of exercises for stress, focus, productivity, sleep, kids and more to help your employees manage their mental health, anytime.
             </p>
          </div>
          
          <div className="order-1 lg:order-2 relative">
             <div className="w-full aspect-square bg-orange-400 rounded-[3rem] relative flex items-center justify-center overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" alt="Texture" />
                {/* Phone Mockup with Real Image */}
                <div className="w-72 h-[550px] bg-white rounded-[2.5rem] border-8 border-white shadow-2xl relative z-10 overflow-hidden flex flex-col transform rotate-[-5deg] hover:rotate-0 transition-all duration-500">
                   <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="App Screen" />
                   <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-xl shadow-lg">
                         <p className="font-black text-gray-900 text-lg">Wellness Score</p>
                         <p className="font-black text-emerald-500 text-3xl text-center">92%</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FEATURE 2: Enterprise Ready (Orange) */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="bg-[#FF6D00] rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply" alt="Meeting" />
              <div className="bg-[#F9F7F2] rounded-3xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 relative z-10">
                 <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
                    <span className="font-bold text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Reporting</span>
                    <span className="font-bold text-xs text-gray-400">Settings</span>
                 </div>
                 <h4 className="font-bold mb-4 text-gray-900">Engagement Report</h4>
                 <div className="flex items-end gap-2 h-32">
                    {[30, 50, 40, 70, 90, 60, 45, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#0055FF] rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%` }}></div>
                    ))}
                 </div>
              </div>
           </div>

           <div>
              <div className="inline-block bg-orange-100 px-4 py-2 rounded-lg mb-6">
                 <span className="text-xs font-bold uppercase tracking-widest text-orange-800">For Admins</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-gray-900">Stress-free and enterprise-ready.</h2>
              <p className="text-lg leading-relaxed mb-6 font-medium text-gray-600">
                MyBrainCraft for Work is easy to launch and even easier to manage.
              </p>
              <p className="text-lg leading-relaxed font-medium text-gray-600">
                Our Resource Toolkit will help you introduce MyBrainCraft to your team, and our Admin Portal reveals valuable insights on employee engagement.
              </p>
              <Link to="/business" className="inline-block mt-8 text-[#0055FF] font-black border-b-2 border-[#0055FF] pb-1 hover:text-blue-700 transition-colors">
                 Explore Admin Features →
              </Link>
           </div>
        </div>
      </section>

      {/* FEATURE 3: You support your team (Yellow) */}
      <section className="bg-white px-6 pb-24">
        <div className="max-w-7xl mx-auto bg-[#FFD100] rounded-[3rem] p-12 lg:p-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center shadow-xl">
            <div>
               <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-gray-900">You support your team, <br/>we support you.</h2>
               <p className="text-lg leading-relaxed mb-6 font-medium text-gray-900">
                 Your dedicated Partner Success and Engagement Teams will be there every step of the way, helping you integrate MyBrainCraft into your culture and engage your team.
               </p>
               <p className="text-lg leading-relaxed font-medium text-gray-900">
                 Join our exclusive admin community, <span className="bg-white px-1 rounded shadow-sm font-bold text-orange-600">The Imperfect Circle</span>, to connect with other mindful leaders.
               </p>
            </div>
            <div className="relative">
               {/* Collage of faces */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-2 rounded-3xl transform -rotate-6 shadow-lg hover:rotate-0 transition-transform duration-300 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover rounded-2xl" alt="Woman" />
                  </div>
                  <div className="bg-white p-2 rounded-3xl transform rotate-3 mt-12 shadow-lg hover:rotate-0 transition-transform duration-300 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover rounded-2xl" alt="Man" />
                  </div>
                  <div className="col-span-2 bg-white p-2 rounded-3xl transform -rotate-1 shadow-xl z-10 w-2/3 mx-auto -mt-10 hover:scale-105 transition-transform duration-300 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-2xl" alt="Team" />
                  </div>
               </div>
            </div>
        </div>
      </section>

      {/* FORM SECTION - Beige Background */}
      <section className="bg-[#F9F7F2] py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
           <div>
              <h2 className="text-5xl md:text-7xl font-bold leading-tight text-gray-900 mb-8">
                Find out what <span className="text-[#0055FF] underline decoration-4 decoration-yellow-400 underline-offset-4">MyBrainCraft for work</span> can do for your business.
              </h2>
              <h3 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
                Get a demo today.
              </h3>
              <p className="text-sm text-gray-500 font-medium">For educational institutions, please visit our schools page</p>
           </div>

           <div className="bg-transparent">
              <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder="First Name*" className="w-full bg-transparent border-b border-gray-400 py-3 focus:outline-none focus:border-blue-600 placeholder-gray-500 font-medium transition-colors" />
                    <input type="text" placeholder="Last Name*" className="w-full bg-transparent border-b border-gray-400 py-3 focus:outline-none focus:border-blue-600 placeholder-gray-500 font-medium transition-colors" />
                 </div>
                 <input type="text" placeholder="Company Name*" className="w-full bg-transparent border-b border-gray-400 py-3 focus:outline-none focus:border-blue-600 placeholder-gray-500 font-medium transition-colors" />
                 <select className="w-full bg-transparent border-b border-gray-400 py-3 focus:outline-none focus:border-blue-600 text-gray-500 font-medium cursor-pointer">
                    <option>Number of Employees*</option>
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>200+</option>
                 </select>
                 <input type="email" placeholder="Work Email*" className="w-full bg-transparent border-b border-gray-400 py-3 focus:outline-none focus:border-blue-600 placeholder-gray-500 font-medium transition-colors" />
                 <input type="tel" placeholder="Phone Number*" className="w-full bg-transparent border-b border-gray-400 py-3 focus:outline-none focus:border-blue-600 placeholder-gray-500 font-medium transition-colors" />
                 
                 <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                   By submitting this form you agree to our <span className="underline cursor-pointer">Privacy notice</span>, and to receive information regarding our MyBrainCraft for Work offering.
                 </p>

                 <button type="button" className="bg-[#0055FF] text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl active:scale-95 mt-4">
                   Submit Request
                 </button>
              </form>
           </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
