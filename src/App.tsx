import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { InventoryList } from './components/InventoryList';
import { UserManagement } from './components/UserManagement';
import { SqlConsole } from './components/SqlConsole';
import { ArchitectureCodeExplorer } from './components/ArchitectureCodeExplorer';
import { AuditLogViewer } from './components/AuditLogViewer';
import { InventoryModal } from './components/InventoryModal';
import { AssignModal } from './components/AssignModal';
import { ReturnModal } from './components/ReturnModal';
import { InventoryItem, User } from './types/inventory';
import { sqlDb } from './services/sqlDbService';
import { CODE_FILES } from './data/dotNetAngularCode';
import JSZip from 'jszip';
import { Terminal, X, Copy, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inventory');
  const [, setDbVersion] = useState(0);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [itemToAssign, setItemToAssign] = useState<InventoryItem | null>(null);
  const [itemToReturn, setItemToReturn] = useState<InventoryItem | null>(null);
  const [inspectSql, setInspectSql] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Subscribe to database changes to trigger UI updates
  useEffect(() => {
    const unsubscribe = sqlDb.subscribe(() => {
      setDbVersion(v => v + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleOpenCreateModal = () => {
    setItemToEdit(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setItemToEdit(item);
    setIsCreateModalOpen(true);
  };

  const handleAssignToUserDirectly = (user: User) => {
    // Find an available item in stock to assign, or open the create modal
    const availableItems = sqlDb.getItems({ status: 'Available' });
    if (availableItems.length > 0) {
      setItemToAssign(availableItems[0]);
    } else {
      handleOpenCreateModal();
    }
  };

  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();

      // Readme instructions
      zip.file(
        'README.md',
        `# InventoryHub - User Inventory Management System
Angular 18 Frontend + ASP.NET Core 8 Web API + SQL Database Solution

## Architecture Highlights
- **Angular 18**: Standalone components, modern Signals (\`signal()\`, \`computed()\`), Reactive Forms (\`FormBuilder\`), RxJS (\`HttpClient\`)
- **ASP.NET Core 8 Web API**: Entity Framework Core DbContext, async controllers, DTO mapping, Swagger OpenAPI, CORS policy
- **SQL Relational Database**: Full DDL schema with primary keys, foreign keys (\`Users\` -> \`InventoryItems\`), indexes, and stored procedures (\`sp_AssignInventoryItem\`)

## Backend Setup (ASP.NET Core 8):
\`\`\`bash
cd InventoryHub.API
dotnet restore
dotnet run
\`\`\`
Open Swagger API docs: \`https://localhost:7001/swagger\`

## Frontend Setup (Angular 18):
\`\`\`bash
cd angular-client
npm install
ng serve
\`\`\`
Navigate to: \`http://localhost:4200\`
`
      );

      // Package all code files
      CODE_FILES.forEach(file => {
        zip.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'InventoryHub-Angular-DotNet-SQL.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export solution zip:', err);
    }
  };

  const handleResetDb = () => {
    if (confirm('Reset relational database to initial seed state?')) {
      sqlDb.seedDatabase();
    }
  };

  const handleCopyInspectSql = () => {
    if (inspectSql) {
      navigator.clipboard.writeText(inspectSql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreateModal={handleOpenCreateModal}
        onDownloadZip={handleDownloadZip}
        onResetDb={handleResetDb}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Summary Cards (Visible on Inventory & Users tabs) */}
        {(activeTab === 'inventory' || activeTab === 'users') && <StatsCards />}

        {/* Tab 1: Inventory CRUD Operations */}
        {activeTab === 'inventory' && (
          <InventoryList
            onOpenCreateModal={handleOpenCreateModal}
            onOpenEditModal={handleOpenEditModal}
            onOpenAssignModal={(item) => setItemToAssign(item)}
            onOpenReturnModal={(item) => setItemToReturn(item)}
            onViewSqlTrace={(sql) => setInspectSql(sql)}
          />
        )}

        {/* Tab 2: Users & Allocations */}
        {activeTab === 'users' && (
          <UserManagement
            onAssignToUser={handleAssignToUserDirectly}
            onReturnItem={(item) => setItemToReturn(item)}
            onViewSqlTrace={(sql) => setInspectSql(sql)}
          />
        )}

        {/* Tab 3: SQL Database Studio */}
        {activeTab === 'sql_console' && <SqlConsole />}

        {/* Tab 4: Architecture & Code Explorer */}
        {activeTab === 'architecture' && <ArchitectureCodeExplorer />}

        {/* Tab 5: Activity & SQL Traces */}
        {activeTab === 'audit_log' && <AuditLogViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">InventoryHub</span>
            <span>—</span>
            <span>User Inventory Management System</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Angular 18</span>
            <span>•</span>
            <span>ASP.NET Core 8 Web API</span>
            <span>•</span>
            <span>Relational SQL Database</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InventoryModal
        isOpen={isCreateModalOpen}
        itemToEdit={itemToEdit}
        onClose={() => {
          setIsCreateModalOpen(false);
          setItemToEdit(null);
        }}
        onSuccess={() => {}}
      />

      <AssignModal
        isOpen={!!itemToAssign}
        item={itemToAssign}
        onClose={() => setItemToAssign(null)}
        onSuccess={() => {}}
      />

      <ReturnModal
        isOpen={!!itemToReturn}
        item={itemToReturn}
        onClose={() => setItemToReturn(null)}
        onSuccess={() => {}}
      />

      {/* SQL Query Inspector Dialog */}
      {inspectSql && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-sky-400">
                <Terminal className="h-5 w-5" />
                <h3 className="font-bold text-sm text-white">Underlying SQL Query Inspector</h3>
              </div>
              <button
                onClick={() => setInspectSql(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4">
              <p className="text-xs text-slate-400 mb-2">
                This Transact-SQL statement is executed by EF Core on SQL Server:
              </p>
              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-sky-300 whitespace-pre-wrap leading-relaxed">
                {inspectSql}
              </pre>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCopyInspectSql}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                {copiedSql ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedSql ? 'Copied to Clipboard' : 'Copy SQL'}</span>
              </button>
              <button
                onClick={() => {
                  setInspectSql(null);
                  setActiveTab('sql_console');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
              >
                Open in SQL Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
