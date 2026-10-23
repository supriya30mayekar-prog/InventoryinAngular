import React from 'react';
import { 
  Boxes, 
  Users, 
  Terminal, 
  Code2, 
  History, 
  Plus, 
  Download, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { sqlDb } from '../services/sqlDbService';

export type ActiveTab = 'inventory' | 'users' | 'sql_console' | 'architecture' | 'audit_log';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenCreateModal: () => void;
  onDownloadZip: () => void;
  onResetDb: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenCreateModal,
  onDownloadZip,
  onResetDb,
}) => {
  const stats = sqlDb.getStatistics();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-white shadow-lg">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Stack Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-red-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Boxes className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">InventoryHub</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                  v2.0
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <span className="text-red-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                  Angular 18
                </span>
                <span>•</span>
                <span className="text-purple-400 font-semibold">.NET 8 Web API</span>
                <span>•</span>
                <span className="text-sky-400 font-semibold">SQL DB</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center space-x-4 bg-slate-800/80 px-4 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Total Items:</span>
              <span className="font-semibold text-white">{stats.totalItems}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Assigned:</span>
              <span className="font-semibold text-blue-400">{stats.assignedCount}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Available:</span>
              <span className="font-semibold text-emerald-400">{stats.availableCount}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Total Value:</span>
              <span className="font-semibold text-amber-400">
                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onResetDb}
              title="Reset Database to Seed State"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={onDownloadZip}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors shadow-sm"
              title="Export Full Angular + .NET + SQL Project ZIP"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span>Export Solution (.ZIP)</span>
            </button>

            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-lg shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Asset</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-t border-slate-800/80 pt-1 -mb-px overflow-x-auto scrollbar-none">
          <button
            onClick={() => onTabChange('inventory')}
            className={`flex items-center space-x-2 py-2.5 px-3.5 border-b-2 font-medium text-xs whitespace-nowrap transition-all ${
              activeTab === 'inventory'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Boxes className="h-4 w-4" />
            <span>User Inventory (CRUD)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
              {stats.totalItems}
            </span>
          </button>

          <button
            onClick={() => onTabChange('users')}
            className={`flex items-center space-x-2 py-2.5 px-3.5 border-b-2 font-medium text-xs whitespace-nowrap transition-all ${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Employees & Allocations</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
              {stats.totalUsers}
            </span>
          </button>

          <button
            onClick={() => onTabChange('sql_console')}
            className={`flex items-center space-x-2 py-2.5 px-3.5 border-b-2 font-medium text-xs whitespace-nowrap transition-all ${
              activeTab === 'sql_console'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Terminal className="h-4 w-4 text-sky-400" />
            <span>SQL Database Studio</span>
            <span className="px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 text-[9px] uppercase tracking-wider font-semibold">
              Live
            </span>
          </button>

          <button
            onClick={() => onTabChange('architecture')}
            className={`flex items-center space-x-2 py-2.5 px-3.5 border-b-2 font-medium text-xs whitespace-nowrap transition-all ${
              activeTab === 'architecture'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Code2 className="h-4 w-4 text-purple-400" />
            <span>Angular + .NET Code</span>
          </button>

          <button
            onClick={() => onTabChange('audit_log')}
            className={`flex items-center space-x-2 py-2.5 px-3.5 border-b-2 font-medium text-xs whitespace-nowrap transition-all ${
              activeTab === 'audit_log'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <History className="h-4 w-4 text-emerald-400" />
            <span>Activity & SQL Traces</span>
          </button>
        </div>
      </div>
    </header>
  );
};
