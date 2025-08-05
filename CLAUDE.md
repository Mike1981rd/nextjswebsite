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