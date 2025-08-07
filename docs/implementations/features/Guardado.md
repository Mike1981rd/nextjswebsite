# Troubleshooting Guide: CRUD Operations & Data Persistence

## Overview
This document consolidates all troubleshooting experiences related to CRUD operations, API communication, and data persistence issues encountered during the WebsiteBuilder project development.

---

## 🔴 Critical Issues & Solutions

### 1. CompanyId Token Mismatch (400 Bad Request)

**Problem:**
- API returns `400 Bad Request` with error: `"Company ID not found in token"`
- Affects all CRUD operations that require company context
- Other modules work but new modules fail

**Symptoms:**
```javascript
// Console error
:5266/api/locations:1  Failed to load resource: 400 (Bad Request)
Error response: 400 {"error":"Company ID not found in token"}
```

**Root Causes:**
1. JWT token claim uses `"companyId"` (lowercase) but controller expects `"CompanyId"` (uppercase)
2. Token generation in AuthService:
```csharp
// AuthService.cs creates claim with lowercase
new Claim("companyId", user.CompanyId?.ToString() ?? "")
```

3. Controller expects uppercase:
```csharp
// LocationsController.cs looks for uppercase
var companyIdClaim = User.FindFirst("CompanyId")?.Value; // WRONG!
```

**Solution:**
```csharp
// LocationsController.cs - Corrected with fallback
[HttpGet]
public async Task<IActionResult> GetLocations()
{
    try
    {
        // Match the token's lowercase claim
        var companyIdClaim = User.FindFirst("companyId")?.Value;
        int companyId;
        
        if (string.IsNullOrEmpty(companyIdClaim) || !int.TryParse(companyIdClaim, out companyId))
        {
            // Fallback to default company (same as CompanyService)
            companyId = 1;
        }

        var locations = await _locationService.GetLocationsByCompanyIdAsync(companyId);
        return Ok(locations);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = "An error occurred", details = ex.Message });
    }
}
```

**Prevention:**
- Always check existing working controllers for claim naming conventions
- Use consistent casing across all controllers
- Implement fallback logic for single-tenant applications

---

### 2. Logo Update Wiping Other Data

**Problem:**
- Updating company logo causes other fields (phone, email, etc.) to become null
- Partial updates not working as expected

**Root Cause:**
Backend uses conditional update logic that only updates non-null fields:
```csharp
// CompanyService.cs
if (!string.IsNullOrEmpty(request.Name))
    company.Name = request.Name;
// Fields not sent remain unchanged, but empty strings need special handling
```

**Solution:**
```csharp
// Handle empty strings explicitly
if (request.PhoneNumber != null && request.PhoneNumber != "")
    company.PhoneNumber = request.PhoneNumber;
else if (request.PhoneNumber == "")
    company.PhoneNumber = null; // Explicitly set to null for empty
```

Frontend must send complete data or use separate endpoints:
```typescript
// Use dedicated endpoint for logo
await api.post('/api/company/current/logo', formData);
// Don't mix with other field updates
```

---

### 3. PostgreSQL JSONB Serialization Errors

**Problem:**
- Cannot save `List<string>` to JSONB columns
- Error: "Can't write CLR type System.Collections.Generic.List`1[System.String]"

**Root Cause:**
Missing Npgsql dynamic JSON configuration

**Solution:**
```csharp
// Program.cs - CRITICAL configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
dataSourceBuilder.EnableDynamicJson(); // THIS IS REQUIRED!
var dataSource = dataSourceBuilder.Build();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(dataSource));
```

---

### 4. Frontend Not Updating After Save

**Problem:**
- Data saves to database but UI doesn't reflect changes
- Need to refresh page to see updates

**Root Causes:**
1. Not refetching data after successful save
2. Using stale state in React components

**Solution:**
```typescript
const handleSubmit = async () => {
  try {
    const response = await fetch(url, {
      method: editMode ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      // CRITICAL: Refetch data after save
      await fetchLocations();
      resetForm();
      setShowForm(false);
    }
  } catch (error) {
    console.error('Error saving:', error);
  }
};
```

---

### 5. CORS Issues with API Calls

**Problem:**
- Frontend cannot communicate with backend
- CORS policy blocks requests

**Solution:**
```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevelopmentCors",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

// After Build()
app.UseCors("DevelopmentCors");
```

---

### 6. Auto-Save Conflicts

**Problem:**
- Multiple auto-save requests causing data conflicts
- Race conditions when typing quickly

**Solution:**
```typescript
// Implement debouncing
const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

const handleChange = (value: string) => {
  setFormData(value);
  
  // Clear existing timeout
  if (saveTimeout) clearTimeout(saveTimeout);
  
  // Set new timeout
  const timeout = setTimeout(() => {
    saveData(value);
  }, 1000); // Wait 1 second after typing stops
  
  setSaveTimeout(timeout);
};
```

---

### 7. Validation Errors Not Showing

**Problem:**
- Backend returns validation errors but frontend doesn't display them

**Solution:**
```typescript
const handleSubmit = async () => {
  try {
    const response = await fetch(url, { /* ... */ });
    
    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle validation errors
      if (response.status === 400 && errorData.errors) {
        setValidationErrors(errorData.errors);
        return;
      }
      
      // Handle other errors
      throw new Error(errorData.message || 'Save failed');
    }
  } catch (error) {
    setError(error.message);
  }
};
```

---

## 🛠️ Best Practices for CRUD Operations

### 1. Always Include Error Details in Console
```typescript
if (!response.ok) {
  const errorText = await response.text();
  console.error('Error response:', response.status, errorText);
}
```

### 2. Use Consistent API URL Configuration
```typescript
// Create a config file
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266';

// Use throughout application
const response = await fetch(`${API_BASE_URL}/api/locations`);
```

### 3. Implement Proper Loading States
```typescript
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);

// Show appropriate UI feedback
{loading && <Spinner />}
{saving && <SavingIndicator />}
```

### 4. Handle Token Expiration
```typescript
if (response.status === 401) {
  // Token expired
  localStorage.removeItem('token');
  router.push('/login');
}
```

### 5. Use DTOs for Type Safety
```typescript
interface CreateLocationDto {
  name: string;
  address: string;
  city: string;
  // ... other fields
}

// Validate before sending
const validateDto = (dto: CreateLocationDto): boolean => {
  return !!(dto.name && dto.address && dto.city);
};
```

---

## 📋 Checklist for New CRUD Modules

### Backend
- [ ] Create Model with proper annotations
- [ ] Create DTOs (Create, Update, Response)
- [ ] Create Service Interface and Implementation
- [ ] Create Controller with proper authorization
- [ ] Register Service in Program.cs
- [ ] Add DbSet to ApplicationDbContext
- [ ] Create and apply migration
- [ ] Test all endpoints with Swagger

### Frontend
- [ ] Create TypeScript interfaces matching DTOs
- [ ] Implement fetch functions with proper error handling
- [ ] Add loading and error states
- [ ] Implement form validation
- [ ] Add success feedback
- [ ] Test create, read, update, delete operations
- [ ] Verify data refreshes after operations
- [ ] Add proper error messages for users

### Common Issues to Check
- [ ] Token claim names match between backend and frontend
- [ ] CORS is configured for development
- [ ] API URLs use correct port (5266 for HTTP, 7224 for HTTPS)
- [ ] Content-Type headers are set correctly
- [ ] Authorization header includes "Bearer " prefix
- [ ] JSON serialization is configured for complex types
- [ ] Dates are handled correctly (UTC conversion)

---

## 🔍 Debugging Tips

### 1. Check Token Contents
```typescript
// Decode JWT to see claims
const token = localStorage.getItem('token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
}
```

### 2. Enable Detailed Errors in Development
```csharp
// Program.cs
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
```

### 3. Log All API Calls
```typescript
// Create API wrapper
const apiCall = async (url: string, options: RequestInit) => {
  console.log(`API Call: ${options.method || 'GET'} ${url}`);
  const response = await fetch(url, options);
  console.log(`Response: ${response.status}`);
  return response;
};
```

### 4. Check Database State
```sql
-- Verify data was actually saved
SELECT * FROM "Locations" WHERE "CompanyId" = 1;
SELECT * FROM "Companies" WHERE "Id" = 1;
SELECT * FROM "Users" WHERE "Email" = 'user@example.com';
```

---

## 📚 Related Documentation

- [Company Data Save Implementation](./2025-08-company-data-save.md)
- [Shipping Zones Implementation](./2025-08-shipping-zones-implementation.md)
- [UI Dashboard Implementation](./2025-08-ui-dashboard-implementation.md)
- [Authentication Blueprint](../../blueprints/blueprint2.md)

---

## 🚨 Emergency Fixes

### If nothing saves:
1. Check backend is running (port 5266)
2. Check database connection string
3. Verify migrations are applied
4. Check browser console for errors
5. Check Network tab for API responses
6. Verify token is not expired

### If data saves but UI doesn't update:
1. Check refetch logic after save
2. Verify state management
3. Check for console errors
4. Ensure proper async/await usage

### If getting 400 Bad Request:
1. Check token claims match
2. Verify required fields are sent
3. Check DTO validation rules
4. Review ModelState errors
5. Check for CompanyId issues

---

**Last Updated:** August 2025
**Version:** 1.0
**Maintainer:** Development Team