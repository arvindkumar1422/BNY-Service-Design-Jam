import React from 'react';
import { Ticket, RiskLevel } from '../types';
import { Activity, ArrowRight, User } from 'lucide-react';

interface LiveFeedProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  selectedTicketId?: string;
  onTeamClick: (ticket: Ticket) => void;
}

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const colors = {
    LOW: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-blue-100 text-blue-700 border-blue-200',
    HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
    CRITICAL: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[level]}`}>
      {level} RISK
    </span>
  );
};

export const LiveFeed: React.FC<LiveFeedProps> = ({ tickets, onSelectTicket, selectedTicketId, onTeamClick }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500" />
          Live Workflow Feed
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 border-b border-slate-200">User / Time</th>
              <th className="px-4 py-3 border-b border-slate-200">Intent</th>
              <th className="px-4 py-3 border-b border-slate-200">Risk Analysis</th>
              <th className="px-4 py-3 border-b border-slate-200">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map(ticket => (
              <tr 
                key={ticket.id} 
                onClick={() => onSelectTicket(ticket)}
                className={`cursor-pointer hover:bg-slate-50 transition-colors ${selectedTicketId === ticket.id ? 'bg-indigo-50 hover:bg-indigo-50' : ''}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                      <User className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{ticket.userId}</p>
                      <p className="text-xs text-slate-400 font-mono">{new Date(ticket.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {ticket.intent}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <RiskBadge level={ticket.riskLevel} />
                    <span className="text-[10px] text-slate-400">Score: {ticket.riskScore}/100</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                   <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
                      {ticket.assignedTeam !== 'NONE' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onTeamClick(ticket);
                          }}
                          className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                        >
                          → {ticket.assignedTeam}
                        </button>
                      )}
                      {ticket.assignedTeam === 'NONE' && <ArrowRight className="w-3 h-3" />}
                   </div>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-slate-400 text-sm">
                  Waiting for incoming tickets...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};