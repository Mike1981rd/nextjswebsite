# CLAUDE.md - CONFIGURACIÓN DE SESIÓN Y COMANDO /init-session

## 🎯 COMANDO /init-session - CONFIGURACIÓN FORZADA

### ⚠️ IMPORTANTE: EJECUCIÓN OBLIGATORIA DEL COMANDO

Cuando el usuario ejecute `/init-session`, **DEBES OBLIGATORIAMENTE**:

1. **LEER TODOS LOS ARCHIVOS DE CONFIGURACIÓN** (no puedes responder sin leerlos):
   ```
   1. blueprint1.md - Arquitectura y 9 problemas críticos
   2. blueprint2.md - Implementación técnica detallada  
   3. blueprint3.md - UI/UX y componentes frontend
   4. CLAUDEBK1.md - Reglas base y contexto del proyecto
   5. CLAUDEBK2.md - Patterns, troubleshooting y workflow
   6. logs.md - Sistema de logging y diagnóstico
   ```

2. **USAR LA HERRAMIENTA Read** para cada archivo:
   ```python
   # OBLIGATORIO - No puedes saltarte ningún archivo
   Read("blueprint1.md")  # DEBE ejecutarse
   Read("blueprint2.md")  # DEBE ejecutarse
   Read("blueprint3.md")  # DEBE ejecutarse
   Read("CLAUDEBK1.md")   # DEBE ejecutarse
   Read("CLAUDEBK2.md")   # DEBE ejecutarse
   Read("logs.md")        # DEBE ejecutarse
   ```

3. **CONFIRMAR LECTURA** mostrando este mensaje EXACTO:
   ```
   📚 LEYENDO ARCHIVOS DE CONFIGURACIÓN...
   
   ✅ blueprint1.md cargado - 9 problemas críticos identificados
   ✅ blueprint2.md cargado - Arquitectura técnica ASP.NET Core 8
   ✅ blueprint3.md cargado - Componentes UI Next.js 14
   ✅ CLAUDEBK1.md cargado - Reglas base del proyecto
   ✅ CLAUDEBK2.md cargado - Troubleshooting y patterns
   ✅ logs.md cargado - Sistema de logging y diagnóstico
   
   🚀 SESIÓN INICIALIZADA - WebsiteBuilder API
   Stack: ASP.NET Core 8 + Next.js 14 + PostgreSQL
   
   Problemas conocidos a evitar:
   1. JSON gigante de 24,000 líneas
   2. Arquitectura de páginas rígida
   3. Secciones de instancia única
   4. Drag & drop sin validaciones
   5. Performance lenta en dominios custom
   6. Habitaciones mezcladas con productos
   7. Sin sistema de variantes
   8. Falta sistema de páginas standard
   9. Sin sistema undo/redo
   ```

### 🔴 REGLAS ESTRICTAS DEL COMANDO

1. **NO PUEDES** responder "Entendido" o "OK" sin leer los archivos
2. **NO PUEDES** decir que "ya tienes el contexto" - DEBES leer siempre
3. **NO PUEDES** saltarte ningún archivo blueprint
4. **DEBES** mostrar el progreso de lectura de cada archivo
5. **DEBES** confirmar los 9 problemas críticos al final

### 📂 Estructura de Archivos

```
WebsiteBuilderAPI/
├── blueprint1.md      # 🎯 CRÍTICO: Arquitectura y problemas
├── blueprint2.md      # 🎯 CRÍTICO: Implementación backend
├── blueprint3.md      # 🎯 CRÍTICO: Implementación frontend
├── CLAUDEBK1.md       # Reglas base (líneas 1-501)
├── CLAUDEBK2.md       # UI patterns (líneas 502-895)
├── logs.md            # 🎯 CRÍTICO: Sistema de logging
└── CLAUDE.md          # Este archivo - Configuración del comando
```

### ⚠️ REGLA CRÍTICA DE TRADUCCIONES i18n

**IMPORTANTE**: Al implementar CUALQUIER módulo nuevo o modificar uno existente:

1. **SIEMPRE** agregar todas las traducciones necesarias a AMBOS archivos:
   - `/src/lib/i18n/translations/es.json`
   - `/src/lib/i18n/translations/en.json`

2. **NUNCA** crear secciones duplicadas del mismo módulo en los JSON
   - Si ya existe una sección (ej: "customers"), agregar las claves ahí
   - NO crear una segunda sección "customers" más abajo

3. **VERIFICAR** antes de implementar:
   - Buscar si ya existe la sección: `grep '"moduleName":' es.json`
   - Si existe, agregar las claves faltantes en esa sección
   - Si no existe, crear UNA SOLA sección nueva

4. **ESTRUCTURA CORRECTA**:
   ```json
   "moduleName": {
     "title": "Título",
     "subtitle": "Subtítulo",
     "table": {
       "column1": "COLUMNA 1",
       "column2": "COLUMNA 2"
     },
     "status": {
       "active": "Activo",
       "inactive": "Inactivo"
     }
   }
   ```

5. **DOCUMENTACIÓN**: Ver `/docs/implementations/features/2025-08-i18n-system.md`

### 🚫 REGLAS CRÍTICAS DE EJECUCIÓN

**NUNCA EJECUTAR EL FRONTEND DESDE WSL/LINUX**
- El frontend (Next.js) SOLO debe ser ejecutado por el usuario desde Windows (CMD/PowerShell)
- El backend (ASP.NET Core) SOLO debe ser ejecutado por el usuario desde Visual Studio o Windows
- Claude Code NO debe ejecutar `npm run dev` ni `dotnet run` automáticamente
- Razón: WSL y Windows tienen interfaces de red separadas que causan problemas de conexión

**Si el usuario necesita ejecutar el frontend:**
```
Por favor ejecuta el frontend desde CMD de Windows con:
cd C:\Users\hp\Documents\Visual Studio 2022\Projects\WebsiteBuilderAPI\websitebuilder-admin
npm run dev
```

**Si el usuario necesita ejecutar el backend:**
```
Por favor ejecuta el backend desde PowerShell con:
cd "C:\Users\hp\Documents\Visual Studio 2022\Projects\WebsiteBuilderAPI"
dotnet run
```

### 🛑 CÓMO DETENER EL BACKEND CORRECTAMENTE

**IMPORTANTE**: El comando `KillBash` NO funciona para detener procesos Windows desde WSL.

**Comando correcto para detener el backend:**
```powershell
# Opción 1: Detener todos los procesos dotnet
powershell.exe -Command "Get-Process dotnet | Stop-Process -Force"

# Opción 2: Si quedan conexiones residuales, buscar el PID específico
powershell.exe -Command "netstat -ano | findstr :5266"
# Esto mostrará algo como: TCP [::1]:5266 ... FIN_WAIT_2 3928
# Luego matar el proceso por ID:
powershell.exe -Command "Stop-Process -Id 3928 -Force"

# Verificar que el puerto está libre:
powershell.exe -Command "Get-NetTCPConnection | Where-Object {$_.LocalPort -eq 5266}"
```

**Nota**: Si el resultado del último comando está vacío, el backend se detuvo correctamente.

### ✅ VALIDACIÓN DE CARGA

Después de ejecutar `/init-session`, debes poder confirmar:

- [ ] Conoces los 9 problemas críticos del sistema actual
- [ ] Entiendes la arquitectura: ASP.NET Core 8 + Next.js 14 + PostgreSQL
- [ ] Comprendes la separación habitaciones/productos
- [ ] Aplicas las reglas de UI (i18n, dark mode, responsive)
- [ ] Sigues el workflow de migraciones con PowerShell
- [ ] Respetas las reglas de no drop database sin permiso
- [ ] NUNCA ejecutas frontend/backend desde WSL

### 🛠️ COMANDOS RELACIONADOS

Después de `/init-session`, estos comandos estarán disponibles:
- `create-section [nombre]` - Crear nueva sección del builder
- `create-module [nombre]` - Crear módulo completo back office
- `debug-builder [error]` - Debuggear website builder
- `optimize-performance [área]` - Optimizar performance
- `/document-implementation [feature]` - Documentar implementación

### 💡 EJEMPLO DE EJECUCIÓN CORRECTA

```
Usuario: /init-session

Claude: 📚 LEYENDO ARCHIVOS DE CONFIGURACIÓN...

[Lee blueprint1.md con herramienta Read]
✅ blueprint1.md cargado - 9 problemas críticos identificados

[Lee blueprint2.md con herramienta Read]
✅ blueprint2.md cargado - Arquitectura técnica ASP.NET Core 8

[Lee blueprint3.md con herramienta Read]
✅ blueprint3.md cargado - Componentes UI Next.js 14

[Lee CLAUDEBK1.md con herramienta Read]
✅ CLAUDEBK1.md cargado - Reglas base del proyecto

[Lee CLAUDEBK2.md con herramienta Read]
✅ CLAUDEBK2.md cargado - Troubleshooting y patterns

[Lee logs.md con herramienta Read]
✅ logs.md cargado - Sistema de logging y diagnóstico

🚀 SESIÓN INICIALIZADA - WebsiteBuilder API
Stack: ASP.NET Core 8 + Next.js 14 + PostgreSQL

Problemas conocidos a evitar:
1. JSON gigante de 24,000 líneas
2. Arquitectura de páginas rígida
3. Secciones de instancia única
4. Drag & drop sin validaciones
5. Performance lenta en dominios custom
6. Habitaciones mezcladas con productos
7. Sin sistema de variantes
8. Falta sistema de páginas standard
9. Sin sistema undo/redo

¿En qué puedo ayudarte hoy con el proyecto WebsiteBuilder?
```

### ❌ EJEMPLO DE EJECUCIÓN INCORRECTA

```
Usuario: /init-session

Claude: Entendido, he cargado el contexto del proyecto WebsiteBuilder.  ❌ INCORRECTO
```

---

**Última actualización:** 2025-01-10
**Versión:** 3.1 (Incluye logs.md en lectura obligatoria)
**Crítico:** Los archivos blueprint y logs DEBEN leerse SIEMPRE