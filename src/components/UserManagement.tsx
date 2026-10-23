import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  MapPin, 
  Briefcase, 
  Laptop, 
  Trash2, 
  Edit3, 
  Plus, 
  X, 
  Check, 
  RotateCcw,
  Package,
  ExternalLink
} from 'lucide-react';
import { User, InventoryItem } from '../types/inventory';
import { sqlDb } from '../services/sqlDbService';

interface UserManagementProps {
  onAssignToUser: (user: User) => void;
  onReturnItem: (item: InventoryItem) => void;
  onViewSqlTrace: (sql: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  onAssignToUser,
  onReturnItem,
  onViewSqlTrace,
}) => {
  const users = sqlDb.getUsers();
  const allItems = sqlDb.getItems();

  const [selectedDept, setSelectedDept] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form states for Create / Edit
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('Software Engineer');
  const [location, setLocation] = useState('Building A, Floor 3 (Seattle)');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [formError, setFormError] = useState<string | null>(null);

  const departments = ['Engineering', 'Product & Design', 'DevOps & Infrastructure', 'Data & Analytics', 'Quality Assurance', 'Operations', 'Finance'];

  const filteredUsers = users.filter((u) => {
    const matchDept = selectedDept === 'all' || u.department === selectedDept;
    const matchSearch =
      !userSearch ||
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleOpenAddModal = () => {
    setUserToEdit(null);
    setFullName('');
    setEmail('');
    setDepartment('Engineering');
    setRole('Senior Engineer');
    setLocation('Building A (Seattle)');
    setPhone('+1 (555) 123-4567');
    setFormError(null);
    setIsAddUserModalOpen(true);
  };

  const handleOpenEditModal = (u: User) => {
    setUserToEdit(u);
    setFullName(u.fullName);
    setEmail(u.email);
    setDepartment(u.department);
    setRole(u.role);
    setLocation(u.location);
    setPhone(u.phone || '');
    setFormError(null);
    setIsAddUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !email.trim()) {
      setFormError('Full name and email are required.');
      return;
    }

    try {
      if (userToEdit) {
        sqlDb.updateUser(userToEdit.id, {
          fullName: fullName.trim(),
          email: email.trim(),
          department,
          role: role.trim(),
          location: location.trim(),
          phone: phone.trim(),
        });
      } else {
        sqlDb.createUser({
          fullName: fullName.trim(),
          email: email.trim(),
          department,
          role: role.trim(),
          location: location.trim(),
          phone: phone.trim(),
          active: true,
        });
      }
      setIsAddUserModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save user.');
    }
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      sqlDb.deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-400" />
            <span>Employee Directory & Asset Allocations</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage employees and monitor IT hardware allocated per user (1:N Relational Mapping)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search employee or role..."
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>New Employee</span>
          </button>
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredUsers.map((user) => {
          const userItems = allItems.filter((i) => i.assignedToUserId === user.id);
          const totalAssignedValue = userItems.reduce((acc, curr) => acc + (curr.purchaseCost || 0), 0);

          return (
            <div
              key={user.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              {/* User Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                      {user.fullName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white text-base">{user.fullName}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          Active
                        </span>
                      </div>
                      <div className="text-xs text-indigo-400 font-medium flex items-center space-x-1.5 mt-0.5">
                        <Briefcase className="h-3 w-3" />
                        <span>{user.role}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{user.department}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(user)}
                      title="Edit Employee details"
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setUserToDelete(user)}
                      title="Delete Employee"
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Contact & Location Metadata */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="flex items-center space-x-2 truncate">
                    <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 truncate">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{user.location}</span>
                  </div>
                </div>

                {/* Assigned Assets Section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                      <Package className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Allocated Assets ({userItems.length})</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Value: <strong className="text-emerald-400">${totalAssignedValue.toLocaleString()}</strong>
                    </span>
                  </div>

                  {userItems.length === 0 ? (
                    <div className="py-3 px-3 bg-slate-950/40 rounded-lg border border-dashed border-slate-800 text-center text-xs text-slate-500">
                      No assets currently checked out to this employee.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {userItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <Laptop className="h-4 w-4 text-indigo-400 shrink-0" />
                            <div className="min-w-0 flex-1 truncate">
                              <span className="font-semibold text-white truncate block">{item.name}</span>
                              <div className="text-[10px] font-mono text-slate-400">
                                {item.sku} • Cost: ${item.purchaseCost}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-2 shrink-0">
                            <button
                              onClick={() => onReturnItem(item)}
                              title="Check in this item back to storage"
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                            >
                              Check-In
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-500">ID: {user.id}</span>
                <button
                  onClick={() => onAssignToUser(user)}
                  className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Allocate New Asset</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">
                {userToEdit ? 'Edit Employee Details' : 'Add New Employee'}
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 mt-4">
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Rachel Adams"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. rachel.adams@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Product Lead"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Office / Remote Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Seattle Office, Floor 3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
                >
                  {userToEdit ? 'Save Changes' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-white">
            <h3 className="font-bold text-base text-white mb-2">Delete Employee Profile</h3>
            <p className="text-xs text-slate-300 mb-4">
              Are you sure you want to delete <strong className="text-white">{userToDelete.fullName}</strong>?
              Any assets currently assigned to them will be automatically unlinked and marked as Available.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-md"
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
