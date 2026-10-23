export type ItemStatus = 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
export type ItemCondition = 'New' | 'Good' | 'Fair' | 'Poor';

export interface User {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  location: string;
  avatarUrl?: string;
  phone?: string;
  active: boolean;
  assignedItemsCount?: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  modelNumber: string;
  serialNumber: string;
  assignedToUserId: string | null;
  assignedToUserName?: string | null;
  assignedUserEmail?: string | null;
  assignedDate: string | null;
  status: ItemStatus;
  condition: ItemCondition;
  purchaseCost: number;
  purchaseDate: string;
  warrantyExpiry: string;
  location: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  prefix: string;
  iconName: string;
  description: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ASSIGN' | 'RETURN' | 'MAINTENANCE';
  entityType: 'InventoryItem' | 'User';
  entityId: string;
  entityName: string;
  userId?: string;
  userName?: string;
  details: string;
  sqlExecuted: string;
}

export interface SqlTrace {
  id: string;
  timestamp: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'SCHEMA';
  sql: string;
  parameters?: Record<string, any>;
  durationMs: number;
  rowsAffected: number;
  origin: string; // e.g. 'InventoryService.getItems()' or 'InventoryController.Create()'
}

export interface SqlQueryResult {
  columns: string[];
  rows: any[][];
  executionTimeMs: number;
  rowCount: number;
  error?: string;
}

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  language: 'csharp' | 'typescript' | 'html' | 'sql' | 'json';
  category: 'dotnet' | 'angular' | 'sql';
  description: string;
  content: string;
}
