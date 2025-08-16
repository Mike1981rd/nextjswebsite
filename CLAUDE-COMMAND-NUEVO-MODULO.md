# 🤖 COMANDO `/nuevo-modulo` - CONFIGURACIÓN PARA SECCIONES DEL TEMPLATE

## ⚠️ IMPORTANTE
Este comando es **EXCLUSIVAMENTE para secciones del template** (Hero, Gallery, Testimonials, etc.)
- ✅ Multi-instancia: Se pueden agregar múltiples veces en una página
- ✅ Funcionan en TODAS las páginas (Home, Product, Collection, etc.)
- ✅ Se guardan con el botón Save de la página
- ✅ Usan `updateSectionSettings()` del store

## ACTIVACIÓN
Cuando el usuario escriba `/nuevo-modulo`, sigue este flujo EXACTO.

## FLUJO PASO A PASO

### 🎯 FASE 1: CLASIFICACIÓN
```
PREGUNTAR: "🔷 ¿La sección tiene hijos/items? (sí/no)
Ejemplo: Gallery tiene items, Hero no tiene"
ESPERAR respuesta

CONFIRMAR: "✅ Entendido. Creando sección del template [con/sin] hijos"
```

### 📋 FASE 2: CONFIGURACIÓN PADRE
```
PREGUNTAR: "🔷 Dame el screenshot o descripción de la vista de configuración del módulo padre"
ESPERAR respuesta

ANALIZAR y MOSTRAR tabla:
┌─────────────────────────────────────────┐
│ CAMPO           │ TIPO      │ TYPOGRAPHY │
├─────────────────────────────────────────┤
│ [campos identificados]                   │
└─────────────────────────────────────────┘

PREGUNTAR: "¿Es correcto? (sí/corrige: [detalles])"
ESPERAR confirmación
```

### 👶 FASE 3: HIJOS (solo si aplica)
```
PREGUNTAR: "🔷 Dame el screenshot o descripción de la configuración de cada hijo/item"
ESPERAR respuesta

ANALIZAR y MOSTRAR tabla de campos del hijo
ESPERAR confirmación
```

### 🎨 FASE 4: PREVIEW
```
PREGUNTAR: "🔷 ¿Cómo debe verse estructuralmente en el preview?
- Desktop: [descripción o screenshot]
- Mobile: [descripción o screenshot]"
ESPERAR respuesta

CONFIRMAR entendimiento
ESPERAR aprobación
```

### ⚙️ FASE 5: GENERAR

Crear automáticamente:

#### 1. TYPES
```typescript
// /components/editor/modules/[Module]/types.ts
export interface [Module]Config {
  // Campos identificados
  colorScheme: '1' | '2' | '3' | '4' | '5';
  // ... resto de campos
}

export interface [Module]ItemConfig {
  // Si tiene hijos
}
```

#### 2. PREVIEW
```typescript
// /components/preview/Preview[Module].tsx
- Implementar theme dual (theme || store)
- Aplicar colorScheme
- Mapear typography correctamente
- Responsive desktop/mobile
```

#### 3. EDITOR
```typescript
// /components/editor/modules/[Module]/[Module]Editor.tsx
- Todos los controles identificados
- SIEMPRE usar updateSectionSettings (es sección del template)
- Multi-instancia habilitado
```

#### 4. CHILDREN (si aplica)
```typescript
// /components/editor/modules/[Module]/[Module]Children.tsx
- Botón azul "Agregar [item]" al inicio
- Lista con drag & drop
- Botones de visibilidad y eliminar
```

#### 5. INTEGRACIONES
- Agregar a SECTION_CONFIGS con category: 'template'
- Agregar a AddSectionModal.tsx para que aparezca en "Agregar sección"
- Agregar caso en PreviewContent.tsx
- Agregar caso en EditorPreview.tsx
- Agregar caso en ConfigPanel.tsx (padre y si tiene hijos)
- Si tiene hijos, actualizar SectionItem.tsx:
  ```typescript
  // Agregar al check de canHaveChildren
  const canHaveChildren = section.type === SectionType.SLIDESHOW || 
                          section.type === SectionType.[NUEVO_MODULO];
  ```

#### 6. TRADUCCIONES
```json
// es.json y en.json
{
  "moduleName": {
    "title": "...",
    "fields": { ... }
  }
}
```

## MAPEO DE TYPOGRAPHY

| Detectado | → Mapear a |
|-----------|------------|
| heading, title, headline | typography.headings |
| subheading, subtitle | typography.body |
| body, text, description | typography.body |
| button, cta | typography.buttons |
| menu, nav | typography.menus |

## ELEMENTOS AUTOMÁTICOS

SIEMPRE incluir:
- Color Scheme selector (1-5)
- Width selector (screen/page/large/medium)
- Spacing controls (padding top/bottom)
- Responsive config
- Theme dual pattern

## REGLAS CRÍTICAS

1. **SOLO Secciones del Template**:
   - SIEMPRE usar `updateSectionSettings()`
   - NUNCA usar API de structural-components
   - Multi-instancia habilitado por defecto

2. **Preview SIEMPRE con theme dual**:
   ```typescript
   const themeConfig = theme || useThemeConfigStore(state => state.config);
   ```

3. **Hijos con botón AZUL al inicio**:
   ```typescript
   className="text-blue-600 hover:bg-blue-50"
   ```

4. **Archivos < 300 líneas** - dividir si es necesario

5. **NO modificar** sistemas existentes que funcionan

## ESTRUCTURA PARA MÓDULOS CON HIJOS

Si el módulo tiene hijos, el sidebar debe mostrar:
```
▼ [NombreMódulo]
  └─ [Hijo 1]
  └─ [Hijo 2]
  └─ [+ Agregar bloque] (botón azul)
```

Para lograrlo:

1. **SectionItem.tsx** detecta automáticamente con `canHaveChildren`
2. **ConfigPanel.tsx** maneja la navegación a hijos con IDs especiales: `sectionId:child:childId`
3. **[Module]Children.tsx** gestiona el agregar/eliminar/reordenar
4. **[Module]ChildEditor.tsx** edita cada hijo individualmente

## 🚨 ERRORES COMUNES A EVITAR (Lecciones del Slideshow)

### ❌ Error 1: Módulo no persiste
**SOLUCIÓN IMPLEMENTADA**: 
- El savePage() ya guarda en localStorage automáticamente
- VERIFICAR que el módulo está en `sections.template`

### ❌ Error 2: Hijos sin Drag & Drop
**SOLUCIÓN IMPLEMENTADA**:
- [Module]Children.tsx DEBE incluir DndContext completo
- Integrar en EditorSidebarWithDnD.tsx

### ❌ Error 3: Click en hijo no abre configuración
**PASOS CRÍTICOS**:
1. En [Module]Children usar ID especial: `${section.id}:child:${childId}`
2. En EditorSidebarWithDnD agregar sección virtual
3. En ConfigPanel detectar con `selectedSectionId?.includes(':child:')`

### ❌ Error 4: Navegación incorrecta
**EN [Child]Editor.tsx**:
```typescript
const handleBack = () => {
  selectSection(null); // AL SIDEBAR, NO AL PADRE
};
```

### ❌ Error 5: UI incorrecta de hijos
**ESTILO CORRECTO**:
- SIN fondos azules de selección
- CON chevron de indentación
- Hover gris simple
- Drag handle oculto por defecto

## INTEGRACIONES CRÍTICAS PARA HIJOS

### En EditorSidebarWithDnD.tsx:
```typescript
// 1. Importar Children
import [Module]Children from './modules/[Module]/[Module]Children';

// 2. Renderizar después del section (línea ~220)
{section.type === SectionType.[MODULE] && section.visible && (
  <[Module]Children section={section} groupId={group.id} />
)}

// 3. Agregar sección virtual (línea ~120)
if (!selectedSection && selectedSectionId?.includes(':child:')) {
  const [sectionId] = selectedSectionId.split(':child:');
  const parentSection = Object.values(sections).flat().find(s => s.id === sectionId);
  
  if (parentSection?.type === SectionType.[MODULE]) {
    selectedSection = {
      id: selectedSectionId,
      type: '[MODULE]_CHILD' as any,
      name: '[Module] Child',
      visible: true,
      settings: parentSection?.settings || {},
      sortOrder: 0
    } as any;
  }
}
```

### En ConfigPanel.tsx:
```typescript
// 1. Importar editor hijo
import [Module]ChildEditor from './modules/[Module]/[Module]ChildEditor';

// 2. Detectar hijo (después de línea ~40)
const is[Module]Child = selectedSectionId?.includes(':child:') && 
  section.type === SectionType.[MODULE];

// 3. Renderizar editor hijo (después de línea ~110)
if (is[Module]Child) {
  const sectionId = selectedSectionId.split(':child:')[0];
  const childId = selectedSectionId.split(':child:')[1];
  if (sectionId && childId) {
    return <[Module]ChildEditor sectionId={sectionId} childId={childId} />;
  }
}
```

## CONFIRMACIÓN FINAL
Al terminar, mostrar:
```
🎉 Módulo [Nombre] generado exitosamente!

✅ Archivos creados:
- types.ts
- Preview[Module].tsx
- [Module]Editor.tsx
- [Module]Children.tsx (si aplica)
- [Module]ChildEditor.tsx (si aplica)

✅ Integraciones actualizadas:
- SECTION_CONFIGS ✓
- AddSectionModal ✓
- PreviewContent ✓
- EditorPreview ✓
- ConfigPanel ✓
- EditorSidebarWithDnD (si tiene hijos) ✓
- SectionItem (si tiene hijos) ✓

✅ Traducciones agregadas

⚠️ VERIFICACIÓN DE ERRORES COMUNES:
- [ ] Persistencia: Verificar que guarda al cambiar de página
- [ ] Drag & Drop: Los hijos se pueden reordenar
- [ ] Click en hijos: Abre el editor correcto
- [ ] Navegación: Flecha vuelve al sidebar principal
- [ ] UI: Sin fondos azules, con indentación correcta

📝 Próximos pasos:
1. Verificar que los controles funcionan
2. Probar que persiste al cambiar de página
3. Si tiene hijos, verificar drag & drop
4. Confirmar navegación correcta
```