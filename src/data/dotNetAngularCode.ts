import { CodeFile } from '../types/inventory';

export const CODE_FILES: CodeFile[] = [
  // --- 1. ASP.NET CORE 8 WEB API ---
  {
    id: 'dotnet-program-cs',
    name: 'Program.cs',
    path: 'InventoryHub.API/Program.cs',
    language: 'csharp',
    category: 'dotnet',
    description: 'ASP.NET Core 8 Web API entry point with EF Core SQL Server, CORS, DI, and Swagger.',
    content: `using InventoryHub.API.Data;
using InventoryHub.API.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "User Inventory Management API", Version = "v1" });
});

// Configure Entity Framework Core with SQL Server or PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Database=UserInventoryDb;Trusted_Connection=True;TrustServerCertificate=True;";

builder.Services.AddDbContext<InventoryDbContext>(options =>
    options.UseSqlServer(connectionString));

// Register Repository and Unit of Work
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();

// Configure CORS for Angular frontend (default port 4200)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularDevClient");
app.UseAuthorization();
app.MapControllers();

// Auto-migrate and seed database on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();
    context.Database.EnsureCreated();
}

app.Run();`
  },

  {
    id: 'dotnet-inventory-controller',
    name: 'InventoryController.cs',
    path: 'InventoryHub.API/Controllers/InventoryController.cs',
    language: 'csharp',
    category: 'dotnet',
    description: 'RESTful API Controller handling complete CRUD operations for user inventory items.',
    content: `using InventoryHub.API.Data;
using InventoryHub.API.DTOs;
using InventoryHub.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly InventoryDbContext _context;
    private readonly ILogger<InventoryController> _logger;

    public InventoryController(InventoryDbContext context, ILogger<InventoryController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/inventory?category=Laptops&status=Assigned&search=MacBook
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetAll(
        [FromQuery] string? category,
        [FromQuery] string? status,
        [FromQuery] string? search,
        [FromQuery] string? userId)
    {
        var query = _context.InventoryItems
            .Include(i => i.AssignedUser)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrEmpty(category) && category != "all")
            query = query.Where(i => i.Category == category);

        if (!string.IsNullOrEmpty(status) && status != "all")
            query = query.Where(i => i.Status == status);

        if (!string.IsNullOrEmpty(userId))
            query = query.Where(i => i.AssignedToUserId == userId);

        if (!string.IsNullOrEmpty(search))
        {
            var s = search.ToLower();
            query = query.Where(i => 
                i.Name.ToLower().Contains(s) || 
                i.Sku.ToLower().Contains(s) || 
                i.SerialNumber.ToLower().Contains(s));
        }

        var items = await query
            .OrderByDescending(i => i.UpdatedAt)
            .Select(i => new InventoryItemDto
            {
                Id = i.Id,
                Sku = i.Sku,
                Name = i.Name,
                Category = i.Category,
                ModelNumber = i.ModelNumber,
                SerialNumber = i.SerialNumber,
                AssignedToUserId = i.AssignedToUserId,
                AssignedToUserName = i.AssignedUser != null ? i.AssignedUser.FullName : null,
                AssignedUserEmail = i.AssignedUser != null ? i.AssignedUser.Email : null,
                AssignedDate = i.AssignedDate,
                Status = i.Status,
                Condition = i.Condition,
                PurchaseCost = i.PurchaseCost,
                PurchaseDate = i.PurchaseDate,
                WarrantyExpiry = i.WarrantyExpiry,
                Location = i.Location,
                Notes = i.Notes,
                UpdatedAt = i.UpdatedAt
            })
            .ToListAsync();

        return Ok(items);
    }

    // GET: api/inventory/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<InventoryItemDto>> GetById(string id)
    {
        var item = await _context.InventoryItems
            .Include(i => i.AssignedUser)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (item == null)
            return NotFound(new { message = $"Item with ID '{id}' was not found." });

        return Ok(MapToDto(item));
    }

    // POST: api/inventory (CREATE)
    [HttpPost]
    public async Task<ActionResult<InventoryItemDto>> Create([FromBody] CreateInventoryItemDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existingSku = await _context.InventoryItems.AnyAsync(i => i.Sku == dto.Sku);
        if (existingSku)
            return Conflict(new { message = $"An item with SKU '{dto.Sku}' already exists." });

        var item = new InventoryItem
        {
            Id = Guid.NewGuid().ToString("N")[..12],
            Sku = dto.Sku,
            Name = dto.Name,
            Category = dto.Category,
            ModelNumber = dto.ModelNumber,
            SerialNumber = dto.SerialNumber,
            AssignedToUserId = dto.AssignedToUserId,
            AssignedDate = !string.IsNullOrEmpty(dto.AssignedToUserId) ? DateTime.UtcNow.ToString("yyyy-MM-dd") : null,
            Status = !string.IsNullOrEmpty(dto.AssignedToUserId) ? "Assigned" : dto.Status,
            Condition = dto.Condition,
            PurchaseCost = dto.PurchaseCost,
            PurchaseDate = dto.PurchaseDate,
            WarrantyExpiry = dto.WarrantyExpiry,
            Location = dto.Location,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.InventoryItems.Add(item);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created new Inventory Item {Sku} ({Name})", item.Sku, item.Name);

        return CreatedAtAction(nameof(GetById), new { id = item.Id }, MapToDto(item));
    }

    // PUT: api/inventory/{id} (UPDATE)
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateInventoryItemDto dto)
    {
        var item = await _context.InventoryItems.FindAsync(id);
        if (item == null)
            return NotFound(new { message = $"Item with ID '{id}' was not found." });

        item.Name = dto.Name;
        item.Category = dto.Category;
        item.ModelNumber = dto.ModelNumber;
        item.SerialNumber = dto.SerialNumber;
        item.Condition = dto.Condition;
        item.PurchaseCost = dto.PurchaseCost;
        item.Location = dto.Location;
        item.Notes = dto.Notes;
        item.Status = dto.Status;

        // If user assignment changed
        if (item.AssignedToUserId != dto.AssignedToUserId)
        {
            item.AssignedToUserId = dto.AssignedToUserId;
            item.AssignedDate = !string.IsNullOrEmpty(dto.AssignedToUserId) 
                ? DateTime.UtcNow.ToString("yyyy-MM-dd") 
                : null;
            if (!string.IsNullOrEmpty(dto.AssignedToUserId) && item.Status == "Available")
                item.Status = "Assigned";
        }

        item.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(MapToDto(item));
    }

    // DELETE: api/inventory/{id} (DELETE)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var item = await _context.InventoryItems.FindAsync(id);
        if (item == null)
            return NotFound(new { message = $"Item with ID '{id}' was not found." });

        _context.InventoryItems.Remove(item);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted Inventory Item with ID {Id}", id);
        return NoContent();
    }

    // POST: api/inventory/{id}/assign (Assign to User)
    [HttpPost("{id}/assign")]
    public async Task<IActionResult> AssignToUser(string id, [FromBody] AssignItemDto dto)
    {
        var item = await _context.InventoryItems.FindAsync(id);
        if (item == null) return NotFound();

        var user = await _context.Users.FindAsync(dto.UserId);
        if (user == null) return NotFound(new { message = "Target user does not exist." });

        item.AssignedToUserId = dto.UserId;
        item.AssignedDate = DateTime.UtcNow.ToString("yyyy-MM-dd");
        item.Status = "Assigned";
        item.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Asset '{item.Name}' assigned to {user.FullName}." });
    }

    // POST: api/inventory/{id}/return (Return Item)
    [HttpPost("{id}/return")]
    public async Task<IActionResult> ReturnItem(string id)
    {
        var item = await _context.InventoryItems.FindAsync(id);
        if (item == null) return NotFound();

        item.AssignedToUserId = null;
        item.AssignedDate = null;
        item.Status = "Available";
        item.Location = "IT Storage Facility";
        item.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Asset '{item.Name}' returned and marked as Available." });
    }

    private static InventoryItemDto MapToDto(InventoryItem i) => new()
    {
        Id = i.Id,
        Sku = i.Sku,
        Name = i.Name,
        Category = i.Category,
        ModelNumber = i.ModelNumber,
        SerialNumber = i.SerialNumber,
        AssignedToUserId = i.AssignedToUserId,
        AssignedToUserName = i.AssignedUser?.FullName,
        AssignedUserEmail = i.AssignedUser?.Email,
        AssignedDate = i.AssignedDate,
        Status = i.Status,
        Condition = i.Condition,
        PurchaseCost = i.PurchaseCost,
        PurchaseDate = i.PurchaseDate,
        WarrantyExpiry = i.WarrantyExpiry,
        Location = i.Location,
        Notes = i.Notes,
        UpdatedAt = i.UpdatedAt
    };
}`
  },

  {
    id: 'dotnet-dbcontext',
    name: 'InventoryDbContext.cs',
    path: 'InventoryHub.API/Data/InventoryDbContext.cs',
    language: 'csharp',
    category: 'dotnet',
    description: 'Entity Framework Core DbContext defining schema, foreign keys, and indexes.',
    content: `using InventoryHub.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryHub.API.Data;

public class InventoryDbContext : DbContext
{
    public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options)
    {
    }

    public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // InventoryItem configuration
        modelBuilder.Entity<InventoryItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Sku).IsUnique();
            entity.Property(e => e.Sku).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Name).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Category).HasMaxLength(100).IsRequired();
            entity.Property(e => e.PurchaseCost).HasPrecision(18, 2);

            // Foreign Key relationship to User
            entity.HasOne(e => e.AssignedUser)
                  .WithMany(u => u.AssignedItems)
                  .HasForeignKey(e => e.AssignedToUserId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FullName).HasMaxLength(150).IsRequired();
            entity.Property(e => e.Department).HasMaxLength(100).IsRequired();
        });
    }
}`
  },

  {
    id: 'dotnet-models',
    name: 'InventoryItem.cs',
    path: 'InventoryHub.API/Models/InventoryItem.cs',
    language: 'csharp',
    category: 'dotnet',
    description: 'C# Domain Model representing an inventory asset with relations to users.',
    content: `using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryHub.API.Models;

public class InventoryItem
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Sku { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    public string? ModelNumber { get; set; }
    public string SerialNumber { get; set; } = string.Empty;

    // Foreign key to User
    public string? AssignedToUserId { get; set; }
    public virtual User? AssignedUser { get; set; }

    public string? AssignedDate { get; set; }
    public string Status { get; set; } = "Available"; // Available, Assigned, Maintenance, Retired
    public string Condition { get; set; } = "New";   // New, Good, Fair, Poor

    [Column(TypeName = "decimal(18,2)")]
    public decimal PurchaseCost { get; set; }

    public string PurchaseDate { get; set; } = string.Empty;
    public string WarrantyExpiry { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}`
  },

  {
    id: 'dotnet-user-model',
    name: 'User.cs',
    path: 'InventoryHub.API/Models/User.cs',
    language: 'csharp',
    category: 'dotnet',
    description: 'C# Domain Model representing a user / employee who can be assigned inventory.',
    content: `using System.ComponentModel.DataAnnotations;

namespace InventoryHub.API.Models;

public class User
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Department { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Phone { get; set; }
    public bool Active { get; set; } = true;

    // Navigation property
    public virtual ICollection<InventoryItem> AssignedItems { get; set; } = new List<InventoryItem>();
}`
  },

  {
    id: 'dotnet-appsettings',
    name: 'appsettings.json',
    path: 'InventoryHub.API/appsettings.json',
    language: 'json',
    category: 'dotnet',
    description: 'Connection strings for SQL Server / PostgreSQL and logging configurations.',
    content: `{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=UserInventoryDb;Trusted_Connection=True;TrustServerCertificate=True;",
    "PostgresConnection": "Host=localhost;Database=UserInventoryDb;Username=postgres;Password=your_secret_password"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  },
  "AllowedHosts": "*"
}`
  },

  // --- 2. ANGULAR 18 CLIENT ---
  {
    id: 'angular-inventory-service',
    name: 'inventory.service.ts',
    path: 'angular-client/src/app/services/inventory.service.ts',
    language: 'typescript',
    category: 'angular',
    description: 'Angular 18 Service using HttpClient, RxJS Observables, and modern Angular Signals.',
    content: `import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { InventoryItem, CreateInventoryItemDto, UpdateInventoryItemDto } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7001/api/inventory';

  // Angular Signals for reactive state management
  public items = signal<InventoryItem[]>([]);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);

  /**
   * READ: Fetch all inventory items with optional filters
   */
  getItems(filters?: { category?: string; status?: string; search?: string; userId?: string }): Observable<InventoryItem[]> {
    this.isLoading.set(true);
    let params = new HttpParams();

    if (filters?.category && filters.category !== 'all') params = params.set('category', filters.category);
    if (filters?.status && filters.status !== 'all') params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.userId) params = params.set('userId', filters.userId);

    return this.http.get<InventoryItem[]>(this.apiUrl, { params }).pipe(
      tap(data => {
        this.items.set(data);
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.error.set(err.message || 'Failed to load items');
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  /**
   * READ: Get single item by ID
   */
  getItemById(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(\`\${this.apiUrl}/\${id}\`);
  }

  /**
   * CREATE: Add new inventory asset
   */
  createItem(item: CreateInventoryItemDto): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, item).pipe(
      tap(created => {
        // Optimistic / reactive update to Angular signal
        this.items.update(list => [created, ...list]);
      })
    );
  }

  /**
   * UPDATE: Modify existing inventory item
   */
  updateItem(id: string, updates: UpdateInventoryItemDto): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(\`\${this.apiUrl}/\${id}\`, updates).pipe(
      tap(updated => {
        this.items.update(list => list.map(i => (i.id === id ? updated : i)));
      })
    );
  }

  /**
   * DELETE: Remove inventory item
   */
  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`).pipe(
      tap(() => {
        this.items.update(list => list.filter(i => i.id !== id));
      })
    );
  }

  /**
   * ASSIGN: Check out asset to a user
   */
  assignToUser(id: string, userId: string): Observable<any> {
    return this.http.post(\`\${this.apiUrl}/\${id}/assign\`, { userId }).pipe(
      tap(() => this.getItems().subscribe()) // Refresh signal state
    );
  }

  /**
   * RETURN: Check in asset back to available storage
   */
  returnAsset(id: string): Observable<any> {
    return this.http.post(\`\${this.apiUrl}/\${id}/return\`, {}).pipe(
      tap(() => this.getItems().subscribe())
    );
  }
}`
  },

  {
    id: 'angular-list-component',
    name: 'inventory-list.component.ts',
    path: 'angular-client/src/app/components/inventory-list/inventory-list.component.ts',
    language: 'typescript',
    category: 'angular',
    description: 'Angular 18 Standalone Component with Signals, Reactive Forms, and Material-style UI.',
    content: `import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory.model';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {
  private inventoryService = inject(InventoryService);

  // State Signals
  public items = this.inventoryService.items;
  public isLoading = this.inventoryService.isLoading;
  public searchQuery = signal<string>('');
  public selectedCategory = signal<string>('all');
  public selectedStatus = signal<string>('all');

  // Computed summary statistics
  public totalAssetValue = computed(() => 
    this.items().reduce((sum, item) => sum + (item.purchaseCost || 0), 0)
  );

  public assignedPercentage = computed(() => {
    const total = this.items().length;
    if (total === 0) return 0;
    const assigned = this.items().filter(i => i.status === 'Assigned').length;
    return Math.round((assigned / total) * 100);
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.inventoryService.getItems({
      search: this.searchQuery(),
      category: this.selectedCategory(),
      status: this.selectedStatus()
    }).subscribe();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.loadData();
  }

  onCategoryChange(cat: string): void {
    this.selectedCategory.set(cat);
    this.loadData();
  }

  onDelete(id: string, name: string): void {
    if (confirm(\`Are you sure you want to delete asset "\${name}"?\`)) {
      this.inventoryService.deleteItem(id).subscribe({
        next: () => console.log('Asset deleted successfully'),
        error: (err) => alert('Delete failed: ' + err.message)
      });
    }
  }

  onReturn(id: string): void {
    this.inventoryService.returnAsset(id).subscribe({
      next: () => alert('Item checked in successfully')
    });
  }
}`
  },

  {
    id: 'angular-list-html',
    name: 'inventory-list.component.html',
    path: 'angular-client/src/app/components/inventory-list/inventory-list.component.html',
    language: 'html',
    category: 'angular',
    description: 'Angular 18 Template using new control flow (@for, @if) with responsive tables.',
    content: `<div class="inventory-container">
  <!-- Header Bar -->
  <header class="header">
    <div class="title-group">
      <h1>User Inventory Management</h1>
      <p class="subtitle">Angular 18 + .NET 8 Web API + SQL Server Database</p>
    </div>
    <div class="actions">
      <button class="btn btn-primary" (click)="openCreateModal()">
        + Add New Asset
      </button>
    </div>
  </header>

  <!-- Summary Cards -->
  <div class="stats-grid">
    <div class="stat-card">
      <span class="stat-label">Total Assets</span>
      <span class="stat-value">{{ items().length }}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Total Asset Value</span>
      <span class="stat-value">{{ totalAssetValue() | currency:'USD' }}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Assigned Ratio</span>
      <span class="stat-value">{{ assignedPercentage() }}%</span>
    </div>
  </div>

  <!-- Filter & Search Controls -->
  <div class="filter-bar">
    <input 
      type="text" 
      [ngModel]="searchQuery()" 
      (ngModelChange)="onSearchChange($event)"
      placeholder="Search by SKU, Asset Name, or Serial #..." 
      class="form-control search-input" 
    />

    <select [ngModel]="selectedCategory()" (ngModelChange)="onCategoryChange($event)" class="form-control">
      <option value="all">All Categories</option>
      <option value="Laptops & Workstations">Laptops & Workstations</option>
      <option value="Monitors & Displays">Monitors & Displays</option>
      <option value="Mobile Devices & Tablets">Mobile Devices & Tablets</option>
      <option value="Peripherals & Audio">Peripherals & Audio</option>
    </select>
  </div>

  <!-- Items Table with Angular 18 Control Flow -->
  <div class="table-card">
    <table class="inventory-table">
      <thead>
        <tr>
          <th>SKU / Serial</th>
          <th>Asset Name</th>
          <th>Category</th>
          <th>Assigned Employee</th>
          <th>Status</th>
          <th>Cost</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (item of items(); track item.id) {
          <tr>
            <td>
              <div class="font-mono">{{ item.sku }}</div>
              <div class="text-muted text-xs">{{ item.serialNumber }}</div>
            </td>
            <td>
              <div class="font-bold">{{ item.name }}</div>
              <div class="text-xs text-muted">{{ item.location }}</div>
            </td>
            <td>{{ item.category }}</td>
            <td>
              @if (item.assignedToUserName) {
                <span class="user-badge">{{ item.assignedToUserName }}</span>
              } @else {
                <span class="text-muted italic">Unassigned</span>
              }
            </td>
            <td>
              <span class="badge" [ngClass]="item.status.toLowerCase()">
                {{ item.status }}
              </span>
            </td>
            <td>{{ item.purchaseCost | currency:'USD' }}</td>
            <td>
              <div class="action-buttons">
                @if (item.assignedToUserId) {
                  <button class="btn-icon" (click)="onReturn(item.id)" title="Return Asset">Return</button>
                }
                <button class="btn-icon text-danger" (click)="onDelete(item.id, item.name)">Delete</button>
              </div>
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="7" class="empty-state">
              No inventory assets found matching your criteria.
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>
</div>`
  },

  {
    id: 'angular-models',
    name: 'inventory.model.ts',
    path: 'angular-client/src/app/models/inventory.model.ts',
    language: 'typescript',
    category: 'angular',
    description: 'TypeScript domain interfaces and DTOs matching .NET Web API contracts.',
    content: `export type ItemStatus = 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
export type ItemCondition = 'New' | 'Good' | 'Fair' | 'Poor';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  modelNumber?: string;
  serialNumber: string;
  assignedToUserId?: string | null;
  assignedToUserName?: string | null;
  assignedUserEmail?: string | null;
  assignedDate?: string | null;
  status: ItemStatus;
  condition: ItemCondition;
  purchaseCost: number;
  purchaseDate: string;
  warrantyExpiry: string;
  location?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInventoryItemDto {
  sku: string;
  name: string;
  category: string;
  modelNumber?: string;
  serialNumber: string;
  assignedToUserId?: string | null;
  status: ItemStatus;
  condition: ItemCondition;
  purchaseCost: number;
  purchaseDate: string;
  warrantyExpiry: string;
  location?: string;
  notes?: string;
}

export interface UpdateInventoryItemDto {
  name: string;
  category: string;
  modelNumber?: string;
  serialNumber: string;
  assignedToUserId?: string | null;
  status: ItemStatus;
  condition: ItemCondition;
  purchaseCost: number;
  location?: string;
  notes?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  location?: string;
  active: boolean;
  assignedItemsCount?: number;
}`
  },

  // --- 3. SQL DATABASE SCRIPTS ---
  {
    id: 'sql-schema-ddl',
    name: 'UserInventoryDb_Schema.sql',
    path: 'Database/UserInventoryDb_Schema.sql',
    language: 'sql',
    category: 'sql',
    description: 'Complete Transact-SQL / PostgreSQL DDL Script with Tables, Keys, Indexes, and Stored Procedures.',
    content: `-- =========================================================================
-- DATABASE: UserInventoryDb
-- Engine: Microsoft SQL Server 2019+ / Azure SQL / PostgreSQL compatible
-- Description: Production Schema for Enterprise User Inventory Management
-- =========================================================================

-- 1. Create Users / Employees Table
CREATE TABLE Users (
    Id NVARCHAR(50) NOT NULL PRIMARY KEY,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    Department NVARCHAR(100) NOT NULL,
    Role NVARCHAR(100) NOT NULL,
    Location NVARCHAR(150) NULL,
    Phone NVARCHAR(50) NULL,
    Active BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- 2. Create Categories Lookup Table
CREATE TABLE Categories (
    Id NVARCHAR(50) NOT NULL PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Prefix NVARCHAR(10) NOT NULL,
    IconName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(MAX) NULL
);

-- 3. Create Main Inventory Items Table
CREATE TABLE InventoryItems (
    Id NVARCHAR(50) NOT NULL PRIMARY KEY,
    Sku NVARCHAR(50) NOT NULL UNIQUE,
    Name NVARCHAR(255) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    ModelNumber NVARCHAR(100) NULL,
    SerialNumber NVARCHAR(100) NOT NULL UNIQUE,
    AssignedToUserId NVARCHAR(50) NULL,
    AssignedDate DATE NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'Available' 
        CONSTRAINT CHK_Inventory_Status CHECK (Status IN ('Available', 'Assigned', 'Maintenance', 'Retired')),
    Condition NVARCHAR(30) NOT NULL DEFAULT 'New' 
        CONSTRAINT CHK_Inventory_Condition CHECK (Condition IN ('New', 'Good', 'Fair', 'Poor')),
    PurchaseCost DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    PurchaseDate DATE NOT NULL,
    WarrantyExpiry DATE NOT NULL,
    Location NVARCHAR(150) NULL,
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    -- Foreign Key Constraint with User Assignment
    CONSTRAINT FK_InventoryItems_Users FOREIGN KEY (AssignedToUserId) 
        REFERENCES Users(Id) ON DELETE SET NULL
);

-- 4. High-Performance Indexes for Filtering and Search
CREATE NONCLUSTERED INDEX IX_InventoryItems_AssignedUser 
    ON InventoryItems (AssignedToUserId) 
    INCLUDE (Name, Sku, Status);

CREATE NONCLUSTERED INDEX IX_InventoryItems_Status 
    ON InventoryItems (Status) 
    INCLUDE (Category, PurchaseCost);

CREATE NONCLUSTERED INDEX IX_InventoryItems_Category 
    ON InventoryItems (Category);

-- 5. Stored Procedure: Assign Asset to User with Audit
GO
CREATE PROCEDURE sp_AssignInventoryItem
    @ItemId NVARCHAR(50),
    @UserId NVARCHAR(50),
    @AssignedDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Verify User exists
        IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @UserId)
        BEGIN
            RAISERROR('User does not exist', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Update Inventory Item
        UPDATE InventoryItems
        SET AssignedToUserId = @UserId,
            AssignedDate = @AssignedDate,
            Status = 'Assigned',
            UpdatedAt = GETUTCDATE()
        WHERE Id = @ItemId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- 6. Sample Seed Data
INSERT INTO Users (Id, FullName, Email, Department, Role, Location, Phone, Active)
VALUES 
('usr_101', 'Sarah Jenkins', 'sarah.jenkins@company.com', 'Engineering', 'Lead Cloud Architect', 'Seattle Office (Floor 3)', '+1 555-234-8901', 1),
('usr_102', 'David Chen', 'david.chen@company.com', 'Engineering', 'Senior Full Stack Engineer', 'Remote (San Francisco)', '+1 555-456-7812', 1),
('usr_103', 'Elena Rostova', 'elena.rostova@company.com', 'Design', 'Staff UI/UX Designer', 'Austin Design Center', '+1 555-789-0123', 1);

INSERT INTO InventoryItems (Id, Sku, Name, Category, SerialNumber, AssignedToUserId, AssignedDate, Status, Condition, PurchaseCost, PurchaseDate, WarrantyExpiry, Location)
VALUES
('inv_1001', 'NBK-2024-001', 'MacBook Pro 16" M3 Max', 'Laptops & Workstations', 'C02G87H9MD6R', 'usr_101', '2024-01-15', 'Assigned', 'New', 3899.00, '2024-01-10', '2027-01-10', 'Seattle Desk 302'),
('inv_1002', 'NBK-2024-002', 'Dell XPS 15 9530', 'Laptops & Workstations', '8FJK293-DELL', 'usr_102', '2024-02-01', 'Assigned', 'Good', 2650.00, '2024-01-20', '2027-01-20', 'Remote Home Office'),
('inv_1003', 'MON-2023-014', 'Dell UltraSharp 32" 6K', 'Monitors & Displays', 'CN-0N8V8W-74445', 'usr_103', '2024-03-05', 'Assigned', 'New', 2499.00, '2023-11-15', '2026-11-15', 'Austin Studio A');
`
  }
];
