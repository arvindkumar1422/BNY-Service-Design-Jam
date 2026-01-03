import React, { useState, useEffect } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { StatCard } from './components/StatCard';
import { LiveFeed } from './components/LiveFeed';
import { AgentVisualizer } from './components/AgentVisualizer';
import { AlertPanel } from './components/AlertPanel';
import { TeamDetailModal } from './components/TeamDetailModal';
import { processNewTicket } from './services/workflowSimulator';
import { Ticket, TeamAlert } from './types';
import { Activity, Shield, Users, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [alerts, setAlerts] = useState<TeamAlert[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Search State
  const [globalSearch, setGlobalSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{team: string, ticket: Ticket | null}>({ team: '', ticket: null });
  
  // Simulation Loop - Always Running
  useEffect(() => {
    const interval = setInterval(() => {
        const { ticket, newAlerts } = processNewTicket();
        
        setTickets(prev => {
          const updated = [ticket, ...prev].slice(0, 50); // Keep last 50
          return updated;
        });

        if (newAlerts.length > 0) {
          setAlerts(prev => {
            const combined = [...newAlerts, ...prev];
            // Filter to keep only max 10 latest alerts per team to prevent dumping
            const teams = ['SUPPORT', 'PRODUCT', 'ENGINEERING', 'LEGAL'] as const;
            let filtered: TeamAlert[] = [];
            
            teams.forEach(team => {
                const teamAlerts = combined.filter(a => a.team === team).slice(0, 10);
                filtered = [...filtered, ...teamAlerts];
            });

            // Sort by timestamp descending
            return filtered.sort((a, b) => b.timestamp - a.timestamp);
          });
        }
      }, 3500); // New ticket every 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleTeamClick = (ticket: Ticket) => {
      setModalData({ team: ticket.assignedTeam, ticket: ticket });
      setIsModalOpen(true);
  };

  // Filter Logic
  const filteredTickets = tickets.filter(ticket => 
    ticket.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
    ticket.userId.toLowerCase().includes(globalSearch.toLowerCase()) ||
    ticket.content.toLowerCase().includes(globalSearch.toLowerCase()) ||
    ticket.intent.toLowerCase().includes(globalSearch.toLowerCase()) ||
    ticket.assignedTeam.toLowerCase().includes(globalSearch.toLowerCase())
  );

  // Stats
  const highRiskCount = tickets.filter(t => t.riskLevel === 'HIGH' || t.riskLevel === 'CRITICAL').length;
  const slaBreachCount = tickets.filter(t => t.isSlaBreach).length;
  const avgRiskScore = tickets.length > 0 
    ? Math.round(tickets.reduce((acc, t) => acc + t.riskScore, 0) / tickets.length) 
    : 0;

  // Chart Data Preparation
  const intentData = [
    { name: 'Queries', value: tickets.filter(t => t.intent === 'QUERY').length },
    { name: 'Feedback', value: tickets.filter(t => t.intent === 'FEEDBACK').length },
    { name: 'Feature', value: tickets.filter(t => t.intent === 'FEATURE').length },
    { name: 'Complaint', value: tickets.filter(t => t.intent === 'COMPLAINT').length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen">
      <DashboardHeader onSearch={setGlobalSearch} />
      
      <TeamDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        team={modalData.team} 
        ticket={modalData.ticket}
      />

      <main className="flex-1 overflow-hidden flex">
        {/* Main Dashboard Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 scroll-smooth">
          
          {/* Controls & Stats Row */}
          <div className="mb-6 flex justify-between items-end">
            <h2 className="text-xl font-bold text-slate-800">System Overview</h2>
            {/* Simulation controls removed as requested */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Active Tickets" 
              value={tickets.length} 
              icon={<Activity className="w-6 h-6 text-indigo-600" />} 
              colorClass="bg-indigo-600"
              trend="12% from last hour"
              trendUp={true}
            />
            <StatCard 
              title="High Risk Events" 
              value={highRiskCount} 
              icon={<Shield className="w-6 h-6 text-rose-600" />} 
              colorClass="bg-rose-600"
              trend={highRiskCount > 5 ? "Critical Level" : "Stable"}
              trendUp={highRiskCount < 5}
            />
             <StatCard 
              title="SLA Warnings" 
              value={slaBreachCount} 
              icon={<Clock className="w-6 h-6 text-amber-600" />} 
              colorClass="bg-amber-600"
              trend="Timeline Analysis Active"
              trendUp={true}
            />
             <StatCard 
              title="Avg Risk Score" 
              value={avgRiskScore} 
              icon={<Users className="w-6 h-6 text-emerald-600" />} 
              colorClass="bg-emerald-600"
              trend={avgRiskScore < 50 ? "Healthy" : "Attention Needed"}
              trendUp={avgRiskScore < 50}
            />
          </div>

          {/* Grid Layout for Feed and Visualizer */}
          <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
            {/* Left Col: Live Feed (5 cols) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
               <LiveFeed 
                tickets={filteredTickets} 
                onSelectTicket={setSelectedTicket} 
                selectedTicketId={selectedTicket?.id} 
                onTeamClick={handleTeamClick}
               />
               
               {/* Charts Section under Feed */}
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                 <h3 className="text-sm font-bold text-slate-700 mb-4">Intent Distribution</h3>
                 <div className="h-40">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={intentData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="name" hide />
                       <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                       <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {intentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                       </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
            </div>

            {/* Middle Col: Deep Dive (4 cols) */}
            <div className="col-span-12 lg:col-span-4 h-full">
               <AgentVisualizer ticket={selectedTicket || (filteredTickets.length > 0 ? filteredTickets[0] : null)} />
            </div>

            {/* Right Col: Team Alerts (3 cols) */}
            <div className="col-span-12 lg:col-span-3 h-full">
               <AlertPanel alerts={alerts} onResolveAlert={handleResolveAlert} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;