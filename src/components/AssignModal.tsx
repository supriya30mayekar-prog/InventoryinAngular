import React, { useState } from 'react';
import { X, UserPlus, Code2, Check, User } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { sqlDb } from '../services/sqlDbService';

interface AssignModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignModal: React.FC<AssignModalProps> = ({
  isOpen,
  item,
  onClose,
  onSuccess,
}) => {
  const users = sqlDb.getUsers();
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const selectedUser = users.find(u => u.id === selectedUserId);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedUserId) {
      setError('Please select an employee.');
      return;
    }

    try {
      sqlDb.assignItem(item.id, selectedUserId, notes.trim());
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to assign asset.');
    }
  };

  const previewSql = `-- Executed by ASP.NET Core InventoryController.AssignToUser()
UPDATE InventoryItems 
SET assigned_to_user_id = '${selectedUserId}',
    assigned_date = CURRENT_DATE,
    status = 'Assigned',
    updated_at = CURRENT_TIMESTAMP
WHERE id = '${item.id}';`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Assign Asset to Employee</h3>
              <p className="text-xs text-slate-400">Checkout asset from storage to a user</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Item Info Banner */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 my-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white">{item.name}</div>
            <div className="text-[11px] font-mono text-indigo-400 mt-0.5">
              SKU: {item.sku} • Serial: {item.serialNumber}
            </div>
          </div>
          <span className="text-xs font-mono font-medium text-emerald-400">
            ${item.purchaseCost.toFixed(2)}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleAssign} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Employee / User <span className="text-red-400">*</span>
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} — {u.department} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs text-slate-300 flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-200 shrink-0">
                {selectedUser.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{selectedUser.fullName}</div>
                <div className="text-slate-400 text-[11px]">{selectedUser.email}</div>
                <div className="text-indigo-300 text-[11px] mt-0.5">
                  {selectedUser.department} • {selectedUser.location}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Checkout Notes / Purpose
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Standard workstation deployment for new sprint."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* SQL Preview */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-sky-400 whitespace-pre-wrap">
            {previewSql}
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors flex items-center space-x-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Confirm & Assign Asset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
