import React from 'react';
import { Boxes, UserCheck, PackageCheck, Wrench, DollarSign, TrendingUp } from 'lucide-react';
import { sqlDb } from '../services/sqlDbService';

export const StatsCards: React.FC = () => {
  const stats = sqlDb.getStatistics();
  const assignedPercent = stats.totalItems > 0 ? Math.round((stats.assignedCount / stats.totalItems) * 100) : 0;
  const availablePercent = stats.totalItems > 0 ? Math.round((stats.availableCount / stats.totalItems) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Assets & Value */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Asset Portfolio</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center space-x-1 mt-1 text-xs text-slate-400">
              <Boxes className="h-3.5 w-3.5 text-indigo-400" />
              <span>{stats.totalItems} registered items across 6 categories</span>
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 2. Assigned Assets */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Assigned to Employees</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <h3 className="text-2xl font-bold text-blue-400">{stats.assignedCount}</h3>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {assignedPercent}% active
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${assignedPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 3. Available in Stock */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Available in Storage</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <h3 className="text-2xl font-bold text-emerald-400">{stats.availableCount}</h3>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {availablePercent}% ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Ready for instant onboarding checkout</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <PackageCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 4. Maintenance & Service */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Maintenance & Repair</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <h3 className="text-2xl font-bold text-amber-400">{stats.maintenanceCount}</h3>
              <span className="text-xs text-slate-400">
                {stats.retiredCount > 0 ? `+ ${stats.retiredCount} retired` : '0 retired'}
              </span>
            </div>
            <p className="text-xs text-amber-400/90 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Hardware lab inspection
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Wrench className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
