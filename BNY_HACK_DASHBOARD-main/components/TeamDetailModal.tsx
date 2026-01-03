import React from 'react';
import { X, Users, Phone, Mail, Clock, Shield, BarChart3, Zap, Target, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Ticket } from '../types';

interface TeamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: string;
  ticket: Ticket | null;
}

const TEAM_CONFIG: Record<string, any> = {
  SUPPORT: {
    lead: "Sarah Connor",
    role: "Global Support Director",
    email: "support.lead@titan.ai",
    capacity: 82,
    slaRate: 98.5,
    specialties: ["L1 Triage", "Account Access", "Billing"],
    color: "bg-indigo-600",
    lightColor: "bg-indigo-50 text-indigo-700",
    icon: Shield
  },
  PRODUCT: {
    lead: "Tony Stark",
    role: "Head of Product",
    email: "product.ops@titan.ai",
    capacity: 45,
    slaRate: 94.2,
    specialties: ["Roadmap", "UX Validation", "Beta Testing"],
    color: "bg-emerald-600",
    lightColor: "bg-emerald-50 text-emerald-700",
    icon: Target
  },
  ENGINEERING: {
    lead: "Bruce Banner",
    role: "VP of Engineering",
    email: "eng.oncall@titan.ai",
    capacity: 92,
    slaRate: 99.9,
    specialties: ["System Stability", "Bug Patches", "Performance"],
    color: "bg-blue-600",
    lightColor: "bg-blue-50 text-blue-700",
    icon: Zap
  },
  LEGAL: {
    lead: "Matt Murdock",
    role: "Chief Compliance Officer",
    email: "legal@titan.ai",
    capacity: 20,
    slaRate: 100,
    specialties: ["Compliance", "Risk Mitigation", "Policy"],
    color: "bg-slate-700",
    lightColor: "bg-slate-100 text-slate-700",
    icon: Shield
  }
};

export const TeamDetailModal: React.FC<TeamDetailModalProps> = ({ isOpen, onClose, team, ticket }) => {
  if (!isOpen || !ticket) return null;

  const config = TEAM_CONFIG[team] || TEAM_CONFIG['SUPPORT'];
  const Icon = config.icon;

  // Calculate dynamic metrics based on ticket data
  const estimatedResolutionTime = Math.max(15, Math.floor(120 - (ticket.riskScore * 0.5))); // minutes
  const confidenceScore = Math.floor(90 + (Math.random() * 9));
  
  // Format currency/numbers
  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className={`${config.color} p-6 text-white relative flex justify-between items-start`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold tracking-tight">{team} OPS CENTER</h2>
                <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                  Operational
                </span>
              </div>
              <p className="text-white/80 text-sm font-medium">Orchestrating response for Ticket #{ticket.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Team Intelligence (5 cols) */}
            <div className="md:col-span-5 space-y-6">
              {/* Team Lead Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg border-2 border-white shadow-sm">
                    {config.lead.split(' ').map((n:string) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{config.lead}</h4>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{config.role}</p>
                  </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">System Load</span>
                      <span className="font-bold text-slate-700">{config.capacity}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${config.capacity > 90 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${config.capacity}%` }}
                      ></div>
                   </div>
                   <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>Available Agents: {Math.floor(20 * (1 - config.capacity/100))}</span>
                      <span>Queue: {Math.floor(config.capacity * 1.5)}</span>
                   </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">SLA Adherence</p>
                    <p className="text-xl font-bold text-emerald-600">{config.slaRate}%</p>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Avg Response</p>
                    <p className="text-xl font-bold text-slate-700">12m</p>
                 </div>
              </div>

              {/* Specialties Tags */}
              <div className="flex flex-wrap gap-2">
                {config.specialties.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Analytics & Action (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Analytics Dashboard for Ticket */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                    Predictive Analytics
                  </h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-md border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">{confidenceScore}% Confidence</span>
                  </div>
                </div>
                
                <div className="p-5 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-medium text-slate-400 mb-1">Estimated Resolution Time</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-800">{formatTime(estimatedResolutionTime)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Based on historic {ticket.intent.toLowerCase()} data</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-slate-400 mb-1">Complexity Score</p>
                    <div className="flex items-center gap-2">
                       <span className={`text-3xl font-bold ${ticket.riskScore > 50 ? 'text-amber-500' : 'text-slate-800'}`}>
                         {ticket.riskScore}
                       </span>
                       <span className="text-sm text-slate-400">/ 100</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className={`h-1.5 w-full rounded-full ${i * 20 <= ticket.riskScore ? 'bg-amber-400' : 'bg-slate-100'}`}></div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Context & Action Plan */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                 
                 <h3 className="font-bold text-slate-800 mb-3 relative z-10">Context & Recommendation</h3>
                 
                 <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-4 text-sm text-slate-600 relative z-10">
                    <span className="font-bold text-slate-800 block mb-1">User Query:</span>
                    "{ticket.content}"
                 </div>

                 <div className="space-y-3 relative z-10">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1 bg-indigo-100 rounded-full">
                            <ArrowUpRight className="w-3 h-3 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Auto-Routing Logic</p>
                            <p className="text-xs text-slate-500">Routed to {team} due to intent classification "{ticket.intent}" and risk profile.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1 bg-emerald-100 rounded-full">
                            <Zap className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Suggested Action</p>
                            <p className="text-xs text-slate-500">Initiate standard workflow playbook #{Math.floor(Math.random()*1000)}. Verify user credentials before proceeding.</p>
                        </div>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Last updated: just now</span>
            </div>
            <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Lead
                </button>
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Desk
                </button>
                <button className={`px-6 py-2 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-xl hover:opacity-90 transition-all transform active:scale-95 ${config.color}`}>
                    Open Workspace
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};