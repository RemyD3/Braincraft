
import React, { useState } from 'react';
import { Employee, BusinessProfile } from '../types';
import { ALL_TESTS } from '../constants';

const BusinessDashboard: React.FC = () => {
  // Mock Data
  const [profile, setProfile] = useState<BusinessProfile>({
    companyName: "Acme Corp",
    weeklyFocus: "stress-burnout",
    employees: [
      { id: '1', name: 'Sarah Connor', email: 'sarah@acme.com', role: 'Employee', status: 'Active', lastCheckIn: '2024-10-24', department: 'Engineering', wellnessScore: 78, assignedTasks: [] },
      { id: '2', name: 'John Smith', email: 'john@acme.com', role: 'Employee', status: 'Needs Attention', lastCheckIn: '2024-10-10', department: 'Sales', wellnessScore: 45, assignedTasks: [] },
      { id: '3', name: 'Elena Fisher', email: 'elena@acme.com', role: 'Admin', status: 'Active', lastCheckIn: '2024-10-23', department: 'HR', wellnessScore: 92, assignedTasks: [] },
      { id: '4', name: 'Nathan Drake', email: 'nathan@acme.com', role: 'Employee', status: 'Pending', lastCheckIn: '-', department: 'Marketing', wellnessScore: 0, assignedTasks: [] },
    ],
    announcements: []
  });

  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp: Employee = {
      id: Math.random().toString(),
      name: newEmployeeName,
      email: newEmployeeEmail,
      role: 'Employee',
      status: 'Pending',
      lastCheckIn: '-',
      department: 'General',
      wellnessScore: 0,
      assignedTasks: []
    };
    setProfile({ ...profile, employees: [...profile.employees, newEmp] });
    setNewEmployeeName('');
    setNewEmployeeEmail('');
  };

  const handleWeeklyTestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfile({ ...profile, weeklyFocus: e.target.value });
  };

  const activeTest = ALL_TESTS.find(t => t.id === profile.weeklyFocus);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans bg-[#F9F7F2] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Business Portal</h1>
          <p className="text-gray-500 font-medium">Welcome back, {profile.companyName} Admin</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
              <span className="block text-xs font-bold text-gray-400 uppercase">Team Size</span>
              <span className="text-2xl font-black text-gray-900">{profile.employees.length}</span>
           </div>
           <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
              <span className="block text-xs font-bold text-gray-400 uppercase">Avg Wellness</span>
              <span className="text-2xl font-black text-emerald-600">72%</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Weekly Focus Card */}
        <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] lg:col-span-1 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xs font-bold text-[#FFD100] uppercase tracking-widest mb-6">This Week's Focus</h3>
            <div className="mb-6">
               <p className="text-2xl font-bold mb-2">{activeTest?.title}</p>
               <p className="text-gray-400 text-sm line-clamp-2">{activeTest?.description}</p>
            </div>
            
            <div className="mb-6">
               <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Change Assignment</label>
               <select 
                 value={profile.weeklyFocus}
                 onChange={handleWeeklyTestChange}
                 className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-[#0055FF] cursor-pointer"
               >
                 {ALL_TESTS.map(t => (
                   <option key={t.id} value={t.id} className="text-gray-900">{t.title}</option>
                 ))}
               </select>
            </div>

            <button className="w-full py-3 bg-[#0055FF] rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors">
              Notify Team
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0055FF]/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        </div>

        {/* Add Employee Form */}
        <div className="bg-white p-8 rounded-[2.5rem] lg:col-span-2 shadow-lg border border-gray-100">
           <h3 className="text-xl font-bold text-gray-900 mb-6">Invite Team Member</h3>
           <form onSubmit={handleAddEmployee} className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={newEmployeeName}
                onChange={e => setNewEmployeeName(e.target.value)}
                required
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0055FF] transition-colors"
              />
              <input 
                type="email" 
                placeholder="Work Email" 
                value={newEmployeeEmail}
                onChange={e => setNewEmployeeEmail(e.target.value)}
                required
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0055FF] transition-colors"
              />
              <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors">
                Send Invite
              </button>
           </form>
           <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex items-start gap-3">
             <span className="text-xl">ℹ️</span>
             <p className="text-sm text-blue-800 font-medium">New employees will receive an email with instructions to set up their "MyBrainCraft" profile and take the initial onboarding assessment.</p>
           </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-[2.5rem] shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
           <h3 className="text-xl font-bold text-gray-900">Personnel Roster</h3>
           <button className="text-[#0055FF] font-bold text-sm hover:underline">Download Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Name</th>
                <th className="text-left py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Department</th>
                <th className="text-left py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="text-left py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Wellness Score</th>
                <th className="text-right py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {profile.employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-8">
                    <div className="font-bold text-gray-900">{emp.name}</div>
                    <div className="text-xs text-gray-500">{emp.email}</div>
                  </td>
                  <td className="py-4 px-8 text-sm font-medium text-gray-600">{emp.department}</td>
                  <td className="py-4 px-8">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      emp.status === 'Needs Attention' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-4 px-8">
                     {emp.status === 'Pending' ? (
                       <span className="text-gray-400 text-sm">-</span>
                     ) : (
                       <div className="flex items-center gap-2">
                         <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${emp.wellnessScore > 70 ? 'bg-emerald-500' : emp.wellnessScore > 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{width: `${emp.wellnessScore}%`}}></div>
                         </div>
                         <span className="text-sm font-bold">{emp.wellnessScore}%</span>
                       </div>
                     )}
                  </td>
                  <td className="py-4 px-8 text-right">
                    <button className="text-gray-400 hover:text-[#0055FF] font-bold text-sm">View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;