# Comando /nuevo-modulo - Crear Nueva Sección del Template

Crear una nueva sección del template para el Website Builder con el flujo completo de implementación.

## ⚡ IMPORTANTE: USAR POWERSHELL PARA TODOS LOS COMANDOS

### 🚀 PowerShell es MÁS RÁPIDO que WSL/Linux
**SIEMPRE ejecutar comandos desde PowerShell de Windows:**

```powershell
# Para el Frontend (Next.js)
cd "C:\Users\hp\Documents\Visual Studio 2022\Projects\WebsiteBuilderAPI\websitebuilder-admin"
npm run dev        # Desarrollo
npm run build      # Build de producción
npm run type-check # Verificar tipos

# Para el Backend (ASP.NET Core)
cd "C:\Users\hp\Documents\Visual Studio 2022\Projects\WebsiteBuilderAPI"
dotnet run         # Ejecutar backend
dotnet build       # Compilar
dotnet ef database update  # Migraciones
```

### ❌ NO USAR WSL/Linux para:
- `npm run dev` - Problemas de red entre WSL y Windows
- `npm run build` - Más lento en WSL
- `dotnet run` - Conflictos de puertos
- Cualquier comando de compilación o ejecución

### ✅ Claude Code SOLO debe:
- Editar archivos
- Leer archivos
- Crear archivos
- **NO ejecutar servidores**

## 📦 PREREQUISITOS - APIs DE BACKEND

### MediaUploadController ya implementado
El backend ya tiene las APIs necesarias en `Controllers/MediaUploadController.cs`:

- **POST** `/api/MediaUpload/image` - Upload de imágenes
- **POST** `/api/MediaUpload/video` - Upload de videos
- **DELETE** `/api/MediaUpload/{type}/{fileName}` - Eliminar archivos
- **GET** `/api/MediaUpload/list` - Listar archivos

**Características:**
- Autenticación requerida (`[Authorize]`)
- Límite de 50MB para imágenes
- Límite de 100MB para videos
- Formatos soportados:
  - Imágenes: .jpg, .jpeg, .png, .gif, .webp, .svg, .avif
  - Videos: .mp4, .webm, .ogg, .mov, .avi
- Archivos guardados en:
  - `wwwroot/uploads/images/`
  - `wwwroot/uploads/videos/`
- URLs retornadas como: `http://localhost:5266/uploads/images/[guid].jpg`

## 🚀 EJECUCIÓN AUTOMÁTICA - UN SOLO COMANDO

### Cuando ejecutas `/nuevo-modulo`:
1. 🤖 **Te pregunto** nombre y si tiene hijos
2. 🔧 **Ejecuto automáticamente** el script `create-template-section.sh`
3. 📄 **Genero** todos los archivos base
4. 📸 **Te pido** screenshots de configuración
5. 🔍 **Analizo** y te confirmo lo que identifiqué
6. 🎨 **Mapeo** typography y te pido confirmación
7. ⚙️ **Implemento** la lógica específica
8. 🔗 **Integro** automáticamente en el sistema
9. ✅ **Verifico** que todo funcione

**NO necesitas ejecutar el script manualmente - el comando hace TODO**

## 📋 FLUJO COMPLETO DEL COMANDO

### PASO 1: INFORMACIÓN BÁSICA
Preguntar al usuario:
1. **Nombre del módulo** (ej: Multicolumns, Gallery, Testimonials)
2. **¿Tendrá elementos hijos/bloques?** (sí/no)
   - Sí → Generará Children.tsx y ItemEditor.tsx
   - No → Solo Editor principal

### PASO 2: GENERAR ESTRUCTURA BASE

**🎯 MÉTODO PREFERIDO: Script PowerShell nativo**

El usuario debe ejecutar desde PowerShell:
```powershell
cd "C:\Users\hp\Documents\Visual Studio 2022\Projects\WebsiteBuilderAPI"

# Si tiene hijos
.\create-template-section.ps1 -ModuleName "[MODULE_NAME]" -WithChildren

# Si NO tiene hijos
.\create-template-section.ps1 -ModuleName "[MODULE_NAME]"
```

**Alternativa: Si prefieres usar el script bash original**
```powershell
# Opción 1: Con Git Bash (si está instalado)
& "C:\Program Files\Git\bin\bash.exe" create-template-section.sh [MODULE_NAME] [--with-children]

# Opción 2: Con WSL
wsl bash create-template-section.sh [MODULE_NAME] [--with-children]
```

Verificar que se generaron los archivos:

```bash
# Verificar archivos generados
echo "\n📁 Verificando archivos generados:"
ls -la websitebuilder-admin/src/components/editor/modules/$MODULE_NAME/

# Verificar preview
if [ -f "websitebuilder-admin/src/components/preview/Preview${MODULE_NAME}.tsx" ]; then
  echo "✅ Preview unificado creado"
else
  echo "⚠️ Error: Preview no se creó correctamente"
fi
```

Archivos que deben existir:
- ✅ `${MODULE_NAME}Editor.tsx` - Editor principal
- ✅ `${MODULE_NAME}Children.tsx` - Gestión de hijos (si aplica)
- ✅ `${MODULE_NAME}ItemEditor.tsx` - Editor de items (si aplica)
- ✅ `Preview${MODULE_NAME}.tsx` - Preview unificado
- ✅ `types.ts` - Tipos TypeScript
- ✅ `index.ts` - Exports

**⚠️ IMPORTANTE: Si Preview${MODULE_NAME}.tsx NO se creó automáticamente, DEBES crearlo manualmente en `websitebuilder-admin/src/components/preview/`**

### PASO 3: SOLICITAR SCREENSHOTS
```
📸 Por favor proporciona:

1. **Vista de configuración del PADRE** ([Module]Editor)
   - Screenshot del panel de configuración principal
   - Muestra todos los campos y controles

2. **Vista de configuración del HIJO** (si aplica)
   - Screenshot del editor de cada item/bloque
   - Muestra campos específicos del hijo

3. **Estructura visual en el EDITOR**
   - Cómo se ve en el sidebar
   - Cómo se ve el botón "Add block" 
   - Comportamiento drag & drop (si aplica)

Esperando screenshots...
```

### PASO 4: ANÁLISIS INICIAL
Después de recibir los screenshots, presentar análisis inicial:

```
📋 ELEMENTOS IDENTIFICADOS EN [MODULE]:

Configuración del PADRE:
✓ [Campo identificado 1]
✓ [Campo identificado 2]
✓ [Campo select 1] - (necesito opciones)
✓ [Campo select 2] - (necesito opciones)
✓ Color scheme selector (si aplica)
✓ [Otros campos...]

🖼️ CAMPOS DE MEDIA DETECTADOS:
✓ [Campo imagen] - Implementaré upload handler
✓ [Campo video] - Implementaré upload handler

Configuración del HIJO (si aplica):
✓ [Campo del hijo 1]
✓ [Campo del hijo 2]
✓ [Campo select hijo] - (necesito opciones)
✓ [Campo imagen hijo] - Implementaré upload handler
✓ [Otros campos...]

Estructura del Editor:
✓ [Comportamiento identificado]
✓ [UI elements identificados]

📝 NECESITO LAS OPCIONES DE LOS SIGUIENTES CAMPOS SELECT:

Para el PADRE:
- [Campo select 1]: ¿Cuáles son las opciones disponibles?
- [Campo select 2]: ¿Cuáles son las opciones disponibles?

Para el HIJO (si aplica):
- [Campo select hijo]: ¿Cuáles son las opciones disponibles?

⚠️ NOTA: Implementaré automáticamente handlers de upload para todos los campos de imagen/video detectados.
⚠️ IMPORTANTE: Los uploads requieren que el backend esté ejecutándose en http://localhost:5266

Por favor proporciona las opciones de cada select...
```

### PASO 4.5: CONFIRMACIÓN FINAL CON OPCIONES
Después de recibir las opciones de los selects:

```
📋 ANÁLISIS COMPLETO DE [MODULE]:

Configuración del PADRE:
✓ [Campo 1]: tipo [tipo]
✓ [Campo 2]: tipo [tipo]
✓ [Campo select 1]: opciones [opción1, opción2, opción3]
✓ [Campo select 2]: opciones [opción1, opción2]
✓ Color scheme selector: [1-5 esquemas]
✓ [Otros campos con tipos...]

Configuración del HIJO (si aplica):
✓ [Campo hijo 1]: tipo [tipo]
✓ [Campo select hijo]: opciones [opción1, opción2, opción3]
✓ [Otros campos con tipos...]

Estructura del Editor:
✓ [Comportamiento identificado]
✓ [UI elements identificados]

¿Es correcto este análisis completo? (S/N)
```

ESPERAR confirmación del usuario antes de continuar.

### PASO 5: MAPEO DE TYPOGRAPHY
Si hay campos de texto, proponer mapeo con typography global:

```
📝 MAPEO DE TYPOGRAPHY PARA [MODULE]:

• [Campo heading] → typography.headings (h2/h3)
• [Campo body] → typography.body
• [Campo button] → typography.buttons
• [Campo link] → typography.link
• [Campo subtitle] → typography.body (smaller)

Este mapeo conectará automáticamente con las 
configuraciones globales de tipografía.

¿Confirmas este mapeo? (S/N)
```

ESPERAR confirmación del usuario antes de continuar.

### PASO 6: IMPLEMENTACIÓN
Solo después de las confirmaciones:

#### 6.1 Actualizar Types
- Agregar campos identificados en `types.ts`
- Incluir configuración de colorScheme si aplica
- Definir interfaces para hijos si aplica

#### 6.2 Implementar Editor

**⚠️ IMPORTS CORRECTOS - VERIFICAR ANTES DE USAR:**
```typescript
// ✅ IMPORTS CORRECTOS para el Editor:
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Upload, Image, Video, X } from 'lucide-react';
import * as Icons from 'lucide-react';  // Para iconos, NO usar @/lib/icons
import { useEditorStore } from '@/stores/useEditorStore';
import useThemeConfigStore from '@/stores/useThemeConfigStore'; // SIN destructuring {}
import { [ModuleName]Config, getDefault[ModuleName]Config } from './types';

// ❌ NUNCA usar:
// import { useThemeConfigStore } from '@/stores/useThemeConfigStore'; // INCORRECTO
// import { iconList } from '@/lib/icons'; // NO EXISTE
```

- Agregar todos los campos de configuración identificados
- **⚠️ CRÍTICO: NO usar ancho fijo en contenedor principal**
```typescript
// ✅ CORRECTO - Sin ancho fijo
<div className="h-full bg-white dark:bg-gray-900 flex flex-col">
  <div className="flex-1 overflow-y-auto">
```
- **⚠️ CRÍTICO: Sliders flexibles para evitar overflow**
```typescript
// ✅ CORRECTO - Sliders que no causan overflow
<input className="flex-1 min-w-0" type="range" />
<span className="flex-shrink-0">{value}</span>
```
- Implementar selector de color scheme (SIN opción "Primary"):
```typescript
const { config: themeConfig } = useThemeConfigStore(); // NO usar destructuring en import
<select value={localConfig.colorScheme}>
  {/* NO agregar <option value="primary">Primary</option> */}
  {themeConfig?.colorSchemes?.schemes?.map((scheme, index) => (
    <option value={String(index + 1)}>{scheme.name || `Color scheme ${index + 1}`}</option>
  ))}
</select>
```

**⚠️ MANEJO DE ICONOS:**
```typescript
// Para selector de iconos en el Editor:
<select value={localConfig.icon || ''} onChange={(e) => handleUpdate({ icon: e.target.value })}>
  <option value="">None</option>
  <option value="Settings">Settings</option>
  <option value="Search">Search</option>
  <option value="Home">Home</option>
  <option value="ShoppingBag">Shopping Bag</option>
  <option value="Heart">Heart</option>
  <option value="Star">Star</option>
  // ... más iconos de lucide-react
</select>

// Para mostrar icono en Preview:
const IconComponent = config.icon ? (Icons as any)[config.icon] : null;
{IconComponent && <IconComponent className="w-8 h-8" />}
```

- **⚠️ CRÍTICO: Implementar upload de imágenes/videos si se detectan**

**IMPORTANTE: El backend ya tiene las APIs de upload implementadas en `MediaUploadController.cs`**

Si hay campos de imagen o video (en padre o hijos), implementar handlers:

```typescript
const handleImageUpload = async (field?: string) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // CRÍTICO: Obtener token de autenticación
      const token = localStorage.getItem('token');
      
      // Usar la API real del backend
      const response = await fetch('http://localhost:5266/api/MediaUpload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // OBLIGATORIO para autenticación
        },
        body: formData,
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // data.url contendrá algo como: http://localhost:5266/uploads/images/guid.jpg
        handleUpdate({ [field || 'image']: data.url });
      } else {
        const error = await response.text();
        console.error('Upload failed:', error);
        alert('Error al subir la imagen. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error de conexión. Asegúrate de que el backend esté ejecutándose.');
    }
  };
  
  input.click();
};

const handleVideoUpload = async (field?: string) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/mp4,video/webm,video/ogg';
  
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // CRÍTICO: Obtener token de autenticación
      const token = localStorage.getItem('token');
      
      // Usar la API real del backend
      const response = await fetch('http://localhost:5266/api/MediaUpload/video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // OBLIGATORIO para autenticación
        },
        body: formData,
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // data.url contendrá algo como: http://localhost:5266/uploads/videos/guid.mp4
        handleUpdate({ [field || 'video']: data.url });
      } else {
        const error = await response.text();
        console.error('Upload failed:', error);
        alert('Error al subir el video. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error de conexión. Asegúrate de que el backend esté ejecutándose.');
    }
  };
  
  input.click();
};
```

**Ejemplo de UI con upload integrado:**
```typescript
{/* Para imagen con preview */}
<div>
  <label className="block text-sm font-medium mb-2">Image</label>
  <div 
    onClick={handleImageUpload}
    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 cursor-pointer transition-colors"
  >
    {localItem.image ? (
      <div className="relative">
        <img 
          src={localItem.image} 
          alt="Preview" 
          className="w-full h-32 object-cover rounded mb-2"
        />
        <p className="text-xs text-gray-500">Click to change image</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate({ image: '' });
          }}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    ) : (
      <>
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
      </>
    )}
  </div>
</div>
```

#### 6.3 Implementar Preview con Vista MÓVIL

**⚠️ IMPORTS CORRECTOS para Preview:**
```typescript
// ✅ IMPORTS CORRECTOS para el Preview:
import React from 'react';
import { [ModuleName]Config, getDefault[ModuleName]Config } from '@/components/editor/modules/[ModuleName]/types';
import { GlobalThemeConfig } from '@/types/theme';
import useThemeConfigStore from '@/stores/useThemeConfigStore'; // SIN destructuring {}
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react'; // Para iconos

// ❌ NUNCA usar:
// import { useThemeConfigStore } from '@/stores/useThemeConfigStore'; // INCORRECTO
```

- **⚠️ CRÍTICO: Implementar vista responsive para móvil**
```typescript
// Detectar dispositivo
const isMobile = deviceView === 'mobile';

// Aplicar clases responsive
<div className={cn(
  "grid gap-6",
  isMobile ? "grid-cols-1" : "grid-cols-3", // Ejemplo para grid
  isMobile ? "px-4" : "px-8" // Padding responsive
)}>
```

- **Configuraciones móviles específicas:**
```typescript
// Si hay configuraciones móviles específicas
const spacing = isMobile && config.mobileSpacing 
  ? config.mobileSpacing 
  : config.desktopSpacing;

const layout = isMobile && config.mobileLayout
  ? config.mobileLayout
  : config.desktopLayout;

// Tamaños de texto responsive
const headingSize = isMobile ? "text-2xl" : "text-4xl";
const bodySize = isMobile ? "text-sm" : "text-base";
```

- Aplicar color scheme seleccionado con estructura PLANA:
```typescript
// Obtener colorScheme (estructura plana, NO anidada)
const colorSchemeIndex = config.colorScheme ? parseInt(config.colorScheme) - 1 : 0;
const colorScheme = themeConfig?.colorSchemes?.schemes?.[colorSchemeIndex] || {
  background: '#ffffff',
  text: '#000000',
  // ... fallbacks
};

// Aplicar colores (NO usar .primary, .secondary en propiedades)
style={{ 
  backgroundColor: colorScheme?.background || '#ffffff',
  color: colorScheme?.text || '#000000'
}}
```
- Condición permisiva para enabled:
```typescript
// Solo ocultar si está explícitamente false
if (config.enabled === false && !isEditor) return null;
```
- Implementar patrón dual de theme:
```typescript
const storeThemeConfig = useThemeConfigStore(state => state.config);
const themeConfig = theme || storeThemeConfig;
```

#### 6.4 Si tiene hijos
- Implementar drag & drop en Children.tsx
- Botón azul "Add [module] block"
- Flecha de regreso correcta (selectSection(null))
- Handle de drag solo visible on hover

### PASO 7: INTEGRACIÓN AUTOMÁTICA

Ejecutar las integraciones automáticamente:

```bash
echo "\n🔧 Iniciando integración automática..."
```

#### 7.1 Agregar tipo en enum
Actualizar `/websitebuilder-admin/src/types/editor.types.ts`:
```typescript
export enum SectionType {
  // ... otros tipos
  [MODULE_UPPER] = '[module_lower]',
}
```

#### 7.2 Integrar en EditorLayout
En `EditorLayout.tsx` o `ConfigPanel.tsx`:
- Importar editor
- Agregar case en switch

#### 7.3 Integrar Preview en EditorPreview
```typescript
import Preview[Module] from '@/components/preview/Preview[Module]';

case SectionType.[MODULE_UPPER]:
  return (
    <Preview[Module]
      config={section.settings}
      theme={themeConfig}
      deviceView={deviceView}
      isEditor={true}
    />
  );
```

#### 7.4 Integrar Preview en PreviewContent (CRÍTICO para Template Sections)
**⚠️ OBLIGATORIO para secciones template que se guardan en BD**

```typescript
// 1. Importar en PreviewContent.tsx
import Preview[Module] from './Preview[Module]';

// 2. Agregar caso en getSectionType()
const getSectionType = (section: any): string | undefined => {
  // ...
  if (t === '[Module]' || t === '[module_lower]') return '[module_lower]';
  // ...
};

// 3. Agregar renderizado
{getSectionType(section) === '[module_lower]' && (
  <Preview[Module] 
    config={getSectionConfig(section)} 
    theme={theme}
    deviceView={deviceView || 'desktop'}
    isEditor={false}
  />
)}
```

#### 7.5 Si tiene hijos - INTEGRACIÓN CRÍTICA (3 PARTES)

**⚠️ IMPORTANTE: Los módulos con hijos requieren 3 integraciones específicas**

**7.5.1 En EditorSidebarWithDnD - Renderizar children y crear sección virtual:**
```typescript
// Renderizar hijos después del padre
{section.type === SectionType.[MODULE_UPPER] && (
  <[Module]Children section={section} groupId={group.id} />
)}

// Agregar sección virtual para hijos (CRÍTICO)
if (!selectedSection && selectedSectionId?.includes(':child:')) {
  const [sectionId] = selectedSectionId.split(':child:');
  const parentSection = Object.values(sections).flat().find(s => s.id === sectionId);
  
  selectedSection = {
    id: selectedSectionId,
    type: '[MODULE_UPPER]_ITEM' as any,
    name: '[Item Name]',
    visible: true,
    settings: parentSection?.settings || {},
    sortOrder: 0
  } as any;
}
```

**7.5.2 En ConfigPanel - Detectar y renderizar editor de hijos:**
```typescript
// Detectar si es un hijo del módulo
const is[Module]Item = selectedSectionId?.includes(':child:') && !isSlideItem;
const get[Module]SectionId = () => {
  if (!is[Module]Item || !selectedSectionId) return null;
  return selectedSectionId.split(':child:')[0];
};
const get[Module]ItemId = () => {
  if (!is[Module]Item || !selectedSectionId) return null;
  return selectedSectionId.split(':child:')[1];
};

// Renderizar editor correcto (DESPUÉS de todos los hooks)
if (is[Module]Item) {
  const sectionId = get[Module]SectionId();
  const itemId = get[Module]ItemId();
  if (sectionId && itemId) {
    return <[Module]ItemEditor sectionId={sectionId} itemId={itemId} />;
  }
}
```

**7.5.3 En [Module]Children - Usar formato especial:**
```typescript
const handleSelectItem = (itemId: string) => {
  // CRÍTICO: Usar formato parentId:child:childId
  selectSection(`${section.id}:child:${itemId}`);
  toggleConfigPanel(true);
};
```

### PASO 8: VERIFICACIÓN (Ejecutar desde PowerShell)

**⚠️ IMPORTANTE: El usuario debe ejecutar estos comandos desde PowerShell**

```powershell
# INSTRUCCIONES PARA EL USUARIO:
Write-Host "Por favor ejecuta estos comandos desde PowerShell:" -ForegroundColor Yellow

cd "C:\Users\hp\Documents\Visual Studio 2022\Projects\WebsiteBuilderAPI\websitebuilder-admin"

# Verificar compilación TypeScript
npm run type-check

# Si hay errores, mostrarlos y corregir
# Si todo está bien, continuar con:
npm run build

# Para ver el resultado en desarrollo:
npm run dev
```

**Claude Code NO debe ejecutar estos comandos, solo indicar al usuario que los ejecute**

Verificar manualmente:
- [ ] El módulo aparece en el editor
- [ ] El preview funciona correctamente  
- [ ] Drag & drop funciona (si aplica)

### PASO 9: REPORTE FINAL
```
✅ MÓDULO [MODULE] IMPLEMENTADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Archivos creados/modificados:
  ✓ [Module]Editor.tsx - [X] campos configurados
  ✓ Preview[Module].tsx - Preview unificado con vista móvil
  ✓ types.ts - Tipos actualizados
  [Si aplica:]
  ✓ [Module]Children.tsx - Gestión de bloques
  ✓ [Module]ItemEditor.tsx - Editor de items

🎨 Configuraciones:
  ✓ Color Schemes: [Integrado/No aplica]
  ✓ Typography: [X] campos mapeados
  ✓ Drag & Drop: [Configurado/No aplica]
  ✓ Vista Móvil: Implementada

🔧 Integraciones:
  ✓ SectionType enum actualizado
  ✓ EditorLayout integrado
  ✓ EditorPreview integrado
  ✓ PreviewContent integrado
  [Si aplica:]
  ✓ EditorSidebarWithDnD integrado

📊 Estado: Listo para usar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ IMPORTANTE: Ejecutar estos comandos desde PowerShell:
  npm run type-check  # Verificar tipos
  npm run build       # Build de producción
  npm run dev         # Ver en desarrollo

Siguiente paso: Agregar sección desde el editor
```

### PASO 10: CHECKLIST FINAL DE VERIFICACIÓN

```
📋 CHECKLIST FINAL - VERIFICACIÓN DE REQUISITOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ESTRUCTURA BASE
□ Script create-template-section.sh ejecutado
□ Todos los archivos base generados
□ Estructura en /components/editor/modules/[Module]/
□ Preview unificado en /components/preview/

✅ ANÁLISIS Y CONFIGURACIÓN
□ Screenshots analizados correctamente
□ Opciones de selects documentadas
□ Campos identificados e implementados
□ Confirmación del usuario obtenida

✅ IMPLEMENTACIÓN TÉCNICA
□ Types.ts actualizado con todas las interfaces
□ Editor sin ancho fijo (sin w-[320px])
□ Sliders con flex-1 min-w-0
□ Color scheme SIN opción "Primary"
□ Vista móvil implementada (deviceView === 'mobile')
□ Clases responsive aplicadas
□ Configuraciones móviles específicas
□ Upload handlers implementados si hay campos de imagen/video
□ Token de autenticación incluido en headers
□ URLs del backend correctas (http://localhost:5266/api/MediaUpload/)

✅ PREVIEW
□ Patrón dual de theme implementado
□ Estructura PLANA de colorScheme
□ Condición permisiva para enabled (=== false)
□ isEditor prop funcionando
□ Vista desktop funcionando
□ Vista móvil funcionando
□ Valores por defecto para editor vacío

✅ INTEGRACIONES (CRÍTICO)
□ SectionType enum actualizado
□ EditorLayout/ConfigPanel integrado
□ EditorPreview integrado
□ PreviewContent integrado (OBLIGATORIO para BD)
□ getSectionType() actualizado
□ Importaciones agregadas

✅ SI TIENE HIJOS
□ [Module]Children.tsx implementado
□ [Module]ItemEditor.tsx implementado
□ Botón "Add block" azul (text-blue-600)
□ Flecha regreso a sidebar (selectSection(null))
□ Drag handle solo visible on hover
□ Formato parentId:child:childId usado
□ EditorSidebarWithDnD integrado (3 partes)
□ ConfigPanel detecta hijos correctamente
□ Sección virtual creada para hijos

✅ VALIDACIÓN
□ npm run type-check sin errores
□ Módulo visible en editor
□ Preview funciona en editor
□ Preview funciona en producción
□ Drag & drop funciona (si aplica)
□ Click en hijos abre editor (si aplica)
□ Guardado en BD funciona

✅ REGLAS RESPETADAS
□ Archivos < 300 líneas
□ Arquitectura unificada (UN Preview)
□ Screenshots recibidos antes de implementar
□ Confirmaciones obtenidas (pasos 4.5 y 5)
□ Solo secciones template (no estructurales)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: [X]/[Y] requisitos cumplidos

⚠️ Si algún item no está marcado, revisar y corregir antes de finalizar.
```

## 🔴 RECORDATORIOS CRÍTICOS

### ⚡ RENDIMIENTO Y EJECUCIÓN:
1. **SIEMPRE usar PowerShell** para comandos npm y dotnet
2. **NO ejecutar desde WSL** - Es más lento
3. **Backend debe estar corriendo** en http://localhost:5266
4. **Usuario debe estar autenticado** para uploads

### Para módulos con hijos:
1. **Botón "Add block"** SIEMPRE azul (text-blue-600)
2. **Flecha de regreso** va al sidebar (selectSection(null))

## 🐛 ERRORES COMUNES Y SOLUCIONES

### Error 1: Vista cortada/overflow en editor
**Síntoma:** Controles cortados, botones de colapso no visibles
**Solución:** NO usar `w-[320px]`, usar `flex-1 min-w-0` en sliders

### Error 2: Click en hijo no abre editor
**Síntoma:** Nada pasa al hacer click en hijo
**Solución:** Verificar las 3 integraciones:
1. [Module]Children usa formato `:child:`
2. ConfigPanel detecta y renderiza ItemEditor
3. EditorSidebarWithDnD crea sección virtual

### Error 3: No se ve en el editor (estructura vacía)
**Síntoma:** Módulo agregado pero no aparece nada
**Solución:** Agregar valores por defecto en Preview:
```typescript
// Valores con fallback:
const layout = config.desktopLayout || 'grid';
const spacing = config.desktopSpacing || 24;
const items = (config.items || []).filter(item => item.visible);

// Placeholders para editor:
const itemsToRender = items.length > 0 ? items : (isEditor ? [
  { id: 'p1', icon: 'star', heading: 'Column 1', body: 'Content' }
] : []);
```

### Error 4: No se ve en preview real
**Síntoma:** Se ve en editor pero no en preview real
**Solución:** Integrar en PreviewContent.tsx:
1. Importar PreviewModule
2. Agregar caso en getSectionType()
3. Agregar renderizado con isEditor={false}

### Error 5: Color schemes no funcionan
**Síntoma:** Los colores no cambian con diferentes schemes
**Solución:** Usar estructura plana del colorScheme:
```typescript
// ✅ CORRECTO
backgroundColor: colorScheme?.background || '#ffffff'
// ❌ INCORRECTO
backgroundColor: colorScheme?.background?.primary
```

### Error 6: No se ve en preview real
**Síntoma:** Visible en editor pero no en preview
**Solución:** Usar comparación estricta:
```typescript
if (config.enabled === false && !isEditor) return null;
```

### Error 7: TypeScript errors
**Síntoma:** Errores de compilación
**Solución:** Ejecutar `npm run type-check` y corregir tipos

### Error 8: Upload de imágenes/videos no funciona
**Síntoma:** Click en botón upload pero no pasa nada
**Solución:** Verificar implementación de handlers:
```typescript
// Verificar que el handler esté correctamente implementado
const handleImageUpload = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => { /* ... */ };
  input.click(); // CRÍTICO: No olvidar el click()
};

// En el botón/div:
<div onClick={handleImageUpload} className="cursor-pointer">
  {/* UI del upload */}
</div>
```

### Error 9: Imagen/video se pierde al cambiar de sección
**Síntoma:** Media desaparece al navegar
**Solución:** Asegurar que se guarde en el store:
```typescript
// Siempre actualizar a través de updateSectionSettings
handleUpdate({ image: imageUrl });
// NO hacer solo setLocalState
```

### Error 10: Error 401 Unauthorized al subir archivos
**Síntoma:** Failed to load resource: 401 (Unauthorized)
**Solución:** Incluir token de autenticación:
```typescript
const token = localStorage.getItem('token');
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Error 11: QuotaExceededError en localStorage
**Síntoma:** Failed to execute 'setItem' on 'Storage'
**Causa:** Guardando imágenes base64 en lugar de URLs
**Solución:** 
1. Usar las APIs del backend (NO guardar base64)
2. Limpiar localStorage: `localStorage.removeItem('editor-store')`
3. Las URLs deben ser como: `http://localhost:5266/uploads/images/guid.jpg`

### Error 12: Backend no está ejecutándose
**Síntoma:** Error de conexión al subir archivos
**Solución:**
1. Ejecutar backend desde Visual Studio o PowerShell:
```powershell
cd "C:\Users\hp\Documents\Visual Studio 2022\Projects\WebsiteBuilderAPI"
dotnet run
```
2. Verificar que esté en `http://localhost:5266`
3. Verificar autenticación (hacer login primero)

3. **SOLO UNA flecha**, nunca dos
4. **Drag handle** solo visible on hover
5. **Items** con chevron > ícono > título

### Para todos los módulos:
1. **Arquitectura unificada**: UN Preview para ambos contextos
2. **Patrón dual de theme**: theme || storeThemeConfig
3. **isEditor prop**: Diferencia contextos
4. **Límite 300 líneas** por archivo
5. **updateSectionSettings()** para secciones del template

## NOTAS IMPORTANTES

- Este comando es SOLO para secciones del template (no componentes estructurales)
- Los componentes estructurales (Header, Footer, etc.) usan un flujo diferente
- SIEMPRE esperar confirmación en pasos 4 y 5 antes de implementar
- NUNCA implementar sin ver los screenshots primero