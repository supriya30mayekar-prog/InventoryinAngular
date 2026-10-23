import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Trash2, 
  Edit3, 
  UserPlus, 
  RotateCcw, 
  Eye, 
  Laptop, 
  Monitor, 
  Smartphone, 
  Headphones, 
  Shield, 
  Key, 
  Layers,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code,
  Tag
} from 'lucide-react';
import { InventoryItem, ItemStatus } from '../types/inventory';
import { sqlDb } from '../services/sqlDbService';

interface InventoryListProps {
  onOpenCreateModal: () => void;
  onOpenEditModal: (item: InventoryItem) => void;
  onOpenAssignModal: (item: InventoryItem) => void;
  onOpenReturnModal: (item: InventoryItem) => void;
  onViewSqlTrace: (sql: string) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  onOpenCreateModal,
  onOpenEditModal,
  onOpenAssignModal,
  onOpenReturnModal,
  onViewSqlTrace,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'updated' | 'cost' | 'name' | 'sku'>('updated');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  const categories = sqlDb.getCategories();
  
  // Query items from database
  const items = useMemo(() => {
    let list = sqlDb.getItems({
      search,
      category,
      status,
    });

    list.sort((a, b) => {
      let comp = 0;
      if (sortBy === 'updated') {
        comp = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (sortBy === 'cost') {
        comp = a.purchaseCost - b.purchaseCost;
      } else if (sortBy === 'name') {
        comp = a.name.localeCompare(b.name);
      } else if (sortBy === 'sku') {
        comp = a.sku.localeCompare(b.sku);
      }
      return sortDir === 'asc' ? comp : -comp;
    });

    return list;
  }, [search, category, status, sortBy, sortDir]);

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      sqlDb.deleteItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const exportCsv = () => {
    const headers = ['ID', 'SKU', 'Name', 'Category', 'Serial', 'Status', 'Condition', 'Cost', 'Assigned To', 'User Email', 'Assigned Date', 'Location'];
    const rows = items.map(i => [
      i.id,
      i.sku,
      `"${i.name.replace(/"/g, '""')}"`,
      i.category,
      i.serialNumber,
      i.status,
      i.condition,
      i.purchaseCost,
      i.assignedToUserName || 'Unassigned',
      i.assignedUserEmail || '',
      i.assignedDate || '',
      `"${i.location || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (s: ItemStatus) => {
    switch (s) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Available
          </span>
        );
      case 'Assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Assigned
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Maintenance
          </span>
        );
      case 'Retired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Retired
          </span>
        );
    }
  };

  const getCategoryIcon = (catName: string) => {
    if (catName.includes('Laptop')) return <Laptop className="h-4 w-4 text-indigo-400" />;
    if (catName.includes('Monitor')) return <Monitor className="h-4 w-4 text-sky-400" />;
    if (catName.includes('Mobile')) return <Smartphone className="h-4 w-4 text-pink-400" />;
    if (catName.includes('Peripheral')) return <Headphones className="h-4 w-4 text-purple-400" />;
    if (catName.includes('Network') || catName.includes('Security')) return <Shield className="h-4 w-4 text-emerald-400" />;
    if (catName.includes('License')) return <Key className="h-4 w-4 text-amber-400" />;
    return <Layers className="h-4 w-4 text-slate-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items by name, SKU, serial #, or employee..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by Category"
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by Status"
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Retired">Retired</option>
          </select>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
            <span className="text-xs text-slate-400 pl-1">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort inventory items by field"
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none pr-1"
            >
              <option value="updated">Recent</option>
              <option value="cost">Cost</option>
              <option value="name">Name</option>
              <option value="sku">SKU</option>
            </select>
            <button
              onClick={() => setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              title={`Sorting ${sortDir === 'asc' ? 'Ascending' : 'Descending'}`}
              className="p-1 text-slate-400 hover:text-white"
            >
              <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>

          {/* Export & Mode */}
          <button
            onClick={exportCsv}
            title="Export filtered inventory to CSV"
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">SKU / Serial</th>
                <th className="py-3.5 px-4 font-semibold">Asset Details</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Employee</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Cost</th>
                <th className="py-3.5 px-4 font-semibold">Location</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertCircle className="h-8 w-8 text-slate-600" />
                      <p className="text-sm font-medium">No inventory items found</p>
                      <p className="text-xs text-slate-500">
                        Try resetting your search query or filters, or add a new asset.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                    {/* SKU & Serial */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-medium text-indigo-300 flex items-center space-x-1.5">
                        <Tag className="h-3 w-3 text-indigo-400" />
                        <span>{item.sku}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                        SN: {item.serialNumber}
                      </div>
                    </td>

                    {/* Name & Model */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        {item.modelNumber && <span>Mod: {item.modelNumber}</span>}
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">Cond: {item.condition}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-slate-300">
                        {getCategoryIcon(item.category)}
                        <span className="text-xs">{item.category}</span>
                      </div>
                    </td>

                    {/* Assigned Employee */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.assignedToUserId ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-7 w-7 rounded-full bg-indigo-900/60 border border-indigo-700/60 flex items-center justify-center text-[11px] font-bold text-indigo-200">
                            {item.assignedToUserName?.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-slate-200">{item.assignedToUserName}</div>
                            <div className="text-[10px] text-slate-400">Since {item.assignedDate}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 italic">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Purchase Cost */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-medium text-slate-200">
                      ${item.purchaseCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-400 max-w-[160px] truncate">
                      {item.location || '—'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {/* Assign / Return quick action */}
                        {item.assignedToUserId ? (
                          <button
                            onClick={() => onOpenReturnModal(item)}
                            title="Return item to available storage"
                            className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded text-[11px] font-medium transition-colors"
                          >
                            Return
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenAssignModal(item)}
                            title="Assign asset to an employee"
                            className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 rounded text-[11px] font-medium transition-colors flex items-center space-x-1"
                          >
                            <UserPlus className="h-3 w-3" />
                            <span>Assign</span>
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => onOpenEditModal(item)}
                          title="Edit Asset Details"
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setItemToDelete(item)}
                          title="Delete Asset"
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with summary and SQL preview */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <span>Showing <strong className="text-white">{items.length}</strong> of <strong className="text-white">{sqlDb.getStatistics().totalItems}</strong> items</span>
            <span>•</span>
            <span className="text-emerald-400">Live Relational SQL Engine</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewSqlTrace(`SELECT i.*, u.full_name, u.email FROM InventoryItems i LEFT JOIN Users u ON i.assigned_to_user_id = u.id ORDER BY i.updated_at DESC;`)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded border border-slate-700 transition-colors"
            >
              <Code className="h-3 w-3" />
              <span>Inspect Underlying SQL Query</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl text-white">
            <div className="flex items-center space-x-3 text-red-400 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Confirm Asset Deletion</h3>
                <p className="text-xs text-slate-400">This action executes an SQL DELETE query.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-4">
              Are you sure you want to delete <strong className="text-white">{itemToDelete.name}</strong> (SKU: {itemToDelete.sku})? 
              {itemToDelete.assignedToUserName && (
                <span className="block mt-2 text-amber-400 text-xs">
                  ⚠️ Note: This item is currently assigned to {itemToDelete.assignedToUserName}.
                </span>
              )}
            </p>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-sky-300 mb-5 break-all">
              DELETE FROM InventoryItems WHERE id = '{itemToDelete.id}';
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
              >
                Delete from Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
