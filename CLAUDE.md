# CLAUDE.md - CONFIGURACIÓN DE SESIÓN Y COMANDO /init-session

## 🛑 REGLAS CRÍTICAS DE DESARROLLO - VIOLACIÓN = DETENCIÓN INMEDIATA

### 🚨 SISTEMA DE ENFORCEMENT AUTOMÁTICO ACTIVO

**ARCHIVOS DE CONTROL:**
- `.claude-rules-enforcement.md` - Sistema de validación y reglas
- `validate-module.sh` - Script de validación automática

### 🔴 REGLA #1: LÍMITE DE 300 LÍNEAS POR ARCHIVO - SIN EXCEPCIONES

**ANTES de escribir CUALQUIER código:**
1. EJECUTAR: `./validate-module.sh [archivo]`
2. Si el archivo actual tiene >250 líneas → CREAR NUEVO ARCHIVO
3. Si agregarías >50 líneas → CREAR COMPONENTE SEPARADO
4. Si es un preview → CREAR EN `/components/editor/modules/[Name]/`

**ARCHIVOS EN VIOLACIÓN (CONGELADOS - NO MODIFICAR):**
- ❌ EditorPreview.tsx con 1,763 líneas - **NO AGREGAR MÁS CÓDIGO**
- ❌ Para nuevos módulos usar: `/components/editor/modules/[ModuleName]/`

**ENFORCEMENT AUTOMÁTICO:**
```bash
# OBLIGATORIO ANTES DE CADA MODIFICACIÓN
./validate-module.sh [archivo]
# Si falla → STOP → Crear en /components/editor/modules/
```

### 🔴 REGLA #2: ARQUITECTURA MODULAR OBLIGATORIA

**NUEVA ESTRUCTURA OBLIGATORIA** para módulos del Website Builder:
```
components/
├── editor/
│   ├── modules/                    # 🆕 TODOS LOS NUEVOS MÓDULOS AQUÍ
│   │   ├── [ModuleName]/
│   │   │   ├── [ModuleName]Editor.tsx      (<300 líneas)
│   │   │   ├── [ModuleName]Preview.tsx     (<300 líneas)
│   │   │   ├── [ModuleName]Config.tsx      (<300 líneas)
│   │   │   ├── [ModuleName]Types.ts        (<100 líneas)
│   │   │   └── index.ts                    (exports)
```

**NO ESTÁ PERMITIDO:**
- Agregar NADA a EditorPreview.tsx (está CONGELADO)
- Crear archivos fuera de /modules/ para nuevas funcionalidades
- Crear archivos monolíticos de más de 300 líneas

### 🔴 REGLA #3: VERIFICACIÓN PRE-CÓDIGO OBLIGATORIA

**ANTES de escribir la PRIMERA línea de código, DEBES:**
```typescript
/**
 * PRE-CODE CHECKLIST - MUST BE TRUE:
 * [ ] File will be < 300 lines
 * [ ] Preview logic in separate file
 * [ ] Following modular architecture
 * [ ] Will update isDirty on changes
 * [ ] Will sync with props via useEffect
 * 
 * IF ANY FALSE → STOP → REDESIGN
 */
```

### 🔴 REGLA #4: AUTO-VERIFICACIÓN EN CADA ARCHIVO

**CADA archivo nuevo DEBE comenzar con:**
```typescript
/**
 * @file [NombreArchivo].tsx
 * @max-lines 300
 * @current-lines 0
 * @architecture modular
 * @validates-rules ✅
 */
```

### 🔴 REGLA #5: DETENCIÓN AUTOMÁTICA SI SE VIOLA

**Si Claude está por violar cualquier regla:**
1. DETENERSE inmediatamente
2. Decir: "⚠️ ALERTA: Esto violaría la regla de [X]. Propongo alternativa:"
3. Ofrecer solución modular que cumpla las reglas

## 🎯 COMANDO /init-session - CONFIGURACIÓN FORZADA

### ⚠️ IMPORTANTE: EJECUCIÓN OBLIGATORIA DEL COMANDO

Cuando el usuario ejecute `/init-session`, **DEBES OBLIGATORIAMENTE**:

1. **LEER TODOS LOS ARCHIVOS DE CONFIGURACIÓN** (no puedes responder sin leerlos):
   ```
   1. .claude-rules-enforcement.md - 🆕 SISTEMA DE ENFORCEMENT AUTOMÁTICO
   2. blueprint1.md - Arquitectura y 9 problemas críticos
   3. blueprint2.md - Implementación técnica detallada  
   4. blueprint3.md - UI/UX y componentes frontend
   5. CLAUDEBK1.md - Reglas base y contexto del proyecto
   6. CLAUDEBK2.md - Patterns, troubleshooting y workflow
   7. logs.md - Sistema de logging y diagnóstico
   ```

2. **USAR LA HERRAMIENTA Read** para cada archivo:
   ```python
   # OBLIGATORIO - No puedes saltarte ningún archivo
   Read(".claude-rules-enforcement.md")  # 🆕 DEBE ejecutarse PRIMERO
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
- `/init-websitebuilder` - Inicializar sesión específica del Website Builder
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

## 🏗️ COMANDO /init-websitebuilder - WEBSITE BUILDER SESSION

### ⚠️ USO ESPECÍFICO
Este comando es para retomar el desarrollo del Website Builder v2.0 específicamente.

### 📋 QUÉ HACE EL COMANDO
1. **Lee el progreso actual** desde `websitebuilderprogress.md`
2. **Carga la arquitectura** desde `blueprintwebsite.md` 
3. **Lee el sistema de logging** desde `logs.md`
4. **🆕 Lee documentación crítica** desde `docs/WEBSITE-BUILDER-ARCHITECTURE.md`
5. **🆕 Lee guía de troubleshooting** desde `docs/WEBSITE-BUILDER-TROUBLESHOOTING.md`
6. **Verifica implementación** actual (tipos, modelos, APIs, componentes)
7. **Identifica siguiente tarea** basado en dependencias y progreso
8. **Prepara el entorno** para continuar exactamente donde quedaste

### 📝 NOTA SOBRE LOGS
- **logs.md** se lee SIEMPRE al inicializar para tener contexto del sistema de logging
- Los logs se REVISAN activamente cuando:
  - El usuario solicita diagnóstico de un error
  - Se necesita rastrear un problema específico
  - El usuario ejecuta comandos de logging como `/check-logs` o `/analyze-logs`
- Para activar revisión de logs: seguir el protocolo definido en `logs.md`

### 💡 CUÁNDO USARLO
- Al comenzar una sesión de trabajo en Website Builder
- Después de una interrupción para retomar el trabajo
- Para verificar el estado actual de implementación
- Cuando necesites recordar decisiones arquitectónicas

### 📊 OUTPUT ESPERADO
```
🚀 WEBSITE BUILDER SESSION INITIALIZED

📚 Loading Documentation...
✅ websitebuilderprogress.md loaded - Current progress tracked
✅ blueprintwebsite.md loaded - Architecture specs loaded
✅ logs.md loaded - Logging system ready
✅ WEBSITE-BUILDER-ARCHITECTURE.md loaded - Critical flows documented
✅ WEBSITE-BUILDER-TROUBLESHOOTING.md loaded - Problem solutions ready

📊 Overall Progress: 55% Complete
Current Phase: Phase 3 - UI Editors (100% complete)

✅ Recently Completed:
- HeaderEditor.tsx with sync
- Save button dirty state fixed
- Undo/Redo system implemented

🔄 Currently In Progress:
- Phase 4: Structural Components
- Next: AnnouncementBarEditor.tsx

📋 Next Recommended Tasks:
1. Create AnnouncementBarEditor.tsx
2. Create FooterEditor.tsx
3. Create CartDrawerEditor.tsx

⚠️ CRITICAL REMINDERS FROM DOCS:
- ALWAYS update isDirty when making changes
- ALWAYS sync local state with props via useEffect
- NEVER compare objects directly, use JSON.stringify
- FOLLOW the documented data flow: Local → Store → API → Preview

[... más detalles ...]
```

## 🗺️ MAPA DE ARCHIVOS CRÍTICOS - NO CONFUNDIR

### ⚠️ WEBSITE BUILDER - ARCHIVOS CORRECTOS SEGÚN CONTEXTO

El Website Builder tiene **DOS interfaces diferentes** que NO deben confundirse:

#### 1️⃣ **EDITOR del Website Builder** (`/editor`)
Ubicación: `http://localhost:3000/editor`
- **SIN sidebar del dashboard**
- **Interfaz dedicada para construir sitios**

| Componente | Archivo Correcto | Descripción |
|------------|------------------|-------------|
| Layout Principal | `/src/app/editor/page.tsx` | Página principal del editor |
| Panel Lateral | `/src/components/editor/EditorSidebar.tsx` | Sidebar del editor (NO del dashboard) |
| Configuraciones Globales | `/src/components/editor/GlobalSettingsPanel.tsx` | Panel de settings DENTRO del editor |
| Preview | `/src/components/editor/EditorPreview.tsx` | Área de preview |
| Config de Sección | `/src/components/editor/ConfigPanel.tsx` | Configuración por sección |

#### 2️⃣ **DASHBOARD - Configuración Global** (`/dashboard/global-settings`)
Ubicación: `http://localhost:3000/dashboard/global-settings`
- **CON sidebar del dashboard**
- **Parte del sistema administrativo general**

| Componente | Archivo Correcto | Descripción |
|------------|------------------|-------------|
| Página de Settings | `/src/app/dashboard/global-settings/page.tsx` | Configuración desde el dashboard |
| Layout Dashboard | `/src/app/dashboard/layout.tsx` | Layout con sidebar |

### 🚨 REGLA DE ORO
**SIEMPRE pregunta al usuario**: "¿Estás en el EDITOR (/editor) o en el DASHBOARD (/dashboard)?"
- Si está en `/editor` → Usa archivos de `/components/editor/`
- Si está en `/dashboard` → Usa archivos de `/app/dashboard/`

### 📝 Ejemplo de Error Común
```
❌ INCORRECTO:
Usuario: "No veo los sliders en configuraciones globales"
Claude: *modifica /app/dashboard/global-settings/page.tsx*

✅ CORRECTO:
Usuario: "No veo los sliders en configuraciones globales"
Claude: "¿Estás en /editor o en /dashboard/global-settings?"
Usuario: "En /editor"
Claude: *modifica /components/editor/GlobalSettingsPanel.tsx*
```

---

### 🔴 DOCUMENTACIÓN CRÍTICA DEL WEBSITE BUILDER

**IMPORTANTE**: Los siguientes documentos son OBLIGATORIOS para trabajar en el Website Builder:

1. **`docs/WEBSITE-BUILDER-ARCHITECTURE.md`** - Explica TODO el flujo de datos y sincronización
   - Cómo funcionan los stores
   - Por qué el botón Save aparece/desaparece
   - Cómo se sincroniza el preview
   - Sistema Undo/Redo

2. **`docs/WEBSITE-BUILDER-TROUBLESHOOTING.md`** - Soluciones a problemas comunes
   - Qué hacer cuando el botón Save no aparece
   - Cómo arreglar cuando Undo no actualiza la vista
   - Comandos de debugging
   - Recuperación de emergencia

**⚠️ NO MODIFICAR CÓDIGO DEL WEBSITE BUILDER SIN LEER ESTOS DOCUMENTOS**

---

**Última actualización:** 2025-01-13
**Versión:** 3.5 (Incluye documentación crítica de arquitectura y troubleshooting)
**Crítico:** Los archivos blueprint, logs, ARCHITECTURE y TROUBLESHOOTING DEBEN leerse SIEMPRE

---

## 📄 Guía de Implementación: Live Preview de Páginas (Editor → Preview Real)

Esta guía resume el contrato técnico y los anti-patrones para implementar la vista previa real de páginas (Home, Product, Custom/Habitaciones, etc.), evitando regresiones.

### 1) Flujo de datos y orden de carga
- Estructurales (anónimos publicados): Header, Footer, AnnouncementBar, ImageBanner
  - GET `/api/structural-components/company/{companyId}/published`
- Tema global (anónimo publicado):
  - GET `/api/global-theme-config/company/{companyId}/published`
- Secciones de página (contenido)
  - PRIMERO: localStorage por tipo de página: `page_sections_{pageType}`
  - LUEGO: backend por slug: GET `/api/websitepages/company/{companyId}/slug/{handle}`

Notas:
- `companyId` se obtiene de localStorage; el Editor lo guarda siempre.
- No forzar deviceView a desktop; ver contrato en (4).

### 2) Slugs y handles (Reglas y alias)
- CUSTOM (Habitaciones): slug estándar `habitaciones`.
  - Backend: endpoint `ensure-custom` MIGRA `custom → habitaciones` y, si no existe, CREA con `PageType = "CUSTOM"`.
  - Frontend (Next.js): redirect 301 `/custom → /habitaciones` en `next.config.mjs`.
  - Router de preview `[handle]/page.tsx`: aceptar alias necesarios (ej. `all-collections`, `all-products`).
  - Editor: el botón de preview abre `/habitaciones` para CUSTOM.
- Para otras páginas, usar handles definidos en `[handle]/page.tsx` sin forzar alias no documentados.

Recomendación operativa:
- Mantener alias/redirects por un tiempo y actualizar menús al slug final.

### 3) Claves de sincronización en localStorage (evitar fugas entre páginas)
- Usar SIEMPRE claves por tipo de página, NO por ID temporal:
  - `page_sections_home`, `page_sections_product`, `page_sections_custom`, etc.
- Editor al guardar: persistir `page_sections_{pageType}`.
- Preview al leer: intentar primero `page_sections_{pageType}` y luego backend (slug).

Pitfall común:
- Guardar con `page_sections_{pageId}` provoca colisiones y hace que Home muestre secciones de otra página.

### 4) Contrato de deviceView (paridad Editor ↔ Preview real)
- Contenedores (PreviewPage/PreviewContent): pasar `deviceView` tal cual, sin `|| 'desktop'`.
- Componentes de preview: patrón de detección CANÓNICO (copiar/pegar):
  ```tsx
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });
  useEffect(() => {
    if (deviceView !== undefined) { setIsMobile(deviceView === 'mobile'); return; }
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [deviceView]);
  ```
- Editor solo fuerza `localStorage.editorDeviceView = 'mobile'` cuando la vista móvil está activa; en desktop se retira el override.

Anti-patrón:
- Establecer default prop `deviceView = 'desktop'` en componentes o contenedores.

### 5) Módulos de Habitaciones (room_*) aislados a CUSTOM
- Los módulos `room_*` (galería, título/host, amenities, mapa, calendario, etc.) solo deben renderizarse/cargarse cuando `pageType === CUSTOM`.
- En el Store (carga de secciones) y en el render del Preview, filtrar `room_*` fuera de páginas que no sean CUSTOM.

Beneficios:
- Evita que Home o Product muestren bloques de Habitaciones por error.

### 6) Router de Preview y alias correctos
- `[handle]/page.tsx` debe aceptar:
  - `home`, `product`, `cart`, `checkout`, `collection`
  - `all_collections` y alias `all-collections`
  - `all_products` y alias `all-products`
  - `custom` (alias histórico) y `habitaciones` (slug final)

### 7) Troubleshooting rápido (síntomas → causa → fix)
- Home muestra Habitaciones
  - Causa: claves de localStorage por ID, o fallback de slug aplicado fuera de CUSTOM, o `room_*` sin filtro.
  - Fix: usar `page_sections_{pageType}`, fallback de slug SOLO en CUSTOM, filtrar `room_*` en no-CUSTOM.
- Preview móvil no coincide con editor
  - Causa: `deviceView` coalescido a desktop, o patrón de detección incompleto.
  - Fix: contrato de (4); nunca `|| 'desktop'`.
- `/custom` sigue activo tras migración
  - Causa: links antiguos.
  - Fix: redirect 301 en Next.js y actualizar menús a `/habitaciones`.

### 8) Checklist para nuevas páginas/secciones
- [ ] Agregar handle en `[handle]/page.tsx` (incluyendo alias si aplica)
- [ ] Usar `page_sections_{pageType}` para sincronización local
- [ ] NO coalescer `deviceView`
- [ ] Componentes siguen el patrón canónico de móvil
- [ ] Si se añaden módulos exclusivos de una página (p.ej., `room_*`), filtrar en Store/Preview según `pageType`
- [ ] Si se cambian slugs, añadir redirect 301 en Next.js y alias en router

### 9) Fragmentos de referencia (cambios mínimos recomendados)
- Editor (abrir preview CUSTOM):
  ```ts
  case PageType.CUSTOM:
    handle = 'habitaciones';
    break;
  ```
- Next.js redirect (`next.config.mjs`):
  ```js
  async redirects() {
    return [{ source: '/custom', destination: '/habitaciones', permanent: true }];
  }
  ```
- Backend (ensure-custom):
  - Buscar `habitaciones`; si no existe, migrar `custom → habitaciones`; si no hay ninguna, crear `CUSTOM` con slug `habitaciones`.

Con esto, el Preview Real queda consistente, resiliente a cambios de slug y sin fugas entre páginas.