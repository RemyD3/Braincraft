
import React from 'react';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  const posts = [
    { id: 1, title: "The Neuroplasticity of Focus", category: "Cognitive", date: "Oct 24, 2024", excerpt: "Exploring how consistent deep-work protocols can rewire your frontal lobe for elite concentration." },
    { id: 2, title: "Understanding Attachment Loops", category: "Social", date: "Oct 22, 2024", excerpt: "Breaking the cycles of anxious and avoidant dynamics through mindful interpersonal awareness." },
    { id: 3, title: "Burnout: The Silent Syntax", category: "Wellness", date: "Oct 18, 2024", excerpt: "Recognizing the subtle behavioral cues that signal neural fatigue before total collapse." },
    { id: 4, title: "Emotional Intelligence in AI Teams", category: "Professional", date: "Oct 15, 2024", excerpt: "How human empathy remains the most valuable asset in an increasingly automated workspace." },
    { id: 5, title: "The Daily Pulse Protocol", category: "Platform", date: "Oct 10, 2024", excerpt: "A guide on using the MyBrainCraft dashboard to track long-term psychological evolution." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-sans">
      <header className="mb-20">
        <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tighter">Growth Journals</h1>
        <p className="text-lg text-gray-500 font-medium max-w-2xl">The latest research, editorial pieces, and user guides for your self-awareness journey.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-20">
          {posts.map(post => (
            <article key={post.id} className="group">
              <div className="flex gap-4 items-center mb-6">
                <span className="px-4 py-1.5 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">{post.category}</span>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{post.date}</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-6 group-hover:text-[#0055FF] transition-colors leading-tight cursor-pointer">{post.title}</h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8">{post.excerpt}</p>
              <button className="text-[10px] font-black uppercase tracking-widest text-gray-900 border-b-2 border-[#FFD100] pb-1 hover:border-gray-900 transition-all">Read Protocol</button>
            </article>
          ))}
        </div>

        <aside className="space-y-16">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50">
             <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Trending Topics</h4>
             <div className="flex flex-wrap gap-2">
                {['Cognitive', 'Personal Evolution', 'Wellness', 'Professional Growth', 'Anxiety Research', 'Social Dynamics'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 hover:text-[#0055FF] hover:border-blue-200 transition-all cursor-pointer uppercase tracking-widest">{tag}</span>
                ))}
             </div>
          </div>

          <div className="bg-[#0055FF] p-10 rounded-[2.5rem] text-white">
             <h4 className="text-2xl font-black mb-4 leading-tight">Sync your inbox.</h4>
             <p className="text-sm text-blue-100 font-medium mb-8">Receive weekly psychological insights and protocol updates.</p>
             <div className="relative">
               <input type="email" placeholder="email@protocol.com" className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:bg-white text-gray-900 placeholder:text-blue-100/50 outline-none transition-all font-bold" />
               <button className="absolute right-2 top-2 bottom-2 px-6 bg-white text-[#0055FF] rounded-xl font-black text-[10px] uppercase tracking-widest">Join</button>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Blog;
