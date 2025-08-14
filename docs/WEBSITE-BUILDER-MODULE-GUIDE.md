# 📘 Guía Completa para Construir Nuevos Módulos del Website Builder

## ⚠️ ADVERTENCIA CRÍTICA: Sincronización de Visibilidad

**IMPORTANTE**: Si tu módulo es un componente estructural (como Header, Footer, AnnouncementBar, CartDrawer), **DEBES** implementar la sincronización de visibilidad entre el store y el context, o el toggle de visibilidad NO se guardará. Ver [Paso 6: Sincronización de Visibilidad](#paso-6-sincronización-de-visibilidad-crítico).

## 📋 Tabla de Contenidos
1. [Overview del Sistema](#overview-del-sistema)
2. [Checklist Completo](#checklist-completo)
3. [Paso 1: Crear el Editor del Módulo](#paso-1-crear-el-editor-del-módulo)
4. [Paso 2: Integrar con EditorLayout](#paso-2-integrar-con-editorlayout)
5. [Paso 3: Agregar al EditorPreview (iframe)](#paso-3-agregar-al-editorpreview-iframe)
6. [Paso 4: Crear el Preview Real](#paso-4-crear-el-preview-real)
7. [Paso 5: Integrar con PreviewPage](#paso-5-integrar-con-previewpage)
8. [Paso 6: Backend y Persistencia](#paso-6-backend-y-persistencia)
9. [Paso 7: Testing y Validación](#paso-7-testing-y-validación)
10. [Plantillas de Código](#plantillas-de-código)
11. [Troubleshooting Común](#troubleshooting-común)

---

## Overview del Sistema

### Arquitectura de Doble Preview
```
┌─────────────────────────────────────────────────┐
│                   EDITOR (/editor)               │
├─────────────────────────────────────────────────┤
│  EditorLayout.tsx                                │
│    ├── ModuleEditor.tsx (Panel de config)       │
│    └── EditorPreview.tsx (iframe - cambios live)│
└─────────────────────────────────────────────────┘
                        ↓
                   [SAVE TO DB]
                        ↓
┌─────────────────────────────────────────────────┐
│              PREVIEW REAL (/[handle])            │
├─────────────────────────────────────────────────┤
│  PreviewPage.tsx                                 │
│    └── PreviewModule.tsx (Preview público)      │
└─────────────────────────────────────────────────┘
```

### Flujo de Datos
1. **Editor → Store → EditorPreview** (cambios en tiempo real)
2. **Store → API → Database** (al guardar)
3. **Database → PreviewPage → PreviewModule** (preview público)

---

## Checklist Completo

### 📝 Para cada nuevo módulo necesitas:

- [ ] **Editor Component** (`/components/editor/[Module]Editor.tsx`)
- [ ] **Integración en EditorLayout** (agregar al sidebar)
- [ ] **Renderizado en EditorPreview** (iframe del editor)
- [ ] **Preview Component** (`/components/preview/Preview[Module].tsx`)
- [ ] **Integración en PreviewPage** (preview real)
- [ ] **Sincronización de Visibilidad** (⚠️ CRÍTICO para componentes estructurales)
  - [ ] Función update en StructuralComponentsContext
  - [ ] Lógica en SectionItem.tsx
  - [ ] Sincronización inicial en StructuralComponentsSync.tsx
- [ ] **Backend API** (si es necesario)
- [ ] **Migración de DB** (si es necesario)
- [ ] **Traducciones i18n** (ES y EN)
- [ ] **Documentación** (implementation y troubleshooting)

---

## Paso 1: Crear el Editor del Módulo

### Ubicación
`/websitebuilder-admin/src/components/editor/[Module]Editor.tsx`

### Plantilla Base Completa con Estilos
```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function [Module]Editor() {
  const { 
    structuralComponents, 
    updateStructuralComponent,
    globalConfig 
  } = useEditorStore();
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [localConfig, setLocalConfig] = useState(() => 
    structuralComponents.[module] || getDefaultConfig()
  );

  // Sincronización con props
  useEffect(() => {
    const newConfig = structuralComponents.[module] || getDefaultConfig();
    if (JSON.stringify(newConfig) !== JSON.stringify(localConfig)) {
      setLocalConfig(newConfig);
    }
  }, [structuralComponents.[module]]);

  // Manejar cambios
  const handleChange = (field: string, value: any) => {
    const updatedConfig = {
      ...localConfig,
      [field]: value
    };
    
    setLocalConfig(updatedConfig);
    updateStructuralComponent('[module]', updatedConfig);
  };

  // Configuración por defecto
  function getDefaultConfig() {
    return {
      enabled: true,
      layout: 'default',
      colorScheme: '1',
      // ... configuración específica del módulo
    };
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      {/* Header colapsable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <span className="font-medium text-gray-900 dark:text-white">
          [Module Name]
        </span>
        {isExpanded ? 
          <ChevronUp className="w-4 h-4 text-gray-500" /> : 
          <ChevronDown className="w-4 h-4 text-gray-500" />
        }
      </button>

      {/* Contenido */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          
          {/* Toggle de habilitado */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Enable [Module]
            </label>
            <button
              onClick={() => handleChange('enabled', !localConfig.enabled)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                localConfig.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                localConfig.enabled ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Layout selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Layout
            </label>
            <div className="flex gap-2">
              {['default', 'compact', 'expanded'].map(layout => (
                <button
                  key={layout}
                  onClick={() => handleChange('layout', layout)}
                  className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors capitalize ${
                    localConfig.layout === layout 
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {layout}
                </button>
              ))}
            </div>
          </div>

          {/* Color scheme selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Color scheme
            </label>
            <select 
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 
                         dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={localConfig.colorScheme}
              onChange={(e) => handleChange('colorScheme', e.target.value)}
            >
              <option value="1">Scheme 1</option>
              <option value="2">Scheme 2</option>
              <option value="3">Scheme 3</option>
              <option value="4">Scheme 4</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Uses the color scheme from global settings
            </p>
          </div>

          {/* Separador de sección */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Advanced Settings
            </h3>
            
            {/* Más controles aquí */}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Reglas Importantes
1. **SIEMPRE** usar `localConfig` para estado local
2. **SIEMPRE** sincronizar con `useEffect`
3. **SIEMPRE** actualizar el store con `updateStructuralComponent`
4. **NUNCA** comparar objetos directamente, usar `JSON.stringify`

---

## Paso 2: Integrar con EditorLayout

### Archivo a modificar
`/websitebuilder-admin/src/components/editor/EditorLayout.tsx`

### Agregar al Sidebar
```typescript
// 1. Importar el componente
import [Module]Editor from './[Module]Editor';

// 2. Agregar en la sección correcta del sidebar
{activeSection === 'structural-components' && (
  <div className="p-4 space-y-4">
    <HeaderEditor />
    <[Module]Editor />  {/* Agregar aquí */}
    <FooterEditor />
    <CartDrawerEditor />
  </div>
)}
```

---

## Paso 3: Agregar al EditorPreview (iframe)

### Archivo a modificar
`/websitebuilder-admin/src/components/editor/EditorPreview.tsx`

### Agregar el renderizado
```typescript
// 1. En la función del componente, obtener la config
const moduleConfig = section.structuralComponents?.[module];

// 2. Agregar el renderizado en el lugar apropiado
{/* Por ejemplo, después del header */}
{moduleConfig?.enabled && (
  <div className="module-container">
    {/* Renderizar el módulo basado en su configuración */}
    {renderModule(moduleConfig)}
  </div>
)}

// 3. Crear función de renderizado
const renderModule = (config: any) => {
  // Aplicar estilos del theme
  const colorScheme = getColorScheme(config.colorScheme);
  
  return (
    <div style={{
      backgroundColor: colorScheme?.background || '#ffffff',
      color: colorScheme?.text || '#000000'
    }}>
      {/* Contenido del módulo */}
    </div>
  );
};
```

---

## Paso 4: Crear el Preview Real

### Ubicación
`/websitebuilder-admin/src/components/preview/Preview[Module].tsx`

### Plantilla Base
```typescript
'use client';

import React from 'react';

interface Preview[Module]Props {
  config: any;
  theme: any;
}

export default function Preview[Module]({ config, theme }: Preview[Module]Props) {
  // Validar configuración
  if (!config?.enabled) {
    return null;
  }

  // Extraer configuración del theme
  const colorScheme = theme?.colorSchemes?.schemes?.[parseInt(config.colorScheme || '1') - 1];
  
  // Aplicar typography si es necesario
  const typographyStyles = theme?.typography?.module ? {
    fontFamily: `'${theme.typography.module.fontFamily}', sans-serif`,
    fontSize: theme.typography.module.fontSize ? 
      `${theme.typography.module.fontSize}px` : '16px',
    // ... más estilos
  } : {};

  // Renderizar el módulo
  return (
    <div 
      className="module-wrapper"
      style={{
        backgroundColor: colorScheme?.background?.default || '#ffffff',
        color: colorScheme?.text?.default || '#000000',
        ...typographyStyles
      }}
    >
      {/* IMPORTANTE: Copiar la lógica de renderizado desde EditorPreview */}
      {/* pero adaptada para datos que vienen del API */}
    </div>
  );
}
```

### Diferencias con EditorPreview
| EditorPreview | Preview Real |
|---------------|--------------|
| Lee del store | Lee de props |
| Cambios instantáneos | Requiere refresh |
| Puede tener estados temporales | Solo estados guardados |
| Acceso a funciones del editor | Solo renderizado |

---

## Paso 5: Integrar con PreviewPage

### Archivo a modificar
`/websitebuilder-admin/src/components/preview/PreviewPage.tsx`

### Pasos de integración
```typescript
// 1. Importar el componente
import Preview[Module] from './Preview[Module]';

// 2. En el JSX, agregar donde corresponda
{structuralComponents?.[module] && (
  <Preview[Module] 
    config={structuralComponents.[module]}
    theme={globalTheme}
  />
)}
```

### Orden de renderizado típico
1. AnnouncementBar
2. Header
3. Content
4. Footer
5. CartDrawer

---

## Paso 6: Sincronización de Visibilidad (CRÍTICO)

### ⚠️ IMPORTANTE: Sincronización con StructuralComponentsContext

Para componentes estructurales (Header, Footer, AnnouncementBar, CartDrawer), la visibilidad debe sincronizarse entre el store y el context para que se guarde correctamente.

#### 1. Agregar función de actualización en StructuralComponentsContext

```typescript
// En StructuralComponentsContext.tsx
interface StructuralComponentsContextType {
  // ... otros campos
  update[Module]ConfigLocal: (config: any) => void;
}

// Implementar la función
const update[Module]ConfigLocal = useCallback((moduleConfig: any) => {
  console.log('[CRITICAL] update[Module]ConfigLocal - Setting hasChanges to TRUE', moduleConfig);
  setHasChanges(true);
  setConfig(prev => ({
    ...prev,
    [module]: moduleConfig
  }));
}, []);
```

#### 2. Actualizar SectionItem.tsx para sincronizar visibilidad

```typescript
// En SectionItem.tsx - handleToggleVisibility
if (section.type === SectionType.[YOUR_MODULE]) {
  // Get current config or create default
  const currentConfig = structuralConfig?.[module] || {
    enabled: true, // o visible: true según el módulo
    // ... configuración por defecto
  };
  
  // Update the visibility/enabled state
  const updatedConfig = {
    ...currentConfig,
    enabled: !section.visible // o visible: !section.visible
  };
  
  console.log('Updating [Module] config:', updatedConfig);
  update[Module]ConfigLocal(updatedConfig);
}
```

#### 3. Agregar sincronización inicial en StructuralComponentsSync.tsx

```typescript
// Sync [Module] visibility on initial load
useEffect(() => {
  if (structuralConfig?.[module] !== undefined) {
    const moduleSection = sections.[groupId].find(
      s => s.type === SectionType.[MODULE]
    );
    
    if (moduleSection) {
      const shouldBeVisible = structuralConfig.[module]?.enabled || false;
      
      if (moduleSection.visible !== shouldBeVisible) {
        console.log('Syncing [Module] visibility:', shouldBeVisible);
        const { toggleSectionVisibility } = useEditorStore.getState();
        toggleSectionVisibility('[groupId]', moduleSection.id);
      }
    }
  }
}, [structuralConfig?.[module]?.enabled]);
```

### ⚠️ Sin esta sincronización, el toggle de visibilidad NO se guardará

**Problema común**: El usuario hace toggle de visibilidad, el botón Guardar se activa, pero al guardar no persiste el cambio.

**Causa**: Solo se actualiza el `useEditorStore` pero no el `StructuralComponentsContext`.

**Solución**: Implementar la sincronización bidireccional como se muestra arriba.

---

## Paso 7: Backend y Persistencia

### Si el módulo necesita datos adicionales

#### 1. Actualizar el Modelo
`/Models/StructuralComponents.cs`
```csharp
public string [Module]Config { get; set; } = "{}";
```

#### 2. Crear Migración
```bash
dotnet ef migrations add Add[Module]Config
dotnet ef database update
```

#### 3. Actualizar el Controller
`/Controllers/StructuralComponentsController.cs`
```csharp
// En el método Update
if (!string.IsNullOrEmpty(dto.[Module]Config))
{
    component.[Module]Config = dto.[Module]Config;
}
```

---

## Paso 7: Testing y Validación

### Checklist de Testing

#### En el Editor
- [ ] El panel de configuración abre/cierra correctamente
- [ ] Los cambios se reflejan instantáneamente en el iframe
- [ ] El botón Save aparece cuando hay cambios
- [ ] Undo/Redo funcionan correctamente
- [ ] Los valores por defecto se aplican correctamente

#### En el Preview Real
- [ ] La configuración se carga correctamente desde DB
- [ ] Los estilos del theme se aplican
- [ ] Typography se aplica si corresponde
- [ ] Responsive funciona en mobile/tablet/desktop
- [ ] Los color schemes se aplican correctamente

#### Sincronización
- [ ] Guardar en editor → Refresh preview → Cambios visibles
- [ ] Sin memory leaks en el editor
- [ ] Sin errores en consola

---

## Estilos y Diseño Visual

### Sistema de Diseño Shopify Polaris

Los editores del Website Builder siguen el sistema de diseño **Shopify Polaris** adaptado:

#### Paleta de Colores
```css
/* Primary Colors */
--primary-blue: #3b82f6;      /* Acciones principales, links */
--primary-blue-hover: #2563eb; /* Hover state */

/* Grays - Light Mode */
--gray-50: #f9fafb;   /* Backgrounds sutiles */
--gray-100: #f3f4f6;  /* Hover backgrounds */
--gray-200: #e5e7eb;  /* Borders, divisores */
--gray-300: #d1d5db;  /* Borders de inputs */
--gray-400: #9ca3af;  /* Placeholder text */
--gray-500: #6b7280;  /* Texto secundario */
--gray-600: #4b5563;  /* Texto de labels */
--gray-700: #374151;  /* Texto principal */
--gray-800: #1f2937;  /* Headings */
--gray-900: #111827;  /* Texto muy importante */
```

#### Tipografía
```css
/* Text Sizes */
text-xs: 0.75rem;   /* 12px - Labels, hints, metadata */
text-sm: 0.875rem;  /* 14px - Body text, inputs */
text-base: 1rem;    /* 16px - Default */
text-lg: 1.125rem;  /* 18px - Títulos de sección */
```

#### Componentes de UI Estándar

##### Input de Texto
```jsx
<input
  type="text"
  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md 
             focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 
             dark:border-gray-600 dark:text-white"
  value={localConfig.field}
  onChange={(e) => handleChange('field', e.target.value)}
  placeholder="Enter value"
/>
```

##### Select/Dropdown
```jsx
<select 
  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md 
             focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 
             dark:border-gray-600 dark:text-white"
  value={localConfig.option}
  onChange={(e) => handleChange('option', e.target.value)}
>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

##### Toggle Switch
```jsx
<button
  onClick={() => handleChange('enabled', !localConfig.enabled)}
  className={`relative inline-flex h-5 w-9 items-center rounded-full 
              transition-colors ${
    localConfig.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
  }`}
>
  <span className={`inline-block h-3.5 w-3.5 transform rounded-full 
                    bg-white transition-transform ${
    localConfig.enabled ? 'translate-x-5' : 'translate-x-1'
  }`} />
</button>
```

##### Grupo de Botones Toggle
```jsx
<div className="flex gap-2">
  {['option1', 'option2', 'option3'].map(option => (
    <button
      key={option}
      onClick={() => handleChange('layout', option)}
      className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
        localConfig.layout === option 
          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
      }`}
    >
      {option}
    </button>
  ))}
</div>
```

##### Slider con Input Numérico
```jsx
<div className="flex items-center gap-3">
  <input
    type="range"
    min="0"
    max="100"
    value={localConfig.size}
    onChange={(e) => handleChange('size', parseInt(e.target.value))}
    className="flex-1"
  />
  <div className="flex items-center gap-1">
    <input
      type="number"
      className="w-14 px-2 py-1 text-sm border border-gray-300 rounded
                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      value={localConfig.size}
      onChange={(e) => handleChange('size', parseInt(e.target.value))}
    />
    <span className="text-xs text-gray-500 dark:text-gray-400">px</span>
  </div>
</div>
```

### Estructura de Campo de Formulario
```jsx
<div>
  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
    Field Label
  </label>
  {/* Input/Select/Control aquí */}
  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
    Help text explaining the field
  </p>
</div>
```

### Sección con Separador
```jsx
<div className="border-t border-gray-200 dark:border-gray-700 pt-4">
  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
    Section Title
  </h3>
  <div className="space-y-3">
    {/* Campos del formulario */}
  </div>
</div>
```

### Espaciados Estándar
- Entre label e input: `mb-1.5` (6px)
- Entre campos: `space-y-3` o `space-y-4`
- Padding de sección: `pt-4` después de border
- Margen de título de sección: `mb-3`
- Padding interno del editor: `px-4 pb-4`

---

## Plantillas de Código

### Configuración Típica de un Módulo
```typescript
interface ModuleConfig {
  enabled: boolean;
  layout?: 'default' | 'compact' | 'expanded';
  colorScheme?: string;
  content?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      id: string;
      text: string;
      link?: string;
    }>;
  };
  animation?: {
    enabled: boolean;
    type: 'fade' | 'slide' | 'none';
    duration: number;
  };
  spacing?: {
    top: number;
    bottom: number;
  };
}
```

### Helper para Color Schemes
```typescript
const getColorScheme = (schemeId: string, theme: any) => {
  const index = parseInt(schemeId || '1') - 1;
  return theme?.colorSchemes?.schemes?.[index];
};
```

### Helper para Typography
```typescript
const getTypographyStyles = (section: string, theme: any) => {
  const typography = theme?.typography?.[section];
  if (!typography) return {};
  
  return {
    fontFamily: `'${typography.fontFamily}', sans-serif`,
    fontSize: typography.fontSize ? 
      (typography.fontSize <= 100 ? 
        `${typography.fontSize}%` : 
        `${typography.fontSize}px`) : '100%',
    fontWeight: typography.fontWeight || '400',
    letterSpacing: `${typography.letterSpacing || 0}px`,
    textTransform: typography.useUppercase ? 'uppercase' : 'none'
  };
};
```

---

## Troubleshooting Común

### Problema: Los cambios no se reflejan en el iframe
**Solución**: Verificar que:
1. `updateStructuralComponent` se llama con el nombre correcto
2. El `useEffect` está sincronizando correctamente
3. No hay errores de tipo en la configuración

### Problema: El preview real no muestra el módulo
**Solución**: Verificar que:
1. El módulo está importado en PreviewPage
2. La configuración tiene `enabled: true`
3. Los datos se están parseando correctamente desde JSONB

### Problema: Los estilos no se aplican
**Solución**: Verificar que:
1. El colorScheme se está extrayendo correctamente
2. Los estilos inline tienen la sintaxis correcta
3. No hay conflictos con Tailwind classes

### Problema: Typography no funciona
**Solución**: Usar la función helper y verificar que:
1. El theme incluye la sección de typography
2. Los nombres de las propiedades coinciden
3. Se está aplicando el objeto de estilos completo

---

## Ejemplo Completo Real: AnnouncementBar

### 1. AnnouncementBarEditor.tsx (pendiente de crear)
```typescript
export default function AnnouncementBarEditor() {
  // ... configuración para múltiples anuncios
  // ... selector de animación
  // ... configuración de velocidad
  // ... selector de color scheme
}
```

### 2. Sincronización de Visibilidad (IMPLEMENTADO)

#### En StructuralComponentsContext.tsx:
```typescript
const updateAnnouncementBarConfigLocal = useCallback((announcementBarConfig: any) => {
  console.log('[CRITICAL] updateAnnouncementBarConfigLocal - Setting hasChanges to TRUE');
  setHasChanges(true);
  setConfig(prev => ({
    ...prev,
    announcementBar: announcementBarConfig
  }));
}, []);
```

#### En SectionItem.tsx:
```typescript
if (section.type === SectionType.ANNOUNCEMENT_BAR) {
  const currentConfig = structuralConfig?.announcementBar || {
    enabled: false,
    messages: [],
    animation: 'slide',
    speed: 5000,
    colorScheme: '1'
  };
  
  const updatedConfig = {
    ...currentConfig,
    enabled: !section.visible
  };
  
  updateAnnouncementBarConfigLocal(updatedConfig);
}
```

#### En StructuralComponentsSync.tsx:
```typescript
useEffect(() => {
  if (structuralConfig?.announcementBar !== undefined) {
    const announcementSection = sections.headerGroup.find(
      s => s.type === SectionType.ANNOUNCEMENT_BAR
    );
    
    if (announcementSection) {
      const shouldBeVisible = structuralConfig.announcementBar?.enabled || false;
      
      if (announcementSection.visible !== shouldBeVisible) {
        const { toggleSectionVisibility } = useEditorStore.getState();
        toggleSectionVisibility('headerGroup', announcementSection.id);
      }
    }
  }
}, [structuralConfig?.announcementBar?.enabled]);
```

### 3. PreviewAnnouncementBar.tsx (pendiente)
```typescript
export default function PreviewAnnouncementBar({ config, theme }) {
  // Implementar preview real
}
```

### 4. En PreviewPage.tsx (pendiente)
```typescript
<PreviewAnnouncementBar 
  config={structuralComponents.announcementBar}
  theme={globalTheme}
/>
```

---

## Notas Importantes

1. **Mantener Consistencia**: El preview real debe verse EXACTAMENTE igual que el iframe
2. **Performance**: No re-renderizar innecesariamente, usar `useMemo` cuando sea apropiado
3. **Validación**: Siempre validar que la configuración existe antes de usarla
4. **Defaults**: Siempre tener valores por defecto sensatos
5. **Documentación**: Actualizar esta guía si encuentras nuevos patterns

---

## Ejemplos de Editores Complejos

### Editor con Lista de Items Dinámicos
```typescript
const handleAddItem = () => {
  const newItem = {
    id: Date.now().toString(),
    text: '',
    link: ''
  };
  handleChange('items', [...(localConfig.items || []), newItem]);
};

const handleRemoveItem = (id: string) => {
  handleChange('items', localConfig.items.filter((item: any) => item.id !== id));
};

const handleUpdateItem = (id: string, field: string, value: string) => {
  const updatedItems = localConfig.items.map((item: any) => 
    item.id === id ? { ...item, [field]: value } : item
  );
  handleChange('items', updatedItems);
};

// En el render:
<div className="space-y-2">
  {localConfig.items?.map((item: any) => (
    <div key={item.id} className="flex gap-2">
      <input
        type="text"
        className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md
                   focus:outline-none focus:ring-1 focus:ring-blue-500
                   dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        value={item.text}
        onChange={(e) => handleUpdateItem(item.id, 'text', e.target.value)}
        placeholder="Item text"
      />
      <button
        onClick={() => handleRemoveItem(item.id)}
        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded
                   hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
      >
        Remove
      </button>
    </div>
  ))}
  <button
    onClick={handleAddItem}
    className="w-full px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md
               hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300
               dark:hover:bg-gray-700 transition-colors"
  >
    + Add Item
  </button>
</div>
```

### Editor con Preview de Imagen
```typescript
<div>
  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
    Logo
  </label>
  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 
                  bg-gray-50 dark:bg-gray-800">
    {localConfig.logoUrl ? (
      <div className="flex items-center justify-between">
        <img 
          src={localConfig.logoUrl} 
          alt="Preview" 
          className="h-12 object-contain" 
        />
        <button 
          onClick={() => handleChange('logoUrl', '')}
          className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded 
                     hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
        >
          Remove
        </button>
      </div>
    ) : (
      <button 
        onClick={() => {/* Open media library */}}
        className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 
                   dark:text-gray-400 dark:hover:text-gray-200"
      >
        Select image
      </button>
    )}
  </div>
</div>
```

---

## Actualización de la Guía

Esta guía debe actualizarse cuando:
- Se descubra un nuevo patrón útil
- Se encuentre una mejor forma de hacer algo
- Se agreguen nuevos tipos de configuración
- Se resuelvan problemas comunes
- Se actualicen los estilos del sistema de diseño

**Referencias:**
- [Setup Designs Guide](../setupdesigns.md) - Sistema de diseño completo
- [Website Builder Architecture](./WEBSITE-BUILDER-ARCHITECTURE.md) - Flujo de datos
- [Website Builder Troubleshooting](./WEBSITE-BUILDER-TROUBLESHOOTING.md) - Problemas comunes

Última actualización: 2025-01-14
Versión: 1.1