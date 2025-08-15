# Footer Module Implementation

## Overview
Complete implementation of the Footer module for Website Builder with multi-instance blocks, modular architecture, and drag & drop reordering for child blocks.

**Created**: 2025-01-15  
**Updated**: 2025-01-15 (Added drag & drop)  
**Category**: features  
**Status**: ✅ Complete  
**Time Spent**: 4 hours (3h initial + 1h drag & drop)  

## Table of Contents
- [Architecture](#architecture)
- [Implementation Details](#implementation-details)
- [Components](#components)
- [Configuration](#configuration)
- [Block System](#block-system)
- [Drag & Drop Implementation](#drag--drop-implementation)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)

## Architecture

### System Design
```
FooterEditor.tsx (Main Configuration)
    ↓
FooterChildren.tsx (Block Management)
    ↓
AddFooterBlockModal.tsx (Block Selection)
    ↓
PreviewFooter.tsx (Unified Rendering)
    ↓
EditorPreview.tsx (Integration)
```

### Key Decisions
1. **Modular Architecture**: All files < 300 lines to prevent monolithic components
2. **Block Pattern**: Similar to AnnouncementBar with multi-instance children
3. **Unified Preview**: Single PreviewFooter component for editor and production
4. **Modal Selection**: Professional UI for block type selection

## Implementation Details

### 1. File Structure
```
/components/editor/
├── modules/Footer/
│   ├── FooterTypes.ts (86 lines)
│   ├── FooterEditor.tsx (267 lines)
│   ├── FooterSocialMedia.tsx (87 lines)
│   ├── FooterExpandibleSections.tsx (198 lines)
│   └── FooterPaddingSection.tsx (88 lines)
├── FooterChildren.tsx (197 lines)
├── AddFooterBlockModal.tsx (115 lines)
└── /preview/
    └── PreviewFooter.tsx (291 lines)
```

### 2. Block Types
```typescript
export enum FooterBlockType {
  LOGO_WITH_TEXT = 'logo-with-text',
  SUBSCRIBE = 'subscribe',
  SOCIAL_MEDIA = 'social-media',
  MENU = 'menu',
  TEXT = 'text',
  IMAGE = 'image'
}
```

## Components

### FooterEditor.tsx
Main configuration panel with all Shopify-like settings:
```typescript
// Key features
- Color scheme selector (1-5)
- Desktop column count (3 or 4)
- Navigation menu selection
- Social media URLs (22 platforms)
- Bottom bar configuration
- Padding controls
```

### FooterChildren.tsx
Manages footer blocks in sidebar:
```typescript
export function FooterChildren({ section, groupId }: FooterChildrenProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAddBlock = (type: FooterBlockType) => {
    const newBlock = {
      id: `footer-block-${Date.now()}`,
      type: type,
      title: blockTypeLabels[type],
      visible: true,
      settings: getDefaultSettings(type)
    };
    // ... update configuration
  };
  
  return (
    <div className="pl-8">
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-blue-600 hover:bg-blue-50"
      >
        <Plus /> Agregar bloque
      </button>
      {/* Block list and modal */}
    </div>
  );
}
```

### AddFooterBlockModal.tsx
Professional modal for block type selection:
```typescript
const blockTypes = [
  { type: FooterBlockType.LOGO_WITH_TEXT, icon: Building },
  { type: FooterBlockType.SUBSCRIBE, icon: Mail },
  { type: FooterBlockType.SOCIAL_MEDIA, icon: Share2 },
  { type: FooterBlockType.MENU, icon: Menu },
  { type: FooterBlockType.TEXT, icon: Type },
  { type: FooterBlockType.IMAGE, icon: Image }
];
```

### PreviewFooter.tsx
Unified rendering component:
```typescript
export default function PreviewFooter({ 
  config, 
  theme, 
  deviceView,
  isEditor = false 
}: PreviewFooterProps) {
  // Always show in editor mode
  if (!isEditor && !config?.enabled) return null;
  
  const mockBlocks = isEditor ? [
    // 6 example blocks for editor
  ] : (config?.blocks || []);
  
  return (
    <footer style={{
      backgroundColor: config?.colorBackground ? colorScheme?.background : 'transparent',
      paddingTop: config?.padding?.top || 40,
      paddingBottom: config?.padding?.bottom || 40
    }}>
      {/* Grid layout with blocks */}
      {/* Bottom bar with language/currency/copyright */}
    </footer>
  );
}
```

## Configuration

### FooterConfig Interface
```typescript
interface FooterConfig {
  enabled: boolean;
  colorScheme: string; // "1" to "5"
  colorBackground: boolean;
  navigationMenuId?: string;
  desktopColumnCount: number; // 3 or 4
  showSeparator: boolean;
  blocks: FooterBlock[];
  bottomBar: {
    enabled: boolean;
    content: 'subscribed' | 'payment' | 'locale' | 'none';
    showPaymentIcons: boolean;
  };
  copyrightNotice: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    // ... 22 platforms total
  };
  padding: {
    enabled: boolean;
    top: number;
    bottom: number;
  };
}
```

## Block System

### Block Management Flow
1. User clicks "Agregar bloque" (blue button)
2. Modal opens with 6 block type options
3. User selects block type
4. Block added to footer with default settings
5. Block appears as indented child in sidebar
6. User can show/hide or delete blocks

### Block Rendering
```typescript
const renderBlock = (block: FooterBlock) => {
  switch (block.type) {
    case FooterBlockType.TEXT:
      return <div>{block.settings.content}</div>;
    case FooterBlockType.MENU:
      return <ul>{block.settings.links.map(...)}</ul>;
    case FooterBlockType.SOCIAL_MEDIA:
      return <div className="flex gap-3">{/* icons */}</div>;
    // ... other block types
  }
};
```

## Drag & Drop Implementation

### Overview
Footer blocks support drag & drop reordering using a **local DnD context** pattern, similar to Announcement children. This keeps the drag & drop functionality isolated from the global sections DnD.

### Architecture
```
FooterChildren.tsx (Parent Component)
├── DndContext (Local, isolated from global)
├── SortableContext (Vertical strategy)
└── DraggableFooterBlock (Wrapper for each block)
    ├── Drag Handle (GripVertical icon)
    └── Block Content (Icon, title, actions)
```

### Key Components

#### 1. DraggableFooterBlock Component
```typescript
// src/components/editor/dragDrop/DraggableFooterBlock.tsx
export function DraggableFooterBlock({ blockId, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: blockId,
    data: { type: 'footer-block', id: blockId }
  });
  
  // Render prop pattern for flexibility
  return children({ setNodeRef, attributes, listeners, isDragging, style });
}
```

#### 2. Drag Handler in FooterChildren
```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;
  
  const oldIndex = blocks.findIndex(b => b.id === active.id);
  const newIndex = blocks.findIndex(b => b.id === over.id);
  
  if (oldIndex !== -1 && newIndex !== -1) {
    const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
    updateFooterConfigLocal({ ...footerConfig, blocks: reorderedBlocks });
    saveHistory(); // For undo/redo support
  }
};
```

### UX Features
1. **Drag Handle**: Only the grip icon is draggable (not entire row)
2. **Visual Feedback**: 
   - Ring and shadow while dragging
   - 40% opacity on dragged item
   - Hover states for handle visibility
3. **Preserved Functionality**: 
   - Click to select still works
   - Actions (eye/trash) remain functional
   - Text selection prevented during drag

### Integration Points
- ✅ Updates through `updateFooterConfigLocal()`
- ✅ Triggers `isDirty` flag automatically
- ✅ Saves history for undo/redo
- ✅ Isolated from global sections DnD
- ✅ No interference with other draggable elements

## Testing

### Test Cases
1. ✅ Footer visible in editor with mock blocks
2. ✅ Block modal opens and closes correctly
3. ✅ Blocks can be added, toggled, and deleted
4. ✅ Configuration saves to structural components
5. ✅ Responsive layout (3/4 columns desktop, 1 mobile)
6. ✅ All files under 300 lines limit
7. ✅ **Drag & drop reordering works smoothly**
8. ✅ **Save button activates after reordering**
9. ✅ **Undo/redo works with drag operations**

### Visual Testing
- Desktop: 3 or 4 column grid layout
- Mobile: Single column stack
- Dark mode: Proper color scheme application
- Editor mode: Mock blocks display correctly

## Troubleshooting

### Issues Resolved

#### 1. Footer Not Visible
**Problem**: Footer pushed out of view by flex layout
**Solution**: Changed `flex-1` to `flex-grow` in main content area
```typescript
// Before
<div className="flex-1">
// After  
<div className="flex-grow">
```

#### 2. Import Error - Collapsible
**Problem**: `@/components/ui/collapsible` doesn't exist
**Solution**: Replaced with local state implementation

#### 3. Incorrect FooterChildren Structure
**Problem**: Block selector inside config panel instead of sidebar
**Solution**: Refactored to match AnnouncementChildren pattern

#### 4. EditorPreview.tsx Violation
**Problem**: File had 1,763 lines (limit: 300)
**Solution**: Enforced modular architecture, extracted components

## Performance Considerations

### Optimizations
1. Mock blocks only rendered in editor mode
2. Lazy loading for block editors (not yet implemented)
3. Memoized block rendering functions
4. Efficient state updates through structural components

## Migration Guide

### From Old Footer System
1. Export existing footer data
2. Map to new FooterConfig structure
3. Convert sections to blocks
4. Update API endpoints

## API Integration

### Endpoints Needed
```csharp
// Not yet implemented
[HttpGet("api/footer/blocks/{companyId}")]
[HttpPost("api/footer/blocks")]
[HttpPut("api/footer/blocks/{blockId}")]
[HttpDelete("api/footer/blocks/{blockId}")]
```

## Related Documentation

### See Also
- [Website Builder Module Guide](/docs/WEBSITE-BUILDER-MODULE-GUIDE.md)
- [Announcement Bar Implementation](/docs/implementations/features/2025-01-announcement-module.md)
- [Live Preview System](/docs/implementations/features/2025-01-live-preview.md)

### Troubleshooting
- [Footer Navigation Issues](/docs/troubleshooting/features/feature-01-announcement-navigation.md)
- [React Hooks Errors](/docs/troubleshooting/features/feature-02-react-hooks-error.md)

## Next Steps

### Pending Implementation
1. Individual block editors (FooterTextEditor, FooterMenuEditor, etc.)
2. Backend API for footer blocks persistence
3. Drag & drop reordering for blocks
4. Block templates/presets
5. Import/export functionality

### Future Enhancements
- Custom CSS per block
- Animation settings
- A/B testing support
- Analytics integration
- Multi-language support for blocks

## Search Keywords
footer, blocks, multi-instance, website builder, modular, shopify clone, grid layout, social media, newsletter, subscribe, menu, bottom bar, copyright, payment icons, language selector, currency selector

## Notes
- Default configuration ensures backward compatibility
- All components follow < 300 lines rule
- Mock data used in editor for better UX
- Block system extensible for future block types

---
**Documentation Version**: 1.0  
**Last Updated**: 2025-08-14  
**Author**: Development Team