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

## CONFIRMACIÓN FINAL
Al terminar, mostrar:
```
🎉 Módulo [Nombre] generado exitosamente!

✅ Archivos creados:
- types.ts
- Preview[Module].tsx
- [Module]Editor.tsx
- [Module]Children.tsx (si aplica)

✅ Integraciones actualizadas
✅ Traducciones agregadas

📝 Próximos pasos:
1. Verificar que los controles funcionan
2. Ajustar estilos si es necesario
3. Probar responsive
```