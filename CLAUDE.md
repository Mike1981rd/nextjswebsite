# CLAUDE.md - REGLAS Y CONTEXTO DEL PROYECTO WEBSITE BUILDER

## 🎯 CONTEXTO DEL PROYECTO
**Proyecto**: Sistema multi-tenant hotel + e-commerce + website builder
**Stack**: ASP.NET Core 8 API + Next.js 14 + PostgreSQL + Entity Framework Core
**Estado**: Reescritura completa iniciando 11 agosto 2025 para resolver 9 problemas críticos
**Arquitectura**: Separación backend/frontend (antes era monolítico ASP.NET Core)

## ⚠️ PROBLEMAS CRÍTICOS A EVITAR (DEL PROYECTO ANTERIOR)
1. **NO** crear JSON gigantes - usar base de datos relacional
2. **NO** mezclar habitaciones con productos - son conceptos separados
3. **NO** limitar secciones a una sola instancia - permitir múltiples
4. **NO** permitir drag & drop sin validaciones - implementar reglas jerárquicas
5. **NO** usar el mismo cache para preview y producción - separar ambos
6. **NO** mezclar carritos de reservas con carritos de productos
7. **SIEMPRE** implementar sistema de variantes para productos
8. **SIEMPRE** incluir 5 tipos de páginas: home, product, cart, checkout, custom
9. **SIEMPRE** implementar undo/redo con historial de 50 estados

## 📁 ESTRUCTURA DE ARCHIVOS

### Backend (WebsiteBuilderAPI/)
```
Controllers/     # Max 300 líneas por archivo
Services/        # Interfaces e implementaciones separadas
Repositories/    # Patrón Repository con EF Core
Models/          # Entidades de dominio
DTOs/           # Data Transfer Objects
```

### Frontend (websitebuilder-admin/)
```
src/app/         # App Router de Next.js 14
src/components/  # Componentes reutilizables
src/lib/         # Utilidades y lógica
src/hooks/       # Custom hooks
```

## 🗄️ ENTIDADES PRINCIPALES DE BASE DE DATOS
- **Hotels**: Multi-tenant, cada hotel tiene su dominio
- **Rooms**: Habitaciones (SEPARADAS de productos)
- **Products**: Productos e-commerce con HasVariants
- **ProductVariants**: Variantes con atributos JSONB
- **WebsitePages**: 5 tipos (home, product, cart, checkout, custom)
- **PageSections**: 11 tipos de secciones modulares
- **RoomReservationCarts**: Carrito SOLO para reservas
- **ProductShoppingCarts**: Carrito SOLO para productos
- **EditorHistory**: Estados para undo/redo

## 🧩 11 TIPOS DE SECCIONES OBLIGATORIAS
1. ImageWithText
2. ImageBanner
3. RichText
4. Gallery
5. ContactForm
6. Newsletter
7. FeaturedProduct
8. FeaturedCollection
9. Testimonials
10. FAQ
11. Videos

## 📋 REGLAS DE DESARROLLO

### 1. SEPARACIÓN DE CONCEPTOS
```csharp
// ❌ INCORRECTO
public class Cart {
    public List<Room> Rooms { get; set; }
    public List<Product> Products { get; set; }
}

// ✅ CORRECTO
public class RoomReservationCart { /* solo reservas */ }
public class ProductShoppingCart { /* solo productos */ }
```

### 2. MULTI-INSTANCIA DE SECCIONES
```typescript
// ✅ SIEMPRE permitir múltiples instancias
<ImageWithText config={config} isMultiple={true} index={0} />
<ImageWithText config={config2} isMultiple={true} index={1} />
```

### 3. VALIDACIONES DRAG & DROP
```typescript
// ✅ SIEMPRE validar antes de permitir drop
if (!validateDrop(source, target, targetLevel)) {
    return false; // No permitir
}
```

### 4. CACHE DIFERENCIADO
```csharp
// ✅ SIEMPRE separar preview de producción
var cacheKey = isPreview 
    ? $"website:preview:{domain}" 
    : $"website:production:{domain}";
```

### 5. SISTEMA DE VARIANTES
```csharp
// ✅ SIEMPRE verificar HasVariants
if (product.HasVariants) {
    // Requerir selección de variante
    var variant = await GetVariant(variantId);
}
```

### 6. UNDO/REDO OBLIGATORIO
```typescript
// ✅ SIEMPRE guardar estado antes de cambios
saveState("Added section", pageConfig, sections);
```

### 7. PÁGINAS ESTÁNDAR
```typescript
// ✅ SIEMPRE incluir estos 5 tipos
enum PageType {
    Home = 'home',
    Product = 'product',
    Cart = 'cart',
    Checkout = 'checkout',
    Custom = 'custom'
}
```

## 🔧 PATRONES DE CÓDIGO

### Controllers (ASP.NET Core)
```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;
    
    // Constructor injection
    // Métodos async/await
    // Retornar ActionResult<T>
    // Manejo de errores con try-catch
}
```

### Componentes (Next.js)
```typescript
// ✅ SIEMPRE usar TypeScript estricto
interface Props {
    config: SectionConfig;
    isMultiple?: boolean;
    index?: number;
}

export function Section({ config, isMultiple = false, index = 0 }: Props) {
    // Hooks al inicio
    // Lógica clara
    // JSX limpio
}
```

### Services
```csharp
public interface IProductService
{
    Task<Product> GetByIdAsync(int id);
    Task<PagedResult<Product>> GetPagedAsync(int page, int size);
    Task<Product> CreateAsync(CreateProductDto dto);
    Task<Product> UpdateAsync(int id, UpdateProductDto dto);
    Task DeleteAsync(int id);
}
```

## 🚀 MÓDULOS REQUERIDOS DEL BACK OFFICE
1. Dashboard - Métricas y KPIs
2. Empresa - Configuración del hotel
3. Roles & Usuarios - Gestión de accesos
4. Clientes - Base de datos CRM
5. Reservaciones - Gestión de habitaciones
6. Métodos de Pago - Gateways de pago
7. Colecciones - Agrupación de productos
8. Productos - Catálogo e-commerce
9. Páginas - Gestión de contenido
10. Políticas - Términos legales
11. Sitio Web - Website builder
12. Dominios - Gestión DNS/SSL

## ⚡ OPTIMIZACIONES OBLIGATORIAS

### Performance
- Cache de 5 min para preview, 24h para producción
- Lazy loading de componentes pesados
- Paginación en todas las listas (20 items default)
- Índices en campos de búsqueda frecuente

### UX/UI
- Undo/Redo con Ctrl+Z / Ctrl+Y
- Auto-save cada 30 segundos
- Preview desktop/móvil en tiempo real
- Drag & drop con feedback visual

### Seguridad
- Autenticación JWT
- Middleware multi-tenant
- Validación de dominios
- Rate limiting en APIs

## 🎨 DESIGN SYSTEM
```typescript
// Colores principales
primary: '#22c55e'    // Verde hotel/farmacia
secondary: '#64748b'  // Gris neutro
error: '#ef4444'      // Rojo error

// Tipografía
fontFamily: 'Inter, system-ui, sans-serif'
// Tamaños: xs(12px), sm(14px), base(16px), lg(18px), xl(20px)
```

## 🛠️ COMANDOS CLAUDE CODE DISPONIBLES
- `create-section [nombre]` - Crear nueva sección del builder
- `create-module [nombre]` - Crear módulo completo back office
- `debug-builder [error]` - Debuggear website builder
- `optimize-performance [área]` - Optimizar performance
- `/document-implementation [feature]` - Documentar implementación y troubleshooting

## 🗄️ MIGRACIONES DE BASE DE DATOS
**IMPORTANTE**: El proyecto tiene múltiples DbContext (ApplicationDbContext y TenantAwareDbContext).

### Comandos de migración en Package Manager Console:
```powershell
# SIEMPRE especificar el contexto
Add-Migration NombreMigracion -Context ApplicationDbContext
Update-Database -Context ApplicationDbContext

# Para revertir
Update-Database NombreMigracionAnterior -Context ApplicationDbContext

# Para eliminar última migración
Remove-Migration -Context ApplicationDbContext
```

### Comandos de migración en CLI:
```bash
# SIEMPRE especificar el contexto
dotnet ef migrations add NombreMigracion --context ApplicationDbContext
dotnet ef database update --context ApplicationDbContext
```

## 📝 CHECKLIST ANTES DE CADA CAMBIO
- [ ] ¿Estoy separando correctamente habitaciones de productos?
- [ ] ¿Las secciones permiten múltiples instancias?
- [ ] ¿El drag & drop tiene validaciones?
- [ ] ¿Estoy usando cache diferenciado?
- [ ] ¿Los productos tienen sistema de variantes?
- [ ] ¿Implementé undo/redo para esta acción?
- [ ] ¿Incluí los 5 tipos de páginas estándar?
- [ ] ¿Los archivos tienen menos de 300 líneas?
- [ ] ¿Estoy siguiendo la arquitectura limpia?

## ⚠️ RECORDATORIOS CRÍTICOS
1. **NUNCA** mezclar lógica de reservas con e-commerce
2. **SIEMPRE** validar permisos multi-tenant
3. **SIEMPRE** usar TypeScript estricto en frontend
4. **NUNCA** crear archivos de más de 300 líneas
5. **SIEMPRE** implementar tests unitarios
6. **NUNCA** hacer push directo a main
7. **SIEMPRE** documentar APIs con Swagger
8. **SIEMPRE** manejar errores apropiadamente

## 🚦 CRITERIOS DE ÉXITO
- Los 9 problemas originales están resueltos
- Performance < 2s carga inicial
- 100% responsive (mobile-first)
- Sin errores de TypeScript
- Cobertura de tests > 80%
- Documentación actualizada
- Deploy automatizado funcionando

# 📋 PROJECT WORKFLOW RULES

## Blueprint & Progress Management
- Always use PROJECT-PROGRESS.md as the single source of truth for project status
- Before starting any task, read both the original blueprint and PROJECT-PROGRESS.md
- Update PROJECT-PROGRESS.md before and after each task completion

## Task Execution Rules
- **CRITICAL**: Work on only ONE task at a time from the progress tracker
- When you complete a single task, STOP immediately and say "TASK COMPLETED - Ready for next instruction"
- This allows for context window management and work review between tasks
- Wait for explicit instruction before proceeding to the next task

## Git & Database Safety Rules
- **NEVER commit to GitHub without explicit permission**
- Before any git commit, ask: "Ready to commit these changes to GitHub? [Y/N]"
- **NEVER run database migrations without explicit permission**
- Before any migration command (dotnet ef database update, etc.), ask: "Ready to apply database migration? [Y/N]"
- Always show what will be committed/migrated before asking for permission
- If permission denied, continue with other tasks and note pending changes in PROJECT-PROGRESS.md

## Database Migration Workflow Rules
- **Claude Code PREPARES migrations only** - analyze changes, generate migration code, create migration files
- **Human EXECUTES migrations manually** - user runs migrations through Visual Studio or command line
- **Claude Code NEVER executes** `dotnet ef database update` or equivalent database update commands
- **After preparing migration, Claude MUST provide:**
  1. Exact migration name created
  2. Specific command to execute: `Update-Database -Migration [MigrationName]`
  3. Alternative command if needed: `dotnet ef database update`
- **Workflow steps:**
  1. Claude prepares migration files and shows what will be migrated
  2. Claude provides exact migration name and execution command
  3. Claude asks: "Migration [MigrationName] prepared. Execute in Visual Studio: `Update-Database -Migration [MigrationName]`. Confirm when completed? [Y/N]"
  4. Wait for human confirmation before updating PROJECT-PROGRESS.md

## Modified Permission Rules
- Remove any automatic database update permissions
- Claude can create migration files but cannot apply them
- Always provide exact migration name and execution command
- Document migration preparation vs execution separately in progress tracker

## Documentation Standards
- Always document completed tasks with:
  - Files created/modified
  - Commands executed
  - Decisions made
  - Any blockers encountered
  - Pending commits/migrations awaiting approval
- Keep implementation notes detailed but concise

## Session Handoff
- At session start, read PROJECT-PROGRESS.md and give status summary
- Always identify the next logical task before beginning work
- Check for any pending commits or migrations from previous sessions
- Maintain continuity between sessions using the progress tracker

## Error Handling
- If any command fails, document the error in PROJECT-PROGRESS.md
- Suggest solutions but don't auto-retry critical operations
- Always ask before making system-level changes

Remember: Quality and safety over speed. Better to complete one task perfectly with proper approvals than rush through multiple risky operations.

## 📚 DOCUMENTATION STANDARDS

### 🗂️ Documentation Structure
```
docs/
├── implementations/          # Implementation documentation
│   ├── auth/                # Authentication implementations
│   ├── api/                 # API feature implementations
│   ├── features/            # Business feature implementations
│   └── infrastructure/     # Infrastructure setup docs
├── troubleshooting/         # Problem-solution documentation
│   ├── auth/               # Authentication issues
│   ├── api/                # API integration issues
│   ├── database/           # Database & migration issues
│   ├── frontend/           # Next.js & UI issues
│   └── general/            # General development issues
└── documentation-templates/ # Standard templates
```

### 📋 Troubleshooting Documentation Rules
1. **File size limit**: Maximum 800 lines per .md file
2. **Structure**: Use modular approach in `/docs/troubleshooting/`
3. **Naming convention**: `category-##-descriptive-name.md`
4. **Required sections**:
   - Problem Summary (affects, frequency, severity)
   - Symptoms (checklist format with exact errors)
   - Root Causes (numbered with verification steps)
   - Solutions (Quick Fix < 5min, Step-by-Step, Alternatives)
   - Prevention (best practices, configuration templates)
   - Related Issues (cross-references)
   - Search Keywords
5. **Navigation**: Always include breadcrumb navigation and cross-references
6. **Indices**: Update ALL relevant index files when adding new problems:
   - Master index (`00-troubleshooting-index.md`)
   - Category index (`category-00-index.md`)

### 📄 Implementation Documentation Rules
1. **Create implementation docs** for major features in `/docs/implementations/`
2. **Naming convention**: `YYYY-MM-feature-name.md` (e.g., `2025-08-login-implementation.md`)
3. **Required sections**:
   ```markdown
   # Feature Name Implementation
   
   ## Overview
   - **Purpose**: Why this feature exists
   - **Scope**: What it includes/excludes
   - **Dependencies**: Required packages/services
   - **Date Implemented**: YYYY-MM-DD
   
   ## Architecture Decisions
   - **Pattern Used**: (e.g., Repository, Service Layer)
   - **Technology Choices**: Why X over Y
   - **Security Considerations**: Auth, validation, etc.
   
   ## Implementation Details
   ### Backend
   - Models created/modified
   - API endpoints
   - Services & repositories
   - Database changes
   
   ### Frontend
   - Components created
   - State management
   - API integration
   - UI/UX decisions
   
   ## Configuration
   - Environment variables
   - appsettings.json changes
   - Package installations
   
   ## Testing
   - Unit tests location
   - Integration test approach
   - Manual testing checklist
   
   ## Known Issues & Limitations
   - Current limitations
   - Future improvements
   - Performance considerations
   
   ## Troubleshooting
   - Common problems (link to troubleshooting docs)
   - Debug tips
   
   ## References
   - Related documentation
   - External resources
   ```

### 📝 When to Document
1. **Always document** when:
   - Implementation took >30 minutes to solve
   - Multiple attempts were needed
   - Non-obvious solution was required
   - Architecture decision was made

2. **Major features requiring docs**:
   - Authentication & Authorization
   - API integrations (payment, email, etc.)
   - Complex business logic (multi-tenancy, etc.)
   - Infrastructure setup (Docker, CI/CD)
   - Database design decisions

3. **Complex debugging** requiring troubleshooting docs:
   - Any error that took >15 minutes to resolve
   - Configuration issues
   - Integration problems
   - Performance bottlenecks

### 🔄 Documentation Workflow
1. **During Implementation**:
   - Take notes of decisions and problems
   - Capture exact error messages
   - Note configuration changes

2. **After Completion**:
   - Run `/document-implementation [feature-name]`
   - Follow prompts for:
     - Implementation type (auth/api/feature/infra)
     - Problems encountered (Y/N)
     - Key decisions made
     - Testing approach

3. **Documentation Creation**:
   - Creates implementation doc in correct folder
   - Creates troubleshooting docs if problems occurred
   - Updates all index files automatically
   - Adds references to PROJECT-PROGRESS.md

4. **Quality Check**:
   - Verify all sections completed
   - Check cross-references work
   - Ensure code examples are accurate
   - Confirm file size < 800 lines

### 📐 Documentation Templates Usage
- **Implementation**: Use `/docs/documentation-templates/implementation-template.md`
- **Troubleshooting**: Use `/docs/documentation-templates/troubleshooting-template.md`
- **Quick Reference**: Check `/docs/documentation-templates/documentation-checklist.md`

### 🎯 Documentation Examples
When I say:
- "Document the login implementation" → Create full implementation doc + any troubleshooting docs
- "Document this error" → Create troubleshooting doc with full problem-solution format
- "Update documentation" → Check what's missing and complete it

### ⚡ Quick Documentation Commands
```bash
# Full implementation + troubleshooting
/document-implementation login

# Just troubleshooting for current issue
/document-troubleshooting auth network-error

# Update indices after manual doc creation
/update-doc-indices
```

### 📊 Documentation Metrics
Track in PROJECT-PROGRESS.md:
- Features with complete documentation
- Troubleshooting issues documented
- Documentation coverage percentage
- Last documentation update date