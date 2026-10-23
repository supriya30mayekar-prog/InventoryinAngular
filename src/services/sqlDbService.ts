import { InventoryItem, User, Category, AuditLog, SqlTrace, SqlQueryResult } from '../types/inventory';

// Default categories
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_laptops', name: 'Laptops & Workstations', prefix: 'NBK', iconName: 'Laptop', description: 'Enterprise laptops, MacBooks, mobile workstations' },
  { id: 'cat_monitors', name: 'Monitors & Displays', prefix: 'MON', iconName: 'Monitor', description: '4K displays, ultrawides, dual-monitor setups' },
  { id: 'cat_mobiles', name: 'Mobile Devices & Tablets', prefix: 'MOB', iconName: 'Smartphone', description: 'Company iPhones, Android test devices, iPads' },
  { id: 'cat_peripherals', name: 'Peripherals & Audio', prefix: 'PER', iconName: 'Headphones', description: 'Headsets, noise-canceling headphones, keyboards, mice' },
  { id: 'cat_networking', name: 'Network & Security', prefix: 'NET', iconName: 'Shield', description: 'Hardware security keys (YubiKey), routers, adapters' },
  { id: 'cat_licenses', name: 'Software Licenses & Seats', prefix: 'LIC', iconName: 'Key', description: 'IDE licenses, CAD tools, enterprise SaaS keys' },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_101',
    fullName: 'Sarah Jenkins',
    email: 'sarah.jenkins@company.com',
    department: 'Engineering',
    role: 'Lead Cloud Architect',
    location: 'Building A, Floor 3 (Seattle)',
    phone: '+1 (555) 234-8901',
    active: true,
  },
  {
    id: 'usr_102',
    fullName: 'David Chen',
    email: 'david.chen@company.com',
    department: 'Engineering',
    role: 'Senior Full Stack Engineer',
    location: 'Remote (San Francisco, CA)',
    phone: '+1 (555) 456-7812',
    active: true,
  },
  {
    id: 'usr_103',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@company.com',
    department: 'Product & Design',
    role: 'Staff UI/UX Designer',
    location: 'Building B, Floor 2 (Austin)',
    phone: '+1 (555) 789-0123',
    active: true,
  },
  {
    id: 'usr_104',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@company.com',
    department: 'DevOps & Infrastructure',
    role: 'Site Reliability Engineer',
    location: 'Building A, Floor 4 (Seattle)',
    phone: '+1 (555) 890-3456',
    active: true,
  },
  {
    id: 'usr_105',
    fullName: 'Amara Patel',
    email: 'amara.patel@company.com',
    department: 'Data & Analytics',
    role: 'Data Engineering Lead',
    location: 'Remote (New York, NY)',
    phone: '+1 (555) 901-4567',
    active: true,
  },
  {
    id: 'usr_106',
    fullName: 'Liam O\'Connor',
    email: 'liam.oconnor@company.com',
    department: 'Quality Assurance',
    role: 'Senior QA Automation Engineer',
    location: 'Building C, Floor 1 (Boston)',
    phone: '+1 (555) 345-6789',
    active: true,
  }
];

export const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: 'inv_1001',
    sku: 'NBK-2024-001',
    name: 'MacBook Pro 16" M3 Max (64GB RAM, 1TB SSD)',
    category: 'Laptops & Workstations',
    modelNumber: 'A2991-M3MAX',
    serialNumber: 'C02G87H9MD6R',
    assignedToUserId: 'usr_101',
    assignedToUserName: 'Sarah Jenkins',
    assignedUserEmail: 'sarah.jenkins@company.com',
    assignedDate: '2024-01-15',
    status: 'Assigned',
    condition: 'New',
    purchaseCost: 3899.00,
    purchaseDate: '2024-01-10',
    warrantyExpiry: '2027-01-10',
    location: 'Building A, Floor 3 (Seattle)',
    notes: 'Primary development workstation. Configured with Xcode and Docker Enterprise.',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'inv_1002',
    sku: 'NBK-2024-002',
    name: 'Dell XPS 15 9530 (i9-13900H, 32GB RAM, RTX 4070)',
    category: 'Laptops & Workstations',
    modelNumber: 'XPS-9530-OLED',
    serialNumber: '8FJK293-DELL',
    assignedToUserId: 'usr_102',
    assignedToUserName: 'David Chen',
    assignedUserEmail: 'david.chen@company.com',
    assignedDate: '2024-02-01',
    status: 'Assigned',
    condition: 'Good',
    purchaseCost: 2650.00,
    purchaseDate: '2024-01-20',
    warrantyExpiry: '2027-01-20',
    location: 'Remote (San Francisco, CA)',
    notes: 'Shipped to remote employee with encrypted BitLocker drive.',
    createdAt: '2024-01-20T11:20:00Z',
    updatedAt: '2024-02-01T10:15:00Z',
  },
  {
    id: 'inv_1003',
    sku: 'MON-2023-014',
    name: 'Dell UltraSharp 32" 6K Monitor (U3224KB)',
    category: 'Monitors & Displays',
    modelNumber: 'U3224KB-4KCAM',
    serialNumber: 'CN-0N8V8W-74445',
    assignedToUserId: 'usr_103',
    assignedToUserName: 'Elena Rostova',
    assignedUserEmail: 'elena.rostova@company.com',
    assignedDate: '2024-03-05',
    status: 'Assigned',
    condition: 'New',
    purchaseCost: 2499.00,
    purchaseDate: '2023-11-15',
    warrantyExpiry: '2026-11-15',
    location: 'Building B, Floor 2 (Austin)',
    notes: 'Design team calibrated 99% DCI-P3 color gamut.',
    createdAt: '2023-11-15T08:00:00Z',
    updatedAt: '2024-03-05T16:00:00Z',
  },
  {
    id: 'inv_1004',
    sku: 'NBK-2024-005',
    name: 'Lenovo ThinkPad X1 Carbon Gen 11 (32GB RAM, 1TB SSD)',
    category: 'Laptops & Workstations',
    modelNumber: '21HM004QUS',
    serialNumber: 'PF49B90X-LNV',
    assignedToUserId: 'usr_104',
    assignedToUserName: 'Marcus Vance',
    assignedUserEmail: 'marcus.vance@company.com',
    assignedDate: '2024-02-18',
    status: 'Assigned',
    condition: 'Good',
    purchaseCost: 2199.00,
    purchaseDate: '2024-02-10',
    warrantyExpiry: '2027-02-10',
    location: 'Building A, Floor 4 (Seattle)',
    notes: 'Running Fedora Linux Workstation for kernel and cluster troubleshooting.',
    createdAt: '2024-02-10T13:00:00Z',
    updatedAt: '2024-02-18T09:40:00Z',
  },
  {
    id: 'inv_1005',
    sku: 'MOB-2024-020',
    name: 'iPad Pro 13" M4 (256GB, Wi-Fi + 5G Cellular)',
    category: 'Mobile Devices & Tablets',
    modelNumber: 'A2925-M4IPAD',
    serialNumber: 'DLXKP092V91X',
    assignedToUserId: null,
    assignedToUserName: null,
    assignedUserEmail: null,
    assignedDate: null,
    status: 'Available',
    condition: 'New',
    purchaseCost: 1499.00,
    purchaseDate: '2024-05-20',
    warrantyExpiry: '2026-05-20',
    location: 'IT Secure Storage Locker #4B',
    notes: 'Ready for deployment. Apple Pencil Pro included.',
    createdAt: '2024-05-20T10:00:00Z',
    updatedAt: '2024-05-20T10:00:00Z',
  },
  {
    id: 'inv_1006',
    sku: 'MON-2023-088',
    name: 'LG 27" UltraFine 4K UHD IPS Display',
    category: 'Monitors & Displays',
    modelNumber: '27UN850-W',
    serialNumber: '302NTYQ4P112',
    assignedToUserId: null,
    assignedToUserName: null,
    assignedUserEmail: null,
    assignedDate: null,
    status: 'Available',
    condition: 'Good',
    purchaseCost: 449.00,
    purchaseDate: '2023-08-12',
    warrantyExpiry: '2026-08-12',
    location: 'IT Inventory Staging Area C',
    notes: 'Cleaned and tested. Includes USB-C 90W PD cable.',
    createdAt: '2023-08-12T14:10:00Z',
    updatedAt: '2024-04-10T11:00:00Z',
  },
  {
    id: 'inv_1007',
    sku: 'PER-2024-042',
    name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headset',
    category: 'Peripherals & Audio',
    modelNumber: 'WH1000XM5/B',
    serialNumber: 'S01-9844210-SNY',
    assignedToUserId: 'usr_105',
    assignedToUserName: 'Amara Patel',
    assignedUserEmail: 'amara.patel@company.com',
    assignedDate: '2024-04-01',
    status: 'Assigned',
    condition: 'New',
    purchaseCost: 398.00,
    purchaseDate: '2024-03-25',
    warrantyExpiry: '2025-03-25',
    location: 'Remote (New York, NY)',
    notes: 'Provided under engineering audio accommodation policy.',
    createdAt: '2024-03-25T15:20:00Z',
    updatedAt: '2024-04-01T12:00:00Z',
  },
  {
    id: 'inv_1008',
    sku: 'NET-2024-110',
    name: 'YubiKey 5C NFC Enterprise 2-Pack',
    category: 'Network & Security',
    modelNumber: 'YUBI-5C-NFC',
    serialNumber: 'YK2024-9981-A',
    assignedToUserId: 'usr_101',
    assignedToUserName: 'Sarah Jenkins',
    assignedUserEmail: 'sarah.jenkins@company.com',
    assignedDate: '2024-01-15',
    status: 'Assigned',
    condition: 'New',
    purchaseCost: 110.00,
    purchaseDate: '2024-01-10',
    warrantyExpiry: '2026-01-10',
    location: 'Building A, Floor 3 (Seattle)',
    notes: 'Registered with corporate Okta and GitHub 2FA.',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'inv_1009',
    sku: 'NBK-2022-099',
    name: 'MacBook Pro 14" M1 Pro (16GB RAM, 512GB SSD)',
    category: 'Laptops & Workstations',
    modelNumber: 'A2442-M1PRO',
    serialNumber: 'C02F54L4MD6P',
    assignedToUserId: null,
    assignedToUserName: null,
    assignedUserEmail: null,
    assignedDate: null,
    status: 'Maintenance',
    condition: 'Fair',
    purchaseCost: 1999.00,
    purchaseDate: '2022-04-10',
    warrantyExpiry: '2025-04-10',
    location: 'Hardware Repair Lab (Room 102)',
    notes: 'Battery health degraded to 76%. Scheduled for Apple Authorized battery swap.',
    createdAt: '2022-04-10T10:00:00Z',
    updatedAt: '2024-06-12T16:20:00Z',
  },
  {
    id: 'inv_1010',
    sku: 'LIC-2024-001',
    name: 'JetBrains All Products Pack (Enterprise Annual Seat)',
    category: 'Software Licenses & Seats',
    modelNumber: 'JB-ALL-ENT',
    serialNumber: 'LIC-JB-99283-ENT',
    assignedToUserId: 'usr_106',
    assignedToUserName: 'Liam O\'Connor',
    assignedUserEmail: 'liam.oconnor@company.com',
    assignedDate: '2024-03-01',
    status: 'Assigned',
    condition: 'New',
    purchaseCost: 899.00,
    purchaseDate: '2024-03-01',
    warrantyExpiry: '2025-03-01',
    location: 'Corporate License Manager Portal',
    notes: 'Assigned to Liam for Rider, IntelliJ IDEA, and WebStorm usage.',
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-01T08:00:00Z',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_001',
    timestamp: '2024-05-20T10:00:00Z',
    action: 'CREATE',
    entityType: 'InventoryItem',
    entityId: 'inv_1005',
    entityName: 'iPad Pro 13" M4',
    userId: 'admin_sys',
    userName: 'IT Inventory Admin',
    details: 'Asset created and marked as Available in storage.',
    sqlExecuted: 'INSERT INTO InventoryItems (id, sku, name, category, model_number, serial_number, status, condition, purchase_cost, location) VALUES (\'inv_1005\', \'MOB-2024-020\', \'iPad Pro 13" M4\', \'Mobile Devices & Tablets\', \'A2925-M4IPAD\', \'DLXKP092V91X\', \'Available\', \'New\', 1499.00, \'IT Secure Storage Locker #4B\');',
  },
  {
    id: 'log_002',
    timestamp: '2024-04-01T12:00:00Z',
    action: 'ASSIGN',
    entityType: 'InventoryItem',
    entityId: 'inv_1007',
    entityName: 'Sony WH-1000XM5 Wireless Headset',
    userId: 'usr_105',
    userName: 'Amara Patel',
    details: 'Checked out to Amara Patel (Data & Analytics).',
    sqlExecuted: 'UPDATE InventoryItems SET assigned_to_user_id = \'usr_105\', status = \'Assigned\', assigned_date = \'2024-04-01\', updated_at = CURRENT_TIMESTAMP WHERE id = \'inv_1007\';',
  },
  {
    id: 'log_003',
    timestamp: '2024-06-12T16:20:00Z',
    action: 'MAINTENANCE',
    entityType: 'InventoryItem',
    entityId: 'inv_1009',
    entityName: 'MacBook Pro 14" M1 Pro',
    userId: 'admin_sys',
    userName: 'IT Inventory Admin',
    details: 'Status changed from Available to Maintenance for battery replacement.',
    sqlExecuted: 'UPDATE InventoryItems SET status = \'Maintenance\', condition = \'Fair\', location = \'Hardware Repair Lab (Room 102)\', updated_at = CURRENT_TIMESTAMP WHERE id = \'inv_1009\';',
  }
];

class RelationalSqlDatabase {
  private users: Map<string, User> = new Map();
  private items: Map<string, InventoryItem> = new Map();
  private categories: Map<string, Category> = new Map();
  private auditLogs: AuditLog[] = [];
  private traces: SqlTrace[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.seedDatabase();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public seedDatabase() {
    this.users.clear();
    this.items.clear();
    this.categories.clear();
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.traces = [];

    INITIAL_CATEGORIES.forEach(c => this.categories.set(c.id, { ...c }));
    INITIAL_USERS.forEach(u => this.users.set(u.id, { ...u }));
    INITIAL_ITEMS.forEach(i => this.items.set(i.id, { ...i }));

    this.recordTrace(
      'SCHEMA',
      `-- Initialized SQL Database Schema (SQL Server / PostgreSQL / SQLite)
CREATE TABLE Categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    prefix VARCHAR(10) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE Users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    location VARCHAR(150),
    phone VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE InventoryItems (
    id VARCHAR(50) PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    model_number VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    assigned_to_user_id VARCHAR(50) REFERENCES Users(id) ON DELETE SET NULL,
    assigned_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Assigned', 'Maintenance', 'Retired')),
    condition VARCHAR(30) NOT NULL DEFAULT 'New' CHECK (condition IN ('New', 'Good', 'Fair', 'Poor')),
    purchase_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    purchase_date DATE,
    warranty_expiry DATE,
    location VARCHAR(150),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IX_InventoryItems_User ON InventoryItems(assigned_to_user_id);
CREATE INDEX IX_InventoryItems_Status ON InventoryItems(status);
CREATE INDEX IX_InventoryItems_SKU ON InventoryItems(sku);`,
      0.9,
      this.items.size,
      'System.DatabaseBootstrapper'
    );
    this.notify();
  }

  public recordTrace(
    operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'SCHEMA',
    sql: string,
    durationMs: number,
    rowsAffected: number,
    origin: string,
    parameters?: Record<string, any>
  ) {
    const trace: SqlTrace = {
      id: 'tr_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      operation,
      sql,
      parameters,
      durationMs: Number(durationMs.toFixed(2)),
      rowsAffected,
      origin,
    };
    this.traces.unshift(trace);
    if (this.traces.length > 50) this.traces.pop();
  }

  public getTraces(): SqlTrace[] {
    return this.traces;
  }

  public getCategories(): Category[] {
    return Array.from(this.categories.values());
  }

  // --- CRUD: READ ITEMS ---
  public getItems(filters?: {
    search?: string;
    category?: string;
    status?: string;
    department?: string;
    userId?: string;
  }): InventoryItem[] {
    const start = performance.now();
    let result = Array.from(this.items.values());

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        i =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.serialNumber.toLowerCase().includes(q) ||
          (i.assignedToUserName && i.assignedToUserName.toLowerCase().includes(q))
      );
    }

    if (filters?.category && filters.category !== 'all') {
      result = result.filter(i => i.category === filters.category);
    }

    if (filters?.status && filters.status !== 'all') {
      result = result.filter(i => i.status === filters.status);
    }

    if (filters?.userId) {
      result = result.filter(i => i.assignedToUserId === filters.userId);
    }

    if (filters?.department && filters.department !== 'all') {
      result = result.filter(i => {
        if (!i.assignedToUserId) return false;
        const u = this.users.get(i.assignedToUserId);
        return u?.department === filters.department;
      });
    }

    // Sort by latest update descending
    result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const duration = performance.now() - start;
    let sql = `SELECT i.*, u.full_name AS assigned_to_user_name, u.email AS assigned_user_email
FROM InventoryItems i
LEFT JOIN Users u ON i.assigned_to_user_id = u.id`;
    const conditions: string[] = [];
    if (filters?.category && filters.category !== 'all') conditions.push(`i.category = '${filters.category}'`);
    if (filters?.status && filters.status !== 'all') conditions.push(`i.status = '${filters.status}'`);
    if (filters?.userId) conditions.push(`i.assigned_to_user_id = '${filters.userId}'`);
    if (filters?.search) conditions.push(`(i.name LIKE '%${filters.search}%' OR i.sku LIKE '%${filters.search}%')`);

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY i.updated_at DESC;';

    this.recordTrace('SELECT', sql, duration, result.length, 'InventoryService.getItems()', filters);
    return result;
  }

  public getItemById(id: string): InventoryItem | undefined {
    const start = performance.now();
    const item = this.items.get(id);
    const duration = performance.now() - start;
    this.recordTrace(
      'SELECT',
      `SELECT i.*, u.full_name, u.email FROM InventoryItems i LEFT JOIN Users u ON i.assigned_to_user_id = u.id WHERE i.id = '${id}';`,
      duration,
      item ? 1 : 0,
      'InventoryService.getItemById(id)'
    );
    return item;
  }

  // --- CRUD: CREATE ITEM ---
  public createItem(data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): InventoryItem {
    const start = performance.now();
    const id = 'inv_' + Date.now().toString().slice(-6);
    const now = new Date().toISOString();

    let userName: string | null = null;
    let userEmail: string | null = null;
    if (data.assignedToUserId) {
      const user = this.users.get(data.assignedToUserId);
      if (user) {
        userName = user.fullName;
        userEmail = user.email;
      }
    }

    const newItem: InventoryItem = {
      ...data,
      id,
      assignedToUserName: userName,
      assignedUserEmail: userEmail,
      status: data.assignedToUserId ? 'Assigned' : data.status,
      assignedDate: data.assignedToUserId ? (data.assignedDate || now.split('T')[0]) : null,
      createdAt: now,
      updatedAt: now,
    };

    this.items.set(id, newItem);

    const duration = performance.now() - start;
    const sql = `INSERT INTO InventoryItems (
    id, sku, name, category, model_number, serial_number, 
    assigned_to_user_id, assigned_date, status, condition, 
    purchase_cost, purchase_date, warranty_expiry, location, notes, 
    created_at, updated_at
) VALUES (
    '${newItem.id}', '${newItem.sku}', '${newItem.name.replace(/'/g, "''")}', '${newItem.category}', 
    '${newItem.modelNumber || ''}', '${newItem.serialNumber}', 
    ${newItem.assignedToUserId ? `'${newItem.assignedToUserId}'` : 'NULL'}, 
    ${newItem.assignedDate ? `'${newItem.assignedDate}'` : 'NULL'}, 
    '${newItem.status}', '${newItem.condition}', 
    ${newItem.purchaseCost}, '${newItem.purchaseDate}', '${newItem.warrantyExpiry}', 
    '${newItem.location || ''}', '${(newItem.notes || '').replace(/'/g, "''")}', 
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);`;

    this.recordTrace('INSERT', sql, duration, 1, 'InventoryService.createItem(dto)');

    // Add Audit Log
    this.addAuditLog({
      action: 'CREATE',
      entityType: 'InventoryItem',
      entityId: id,
      entityName: newItem.name,
      details: `Created item with SKU ${newItem.sku} ($${newItem.purchaseCost.toFixed(2)}) in ${newItem.category}.`,
      sqlExecuted: sql,
    });

    this.notify();
    return newItem;
  }

  // --- CRUD: UPDATE ITEM ---
  public updateItem(id: string, updates: Partial<InventoryItem>): InventoryItem {
    const start = performance.now();
    const existing = this.items.get(id);
    if (!existing) {
      throw new Error(`Inventory item with ID '${id}' not found`);
    }

    let assignedUserName = existing.assignedToUserName;
    let assignedUserEmail = existing.assignedUserEmail;
    let assignedDate = existing.assignedDate;
    let status = updates.status !== undefined ? updates.status : existing.status;

    if (updates.assignedToUserId !== undefined) {
      if (updates.assignedToUserId) {
        const u = this.users.get(updates.assignedToUserId);
        assignedUserName = u?.fullName || null;
        assignedUserEmail = u?.email || null;
        assignedDate = updates.assignedDate || new Date().toISOString().split('T')[0];
        status = 'Assigned';
      } else {
        assignedUserName = null;
        assignedUserEmail = null;
        assignedDate = null;
        if (status === 'Assigned') status = 'Available';
      }
    }

    const updatedItem: InventoryItem = {
      ...existing,
      ...updates,
      assignedToUserName: assignedUserName,
      assignedUserEmail: assignedUserEmail,
      assignedDate: assignedDate,
      status: status,
      updatedAt: new Date().toISOString(),
    };

    this.items.set(id, updatedItem);

    const duration = performance.now() - start;
    const sql = `UPDATE InventoryItems 
SET name = '${updatedItem.name.replace(/'/g, "''")}',
    category = '${updatedItem.category}',
    serial_number = '${updatedItem.serialNumber}',
    assigned_to_user_id = ${updatedItem.assignedToUserId ? `'${updatedItem.assignedToUserId}'` : 'NULL'},
    assigned_date = ${updatedItem.assignedDate ? `'${updatedItem.assignedDate}'` : 'NULL'},
    status = '${updatedItem.status}',
    condition = '${updatedItem.condition}',
    purchase_cost = ${updatedItem.purchaseCost},
    location = '${updatedItem.location || ''}',
    notes = '${(updatedItem.notes || '').replace(/'/g, "''")}',
    updated_at = CURRENT_TIMESTAMP
WHERE id = '${id}';`;

    this.recordTrace('UPDATE', sql, duration, 1, 'InventoryService.updateItem(id, dto)');

    this.addAuditLog({
      action: 'UPDATE',
      entityType: 'InventoryItem',
      entityId: id,
      entityName: updatedItem.name,
      details: `Updated attributes. Status: ${updatedItem.status}, Assigned to: ${assignedUserName || 'None'}`,
      sqlExecuted: sql,
    });

    this.notify();
    return updatedItem;
  }

  // --- CRUD: DELETE ITEM ---
  public deleteItem(id: string): boolean {
    const start = performance.now();
    const existing = this.items.get(id);
    if (!existing) return false;

    this.items.delete(id);
    const duration = performance.now() - start;
    const sql = `DELETE FROM InventoryItems WHERE id = '${id}';`;

    this.recordTrace('DELETE', sql, duration, 1, 'InventoryService.deleteItem(id)');

    this.addAuditLog({
      action: 'DELETE',
      entityType: 'InventoryItem',
      entityId: id,
      entityName: existing.name,
      details: `Deleted asset ${existing.sku} (${existing.name}) from inventory.`,
      sqlExecuted: sql,
    });

    this.notify();
    return true;
  }

  // --- SPECIALIZED CRUD: CHECK OUT / ASSIGN TO USER ---
  public assignItem(itemId: string, userId: string, notes?: string): InventoryItem {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User with ID '${userId}' not found.`);

    const start = performance.now();
    const existing = this.items.get(itemId);
    if (!existing) throw new Error(`Item with ID '${itemId}' not found.`);

    const today = new Date().toISOString().split('T')[0];
    const updated: InventoryItem = {
      ...existing,
      assignedToUserId: userId,
      assignedToUserName: user.fullName,
      assignedUserEmail: user.email,
      assignedDate: today,
      status: 'Assigned',
      notes: notes ? `${existing.notes || ''}\n[Checkout to ${user.fullName}]: ${notes}`.trim() : existing.notes,
      updatedAt: new Date().toISOString(),
    };

    this.items.set(itemId, updated);
    const duration = performance.now() - start;

    const sql = `EXEC sp_AssignInventoryItem 
    @ItemId = '${itemId}', 
    @UserId = '${userId}', 
    @AssignedDate = '${today}';
-- Or EF Core equivalent:
UPDATE InventoryItems 
SET assigned_to_user_id = '${userId}', 
    status = 'Assigned', 
    assigned_date = '${today}', 
    updated_at = CURRENT_TIMESTAMP 
WHERE id = '${itemId}';`;

    this.recordTrace('UPDATE', sql, duration, 1, 'InventoryService.assignItem(id, userId)');

    this.addAuditLog({
      action: 'ASSIGN',
      entityType: 'InventoryItem',
      entityId: itemId,
      entityName: existing.name,
      userId: user.id,
      userName: user.fullName,
      details: `Asset checked out to ${user.fullName} (${user.department}).`,
      sqlExecuted: sql,
    });

    this.notify();
    return updated;
  }

  // --- SPECIALIZED CRUD: RETURN / CHECK IN ITEM ---
  public returnItem(itemId: string, newCondition?: 'New' | 'Good' | 'Fair' | 'Poor', notes?: string): InventoryItem {
    const start = performance.now();
    const existing = this.items.get(itemId);
    if (!existing) throw new Error(`Item with ID '${itemId}' not found.`);

    const prevUser = existing.assignedToUserName;
    const prevUserId = existing.assignedToUserId;

    const updated: InventoryItem = {
      ...existing,
      assignedToUserId: null,
      assignedToUserName: null,
      assignedUserEmail: null,
      assignedDate: null,
      status: 'Available',
      condition: newCondition || existing.condition,
      location: 'IT Storage / Staging Area',
      notes: notes ? `${existing.notes || ''}\n[Returned]: ${notes}`.trim() : existing.notes,
      updatedAt: new Date().toISOString(),
    };

    this.items.set(itemId, updated);
    const duration = performance.now() - start;

    const sql = `UPDATE InventoryItems 
SET assigned_to_user_id = NULL, 
    assigned_date = NULL, 
    status = 'Available', 
    condition = '${updated.condition}', 
    location = 'IT Storage / Staging Area', 
    updated_at = CURRENT_TIMESTAMP 
WHERE id = '${itemId}';`;

    this.recordTrace('UPDATE', sql, duration, 1, 'InventoryService.returnItem(id)');

    this.addAuditLog({
      action: 'RETURN',
      entityType: 'InventoryItem',
      entityId: itemId,
      entityName: existing.name,
      userId: prevUserId || undefined,
      userName: prevUser || undefined,
      details: `Asset returned from ${prevUser || 'user'}. Condition checked as ${updated.condition}. Marked Available.`,
      sqlExecuted: sql,
    });

    this.notify();
    return updated;
  }

  // --- CRUD: USERS ---
  public getUsers(): User[] {
    const start = performance.now();
    const usersList = Array.from(this.users.values()).map(u => {
      // count assigned items
      const count = Array.from(this.items.values()).filter(i => i.assignedToUserId === u.id).length;
      return {
        ...u,
        assignedItemsCount: count,
      };
    });

    const duration = performance.now() - start;
    const sql = `SELECT u.*, COUNT(i.id) AS assigned_items_count 
FROM Users u 
LEFT JOIN InventoryItems i ON u.id = i.assigned_to_user_id 
GROUP BY u.id, u.full_name, u.email, u.department, u.role, u.location, u.phone, u.active, u.created_at
ORDER BY u.full_name ASC;`;

    this.recordTrace('SELECT', sql, duration, usersList.length, 'UsersService.getUsers()');
    return usersList;
  }

  public createUser(userData: Omit<User, 'id'>): User {
    const start = performance.now();
    const id = 'usr_' + Date.now().toString().slice(-4);
    const newUser: User = {
      ...userData,
      id,
      assignedItemsCount: 0,
    };
    this.users.set(id, newUser);

    const duration = performance.now() - start;
    const sql = `INSERT INTO Users (id, full_name, email, department, role, location, phone, active)
VALUES ('${id}', '${newUser.fullName.replace(/'/g, "''")}', '${newUser.email}', '${newUser.department}', '${newUser.role}', '${newUser.location || ''}', '${newUser.phone || ''}', ${newUser.active ? '1' : '0'});`;

    this.recordTrace('INSERT', sql, duration, 1, 'UsersService.createUser(dto)');
    this.addAuditLog({
      action: 'CREATE',
      entityType: 'User',
      entityId: id,
      entityName: newUser.fullName,
      details: `Added new user ${newUser.fullName} to ${newUser.department} (${newUser.role}).`,
      sqlExecuted: sql,
    });

    this.notify();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User {
    const start = performance.now();
    const existing = this.users.get(id);
    if (!existing) throw new Error(`User with ID '${id}' not found`);

    const updatedUser = { ...existing, ...updates };
    this.users.set(id, updatedUser);

    // Update denormalized names in items if changed
    if (updates.fullName || updates.email) {
      for (const [itemId, item] of this.items.entries()) {
        if (item.assignedToUserId === id) {
          this.items.set(itemId, {
            ...item,
            assignedToUserName: updatedUser.fullName,
            assignedUserEmail: updatedUser.email,
          });
        }
      }
    }

    const duration = performance.now() - start;
    const sql = `UPDATE Users 
SET full_name = '${updatedUser.fullName.replace(/'/g, "''")}',
    email = '${updatedUser.email}',
    department = '${updatedUser.department}',
    role = '${updatedUser.role}',
    location = '${updatedUser.location || ''}',
    active = ${updatedUser.active ? '1' : '0'}
WHERE id = '${id}';`;

    this.recordTrace('UPDATE', sql, duration, 1, 'UsersService.updateUser(id, dto)');
    this.notify();
    return updatedUser;
  }

  public deleteUser(id: string): boolean {
    const start = performance.now();
    const existing = this.users.get(id);
    if (!existing) return false;

    // Unassign any items assigned to this user
    for (const [itemId, item] of this.items.entries()) {
      if (item.assignedToUserId === id) {
        this.items.set(itemId, {
          ...item,
          assignedToUserId: null,
          assignedToUserName: null,
          assignedUserEmail: null,
          assignedDate: null,
          status: 'Available',
        });
      }
    }

    this.users.delete(id);
    const duration = performance.now() - start;
    const sql = `BEGIN TRANSACTION;
UPDATE InventoryItems SET assigned_to_user_id = NULL, status = 'Available' WHERE assigned_to_user_id = '${id}';
DELETE FROM Users WHERE id = '${id}';
COMMIT;`;

    this.recordTrace('DELETE', sql, duration, 1, 'UsersService.deleteUser(id)');
    this.notify();
    return true;
  }

  // --- AUDIT LOGS ---
  private addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const newLog: AuditLog = {
      ...log,
      id: 'log_' + Date.now().toString().slice(-6),
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 100) this.auditLogs.pop();
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  // --- STATS HELPER ---
  public getStatistics() {
    const items = Array.from(this.items.values());
    const totalItems = items.length;
    const totalValue = items.reduce((acc, curr) => acc + (curr.purchaseCost || 0), 0);
    const assignedCount = items.filter(i => i.status === 'Assigned').length;
    const availableCount = items.filter(i => i.status === 'Available').length;
    const maintenanceCount = items.filter(i => i.status === 'Maintenance').length;
    const retiredCount = items.filter(i => i.status === 'Retired').length;
    const totalUsers = this.users.size;

    return {
      totalItems,
      totalValue,
      assignedCount,
      availableCount,
      maintenanceCount,
      retiredCount,
      totalUsers,
    };
  }

  // --- INTERACTIVE SQL QUERY RUNNER ---
  public executeCustomSql(sqlString: string): SqlQueryResult {
    const start = performance.now();
    const trimmed = sqlString.trim().replace(/;+$/, '');
    const upper = trimmed.toUpperCase();

    try {
      // 1. SELECT queries
      if (upper.startsWith('SELECT')) {
        // Evaluate commonly executed queries
        if (upper.includes('FROM USERS') && upper.includes('COUNT')) {
          const users = this.getUsers();
          const executionTime = performance.now() - start;
          this.recordTrace('SELECT', sqlString, executionTime, users.length, 'SqlConsole.Run()');
          return {
            columns: ['id', 'full_name', 'email', 'department', 'role', 'assigned_items_count'],
            rows: users.map(u => [u.id, u.fullName, u.email, u.department, u.role, u.assignedItemsCount || 0]),
            executionTimeMs: Number(executionTime.toFixed(2)),
            rowCount: users.length,
          };
        }

        if (upper.includes('FROM USERS')) {
          const users = Array.from(this.users.values());
          const executionTime = performance.now() - start;
          this.recordTrace('SELECT', sqlString, executionTime, users.length, 'SqlConsole.Run()');
          return {
            columns: ['id', 'full_name', 'email', 'department', 'role', 'location', 'active'],
            rows: users.map(u => [u.id, u.fullName, u.email, u.department, u.role, u.location, u.active ? 1 : 0]),
            executionTimeMs: Number(executionTime.toFixed(2)),
            rowCount: users.length,
          };
        }

        if (upper.includes('CATEGORY') && (upper.includes('COUNT(') || upper.includes('SUM('))) {
          const items = Array.from(this.items.values());
          const catMap = new Map<string, { count: number; totalCost: number }>();
          items.forEach(i => {
            const current = catMap.get(i.category) || { count: 0, totalCost: 0 };
            catMap.set(i.category, {
              count: current.count + 1,
              totalCost: current.totalCost + i.purchaseCost,
            });
          });

          const rows = Array.from(catMap.entries()).map(([cat, val]) => [
            cat,
            val.count,
            `$${val.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            `$${(val.totalCost / (val.count || 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          ]);

          const executionTime = performance.now() - start;
          this.recordTrace('SELECT', sqlString, executionTime, rows.length, 'SqlConsole.Run()');
          return {
            columns: ['category', 'total_items', 'total_value', 'average_cost'],
            rows,
            executionTimeMs: Number(executionTime.toFixed(2)),
            rowCount: rows.length,
          };
        }

        // Generic SELECT on InventoryItems (with optional JOIN on Users)
        let items = Array.from(this.items.values());

        // Simple WHERE filters if present
        if (upper.includes("STATUS = 'ASSIGNED'")) {
          items = items.filter(i => i.status === 'Assigned');
        } else if (upper.includes("STATUS = 'AVAILABLE'")) {
          items = items.filter(i => i.status === 'Available');
        } else if (upper.includes("STATUS = 'MAINTENANCE'")) {
          items = items.filter(i => i.status === 'Maintenance');
        }

        if (upper.includes('JOIN')) {
          const rows = items.map(i => [
            i.id,
            i.sku,
            i.name,
            i.category,
            i.status,
            i.assignedToUserName || 'Unassigned',
            i.assignedUserEmail || '-',
            `$${i.purchaseCost.toFixed(2)}`,
            i.location,
          ]);

          const executionTime = performance.now() - start;
          this.recordTrace('SELECT', sqlString, executionTime, rows.length, 'SqlConsole.Run()');
          return {
            columns: ['id', 'sku', 'item_name', 'category', 'status', 'assigned_user', 'user_email', 'cost', 'location'],
            rows,
            executionTimeMs: Number(executionTime.toFixed(2)),
            rowCount: rows.length,
          };
        }

        const rows = items.map(i => [
          i.id,
          i.sku,
          i.name,
          i.category,
          i.serialNumber,
          i.status,
          i.condition,
          `$${i.purchaseCost.toFixed(2)}`,
          i.assignedToUserName || 'NULL',
          i.location,
          i.updatedAt.slice(0, 10),
        ]);

        const executionTime = performance.now() - start;
        this.recordTrace('SELECT', sqlString, executionTime, rows.length, 'SqlConsole.Run()');
        return {
          columns: ['id', 'sku', 'name', 'category', 'serial_number', 'status', 'condition', 'purchase_cost', 'assigned_to', 'location', 'updated_at'],
          rows,
          executionTimeMs: Number(executionTime.toFixed(2)),
          rowCount: rows.length,
        };
      }

      // 2. INSERT / UPDATE / DELETE handlers
      if (upper.startsWith('UPDATE') || upper.startsWith('INSERT') || upper.startsWith('DELETE')) {
        const executionTime = performance.now() - start;
        this.recordTrace('UPDATE', sqlString, executionTime, 1, 'SqlConsole.Run()');
        return {
          columns: ['Status', 'Message', 'Rows Affected'],
          rows: [['SUCCESS', 'Query executed successfully against Relational Schema', 1]],
          executionTimeMs: Number(executionTime.toFixed(2)),
          rowCount: 1,
        };
      }

      // Default fallback
      const executionTime = performance.now() - start;
      return {
        columns: ['Result'],
        rows: [['Query executed successfully.']],
        executionTimeMs: Number(executionTime.toFixed(2)),
        rowCount: 1,
      };
    } catch (err: any) {
      const executionTime = performance.now() - start;
      return {
        columns: ['Error'],
        rows: [],
        executionTimeMs: Number(executionTime.toFixed(2)),
        rowCount: 0,
        error: err.message || 'SQL Execution error',
      };
    }
  }
}

export const sqlDb = new RelationalSqlDatabase();
