# Comando /nuevo-modulo - Crear Nueva Sección del Template

Crear una nueva sección del template para el Website Builder con el flujo completo de implementación.

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

### PASO 2: GENERAR ESTRUCTURA BASE (AUTOMÁTICO)
Ejecutar automáticamente el script desde el directorio del proyecto:

```bash
cd "/mnt/c/Users/hp/Documents/Visual Studio 2022/Projects/WebsiteBuilderAPI"

# Determinar si tiene hijos
if [ "$WITH_CHILDREN" = "sí" ]; then
  echo "🚀 Generando módulo $MODULE_NAME con soporte para hijos..."
  echo "s" | ./create-template-section.sh $MODULE_NAME --with-children
else
  echo "🚀 Generando módulo $MODULE_NAME..."
  echo "s" | ./create-template-section.sh $MODULE_NAME
fi
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

### PASO 4: ANÁLISIS Y CONFIRMACIÓN
Después de recibir los screenshots, presentar análisis:

```
📋 ELEMENTOS IDENTIFICADOS EN [MODULE]:

Configuración del PADRE:
✓ [Campo identificado 1]
✓ [Campo identificado 2]
✓ Color scheme selector (si aplica)
✓ [Otros campos...]

Configuración del HIJO (si aplica):
✓ [Campo del hijo 1]
✓ [Campo del hijo 2]
✓ [Otros campos...]

Estructura del Editor:
✓ [Comportamiento identificado]
✓ [UI elements identificados]

¿Es correcto este análisis? (S/N)
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
- Agregar todos los campos de configuración identificados
- Implementar selector de color scheme:
```typescript
const { config: themeConfig } = useThemeConfigStore();
<select value={localConfig.colorScheme}>
  {themeConfig?.colorSchemes?.schemes?.map((scheme, index) => (
    <option value={String(index + 1)}>{scheme.name}</option>
  ))}
</select>
```

#### 6.3 Implementar Preview
- Aplicar color scheme seleccionado
- Aplicar typography mapeada
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

#### 7.4 Integrar Preview en PreviewPage
```typescript
{pageConfig?.[module_lower] && (
  <Preview[Module]
    config={pageConfig.[module_lower]}
    theme={globalTheme}
    deviceView={editorDeviceView}
    isEditor={false}
  />
)}
```

#### 7.5 Si tiene hijos, integrar en EditorSidebarWithDnD
```typescript
{section.type === SectionType.[MODULE_UPPER] && (
  <[Module]Children section={section} groupId={group.id} />
)}
```

### PASO 8: VERIFICACIÓN AUTOMÁTICA
```bash
echo "\n🔍 Ejecutando verificaciones..."

# Cambiar al directorio del frontend
cd websitebuilder-admin

# Verificar compilación TypeScript
echo "Verificando tipos TypeScript..."
npm run type-check

if [ $? -eq 0 ]; then
  echo "✅ Compilación TypeScript exitosa"
else
  echo "❌ Error en compilación TypeScript"
  echo "Por favor revisa los errores arriba"
fi

# Volver al directorio principal
cd ..
```

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
  ✓ Preview[Module].tsx - Preview unificado
  ✓ types.ts - Tipos actualizados
  [Si aplica:]
  ✓ [Module]Children.tsx - Gestión de bloques
  ✓ [Module]ItemEditor.tsx - Editor de items

🎨 Configuraciones:
  ✓ Color Schemes: [Integrado/No aplica]
  ✓ Typography: [X] campos mapeados
  ✓ Drag & Drop: [Configurado/No aplica]

🔧 Integraciones:
  ✓ SectionType enum actualizado
  ✓ EditorLayout integrado
  ✓ EditorPreview integrado
  ✓ PreviewPage integrado
  [Si aplica:]
  ✓ EditorSidebarWithDnD integrado

📊 Estado: Listo para usar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Siguiente paso: Agregar sección desde el editor
```

## 🔴 RECORDATORIOS CRÍTICOS

### Para módulos con hijos:
1. **Botón "Add block"** SIEMPRE azul (text-blue-600)
2. **Flecha de regreso** va al sidebar (selectSection(null))
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