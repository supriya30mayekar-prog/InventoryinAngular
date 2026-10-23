import React, { useState, useEffect } from 'react';
import { X, Sparkles, Code2, Save, Check } from 'lucide-react';
import { InventoryItem, ItemStatus, ItemCondition, User } from '../types/inventory';
import { sqlDb } from '../services/sqlDbService';

interface InventoryModalProps {
  isOpen: boolean;
  itemToEdit: InventoryItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  itemToEdit,
  onClose,
  onSuccess,
}) => {
  const isEdit = !!itemToEdit;
  const categories = sqlDb.getCategories();
  const users = sqlDb.getUsers();

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Laptops & Workstations');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [status, setStatus] = useState<ItemStatus>('Available');
  const [condition, setCondition] = useState<ItemCondition>('New');
  const [purchaseCost, setPurchaseCost] = useState<number>(1299);
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [warrantyExpiry, setWarrantyExpiry] = useState<string>(
    new Date(Date.now() + 3 * 365 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [assignedToUserId, setAssignedToUserId] = useState<string>('');
  const [location, setLocation] = useState('IT Storage Locker #1');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (itemToEdit) {
      setSku(itemToEdit.sku);
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setModelNumber(itemToEdit.modelNumber || '');
      setSerialNumber(itemToEdit.serialNumber);
      setStatus(itemToEdit.status);
      setCondition(itemToEdit.condition);
      setPurchaseCost(itemToEdit.purchaseCost);
      setPurchaseDate(itemToEdit.purchaseDate);
      setWarrantyExpiry(itemToEdit.warrantyExpiry);
      setAssignedToUserId(itemToEdit.assignedToUserId || '');
      setLocation(itemToEdit.location || '');
      setNotes(itemToEdit.notes || '');
    } else {
      // Auto-generate SKU for new item
      generateSkuForCategory(category);
      setSerialNumber('SN-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    }
  }, [itemToEdit, isOpen]);

  const generateSkuForCategory = (catName: string) => {
    const found = categories.find(c => c.name === catName);
    const prefix = found ? found.prefix : 'AST';
    const year = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    setSku(`${prefix}-${year}-${rand}`);
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    if (!isEdit) {
      generateSkuForCategory(newCat);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Asset name is required.');
      return;
    }
    if (!sku.trim()) {
      setError('SKU is required.');
      return;
    }
    if (!serialNumber.trim()) {
      setError('Serial number is required.');
      return;
    }

    try {
      if (isEdit && itemToEdit) {
        sqlDb.updateItem(itemToEdit.id, {
          name: name.trim(),
          category,
          modelNumber: modelNumber.trim(),
          serialNumber: serialNumber.trim(),
          status: assignedToUserId ? 'Assigned' : status,
          condition,
          purchaseCost: Number(purchaseCost) || 0,
          purchaseDate,
          warrantyExpiry,
          assignedToUserId: assignedToUserId || null,
          location: location.trim(),
          notes: notes.trim(),
        });
      } else {
        sqlDb.createItem({
          sku: sku.trim(),
          name: name.trim(),
          category,
          modelNumber: modelNumber.trim(),
          serialNumber: serialNumber.trim(),
          assignedToUserId: assignedToUserId || null,
          assignedDate: assignedToUserId ? purchaseDate : null,
          status: assignedToUserId ? 'Assigned' : status,
          condition,
          purchaseCost: Number(purchaseCost) || 0,
          purchaseDate,
          warrantyExpiry,
          location: location.trim(),
          notes: notes.trim(),
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save inventory item.');
    }
  };

  // Preview generated SQL statement
  const generatedSql = isEdit
    ? `UPDATE InventoryItems 
SET name = '${name.replace(/'/g, "''")}',
    category = '${category}',
    serial_number = '${serialNumber}',
    assigned_to_user_id = ${assignedToUserId ? `'${assignedToUserId}'` : 'NULL'},
    status = '${assignedToUserId ? 'Assigned' : status}',
    condition = '${condition}',
    purchase_cost = ${Number(purchaseCost) || 0},
    location = '${location.replace(/'/g, "''")}',
    updated_at = CURRENT_TIMESTAMP
WHERE id = '${itemToEdit?.id}';`
    : `INSERT INTO InventoryItems (
    id, sku, name, category, serial_number, 
    assigned_to_user_id, status, condition, purchase_cost, location
) VALUES (
    'inv_${Math.floor(1000 + Math.random() * 9000)}', '${sku}', '${name.replace(/'/g, "''")}', 
    '${category}', '${serialNumber}', 
    ${assignedToUserId ? `'${assignedToUserId}'` : 'NULL'}, 
    '${assignedToUserId ? 'Assigned' : status}', '${condition}', 
    ${Number(purchaseCost) || 0}, '${location.replace(/'/g, "''")}'
);`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{isEdit ? 'Edit Inventory Asset' : 'Add New Inventory Asset'}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-normal">
                {isEdit ? 'SQL UPDATE' : 'SQL INSERT'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Angular Reactive Form bound to ASP.NET Core Web API Controller
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Row 1: SKU & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                SKU / Asset Tag <span className="text-red-400">*</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  disabled={isEdit}
                  required
                  placeholder="e.g. NBK-2024-001"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                />
                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => generateSkuForCategory(category)}
                    title="Generate unique SKU"
                    className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3 text-indigo-400" />
                    <span>Gen</span>
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Asset Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Asset / Hardware Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. MacBook Pro 16-inch M3 Max (64GB RAM)"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Row 3: Model & Serial Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Model Number
              </label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="e.g. A2991-M3MAX"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Serial Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
                placeholder="e.g. C02G87H9MD6R"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 4: Status & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus)}
                disabled={!!assignedToUserId}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
              >
                <option value="Available">Available (In Storage)</option>
                <option value="Assigned">Assigned to User</option>
                <option value="Maintenance">Maintenance / Repair</option>
                <option value="Retired">Retired / Decommissioned</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Physical Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="New">New / Sealed</option>
                <option value="Good">Good (Working)</option>
                <option value="Fair">Fair (Cosmetic wear)</option>
                <option value="Poor">Poor (Needs repair)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Purchase Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 5: Assign to User */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-indigo-300 mb-1.5 flex items-center justify-between">
              <span>Assign Asset to Employee (Foreign Key: Users.id)</span>
              {assignedToUserId && (
                <button
                  type="button"
                  onClick={() => {
                    setAssignedToUserId('');
                    setStatus('Available');
                  }}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Unassign / Set to Storage
                </button>
              )}
            </label>
            <select
              value={assignedToUserId}
              onChange={(e) => {
                const uid = e.target.value;
                setAssignedToUserId(uid);
                if (uid) setStatus('Assigned');
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- No User Assigned (Keep in Stock / Available) --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} — {u.department} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Row 6: Dates & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Warranty Expiration
              </label>
              <input
                type="date"
                value={warrantyExpiry}
                onChange={(e) => setWarrantyExpiry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Physical Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Seattle Desk 302"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Hardware Notes / Specifications
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Includes original 140W USB-C charger and privacy screen protector."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
            ></textarea>
          </div>

          {/* Live SQL Preview Box */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80">
            <div className="flex items-center space-x-2 text-[11px] text-sky-400 font-mono mb-1.5">
              <Code2 className="h-3.5 w-3.5" />
              <span>Real-Time SQL Command Executed on Save:</span>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap overflow-x-auto bg-slate-900/60 p-2.5 rounded border border-slate-800">
              {generatedSql}
            </pre>
          </div>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{isEdit ? 'Update Asset' : 'Create Asset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
