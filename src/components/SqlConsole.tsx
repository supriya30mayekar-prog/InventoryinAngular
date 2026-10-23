import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  Database, 
  Table, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Download
} from 'lucide-react';
import { sqlDb } from '../services/sqlDbService';
import { SqlQueryResult } from '../types/inventory';

const SAMPLE_QUERIES = [
  {
    name: 'All Items with Assigned Users (JOIN)',
    sql: `SELECT i.id, i.sku, i.name, i.category, i.status, u.full_name AS assigned_user, u.email AS user_email, i.purchase_cost, i.location
FROM InventoryItems i
LEFT JOIN Users u ON i.assigned_to_user_id = u.id
ORDER BY i.updated_at DESC;`,
  },
  {
    name: 'Asset Count & Total Value by Category (GROUP BY)',
    sql: `SELECT category, 
       COUNT(*) AS total_items, 
       SUM(purchase_cost) AS total_value,
       AVG(purchase_cost) AS average_cost
FROM InventoryItems
GROUP BY category
ORDER BY total_value DESC;`,
  },
  {
    name: 'Available Stock in Storage (WHERE status = Available)',
    sql: `SELECT id, sku, name, category, serial_number, status, condition, purchase_cost, location
FROM InventoryItems
WHERE status = 'Available'
ORDER BY purchase_cost DESC;`,
  },
  {
    name: 'Hardware Under Maintenance',
    sql: `SELECT id, sku, name, category, serial_number, status, condition, purchase_cost, location
FROM InventoryItems
WHERE status = 'Maintenance';`,
  },
  {
    name: 'Active Employees with Allocated Asset Count',
    sql: `SELECT u.id, u.full_name, u.email, u.department, u.role, COUNT(i.id) AS assigned_items_count
FROM Users u
LEFT JOIN InventoryItems i ON u.id = i.assigned_to_user_id
GROUP BY u.id, u.full_name, u.email, u.department, u.role
ORDER BY assigned_items_count DESC;`,
  },
];

export const SqlConsole: React.FC = () => {
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].sql);
  const [result, setResult] = useState<SqlQueryResult>(() => sqlDb.executeCustomSql(SAMPLE_QUERIES[0].sql));
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'runner' | 'schema'>('runner');

  const handleExecute = () => {
    const res = sqlDb.executeCustomSql(query);
    setResult(res);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetDb = () => {
    if (confirm('Reset relational database to initial seed data?')) {
      sqlDb.seedDatabase();
      handleExecute();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Relational SQL Database Studio</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
                Transact-SQL / SQLite Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute live queries, inspect schemas, and view real database tables powering the .NET API
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab(activeSubTab === 'runner' ? 'schema' : 'runner')}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center space-x-1.5"
          >
            <Table className="h-3.5 w-3.5 text-sky-400" />
            <span>{activeSubTab === 'runner' ? 'View Table Schemas' : 'SQL Query Runner'}</span>
          </button>

          <button
            onClick={handleResetDb}
            title="Reset database to seed records"
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center space-x-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Database</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'runner' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Query Templates Sidebar */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Terminal className="h-4 w-4 text-sky-400" />
              <span>Query Templates</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Click any template to load into the editor:
            </p>

            <div className="space-y-1.5">
              {SAMPLE_QUERIES.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(sq.sql);
                    const res = sqlDb.executeCustomSql(sq.sql);
                    setResult(res);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                    query === sq.sql
                      ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold">{sq.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                    {sq.sql.slice(0, 45)}...
                  </div>
                </button>
              ))}
            </div>

            {/* Relational Table List */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Database Tables
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/60">
                  <span className="font-mono text-sky-300">InventoryItems</span>
                  <span className="text-[10px] text-slate-400 font-mono">14 cols</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/60">
                  <span className="font-mono text-sky-300">Users</span>
                  <span className="text-[10px] text-slate-400 font-mono">9 cols</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/60">
                  <span className="font-mono text-sky-300">Categories</span>
                  <span className="text-[10px] text-slate-400 font-mono">5 cols</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/60">
                  <span className="font-mono text-sky-300">AuditLogs</span>
                  <span className="text-[10px] text-slate-400 font-mono">8 cols</span>
                </div>
              </div>
            </div>
          </div>

          {/* SQL Editor & Results */}
          <div className="lg:col-span-3 space-y-4">
            {/* Editor Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block"></span>
                  <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  <span className="ml-2 font-mono text-xs text-slate-400">SQL Query Editor</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(query)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="Copy SQL Query"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handleExecute}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white rounded-lg text-xs font-semibold shadow-md shadow-sky-600/30 transition-all cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Run Query</span>
                  </button>
                </div>
              </div>

              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={5}
                spellCheck={false}
                className="w-full bg-slate-950 p-4 text-xs font-mono text-sky-300 focus:outline-none resize-none leading-relaxed border-none"
              />

              <div className="bg-slate-900/80 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-sky-400" />
                    <span>Latency: <strong className="text-slate-200">{result.executionTimeMs} ms</strong></span>
                  </span>
                  <span>•</span>
                  <span>Rows: <strong className="text-slate-200">{result.rowCount}</strong></span>
                </div>
                <span className="text-emerald-400 font-mono">STATUS: 200 OK</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-xs text-white flex items-center space-x-2">
                  <Table className="h-4 w-4 text-sky-400" />
                  <span>Query Results Grid</span>
                </h3>
                <span className="text-slate-400 text-xs">
                  {result.rowCount} record{result.rowCount !== 1 ? 's' : ''} returned
                </span>
              </div>

              {result.error ? (
                <div className="p-6 text-center text-red-400">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                  <p className="text-sm font-semibold">SQL Syntax or Execution Error</p>
                  <p className="text-xs font-mono mt-1 text-red-300">{result.error}</p>
                </div>
              ) : (
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 sticky top-0">
                      <tr>
                        {result.columns.map((col, idx) => (
                          <th key={idx} className="py-2.5 px-3.5 whitespace-nowrap font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {result.rows.length === 0 ? (
                        <tr>
                          <td colSpan={result.columns.length} className="py-8 text-center text-slate-500">
                            0 rows returned
                          </td>
                        </tr>
                      ) : (
                        result.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-800/50 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="py-2 px-3.5 whitespace-nowrap">
                                {cell === null || cell === undefined ? (
                                  <span className="text-slate-500 italic">NULL</span>
                                ) : (
                                  String(cell)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Database Schema Viewer */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* InventoryItems Table Schema */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Table className="h-4 w-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white font-mono">InventoryItems</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                Primary Table
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-amber-400 font-bold">🔑 id</span>
                <span className="text-slate-400">VARCHAR(50) [PK]</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">sku</span>
                <span className="text-slate-400">VARCHAR(50) [UNIQUE, INDEX]</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">name</span>
                <span className="text-slate-400">VARCHAR(255) [NOT NULL]</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">category</span>
                <span className="text-slate-400">VARCHAR(100)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-purple-400 font-bold">🔗 assigned_to_user_id</span>
                <span className="text-slate-400">VARCHAR(50) [FK &rarr; Users.id]</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">status</span>
                <span className="text-slate-400">VARCHAR(30) [CHECK]</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">condition</span>
                <span className="text-slate-400">VARCHAR(30)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">purchase_cost</span>
                <span className="text-slate-400">DECIMAL(18,2)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">location</span>
                <span className="text-slate-400">VARCHAR(150)</span>
              </div>
            </div>
          </div>

          {/* Users Table Schema */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Table className="h-4 w-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white font-mono">Users (Employees)</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                Entity Model
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-amber-400 font-bold">🔑 id</span>
                <span className="text-slate-400">VARCHAR(50) [PK]</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">full_name</span>
                <span className="text-slate-400">VARCHAR(150) [NOT NULL]</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">email</span>
                <span className="text-slate-400">VARCHAR(150) [UNIQUE]</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">department</span>
                <span className="text-slate-400">VARCHAR(100)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">role</span>
                <span className="text-slate-400">VARCHAR(100)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">location</span>
                <span className="text-slate-400">VARCHAR(150)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800/60">
                <span className="text-sky-300">active</span>
                <span className="text-slate-400">BOOLEAN / BIT</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
