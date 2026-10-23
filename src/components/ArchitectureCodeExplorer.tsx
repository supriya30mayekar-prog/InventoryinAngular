import React, { useState } from 'react';
import { 
  Code2, 
  Folder, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Server, 
  Database, 
  Globe, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { CODE_FILES } from '../data/dotNetAngularCode';
import { CodeFile } from '../types/inventory';
import JSZip from 'jszip';

export const ArchitectureCodeExplorer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>(CODE_FILES[0].id);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'angular' | 'dotnet' | 'sql'>('dotnet');

  const selectedFile = CODE_FILES.find(f => f.id === selectedFileId) || CODE_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFullZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Add Readme
      zip.file('README.md', `# InventoryHub - User Inventory Management Solution
Full-stack User Inventory & Hardware Asset Management System built with:
- **Frontend**: Angular 18 (Standalone components, Signals, Reactive Forms, RxJS)
- **Backend**: ASP.NET Core 8 Web API (RESTful endpoints, EF Core, Swagger, CORS)
- **Database**: SQL Server / PostgreSQL (Relational schema, foreign keys, indexes, stored procedures)

## Running the ASP.NET Core 8 Backend:
\`\`\`bash
cd InventoryHub.API
dotnet restore
dotnet run
\`\`\`
The API will run at \`https://localhost:7001\` with Swagger UI at \`https://localhost:7001/swagger\`.

## Running the Angular 18 Client:
\`\`\`bash
cd angular-client
npm install
ng serve
\`\`\`
Open \`http://localhost:4200\` to interact with the full CRUD user inventory application!
`);

      // Add each code file into the zip
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
      console.error('Failed to generate zip:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const dotnetFiles = CODE_FILES.filter(f => f.category === 'dotnet');
  const angularFiles = CODE_FILES.filter(f => f.category === 'angular');
  const sqlFiles = CODE_FILES.filter(f => f.category === 'sql');

  return (
    <div className="space-y-4">
      {/* Architecture Interactive Flow Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="h-5 w-5 text-indigo-400" />
              <span>Full-Stack 3-Tier Architecture (.NET 8 + Angular 18 + SQL DB)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enterprise solution breakdown with production code files ready for Visual Studio & Angular CLI
            </p>
          </div>

          <button
            onClick={handleDownloadFullZip}
            disabled={isExporting}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Generating ZIP...' : 'Download Full Solution (.ZIP)'}</span>
          </button>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center">
          {/* Node 1: Angular Client */}
          <div 
            onClick={() => {
              setActiveLayer('angular');
              setSelectedFileId(angularFiles[0]?.id);
            }}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeLayer === 'angular'
                ? 'bg-red-500/10 border-red-500/40 text-red-300 ring-1 ring-red-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-center mb-1 text-red-400">
              <Globe className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-white">Angular 18 Frontend</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Signals • Standalone • RxJS</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="h-5 w-5 animate-pulse text-indigo-500" />
          </div>

          {/* Node 2: .NET 8 Web API */}
          <div 
            onClick={() => {
              setActiveLayer('dotnet');
              setSelectedFileId(dotnetFiles[0]?.id);
            }}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeLayer === 'dotnet'
                ? 'bg-purple-500/10 border-purple-500/40 text-purple-300 ring-1 ring-purple-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-center mb-1 text-purple-400">
              <Server className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-white">ASP.NET Core 8 Web API</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Controllers • DTOs • DI</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="h-5 w-5 animate-pulse text-indigo-500" />
          </div>

          {/* Node 3: SQL Relational Database */}
          <div 
            onClick={() => {
              setActiveLayer('sql');
              setSelectedFileId(sqlFiles[0]?.id);
            }}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeLayer === 'sql'
                ? 'bg-sky-500/10 border-sky-500/40 text-sky-300 ring-1 ring-sky-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-center mb-1 text-sky-400">
              <Database className="h-5 w-5" />
            </div>
            <div className="font-bold text-xs text-white">SQL Server Database</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Tables • FK • Stored Procs</div>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Solution Explorer File Tree */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Folder className="h-4 w-4 text-indigo-400" />
              <span>Solution Explorer</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">10 Files</span>
          </div>

          {/* ASP.NET Core Project Group */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-xs font-semibold text-purple-300 px-1 py-1">
              <Server className="h-3.5 w-3.5 text-purple-400" />
              <span>InventoryHub.API (.NET 8)</span>
            </div>
            <div className="pl-3 space-y-0.5 border-l border-slate-800">
              {dotnetFiles.map(file => (
                <button
                  key={file.id}
                  onClick={() => {
                    setSelectedFileId(file.id);
                    setActiveLayer('dotnet');
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center space-x-2 transition-colors ${
                    selectedFileId === file.id
                      ? 'bg-purple-500/20 text-purple-200 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Angular Client Group */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center space-x-1 text-xs font-semibold text-red-300 px-1 py-1">
              <Globe className="h-3.5 w-3.5 text-red-400" />
              <span>angular-client (v18)</span>
            </div>
            <div className="pl-3 space-y-0.5 border-l border-slate-800">
              {angularFiles.map(file => (
                <button
                  key={file.id}
                  onClick={() => {
                    setSelectedFileId(file.id);
                    setActiveLayer('angular');
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center space-x-2 transition-colors ${
                    selectedFileId === file.id
                      ? 'bg-red-500/20 text-red-200 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Database Scripts Group */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center space-x-1 text-xs font-semibold text-sky-300 px-1 py-1">
              <Database className="h-3.5 w-3.5 text-sky-400" />
              <span>Database Scripts</span>
            </div>
            <div className="pl-3 space-y-0.5 border-l border-slate-800">
              {sqlFiles.map(file => (
                <button
                  key={file.id}
                  onClick={() => {
                    setSelectedFileId(file.id);
                    setActiveLayer('sql');
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center space-x-2 transition-colors ${
                    selectedFileId === file.id
                      ? 'bg-sky-500/20 text-sky-200 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Viewer Panel */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          {/* File Header Bar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <FileCode className="h-4 w-4 text-indigo-400" />
                <span className="font-mono text-xs font-bold text-white">{selectedFile.path}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono uppercase">
                  {selectedFile.language}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopyCode}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Highlighted Code Area */}
          <div className="bg-slate-950 p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200 max-h-[600px] overflow-y-auto">
            <pre className="whitespace-pre">
              {selectedFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-slate-900/50">
                  <span className="table-cell select-none pr-4 text-slate-600 text-right w-10">
                    {idx + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
