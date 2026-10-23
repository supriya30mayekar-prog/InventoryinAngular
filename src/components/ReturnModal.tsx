import React, { useState } from 'react';
import { X, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { InventoryItem, ItemCondition } from '../types/inventory';
import { sqlDb } from '../services/sqlDbService';

interface ReturnModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  isOpen,
  item,
  onClose,
  onSuccess,
}) => {
  const [condition, setCondition] = useState<ItemCondition>(item?.condition || 'Good');
  const [returnNotes, setReturnNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sqlDb.returnItem(item.id, condition, returnNotes.trim());
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to check in asset.');
    }
  };

  const sqlPreview = `UPDATE InventoryItems 
SET assigned_to_user_id = NULL,
    assigned_date = NULL,
    status = 'Available',
    condition = '${condition}',
    location = 'IT Storage Facility / Staging Area',
    updated_at = CURRENT_TIMESTAMP
WHERE id = '${item.id}';`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Return Asset to Stock</h3>
              <p className="text-xs text-slate-400">Check in asset from employee back to available inventory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current State Details */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 my-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-sm text-white">{item.name}</div>
              <div className="text-xs font-mono text-indigo-400">SKU: {item.sku}</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              Currently Assigned
            </span>
          </div>

          <div className="text-xs text-slate-300 pt-1 border-t border-slate-800/80">
            Assigned to: <strong className="text-white">{item.assignedToUserName || 'User'}</strong> ({item.assignedUserEmail})
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleReturn} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Inspect Returned Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ItemCondition)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="New">Like New / Pristine</option>
              <option value="Good">Good (Normal wear)</option>
              <option value="Fair">Fair (Cosmetic scratches)</option>
              <option value="Poor">Poor (Requires maintenance before reissuing)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Return Inspection Notes
            </label>
            <textarea
              rows={2}
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              placeholder="e.g. Device returned upon project completion. Factory reset and cleaned."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* SQL Preview */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-sky-400 whitespace-pre-wrap">
            {sqlPreview}
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
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors flex items-center space-x-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Confirm Return to Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
