import React from 'react';
import { Bell, Search, ShieldAlert } from 'lucide-react';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSearch }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">Titan</h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide">MASTER INTENT DASHBOARD</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tickets, logs..." 
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-slate-700 placeholder-slate-400"
          />
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
          AD
        </div>
      </div>
    </header>
  );
};