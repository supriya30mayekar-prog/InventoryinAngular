import React, { useState } from 'react';
import { History, Terminal, Clock, Copy, Check, Filter, Layers, Database } from 'lucide-react';
import { sqlDb } from '../services/sqlDbService';
import { AuditLog, SqlTrace } from '../types/inventory';

export const AuditLogViewer: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewType, setViewType] = useState<'audit' | 'traces'>('traces');

  const auditLogs = sqlDb.getAuditLogs();
  const traces = sqlDb.getTraces();

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
      case 'CREATE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">INSERT / CREATE</span>;
      case 'UPDATE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">UPDATE</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">DELETE</span>;
      case 'ASSIGN':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">ASSIGN / CHECKOUT</span>;
      case 'RETURN':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">RETURN / CHECKIN</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-500/10 text-slate-400">LOG</span>;
    }
  };

  const filteredLogs = auditLogs.filter(l => {
    if (activeFilter === 'all') return true;
    return l.action === activeFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Real-Time CRUD Activity & SQL Tracing</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Live Audit Stream
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every Angular CRUD action and EF Core query executed against the relational SQL database
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center space-x-1">
            <button
              onClick={() => setViewType('traces')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewType === 'traces'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SQL Query Traces ({traces.length})
            </button>
            <button
              onClick={() => setViewType('audit')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewType === 'audit'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Business Audit Trail ({auditLogs.length})
            </button>
          </div>
        </div>
      </div>

      {viewType === 'traces' ? (
        /* Real-Time SQL Traces View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-xs text-white flex items-center space-x-2 font-mono">
              <Terminal className="h-4 w-4 text-sky-400" />
              <span>Live Database Query Stream</span>
            </h3>
            <span className="text-xs text-slate-400">
              Captures all SELECT, INSERT, UPDATE, DELETE queries
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {traces.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No SQL queries recorded yet. Perform an inventory CRUD operation to see live traces.
              </div>
            ) : (
              traces.map((trace) => (
                <div key={trace.id} className="p-4 hover:bg-slate-800/30 transition-colors space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          trace.operation === 'SELECT'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : trace.operation === 'INSERT'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : trace.operation === 'UPDATE'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {trace.operation}
                      </span>
                      <span className="font-mono text-slate-300 font-medium">{trace.origin}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span className="text-emerald-400 font-semibold">{trace.durationMs}ms</span>
                      </span>
                      <span>•</span>
                      <span>{trace.rowsAffected} rows</span>
                      <span>•</span>
                      <span>{trace.timestamp}</span>
                      <button
                        onClick={() => handleCopy(trace.id, trace.sql)}
                        className="p-1 hover:text-white transition-colors"
                        title="Copy SQL"
                      >
                        {copiedId === trace.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <pre className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-sky-300 whitespace-pre-wrap overflow-x-auto border border-slate-800/80">
                    {trace.sql}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Business Audit Trail */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-300">Filter by Event:</span>
              <div className="flex space-x-1">
                {['all', 'CREATE', 'UPDATE', 'DELETE', 'ASSIGN', 'RETURN'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={`px-2 py-1 rounded text-[11px] transition-colors ${
                      activeFilter === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs text-slate-400">{filteredLogs.length} events logged</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-800/30 transition-colors space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2.5">
                    {getActionBadge(log.action)}
                    <span className="font-semibold text-white">{log.entityName}</span>
                    <span className="text-slate-500 font-mono text-[11px]">({log.entityType})</span>
                  </div>

                  <span className="text-slate-400 text-[11px] font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{log.details}</p>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-[11px] font-mono text-sky-400 flex items-center justify-between">
                  <span className="truncate pr-2">{log.sqlExecuted}</span>
                  <button
                    onClick={() => handleCopy(log.id, log.sqlExecuted)}
                    className="p-1 hover:text-white transition-colors shrink-0"
                    title="Copy SQL"
                  >
                    {copiedId === log.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
