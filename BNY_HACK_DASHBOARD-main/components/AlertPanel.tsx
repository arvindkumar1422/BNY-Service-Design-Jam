import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XOctagon, Zap, ChevronDown, ChevronUp, Bell, X, Check } from 'lucide-react';
import { TeamAlert } from '../types';

interface AlertPanelProps {
  alerts: TeamAlert[];
  onResolveAlert: (id: string) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onResolveAlert }) => {
  // Group alerts by team
  const teams = ['SUPPORT', 'PRODUCT', 'ENGINEERING', 'LEGAL'] as const;
  
  // State for expanded dropdowns
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

  const toggleTeam = (team: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [team]: !prev[team]
    }));
  };
  
  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'CRITICAL': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'WARNING': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getSeverityIcon = (sev: string) => {
    switch(sev) {
      case 'CRITICAL': return <XOctagon className="w-4 h-4 shrink-0" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4 shrink-0" />;
      default: return <Zap className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Active Team Alerts
        </h2>
        <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-bold">
          {alerts.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {teams.map(team => {
          const teamAlerts = alerts.filter(a => a.team === team);
          const isExpanded = expandedTeams[team];
          const count = teamAlerts.length;

          return (
            <div key={team} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <button 
                onClick={() => toggleTeam(team)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${isExpanded ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">{team} Team</h3>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Notification Badge */}
                    <div className="relative">
                        <Bell className={`w-4 h-4 ${count > 0 ? 'text-indigo-600' : 'text-slate-300'}`} />
                        {count > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                                {count}
                            </span>
                        )}
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  {teamAlerts.length === 0 ? (
                    <div className="text-center py-4 text-slate-400">
                       <p className="text-xs">No active alerts</p>
                    </div>
                  ) : (
                    teamAlerts.map(alert => (
                        <div key={alert.id} className={`p-3 rounded-lg border flex gap-3 items-start group relative ${getSeverityColor(alert.severity)}`}>
                          <div className="mt-0.5">
                              {getSeverityIcon(alert.severity)}
                          </div>
                          <div className="flex-1 pr-6">
                              <p className="text-sm font-semibold leading-tight mb-1">{alert.message}</p>
                              <p className="text-xs opacity-80 flex justify-between items-center">
                              <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                              <span className="font-mono">#{alert.ticketId}</span>
                              </p>
                          </div>
                          
                          {/* Resolve/Clear Button */}
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onResolveAlert(alert.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/50 text-current opacity-60 hover:opacity-100 transition-all"
                            title="Mark as Resolved"
                          >
                             <Check className="w-4 h-4" />
                          </button>
                        </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {alerts.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">All systems nominal.</p>
            <p className="text-xs">No active alerts requiring attention.</p>
          </div>
        )}
      </div>
    </div>
  );
};