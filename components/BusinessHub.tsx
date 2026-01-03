
import React, { useState, useRef, useEffect } from 'react';
import { ALL_TESTS, PRICING_PLANS } from '../constants';
import { Employee, AnalyticsLog, AssignedTask, PricingPlan } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import PaymentGateway from './PaymentGateway';
import { chatWithBusinessCoach } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import Logo from './Logo';

const BusinessHub: React.FC = () => {
  // Flow Management
  const [appState, setAppState] = useState<'setup' | 'pricing' | 'hub' | 'admin' | 'employee'>('setup');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PricingPlan | null>(null);
  const navigate = useNavigate();

  // --- AI ASSISTANT STATE ---
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello. I am your Executive Wellness Consultant. I have analyzed your current team roster and activity logs. How can I assist you today?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- DATA STATE ---
  const [companyProfile, setCompanyProfile] = useState({
      name: 'Acme Corp',
      industry: 'Technology',
      size: '11-50',
      adminName: 'Admin User',
      region: 'North America'
  });
  
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([
    { 
      id: '1', name: 'Sarah Connor', email: 'sarah@acme.com', role: 'Employee', status: 'Active', department: 'Engineering', wellnessScore: 78, lastCheckIn: '2024-10-24',
      assignedTasks: [
        { id: 't1', testId: 'stress-burnout', title: 'Professional Burnout Index', assignedDate: '2024-10-20', dueDate: '2024-10-27', complete: false },
        { id: 't2', testId: 'focus-attention', title: 'Deep Work Capacity', assignedDate: '2024-10-22', dueDate: '2024-10-29', complete: true, completionDate: '2024-10-23' }
      ] 
    },
    { 
      id: '2', name: 'John Smith', email: 'john@acme.com', role: 'Employee', status: 'Needs Attention', department: 'Sales', wellnessScore: 45, lastCheckIn: '2024-10-10',
      assignedTasks: [
        { id: 't3', testId: 'gad-7', title: 'General Anxiety Disorder', assignedDate: '2024-10-21', dueDate: '2024-10-25', complete: false }
      ] 
    },
    { 
      id: '3', name: 'Elena Fisher', email: 'elena@acme.com', role: 'Admin', status: 'Active', department: 'HR', wellnessScore: 92, lastCheckIn: '2024-10-23',
      assignedTasks: [] 
    },
  ]);

  const [testLogs, setTestLogs] = useState<AnalyticsLog[]>([
    { id: 'l1', employeeName: 'Sarah Connor', testName: 'Deep Work Capacity', date: '2024-10-23T14:30:00', score: 85, department: 'Engineering' },
    { id: 'l2', employeeName: 'John Smith', testName: 'Professional Burnout Index', date: '2024-10-22T09:15:00', score: 42, department: 'Sales' },
    { id: 'l3', employeeName: 'Elena Fisher', testName: 'Big Five Personality', date: '2024-10-21T11:00:00', score: 92, department: 'HR' },
    { id: 'l4', employeeName: 'Sarah Connor', testName: 'Big Five Personality', date: '2024-10-15T16:45:00', score: 0, department: 'Engineering' }, 
  ]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiOpen]);

  // --- HANDLERS ---

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppState('pricing');
  };

  const handlePlanSelection = (plan: PricingPlan) => {
    setSelectedPlanForPayment(plan);
  };

  const handlePaymentSuccess = () => {
    setSelectedPlanForPayment(null);
    setIsSubscribed(true);
    setAppState('hub');
  };

  const handleAssignTest = (testId: string, empId: string, dueDate: string) => {
    const test = ALL_TESTS.find(t => t.id === testId);
    if (!test) return;

    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId || empId === 'all') {
        const newTask: AssignedTask = {
          id: Math.random().toString(36).substr(2, 9),
          testId: test.id,
          title: test.title,
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate: dueDate,
          complete: false
        };
        return { ...emp, assignedTasks: [...emp.assignedTasks, newTask] };
      }
      return emp;
    }));
    alert(`Assigned ${test.title} successfully.`);
  };

  const handleDeleteEmployee = (id: string) => {
    if(confirm('Are you sure you want to remove this employee? This action cannot be undone.')) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleAddEmployee = (e: React.FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
      const email = (form.elements.namedItem('email') as HTMLInputElement).value;
      const dept = (form.elements.namedItem('dept') as HTMLSelectElement).value;

      const newEmp: Employee = {
          id: Math.random().toString(),
          name,
          email,
          role: 'Employee',
          status: 'Pending',
          department: dept,
          wellnessScore: 0,
          assignedTasks: [],
          lastCheckIn: '-'
      };
      setEmployees([...employees, newEmp]);
      form.reset();
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiThinking(true);

    const context = {
      companyName: companyProfile.name,
      employees,
      logs: testLogs,
      currentFocus: 'Professional Burnout Index'
    };

    const response = await chatWithBusinessCoach(userMsg, context, chatMessages);

    setIsAiThinking(false);
    setChatMessages(prev => [...prev, { role: 'ai', text: response || "I apologize, I couldn't process that request." }]);
  };


  // --- VIEW 1: SETUP FORM ---
  if (appState === 'setup') {
      // (Setup form implementation remains same as previous turn)
      return (
        <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-6 font-sans">
           <div className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full border border-gray-100 flex flex-col md:flex-row overflow-hidden">
              <div className="md:w-1/3 bg-gray-900 p-12 text-white flex flex-col justify-between">
                 <div>
                    <Logo className="w-12 h-12 mb-8" />
                    <h1 className="text-3xl font-bold mb-4">Initialize Business Workspace.</h1>
                    <p className="text-gray-400 leading-relaxed">Set up your organizational profile to access enterprise-grade analytics, team management, and the AI Wellness Consultant.</p>
                 </div>
                 <div className="mt-12">
                    <div className="flex items-center gap-3 mb-4 opacity-50">
                        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold">1</div>
                        <span className="font-bold">Company Profile</span>
                    </div>
                    <div className="flex items-center gap-3 mb-4 opacity-30">
                        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold">2</div>
                        <span className="font-bold">Select Plan</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-30">
                        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold">3</div>
                        <span className="font-bold">Dashboard</span>
                    </div>
                 </div>
              </div>
              
              <div className="md:w-2/3 p-12">
                 <h2 className="text-2xl font-bold text-gray-900 mb-8">Company Details</h2>
                 <form onSubmit={handleSetupSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Company Name</label>
                          <input 
                            required
                            type="text" 
                            placeholder="Acme Inc."
                            value={companyProfile.name} 
                            onChange={(e) => setCompanyProfile({...companyProfile, name: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:border-[#0055FF] outline-none transition-all" 
                          />
                       </div>
                       <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Industry</label>
                           <select 
                               required
                               className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:border-[#0055FF] outline-none cursor-pointer"
                               onChange={(e) => setCompanyProfile({...companyProfile, industry: e.target.value})}
                           >
                               <option value="Technology">Technology</option>
                               <option value="Finance">Finance</option>
                               <option value="Healthcare">Healthcare</option>
                               <option value="Education">Education</option>
                               <option value="Other">Other</option>
                           </select>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Primary Admin</label>
                           <input required type="text" placeholder="Your Name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:border-[#0055FF] outline-none" onChange={(e) => setCompanyProfile({...companyProfile, adminName: e.target.value})}/>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Team Size</label>
                           <select required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:border-[#0055FF] outline-none cursor-pointer" onChange={(e) => setCompanyProfile({...companyProfile, size: e.target.value})}>
                               <option value="1-10">1-10</option>
                               <option value="11-50">11-50</option>
                               <option value="51-200">51-200</option>
                               <option value="200+">200+</option>
                           </select>
                        </div>
                    </div>

                    <div className="pt-8 flex justify-end">
                       <button type="submit" className="px-10 py-4 bg-[#0055FF] text-white rounded-xl font-bold text-lg shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2">
                           Next Step <span>→</span>
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      );
  }

  // --- VIEW 2: PRICING SELECTION ---
  if (appState === 'pricing') {
    const businessPlans = PRICING_PLANS.filter(p => p.isBusiness);
    return (
      <div className="min-h-screen bg-[#F9F7F2] py-20 px-6 font-sans">
         <div className="max-w-6xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-black text-gray-900 mb-4">Select your Workspace Plan</h1>
            <p className="text-gray-500 font-medium">Choose a plan to unlock the Admin HQ and start managing team wellness.</p>
         </div>
         
         <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {businessPlans.map(plan => (
              <div key={plan.id} className="bg-white rounded-[2.5rem] p-10 border-2 border-transparent hover:border-[#0055FF] shadow-2xl transition-all relative overflow-hidden group flex flex-col">
                 <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Logo className="w-32 h-32" />
                 </div>
                 
                 <h3 className="text-3xl font-black text-gray-900 mb-2">{plan.name}</h3>
                 <p className="text-gray-500 font-medium mb-8 h-12">{plan.description}</p>
                 
                 <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black text-[#0055FF]">${plan.priceUSD}</span>
                    <span className="text-gray-400 font-bold">/mo</span>
                 </div>

                 <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features?.map((f, i) => (
                       <li key={i} className="flex items-center gap-3 font-medium text-gray-700">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">✓</div>
                          {f}
                       </li>
                    ))}
                 </ul>

                 <button 
                   onClick={() => handlePlanSelection(plan)}
                   className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-[#0055FF] transition-all shadow-lg"
                 >
                    Select Plan
                 </button>
              </div>
            ))}
         </div>
         
         <div className="text-center mt-12">
            <button onClick={() => setAppState('setup')} className="text-gray-400 font-bold hover:text-gray-600">← Back to Profile</button>
         </div>

         {/* Payment Modal */}
         {selectedPlanForPayment && (
            <PaymentGateway 
              plan={selectedPlanForPayment} 
              onClose={() => setSelectedPlanForPayment(null)} 
              onSuccess={handlePaymentSuccess} 
            />
         )}
      </div>
    );
  }

  // --- VIEW 3: HUB LANDING ---
  if (appState === 'hub') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#0055FF] rounded-full blur-[150px]"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FFD100] rounded-full blur-[150px]"></div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-12 md:p-20 shadow-2xl max-w-5xl w-full text-center border border-white/10 relative z-10">
           <div className="mb-12">
              <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">{companyProfile.name} <span className="text-[#FFD100]">Hub</span></h1>
              <p className="text-xl text-gray-400 font-medium">Secure Organization Workspace</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Employee Login */}
              <button onClick={() => setAppState('employee')} className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:border-[#FFD100] hover:bg-gray-50 transition-all text-left relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">👋</div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Employee Portal</h3>
                    <p className="text-sm font-bold text-gray-400 group-hover:text-gray-600">Access assigned protocols and personal wellness dashboard.</p>
                 </div>
              </button>
              
              {/* Admin Login - Checked against Subscription */}
              <button 
                onClick={() => isSubscribed ? setAppState('admin') : alert("Subscription required.")} 
                className="group p-10 rounded-[2.5rem] bg-[#0055FF] text-white hover:bg-blue-600 transition-all text-left shadow-2xl relative overflow-hidden"
              >
                 <div className="relative z-10">
                    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">🔐</div>
                    <h3 className="text-2xl font-black mb-2">Admin HQ</h3>
                    <p className="text-sm font-bold text-blue-200 group-hover:text-white">Manage roster, view analytics, and billing.</p>
                    
                    {!isSubscribed && (
                        <span className="inline-block mt-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">Payment Required</span>
                    )}
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              </button>
           </div>
           
           <div className="mt-12">
              <Link to="/" className="text-gray-500 font-bold hover:text-white transition-colors text-sm">Return to Home</Link>
           </div>
        </div>
      </div>
    );
  }

  // --- VIEW 4: EMPLOYEE VIEW ---
  if (appState === 'employee') {
     const me = employees[0]; 
     return (
       <div className="min-h-screen bg-[#F9F7F2] font-sans pb-20">
          <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-40">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFD100] rounded-full flex items-center justify-center font-black">SC</div>
                <span className="font-bold text-gray-900">Sarah's Workspace</span>
             </div>
             <button onClick={() => setAppState('hub')} className="text-xs font-bold text-gray-400 hover:text-red-500">Log Out</button>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-12">
             <header className="mb-12">
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">My <span className="text-[#0055FF]">Assignments.</span></h1>
                <p className="text-xl text-gray-500 font-medium">You have <span className="text-gray-900 font-bold">{me.assignedTasks.filter(t => !t.complete).length} pending</span> protocols to complete this week.</p>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {me.assignedTasks.map(task => {
                  const testDetails = ALL_TESTS.find(t => t.id === task.testId);
                  if (!testDetails) return null;
                  
                  return (
                    <div key={task.id} className={`rounded-[2.5rem] p-8 border transition-all relative overflow-hidden group ${task.complete ? 'bg-gray-100 border-gray-200 opacity-80' : 'bg-white border-gray-100 shadow-xl hover:shadow-2xl'}`}>
                       <div className="absolute top-0 left-0 w-full h-32 overflow-hidden opacity-20 group-hover:opacity-30 transition-opacity">
                          <img src={testDetails.image} className="w-full h-full object-cover" alt="" />
                       </div>
                       
                       <div className="relative z-10 pt-20">
                          <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 ${task.complete ? 'bg-emerald-100 text-emerald-600' : 'bg-[#FFD100] text-gray-900'}`}>
                             {task.complete ? 'Completed' : `Due: ${task.dueDate}`}
                          </span>
                          <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{task.title}</h3>
                          <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-2">{testDetails.description}</p>
                          
                          {task.complete ? (
                             <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                <span>✓</span> Protocol Finished
                             </div>
                          ) : (
                             <Link 
                               to={`/test/${testDetails.id}`} 
                               className="block w-full py-4 bg-[#0055FF] text-white text-center rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                             >
                               Start Protocol
                             </Link>
                          )}
                       </div>
                    </div>
                  );
                })}
                
                {me.assignedTasks.length === 0 && (
                   <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold text-lg">No active assignments.</p>
                      <p className="text-sm text-gray-300">Great job! You're all caught up.</p>
                   </div>
                )}
             </div>
          </div>
       </div>
     );
  }

  // --- VIEW 5: ADMIN DASHBOARD ---
  // (Admin Dashboard implementation remains the same, but using the updated mock data and state)
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row relative">
       {/* Professional Sidebar */}
       <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen z-30">
          <div className="p-8 border-b border-gray-100 flex items-center gap-3">
             <div className="w-10 h-10 bg-[#0055FF] rounded-lg flex items-center justify-center text-white font-black">HQ</div>
             <div>
                <h2 className="text-sm font-black text-gray-900">{companyProfile.name}</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Admin Console</p>
             </div>
          </div>
          
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
             {[
               { id: 'overview', icon: '📊', label: 'Dashboard' },
               { id: 'team roster', icon: '👥', label: 'Personnel' },
               { id: 'analytics', icon: '📈', label: 'Analytics' },
               { id: 'billing & plans', icon: '💳', label: 'Billing' },
               { id: 'settings', icon: '⚙️', label: 'Settings' }
             ].map(item => (
               <button 
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full text-left py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center gap-4 ${
                    activeTab === item.id 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                 }`}
               >
                 <span>{item.icon}</span>
                 {item.label}
               </button>
             ))}
          </nav>

          <div className="p-6 border-t border-gray-100">
             <button 
                onClick={() => setIsAiOpen(true)}
                className="w-full mb-4 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-purple-900/20 transition-all hover:scale-[1.02] text-white"
             >
                 <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">✨</div>
                 <div className="text-left">
                    <p className="text-[10px] font-bold opacity-80 uppercase">Gemini AI</p>
                    <p className="text-xs font-black">Consultant</p>
                 </div>
             </button>

             <button onClick={() => setAppState('hub')} className="w-full py-3 text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-2 justify-center border border-gray-200 rounded-xl hover:border-red-200 transition-all">
                Exit Console
             </button>
          </div>
       </aside>

       {/* Main Content Area */}
       <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-gray-50">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
             <div>
                <h1 className="text-2xl font-black text-gray-900 capitalize">{activeTab}</h1>
                <p className="text-sm text-gray-500 font-medium">Real-time data for {companyProfile.name}</p>
             </div>
             <div className="flex gap-4">
                <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-500 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   System Healthy
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 border border-white shadow-sm">
                   {companyProfile.adminName.charAt(0)}
                </div>
             </div>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
             <div className="max-w-6xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Employees</p>
                      <p className="text-3xl font-black text-gray-900">{employees.length}</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Completion Rate</p>
                      <p className="text-3xl font-black text-[#0055FF]">82%</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Avg Wellness</p>
                      <p className="text-3xl font-black text-emerald-500">7.8</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">At Risk</p>
                      <p className="text-3xl font-black text-red-500">2</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Assessments</h3>
                      <div className="space-y-4">
                         {testLogs.slice(0, 5).map((log, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0055FF] flex items-center justify-center text-xs font-bold">
                                     {log.employeeName.charAt(0)}
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold text-gray-900">{log.employeeName}</p>
                                     <p className="text-xs text-gray-400">{log.testName}</p>
                                  </div>
                               </div>
                               <span className="text-xs font-mono text-gray-400">{new Date(log.date).toLocaleDateString()}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                      <div className="relative z-10">
                         <h3 className="text-xl font-bold mb-4">Weekly Pulse Check</h3>
                         <p className="text-sm text-gray-400 mb-8">Schedule the "Professional Burnout Index" for the Engineering team to track release cycle fatigue.</p>
                         <button 
                            onClick={() => setActiveTab('team roster')}
                            className="bg-[#0055FF] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors"
                         >
                            Go to Scheduler
                         </button>
                      </div>
                      <div className="absolute top-0 right-0 w-40 h-40 bg-[#0055FF]/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                   </div>
                </div>
             </div>
          )}

          {/* TEAM ROSTER TAB */}
          {activeTab === 'team roster' && (
             <div className="max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-lg font-bold text-gray-900">Personnel Directory</h3>
                   <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">+ Add Member</button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                     <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                           <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                 <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest">Name</th>
                                 <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest">Dept</th>
                                 <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest">Score</th>
                                 <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                              {employees.map(emp => (
                                 <tr key={emp.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                       <div className="font-bold text-gray-900 text-sm">{emp.name}</div>
                                       <div className="text-xs text-gray-400">{emp.email}</div>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-gray-600">{emp.department}</td>
                                    <td className="p-4">
                                       <div className={`text-xs font-bold px-2 py-1 rounded inline-block ${emp.wellnessScore > 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                          {emp.wellnessScore}%
                                       </div>
                                    </td>
                                    <td className="p-4">
                                       <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>

                     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Assign</h3>
                        <form 
                          onSubmit={(e) => {
                             e.preventDefault();
                             const form = e.target as HTMLFormElement;
                             handleAssignTest(form.test.value, form.assignee.value, form.date.value);
                          }}
                          className="space-y-4"
                        >
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Protocol</label>
                              <select name="test" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                                  {ALL_TESTS.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Assignee</label>
                              <select name="assignee" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                                  <option value="all">Everyone</option>
                                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Due Date</label>
                              <input type="date" name="date" required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" />
                           </div>
                           <button className="w-full bg-[#0055FF] text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">Assign</button>
                        </form>
                     </div>
                </div>
             </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
             <div className="max-w-6xl">
                 <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
                   <h3 className="text-lg font-bold text-gray-900 mb-6">Tests Completed by Department</h3>
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={[
                            { name: 'Engineering', count: testLogs.filter(l => l.department === 'Engineering').length },
                            { name: 'Sales', count: testLogs.filter(l => l.department === 'Sales').length },
                            { name: 'HR', count: testLogs.filter(l => l.department === 'HR').length },
                         ]}>
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="count" radius={[4, 4, 4, 4]} barSize={40}>
                               <Cell fill="#0055FF" />
                               <Cell fill="#FF6D00" />
                               <Cell fill="#10B981" />
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing & plans' && (
              <div className="max-w-6xl">
                 <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Current Subscription</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                       <div>
                          <p className="font-black text-gray-900">Organization Pro</p>
                          <p className="text-sm text-gray-500">Active • Renews Nov 24, 2024</p>
                       </div>
                       <button className="text-sm font-bold text-[#0055FF] hover:underline">Manage Payment Method</button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PRICING_PLANS.filter(p => p.isBusiness).map(plan => (
                       <div key={plan.id} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm opacity-60 hover:opacity-100 transition-opacity">
                          <h4 className="font-bold text-gray-900 mb-2">{plan.name}</h4>
                          <p className="text-2xl font-black text-gray-900 mb-4">${plan.priceUSD}<span className="text-xs text-gray-400">/mo</span></p>
                          <button className="w-full py-2 border-2 border-gray-200 rounded-lg font-bold text-sm text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all">Switch Plan</button>
                       </div>
                    ))}
                 </div>
              </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
             <div className="max-w-3xl">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                   <h3 className="text-lg font-bold text-gray-900 mb-6">General Configuration</h3>
                   <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Company Name</label>
                         <input type="text" value={companyProfile.name} onChange={(e) => setCompanyProfile({...companyProfile, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-medium text-gray-900 focus:border-[#0055FF] outline-none" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Region</label>
                         <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-medium text-gray-900 outline-none">
                            <option>North America</option>
                            <option>Europe</option>
                            <option>Asia Pacific</option>
                         </select>
                      </div>
                      <button className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800">Save Changes</button>
                   </div>
                </div>
             </div>
          )}

       </main>

       {/* AI CONSULTANT SLIDE-OVER */}
       <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col ${isAiOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">✨</div>
                <div>
                  <h3 className="font-bold text-sm">Gemini Consultant</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Business Intelligence</p>
                </div>
             </div>
             <button onClick={() => setIsAiOpen(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
             {chatMessages.map((msg, i) => (
               <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-[#0055FF] text-white rounded-br-none' 
                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'
                  }`}>
                    {msg.role === 'ai' ? (
                      <ReactMarkdown components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                        li: ({node, ...props}) => <li className="text-gray-600" {...props} />,
                      }}>
                        {msg.text}
                      </ReactMarkdown>
                    ) : msg.text}
                  </div>
               </div>
             ))}
             {isAiThinking && (
               <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex gap-1 items-center">
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
               </div>
             )}
             <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
             <form onSubmit={handleAiSubmit} className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask for insights..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-10 py-3 text-sm focus:outline-none focus:border-[#0055FF] transition-all"
                  disabled={isAiThinking}
                />
                <button 
                  type="submit" 
                  disabled={isAiThinking || !chatInput.trim()}
                  className="absolute right-2 top-2 bottom-2 w-8 bg-[#0055FF] text-white rounded flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  ↑
                </button>
             </form>
          </div>
       </div>

       {/* Payment Modal Wrapper */}
       {selectedPlanForPayment && (
           <PaymentGateway 
             plan={selectedPlanForPayment} 
             onClose={() => setSelectedPlanForPayment(null)} 
             onSuccess={handlePaymentSuccess} 
           />
       )}
    </div>
  );
};

export default BusinessHub;
