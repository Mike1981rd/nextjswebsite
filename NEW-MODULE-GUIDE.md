# 🚀 GUÍA RÁPIDA: CREAR NUEVO MÓDULO

## ⚠️ IMPORTANTE: EditorPreview.tsx está CONGELADO
**NO agregar más código a EditorPreview.tsx (839 líneas actuales)**

## ✅ PASOS PARA CREAR UN NUEVO MÓDULO

### 1. Validar antes de empezar
```bash
./validate-module.sh websitebuilder-admin/src/components/editor/EditorPreview.tsx
# Resultado esperado: ❌ ERROR - usar modules/
```

### 2. Crear estructura del módulo
```bash
# Ejemplo: Crear módulo Gallery
MODULE_NAME="Gallery"
cd websitebuilder-admin/src/components/editor

# Crear carpeta del módulo
mkdir -p modules/$MODULE_NAME

# Crear archivos base
touch modules/$MODULE_NAME/${MODULE_NAME}Editor.tsx
touch modules/$MODULE_NAME/${MODULE_NAME}Preview.tsx
touch modules/$MODULE_NAME/${MODULE_NAME}Config.tsx
touch modules/$MODULE_NAME/${MODULE_NAME}Types.ts
touch modules/$MODULE_NAME/index.ts
```

### 3. Estructura de archivos

#### `GalleryTypes.ts` (máx 100 líneas)
```typescript
export interface GallerySettings {
  images: GalleryImage[];
  layout: 'grid' | 'carousel' | 'masonry';
  columns: number;
  spacing: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}
```

#### `GalleryEditor.tsx` (máx 300 líneas)
```typescript
/**
 * @file GalleryEditor.tsx
 * @max-lines 300
 * @module Gallery
 * @created 2025-01-15
 */

import React from 'react';
import { GallerySettings } from './GalleryTypes';

interface GalleryEditorProps {
  settings: GallerySettings;
  onChange: (settings: GallerySettings) => void;
}

export const GalleryEditor: React.FC<GalleryEditorProps> = ({
  settings,
  onChange
}) => {
  // Lógica del editor aquí (máx 280 líneas)
  return <div>Editor UI</div>;
};
```

#### `GalleryPreview.tsx` (máx 300 líneas)
```typescript
/**
 * @file GalleryPreview.tsx
 * @max-lines 300
 * @module Gallery
 */

import React from 'react';
import { GallerySettings } from './GalleryTypes';

interface GalleryPreviewProps {
  settings: GallerySettings;
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({
  settings
}) => {
  // Renderizado del preview (máx 280 líneas)
  return <div>Preview</div>;
};
```

#### `index.ts` (exportaciones)
```typescript
export * from './GalleryEditor';
export * from './GalleryPreview';
export * from './GalleryConfig';
export * from './GalleryTypes';
```

### 4. Integración con el sistema

#### En `EditorPreview.tsx` - NO HACER ESTO ❌
```typescript
// ❌ INCORRECTO - No agregar más imports a EditorPreview.tsx
import { GalleryPreview } from './modules/Gallery';
```

#### En su lugar, usar el sistema modular ✅
```typescript
// ✅ CORRECTO - Crear un componente Registry
// components/editor/modules/ModuleRegistry.tsx
export const moduleComponents = {
  gallery: () => import('./Gallery'),
  testimonials: () => import('./Testimonials'),
  // etc...
};
```

### 5. Validación continua

Antes de cada modificación:
```bash
./validate-module.sh [archivo]
```

### 📊 Límites por archivo

| Tipo de Archivo | Líneas Máx | Alerta en |
|----------------|------------|-----------|
| Editor.tsx     | 300        | 250       |
| Preview.tsx    | 300        | 250       |
| Config.tsx     | 300        | 250       |
| Types.ts       | 100        | 80        |
| index.ts       | 20         | N/A       |

### 🎯 Checklist antes de codear

- [ ] ¿Ejecuté `validate-module.sh`?
- [ ] ¿Creé la carpeta en `/modules/`?
- [ ] ¿Separé editor, preview y config?
- [ ] ¿Los tipos están en archivo separado?
- [ ] ¿Cada archivo tiene el header de validación?
- [ ] ¿Ningún archivo excederá 300 líneas?

### 🚫 Lo que NO hacer

1. **NO** modificar EditorPreview.tsx
2. **NO** crear archivos de más de 300 líneas
3. **NO** mezclar lógica de editor y preview
4. **NO** poner todo en un solo archivo
5. **NO** ignorar las alertas del validador

### 💡 Comando rápido para nuevo módulo

```bash
#!/bin/bash
# create-module.sh
MODULE=$1
cd websitebuilder-admin/src/components/editor
mkdir -p modules/$MODULE
cd modules/$MODULE

cat > ${MODULE}Types.ts << 'EOF'
/**
 * @file ${MODULE}Types.ts
 * @max-lines 100
 */
export interface ${MODULE}Settings {
  // TODO: Define settings
}
EOF

cat > ${MODULE}Editor.tsx << 'EOF'
/**
 * @file ${MODULE}Editor.tsx
 * @max-lines 300
 */
import React from 'react';
import { ${MODULE}Settings } from './${MODULE}Types';

export const ${MODULE}Editor: React.FC = () => {
  return <div>${MODULE} Editor</div>;
};
EOF

cat > ${MODULE}Preview.tsx << 'EOF'
/**
 * @file ${MODULE}Preview.tsx
 * @max-lines 300
 */
import React from 'react';
import { ${MODULE}Settings } from './${MODULE}Types';

export const ${MODULE}Preview: React.FC = () => {
  return <div>${MODULE} Preview</div>;
};
EOF

cat > index.ts << 'EOF'
export * from './${MODULE}Editor';
export * from './${MODULE}Preview';
export * from './${MODULE}Types';
EOF

echo "✅ Módulo $MODULE creado en modules/$MODULE/"
```

---
**Recuerda:** El objetivo es mantener el código modular, limpio y mantenible. 
**Nunca** sacrifiques estas reglas por "rapidez".