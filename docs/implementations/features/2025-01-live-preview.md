# Live Preview Implementation

## Overview
Complete implementation of the Website Builder Live Preview system, enabling real-time visualization of website configurations in a separate browser tab.

**Created**: 2025-01-14  
**Category**: features  
**Status**: ✅ Complete  
**Time Spent**: 3 hours  

## Table of Contents
- [Architecture](#architecture)
- [Implementation Details](#implementation-details)
- [Components](#components)
- [Configuration Flow](#configuration-flow)
- [Code Examples](#code-examples)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)

## Architecture

### System Design
```
HeaderEditor.tsx (Configuration)
    ↓
StructuralComponentsController (Save)
    ↓
Database (JSONB Storage)
    ↓
PreviewPage.tsx (Load)
    ↓
PreviewHeader.tsx (Render)
```

### Key Decisions
1. **Separate Preview Components**: Keep PreviewHeader independent from EditorPreview for cleaner separation
2. **Data Structure Consistency**: Use `subItems` naming to match EditorPreview
3. **Visual Parity**: Exact replication of editor behavior in preview
4. **Typography Application**: Apply theme typography to all menu elements

## Implementation Details

### 1. Preview Header Component

#### Complete Typography Integration
```typescript
// Apply typography styles from theme (matching EditorPreview.tsx)
const menuTypographyStyles = theme?.typography?.menu ? {
  fontFamily: `'${theme.typography.menu.fontFamily}', sans-serif`,
  fontWeight: theme.typography.menu.fontWeight || '400',
  textTransform: theme.typography.menu.useUppercase ? 'uppercase' as const : 'none' as const,
  fontSize: theme.typography.menu.fontSize ? 
    (theme.typography.menu.fontSize <= 100 ? 
      `${theme.typography.menu.fontSize}%` : 
      `${theme.typography.menu.fontSize}px`) : '94%',
  letterSpacing: `${theme.typography.menu.letterSpacing || 0}px`
} : {};
```

### 2. Layout System Implementation

#### All 6 Layouts Supported
- **Drawer**: Hamburger menu with sliding panel from left
- **Logo left, menu center inline**: Standard centered navigation
- **Logo left, menu left inline**: Aligned left navigation
- **Logo center, menu left inline**: Centered logo with left nav
- **Logo center, menu center below**: Two-row centered layout
- **Logo left, menu left below**: Two-row left-aligned layout

### 3. Drawer Implementation

#### Correct Animation Direction
```typescript
// Drawer opens from LEFT (not right)
<div 
  className={`absolute bg-white transition-transform duration-300 ${
    drawerOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
  style={{ 
    left: 0,
    top: headerConfig?.height || 80,
    // ... other styles
  }}
>
  {/* Content wrapper for sliding effect - slides LEFT for submenu */}
  <div 
    className="flex transition-transform duration-300 ease-in-out"
    style={{
      width: '200%',
      transform: activeDrawerSubmenu ? 'translateX(-50%)' : 'translateX(0)'
    }}
  >
```

### 4. Menu Data Structure Fix

#### Transform to Use subItems
```typescript
const transformMenuItem = (item: any): any => ({
  id: item.id?.toString() || item.name,
  label: item.name || item.label,
  url: item.url || item.link || '#',
  subItems: item.children?.map(transformMenuItem) || 
            item.items?.map(transformMenuItem) || 
            item.subItems?.map(transformMenuItem)
});
```

## Components

### PreviewHeader.tsx
- **Location**: `/src/components/preview/PreviewHeader.tsx`
- **Purpose**: Render header with full configuration support
- **Lines**: 633
- **Key Features**:
  - All 6 layouts
  - Dynamic icon styles
  - Typography application
  - Color scheme support
  - Drawer with submenus

### PreviewPage.tsx
- **Location**: `/src/components/preview/PreviewPage.tsx`
- **Purpose**: Load and provide configuration to preview components
- **Integration**: Fetches structural components and theme config

## Configuration Flow

### 1. Editor Save
```
HeaderEditor → useEditorStore → API Save → Database
```

### 2. Preview Load
```
Preview Page → Fetch APIs → Parse JSONB → Render Components
```

### 3. Data Transformation
```
Database JSONB → Parse → Transform (children → subItems) → Render
```

## Code Examples

### Dropdown with Underline on Active
```typescript
{/* Underline when dropdown is open */}
{isOpen && (
  <span 
    className="absolute left-0 right-0 h-0.5"
    style={{ 
      backgroundColor: colorScheme?.text?.default || '#000000',
      bottom: '-2px'
    }}
  />
)}
```

### Hover Effects in Drawer
```typescript
onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = colorScheme?.text?.default ? 
    `${colorScheme.text.default}10` : 'rgba(0,0,0,0.05)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.backgroundColor = 'transparent';
}}
```

## Testing

### Test Scenarios
1. ✅ All 6 layouts render correctly
2. ✅ Typography applies to all menu items
3. ✅ Drawer opens from left side
4. ✅ Submenus slide left (not right)
5. ✅ Hover shows underline on active dropdown
6. ✅ Click mode shows chevron and toggles correctly
7. ✅ Icon styles change based on configuration
8. ✅ Color schemes apply throughout
9. ✅ Height configuration respected
10. ✅ Sticky header works when enabled

### Browser Testing
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile responsive (needs viewport testing)

## Troubleshooting

### Common Issues Resolved

#### 1. Typography Not Applying
**Problem**: Menu items showed default font instead of configured typography
**Solution**: Extract typography from theme and apply to all menu elements

#### 2. Drawer Opening from Wrong Side
**Problem**: Drawer used `translate-x-full` and opened from right
**Solution**: Changed to `translate-x-full` → `translate-x-0` with `left: 0`

#### 3. Submenus Not Working
**Problem**: Code looked for `children` but API sends `subItems`
**Solution**: Updated transform function to check all possible property names

#### 4. No Visual Feedback on Active Menu
**Problem**: No underline when dropdown was open
**Solution**: Added conditional underline element tied to `isOpen` state

### Related Troubleshooting Docs
- [Preview Typography Issues](/docs/troubleshooting/features/features-08-preview-typography.md)
- [Drawer Animation Problems](/docs/troubleshooting/features/features-09-drawer-animation.md)

## Performance Considerations

### Optimizations
1. **Menu Loading**: Async fetch with fallback to basic menu
2. **Hover Effects**: CSS-in-JS for dynamic color calculations
3. **Animation**: Hardware-accelerated transforms
4. **State Management**: Minimal re-renders with targeted state

### Future Improvements
- Add menu item caching
- Implement loading skeleton
- Add error boundaries
- Optimize for mobile viewports

## API Integration

### Endpoints Used
```typescript
// Load navigation menu
GET /api/NavigationMenu/{menuId}/public

// Load structural components
GET /api/structural-components/company/{companyId}/published

// Load theme configuration
GET /api/global-theme-config/company/{companyId}/published
```

## Migration Notes

### From Old Preview System
If migrating from an older preview:
1. Update menu data structure (children → subItems)
2. Apply typography configuration
3. Update drawer animation direction
4. Add underline states for dropdowns

## Related Documentation

### See Also
- [Header Configuration System](/docs/implementations/features/2025-01-header-configurations.md)
- [Website Builder Architecture](/docs/WEBSITE-BUILDER-ARCHITECTURE.md)
- [EditorPreview Implementation](/docs/implementations/features/2025-01-editor-preview.md)

### Dependencies
- Next.js 14 App Router
- TypeScript strict mode
- Tailwind CSS
- Lucide React icons

## Search Keywords
preview, header, live preview, website builder, drawer, menu, navigation, typography, layout, submenus, dropdown, hover, click, underline, animation, transform, structural components, theme configuration

## Notes
- Preview opens in new tab at `/home` or configured slug
- Configuration syncs on page refresh (not real-time WebSocket)
- Drawer layout automatically sets width to screen
- Maximum 6 layout variations supported
- Color schemes limited to pre-configured options
- Typography affects only menu items (not logo or icons)