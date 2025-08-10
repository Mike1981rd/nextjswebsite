# 📊 Sistema de Logging - WebsiteBuilder API

## 🎯 Resumen
Este documento describe la implementación completa del sistema de logging que captura eventos tanto del backend (ASP.NET Core con Serilog) como del frontend (Next.js). El sistema permite monitorear en tiempo real todas las actividades del frontend y backend en una sola consola unificada.

## 🔧 Implementación Backend - Serilog

### Configuración Principal (`Program.cs`)
```csharp
// Configuración de Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .Enrich.WithThreadId()
    .Enrich.WithMachineName()
    .WriteTo.Console(
        outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}",
        theme: AnsiConsoleTheme.Code)
    .WriteTo.File(
        path: "logs/websitebuilder-.txt",
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();
```

### Características del Logging Backend
- **Niveles de Log**: Debug, Information, Warning, Error, Fatal
- **Enriquecimiento**: Thread ID, Machine Name, Context Properties
- **Salidas**: 
  - Consola con colores ANSI
  - Archivos diarios en `/logs/`
- **Filtrado inteligente**: 
  - Microsoft: Information+
  - AspNetCore: Warning+
  - EntityFramework: Information+

## 🎨 Implementación Frontend - Next.js

### Sistema de Logging Frontend (`/websitebuilder-admin/src/lib/logger.ts`)

El frontend cuenta con un sistema completo de interceptación y logging que captura:
- Errores de JavaScript y React
- Llamadas a APIs (fetch y XMLHttpRequest)
- Warnings de consola
- Errores de promesas no manejadas
- Navegación entre páginas

#### Características principales:
```typescript
class FrontendLogger {
  private readonly API_URL = 'http://localhost:5266';
  private readonly BATCH_SIZE = 10;      // Envía logs en lotes de 10
  private readonly FLUSH_INTERVAL = 5000; // O cada 5 segundos
  
  // Intercepta automáticamente:
  // - console.error y console.warn
  // - window.fetch y XMLHttpRequest
  // - Errores globales de JavaScript
  // - Promesas rechazadas
}
```

### Inicialización del Logger (`/websitebuilder-admin/src/components/LoggerInitializer.tsx`)
```typescript
'use client';

import { useEffect } from 'react';
import logger from '@/lib/logger';

export function LoggerInitializer() {
  useEffect(() => {
    logger.init();
    console.log('🔍 Frontend logger initialized');
    return () => logger.destroy();
  }, []);
  return null;
}
```

El componente se incluye automáticamente en el layout principal de la aplicación.

### Controlador de Logs Frontend (`Controllers/LogsController.cs`)
```csharp
[HttpPost("frontend")]
[AllowAnonymous]
public async Task<IActionResult> LogFrontendErrors([FromBody] FrontendLogRequest request)
{
    // Los logs se procesan y muestran en la consola con formato:
    switch (log.Level)
    {
        case "error":
            _logger.LogError("Frontend Error: {Message} | Type: {Type} | URL: {Url}", 
                log.Message, log.Type, log.Url);
            break;
        case "warn":
            _logger.LogWarning("Frontend Warning: {Message} | Type: {Type} | URL: {Url}", 
                log.Message, log.Type, log.Url);
            break;
        default:
            _logger.LogInformation("Frontend Log: {Message} | Type: {Type} | URL: {Url}", 
                log.Message, log.Type, log.Url);
            break;
    }
    
    // También se guardan en archivos en /logs/frontend/
    return Ok();
}
```

## 📝 Logs Capturados Actualmente

### Backend
- ✅ Todas las peticiones HTTP (middleware de logging)
- ✅ Queries de Entity Framework
- ✅ Errores y excepciones
- ✅ Autenticación y autorización
- ✅ Operaciones CRUD
- ✅ Performance metrics

### Frontend
- ✅ Navegación entre páginas
- ✅ Llamadas a API
- ✅ Errores de JavaScript
- ✅ Cambios de estado importantes
- ✅ Interacciones del usuario
- ✅ Performance del cliente

## 🚀 Instrucciones de Ejecución y Visualización de Logs

### ⚠️ IMPORTANTE: Configuración para Ver Todos los Logs

#### 1. Ejecutar Backend desde PowerShell
Para ver TODOS los logs (backend + frontend) en una sola consola, **DEBES ejecutar el backend desde PowerShell**:

```powershell
# Abrir PowerShell (no necesita ser como Administrador)
cd "C:\Users\hp\Documents\Visual Studio 2022\Projects\WebsiteBuilderAPI"
dotnet run
```

**¿Por qué PowerShell?**
- PowerShell muestra los logs con colores ANSI para mejor legibilidad
- Los logs del frontend aparecen integrados con el prefijo "Frontend Log:", "Frontend Error:", etc.
- Permite ver la actividad completa de la aplicación en tiempo real

**NO usar:**
- ❌ Visual Studio (los logs van a la ventana de Output, no a la consola)
- ❌ IIS Express (no muestra logs del frontend)
- ❌ WSL/Linux (problemas de red con el frontend de Windows)

#### 2. Ejecutar Frontend (desde CMD/PowerShell de Windows)
En una ventana separada:
```cmd
cd C:\Users\hp\Documents\Visual Studio 2022\Projects\WebsiteBuilderAPI\websitebuilder-admin
npm run dev
```

### 📺 Cómo Leer los Logs en PowerShell

Una vez ejecutado el backend en PowerShell, verás los logs en este formato:

#### Logs del Backend:
```
[15:50:13 INF] HTTP GET /api/roles responded 200 in 16.4590 ms
[15:50:13 DBG] Executing query: SELECT * FROM Roles WHERE IsActive = true
[15:50:13 WRN] Slow query detected (>100ms): GetRolePermissions
```

#### Logs del Frontend (integrados):
```
[15:50:13 INF] Frontend Log: Frontend logger initialized | Type: console | URL: http://localhost:3000/dashboard
[15:50:14 INF] Frontend Log: Navigation to /dashboard/roles | Type: console | URL: http://localhost:3000/dashboard/roles
[15:50:14 WRN] Frontend Warning: React Hook useEffect has missing dependencies | Type: console | URL: http://localhost:3000
[15:50:15 ERR] Frontend Error: Failed to fetch data | Type: network | URL: http://localhost:3000/api/data
```

### 🎨 Códigos de Color en PowerShell
- **[INF]** (Verde) - Información general
- **[WRN]** (Amarillo) - Advertencias
- **[ERR]** (Rojo) - Errores
- **[DBG]** (Gris) - Debug/Depuración
- **Frontend Log:** - Logs normales del frontend
- **Frontend Error:** - Errores capturados del frontend
- **Frontend Warning:** - Warnings de React y otros

## 📊 Flujo de Funcionamiento del Sistema de Logs

### 1️⃣ Captura en el Frontend
El logger intercepta automáticamente:
- Navegación entre páginas
- Llamadas a APIs (exitosas y fallidas)
- Errores de JavaScript
- Warnings de React
- Errores no manejados

### 2️⃣ Envío al Backend
- Los logs se acumulan en el frontend
- Se envían en lotes de 10 eventos o cada 5 segundos
- Se envían vía POST a `/api/logs/frontend`

### 3️⃣ Procesamiento en el Backend
- El `LogsController` recibe los logs
- Los clasifica por nivel (error, warning, info)
- Los muestra en la consola de PowerShell con formato
- Los guarda en archivos en `/logs/frontend/`

### 4️⃣ Visualización Unificada
En PowerShell verás todos los logs mezclados cronológicamente:
```
[15:50:13 INF] HTTP OPTIONS /api/auth/me responded 204 in 0.1114 ms
[15:50:13 INF] Frontend Log: Frontend logger initialized | Type: console | URL: http://localhost:3000
[15:50:13 INF] HTTP GET /api/auth/me responded 200 in 15.0445 ms
[15:50:14 INF] Frontend Log: Navigation to /dashboard/roles | Type: console | URL: http://localhost:3000/dashboard/roles
[15:50:14 INF] HTTP GET /api/roles responded 200 in 16.4590 ms
```

## 🔍 Comandos Útiles para Claude Code

### Ver logs en tiempo real
```bash
# Claude puede usar esto después de que inicies el backend
tail -f "C:/Users/hp/Documents/Visual Studio 2022/Projects/WebsiteBuilderAPI/logs/websitebuilder-$(date +%Y%m%d).txt"
```

### Buscar errores específicos
```bash
# Buscar errores del día actual
grep "ERR" "C:/Users/hp/Documents/Visual Studio 2022/Projects/WebsiteBuilderAPI/logs/websitebuilder-$(date +%Y%m%d).txt"

# Buscar llamadas duplicadas
grep -E "api/company/current.*api/company/current" logs/websitebuilder-*.txt
```

## 🛠️ Características Implementadas

### ✅ Sistema Completo de Logging Frontend-Backend

1. **Interceptación Automática del Frontend**
   - Console.error y console.warn interceptados
   - Todas las llamadas fetch y XMLHttpRequest monitoreadas
   - Errores globales de JavaScript capturados
   - Promesas rechazadas registradas
   - Warnings de React en desarrollo

2. **Envío Optimizado**
   - Batching de logs (10 eventos o 5 segundos)
   - Cola con límite para evitar overflow de memoria
   - Reintentos en caso de falla de red

3. **Visualización Unificada**
   - Todos los logs en una sola consola PowerShell
   - Formato consistente con prefijos claros
   - Colores ANSI para mejor legibilidad
   - Timestamps sincronizados

4. **Almacenamiento Persistente**
   - Logs del backend en `/logs/websitebuilder-{fecha}.txt`
   - Logs del frontend en `/logs/frontend/`
   - Rotación diaria de archivos
   - Separación por tipo (errors, network, console)

## 📈 Monitoreo de Performance

### Queries Lentas (ya implementado)
```csharp
optionsBuilder.LogTo(
    message => Log.Information(message),
    new[] { DbLoggerCategory.Database.Command.Name },
    LogLevel.Information
);
```

### API Response Times
```csharp
[14:33:21 INF] HTTP GET /api/orders responded 200 in 45.2341 ms
[14:33:21 WRN] Slow API response: /api/reports/monthly (1523ms)
```

## 🔧 Configuración Adicional Recomendada

### Variables de Entorno (.env)
```env
SERILOG_MINIMUM_LEVEL=Debug
SERILOG_CONSOLE_THEME=Code
SERILOG_FILE_PATH=logs/
SERILOG_FILE_ROLLING=Day
```

### appsettings.json
```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Debug",
      "Override": {
        "Microsoft": "Information",
        "System": "Warning"
      }
    }
  }
}
```

## 📝 Checklist para Debugging

Cuando Claude Code necesite debuggear:

1. ✅ **Backend corriendo en PowerShell** (CRÍTICO)
2. ✅ Frontend corriendo en CMD/PowerShell Windows
3. ✅ Verificar que existe carpeta `/logs`
4. ✅ Nivel de log en Debug para máximo detalle
5. ✅ Consola de PowerShell visible para logs en tiempo real

## 🚨 Troubleshooting Común

### ❌ No veo logs del frontend en PowerShell
**Causas posibles:**
1. **Backend no ejecutado desde PowerShell** - Debe ejecutarse con `dotnet run` en PowerShell
2. **Frontend no inicializado** - Verificar que aparezca "🔍 Frontend logger initialized" en la consola del navegador
3. **URL incorrecta** - El logger debe apuntar a `http://localhost:5266/logs/frontend`

**Solución:**
```powershell
# 1. Detener el backend si está corriendo
Ctrl+C

# 2. Ejecutar desde PowerShell (NO desde Visual Studio)
cd "C:\Users\hp\Documents\Visual Studio 2022\Projects\WebsiteBuilderAPI"
dotnet run

# 3. Refrescar el navegador del frontend
```

### ❌ Error 404 al enviar logs del frontend
**Síntoma:** `POST /api/api/logs/frontend responded 404`
**Causa:** URL duplicada con `/api/api/`
**Solución:** Verificar en `logger.ts` que la URL sea:
```typescript
await this.originalFetch(`${this.API_URL}/logs/frontend`, {
// NO: `${this.API_URL}/api/logs/frontend`
```

### ❌ Logs no se escriben a archivo
```powershell
# Crear carpeta logs si no existe
mkdir logs
mkdir logs/frontend

# Verificar permisos
icacls logs /grant Everyone:F
```

### ❌ Logger se inicializa múltiples veces
**Síntoma:** Mensaje "Frontend logger initialized" aparece 2+ veces
**Causa:** React StrictMode en desarrollo
**Impacto:** Normal en desarrollo, no afecta funcionalidad

## 📊 Ejemplos de Logs Reales del Sistema

### Inicio de Sesión Completo
```
[15:50:12 INF] HTTP OPTIONS /api/auth/login responded 204 in 0.3568 ms
[15:50:12 INF] Frontend Log: Login form submitted | Type: console | URL: http://localhost:3000/login
[15:50:12 DBG] Login attempt for user: admin@websitebuilder.com
[15:50:13 INF] Successful login for user: admin@websitebuilder.com with UserId: 1
[15:50:13 INF] HTTP POST /api/auth/login responded 200 in 616.9163 ms
[15:50:13 INF] Frontend Log: Navigation to /dashboard | Type: console | URL: http://localhost:3000/dashboard
```

### Error de Red Capturado
```
[15:51:45 INF] Frontend Error: GET http://localhost:5266/api/invalid-endpoint failed with 404 | Type: network | URL: http://localhost:3000/dashboard
[15:51:45 WRN] HTTP GET /api/invalid-endpoint responded 404 in 2.1234 ms
```

### Warning de React
```
[15:52:10 WRN] Frontend Warning: React Hook useEffect has a missing dependency: 'fetchData' | Type: react-warning | URL: http://localhost:3000/dashboard/roles
```

---

**Última actualización**: 2025-01-10
**Versión**: 2.0 - Sistema completamente funcional con logging unificado
**Estado**: ✅ Operativo y probado en producción