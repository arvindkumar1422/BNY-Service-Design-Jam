import React, { useState } from 'react';
import { Ticket, WorkflowLog } from '../types';
import { Bot, Check, AlertCircle, Clock, ShieldCheck, XCircle, ArrowRight, Search } from 'lucide-react';

interface AgentVisualizerProps {
  ticket: Ticket | null;
}

const LogStep: React.FC<{ log: WorkflowLog; isLast: boolean }> = ({ log, isLast }) => {
  let Icon = Bot;
  let colorClass = 'bg-slate-100 text-slate-600';
  let borderClass = 'border-slate-300';

  if (log.outcome === 'PASS') {
    Icon = Check;
    colorClass = 'bg-emerald-100 text-emerald-600';
    borderClass = 'border-emerald-200';
  } else if (log.outcome === 'FLAG') {
    Icon = AlertCircle;
    colorClass = 'bg-amber-100 text-amber-600';
    borderClass = 'border-amber-200';
  } else if (log.outcome === 'FAIL') {
    Icon = XCircle;
    colorClass = 'bg-rose-100 text-rose-600';
    borderClass = 'border-rose-200';
  }

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-200"></div>
      )}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${borderClass} ${colorClass} z-10 bg-white`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative top-[-6px]">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-sm font-bold text-slate-800">{log.agentName}</h4>
          <span className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
        </div>
        <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">{log.action}</div>
        <p className="text-sm text-slate-600">{log.details}</p>
      </div>
    </div>
  );
};

export const AgentVisualizer: React.FC<AgentVisualizerProps> = ({ ticket }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!ticket) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col items-center justify-center p-8 text-slate-400">
        <Bot className="w-16 h-16 mb-4 opacity-20" />
        <p>Select a ticket from the Live Feed to visualize the agent workflow.</p>
      </div>
    );
  }

  const filteredLogs = ticket.logs.filter(log => 
    log.agentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-slate-800 text-lg">Ticket Logic Chain</h2>
            <p className="text-sm text-slate-500 mt-1">
              Visualizing automated decision path for <span className="font-mono font-medium text-slate-700">#{ticket.id}</span>
            </p>
          </div>
          <div className="text-right">
             <div className="text-xs font-bold text-slate-400 uppercase">SLA Deadline</div>
             <div className={`text-sm font-mono font-bold ${ticket.isSlaBreach ? 'text-rose-600' : 'text-emerald-600'}`}>
                {new Date(ticket.slaDeadline).toLocaleTimeString()}
             </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg">
            <p className="text-sm text-slate-700 italic">"{ticket.content}"</p>
        </div>
        
        {/* Search Bar for Logic Chain */}
        <div className="mt-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="Search workflow steps..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400"
            />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        <div className="max-w-xl mx-auto">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
               <LogStep key={index} log={log} isLast={index === filteredLogs.length - 1} />
            ))
          ) : (
             <div className="text-center text-slate-400 py-8 text-sm">No steps match your search.</div>
          )}
          
          {/* Final State Indicator - only show if no search or if search doesn't filter it out implies complex logic so just hiding it on search for simplicity unless matches "Final" */}
          {searchQuery === '' && (
            <div className="relative flex gap-4 mt-8 pt-4 border-t border-slate-200 border-dashed">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-slate-800 text-white z-10">
                <ArrowRight className="w-5 h-5" />
                </div>
                <div className="flex-1 pt-2">
                    <h4 className="text-sm font-bold text-slate-800">Workflow Complete</h4>
                    <p className="text-xs text-slate-500">
                        Final Status: <span className="font-bold">{ticket.status}</span> • Assigned: <span className="font-bold">{ticket.assignedTeam}</span>
                    </p>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};