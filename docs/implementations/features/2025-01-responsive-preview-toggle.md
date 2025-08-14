# Implementación: Toggle de Vista Responsiva Desktop/Móvil

## 📅 Información General
- **Fecha**: 14 de enero 2025
- **Duración**: 30 minutos
- **Categoría**: features
- **Estado**: ✅ Completado

## 📋 Resumen
Implementación de la funcionalidad de toggle entre vista desktop y móvil en el editor del Website Builder, permitiendo previsualizar en tiempo real cómo se ve el sitio en diferentes dispositivos.

## 🎯 Objetivos
- Activar los iconos de dispositivo en la barra superior del editor
- Permitir cambio entre vista desktop (ancho completo) y móvil (375px)
- Mantener el contenido sincronizado entre ambas vistas
- No afectar ningún estado ni configuración del sistema

## 🏗️ Arquitectura

### Componentes Modificados
1. **`/app/editor/page.tsx`** - Página principal del editor
2. **`/components/editor/EditorLayout.tsx`** - Layout del editor
3. **`/components/editor/EditorPreview.tsx`** - Componente de preview

### Flujo de Datos
```
EditorPage (controla estado deviceView)
    ↓ prop
EditorLayout (pasa el prop)
    ↓ prop  
EditorPreview (aplica el ancho según deviceView)
```

## 💻 Implementación

### 1. Estado en EditorPage (`/app/editor/page.tsx`)

```typescript
// Añadido estado para controlar vista de dispositivo
const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
```

### 2. Botones de Toggle

```typescript
{/* Device Preview Icons */}
<div className="flex items-center gap-1 ml-2">
  <button 
    onClick={() => setDeviceView('desktop')}
    className={`p-1.5 rounded transition-colors ${
      deviceView === 'desktop' 
        ? 'bg-gray-200' 
        : 'hover:bg-gray-100'
    }`} 
    title={t('editor.toolbar.desktop', 'Escritorio')}
  >
    <Monitor className={`w-4 h-4 ${
      deviceView === 'desktop' ? 'text-gray-900' : 'text-gray-600'
    }`} />
  </button>
  
  {/* Tablet button hidden as requested */}
  
  <button 
    onClick={() => setDeviceView('mobile')}
    className={`p-1.5 rounded transition-colors ${
      deviceView === 'mobile' 
        ? 'bg-gray-200' 
        : 'hover:bg-gray-100'
    }`} 
    title={t('editor.toolbar.mobile', 'Móvil')}
  >
    <Smartphone className={`w-4 h-4 ${
      deviceView === 'mobile' ? 'text-gray-900' : 'text-gray-600'
    }`} />
  </button>
</div>
```

### 3. Paso de Props

```typescript
// EditorPage -> EditorLayout
<EditorLayout deviceView={deviceView} />

// EditorLayout -> EditorPreview  
interface EditorLayoutProps {
  deviceView?: 'desktop' | 'mobile';
}

export function EditorLayout({ deviceView = 'desktop' }: EditorLayoutProps) {
  return (
    <EditorPreview deviceView={deviceView} />
  );
}
```

### 4. Aplicación del Ancho en Preview

```typescript
// EditorPreview.tsx
const getPreviewWidth = () => {
  switch (deviceView) {
    case 'mobile':
      return 'w-[375px]';  // iPhone width
    case 'tablet':
      return 'w-[768px]';  // iPad width (oculto)
    default:
      return 'w-full';     // Desktop full width
  }
};

// Aplicado en el contenedor
<div className={`bg-white ${getPreviewWidth()} min-h-full shadow-lg`}>
```

## 🐛 Problemas Resueltos

### Problema 1: Fondo en Logo Móvil
**Síntoma**: El logo mostraba un fondo extraño en modo móvil

**Causa**: Clases Tailwind con media queries (`sm:hidden`, `hidden sm:block`) conflictuaban con control JavaScript

**Solución**: 
- Removidas todas las clases de media queries
- Control de visibilidad completamente por JavaScript con `display: none/block`
- Eliminados conflictos entre CSS y JavaScript

```typescript
// Antes (INCORRECTO)
className="sm:hidden"  // Media query CSS

// Después (CORRECTO)  
style={{ display: deviceView === 'mobile' ? 'block' : 'none' }}  // Control JS
```

## ✅ Características Implementadas

1. **Toggle Visual Claro**
   - Botón activo con fondo gris (`bg-gray-200`)
   - Iconos cambian de color cuando están activos
   - Transiciones suaves

2. **Viewport Responsivo**
   - Desktop: Ancho completo (`w-full`)
   - Móvil: 375px (tamaño iPhone estándar)
   - Preview centrado con sombra

3. **Sin Efectos Secundarios**
   - No modifica configuraciones
   - No afecta el estado `isDirty`
   - No interfiere con el sistema de guardado
   - Solo cambia la visualización

## 🎨 UI/UX

- Iconos consistentes con Lucide React (Monitor, Smartphone)
- Estados hover y active claramente diferenciados
- Tooltips en español/inglés según i18n
- Botón de tablet oculto según requerimiento

## 🔧 Configuración

### Viewports Disponibles
```typescript
type DeviceView = 'desktop' | 'mobile';  // tablet removido

// Anchos configurados
desktop: 'w-full'    // 100% del contenedor
mobile: 'w-[375px]'  // iPhone standard
```

## 📊 Impacto

### Performance
- ✅ Sin re-renders innecesarios
- ✅ Solo cambia CSS width
- ✅ No recarga el contenido

### Mantenibilidad  
- ✅ Código simple y directo
- ✅ Fácil agregar más viewports
- ✅ Separación clara de responsabilidades

## 🚀 Uso

1. Click en icono **Monitor** → Vista desktop
2. Click en icono **Smartphone** → Vista móvil (375px)
3. El contenido se adapta automáticamente
4. Los cambios en el editor se reflejan en ambas vistas

## 📝 Notas Técnicas

### Decisiones de Diseño
1. **Estado en EditorPage**: Centralizado para fácil acceso
2. **Props vs Context**: Props por simplicidad (solo 2 niveles)
3. **CSS vs JS**: Control por JS para evitar conflictos
4. **Sin tablet**: Según requerimiento del usuario

### Compatibilidad
- ✅ Compatible con todos los componentes del editor
- ✅ Funciona con Header drawer y todos los layouts
- ✅ Respeta el sistema de colorSchemes
- ✅ Compatible con sistema undo/redo

## 🔗 Referencias
- Inspiración: Editor de Shopify
- Imagen de referencia: `/Test Images/Responsiveness Icon/image.png`
- Arquitectura del sistema: `/docs/WEBSITE-BUILDER-ARCHITECTURE.md`

## 📌 Keywords
responsive, preview, mobile, desktop, viewport, toggle, editor, website-builder

---

**Autor**: Claude Code
**Revisado**: 14 enero 2025
**Versión**: 1.0.0