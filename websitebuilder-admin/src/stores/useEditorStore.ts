import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  EditorState, 
  Section, 
  SectionType, 
  PageType,
  Page,
  SECTION_CONFIGS 
} from '@/types/editor.types';

interface EditorStore extends EditorState {
  // Actions
  setSelectedPage: (pageId: string, pageType: PageType) => void;
  addSection: (groupId: 'headerGroup' | 'asideGroup' | 'template' | 'footerGroup', sectionType: SectionType) => void;
  removeSection: (groupId: string, sectionId: string) => void;
  toggleSectionVisibility: (groupId: string, sectionId: string) => void;
  updateSectionSettings: (groupId: string, sectionId: string, settings: Record<string, any>) => void;
  reorderSections: (groupId: string, fromIndex: number, toIndex: number) => void;
  selectSection: (sectionId: string | null) => void;
  toggleConfigPanel: (open?: boolean) => void;
  setHoveredSection: (sectionId: string | null) => void;
  loadPageSections: (sections: Section[]) => void;
  initializeStructuralComponents: () => void;
  savePage: () => Promise<void>;
  resetChanges: () => void;
  setIsDirty: (dirty: boolean) => void;
  toggleGlobalSettings: () => void;
  isGlobalSettingsOpen: boolean;
  // Undo/Redo
  history: any[];
  historyIndex: number;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const initialState: EditorState & { isGlobalSettingsOpen: boolean; history: any[]; historyIndex: number } = {
  selectedPageId: null,
  selectedPageType: null,
  sections: {
    headerGroup: [],
    asideGroup: [],
    template: [],
    footerGroup: []
  },
  selectedSectionId: null,
  isConfigPanelOpen: false,
  hoveredSectionId: null,
  isDirty: false,
  isSaving: false,
  isGlobalSettingsOpen: false,
  history: [],
  historyIndex: -1
};

export const useEditorStore = create<EditorStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setSelectedPage: (pageId, pageType) => {
          set({
            selectedPageId: pageId,
            selectedPageType: pageType,
            selectedSectionId: null,
            isConfigPanelOpen: false
          });
        },

        addSection: (groupId, sectionType) => {
          const config = SECTION_CONFIGS[sectionType];
          const newSection: Section = {
            id: `${sectionType}_${Date.now()}`,
            type: sectionType,
            name: config.name,
            visible: true,
            settings: { ...config.defaultSettings },
            sortOrder: get().sections[groupId].length
          };

          set((state) => ({
            sections: {
              ...state.sections,
              [groupId]: [...state.sections[groupId], newSection]
            },
            isDirty: true
          }));
        },

        removeSection: (groupId, sectionId) => {
          set((state) => ({
            sections: {
              ...state.sections,
              [groupId as keyof typeof state.sections]: state.sections[groupId as keyof typeof state.sections].filter(
                (s) => s.id !== sectionId
              )
            },
            selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
            isConfigPanelOpen: state.selectedSectionId === sectionId ? false : state.isConfigPanelOpen,
            isDirty: true
          }));
        },

        toggleSectionVisibility: (groupId, sectionId) => {
          set((state) => ({
            sections: {
              ...state.sections,
              [groupId as keyof typeof state.sections]: state.sections[groupId as keyof typeof state.sections].map(
                (s) => s.id === sectionId ? { ...s, visible: !s.visible } : s
              )
            },
            isDirty: true
          }));
        },

        updateSectionSettings: (groupId, sectionId, settings) => {
          set((state) => ({
            sections: {
              ...state.sections,
              [groupId as keyof typeof state.sections]: state.sections[groupId as keyof typeof state.sections].map(
                (s) => s.id === sectionId ? { ...s, settings: { ...s.settings, ...settings } } : s
              )
            },
            isDirty: true
          }));
        },

        reorderSections: (groupId, fromIndex, toIndex) => {
          set((state) => {
            const group = [...state.sections[groupId as keyof typeof state.sections]];
            const [movedItem] = group.splice(fromIndex, 1);
            group.splice(toIndex, 0, movedItem);
            
            // Update sort orders
            const updatedGroup = group.map((item, index) => ({
              ...item,
              sortOrder: index
            }));

            return {
              sections: {
                ...state.sections,
                [groupId]: updatedGroup
              },
              isDirty: true
            };
          });
        },

        selectSection: (sectionId) => {
          set({
            selectedSectionId: sectionId,
            isConfigPanelOpen: sectionId !== null
          });
        },

        toggleConfigPanel: (open) => {
          set((state) => ({
            isConfigPanelOpen: open !== undefined ? open : !state.isConfigPanelOpen
          }));
        },

        setHoveredSection: (sectionId) => {
          set({ hoveredSectionId: sectionId });
        },

        loadPageSections: (sections) => {
          // Only load template sections from the page
          // Structural components (header, footer, etc) are maintained globally
          const state = get();
          const newSections = {
            headerGroup: state.sections.headerGroup, // Keep existing header group
            asideGroup: state.sections.asideGroup,   // Keep existing aside group
            template: [] as Section[],                // Load new template sections
            footerGroup: state.sections.footerGroup  // Keep existing footer group
          };

          // Only process template sections from the page
          sections.forEach((section) => {
            const config = SECTION_CONFIGS[section.type];
            if (config && config.category === 'template') {
              newSections.template.push(section);
            }
          });

          // Sort template sections by sortOrder
          newSections.template.sort((a, b) => a.sortOrder - b.sortOrder);

          set({
            sections: newSections,
            isDirty: false
          });
        },

        initializeStructuralComponents: () => {
          // Initialize structural components if they don't exist
          const state = get();
          const hasHeader = state.sections.headerGroup.some(s => s.type === SectionType.HEADER);
          const hasAnnouncementBar = state.sections.headerGroup.some(s => s.type === SectionType.ANNOUNCEMENT_BAR);
          const hasFooter = state.sections.footerGroup.some(s => s.type === SectionType.FOOTER);
          const hasCartDrawer = state.sections.asideGroup.some(s => s.type === SectionType.CART_DRAWER);

          const updatedSections = { ...state.sections };

          if (!hasHeader) {
            updatedSections.headerGroup.push({
              id: 'header_structural',
              type: SectionType.HEADER,
              name: 'Header',
              visible: true,
              settings: {},
              sortOrder: 1
            });
          }

          if (!hasAnnouncementBar) {
            updatedSections.headerGroup.unshift({  // Use unshift to add at beginning
              id: 'announcement_structural',
              type: SectionType.ANNOUNCEMENT_BAR,
              name: 'Announcement Bar',
              visible: false, // Hidden by default
              settings: {},
              sortOrder: 0
            });
          }

          if (!hasFooter) {
            updatedSections.footerGroup.push({
              id: 'footer_structural',
              type: SectionType.FOOTER,
              name: 'Footer',
              visible: true,
              settings: {},
              sortOrder: 0
            });
          }

          if (!hasCartDrawer) {
            updatedSections.asideGroup.push({
              id: 'cart_drawer_structural',
              type: SectionType.CART_DRAWER,
              name: 'Cart Drawer',
              visible: false, // Hidden by default
              settings: {},
              sortOrder: 0
            });
          }
          
          // Sort headerGroup by sortOrder to ensure correct initial order
          updatedSections.headerGroup.sort((a, b) => a.sortOrder - b.sortOrder);

          set({ sections: updatedSections });
        },

        savePage: async () => {
          const state = get();
          if (!state.selectedPageId || !state.isDirty) return;

          set({ isSaving: true });

          try {
            // Combine all sections with proper sort order
            const allSections = [
              ...state.sections.headerGroup,
              ...state.sections.asideGroup,
              ...state.sections.template,
              ...state.sections.footerGroup
            ];

            const response = await fetch(`/api/website-pages/${state.selectedPageId}/sections`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ sections: allSections })
            });

            if (response.ok) {
              set({ isDirty: false });
            }
          } catch (error) {
            console.error('Error saving page:', error);
          } finally {
            set({ isSaving: false });
          }
        },

        resetChanges: () => {
          set(initialState);
        },

        setIsDirty: (dirty) => {
          set({ isDirty: dirty });
        },

        toggleGlobalSettings: () => {
          set((state) => ({ 
            isGlobalSettingsOpen: !state.isGlobalSettingsOpen,
            isConfigPanelOpen: false,
            selectedSectionId: null
          }));
        },

        // Undo/Redo functionality
        saveHistory: () => {
          const state = get();
          const snapshot = {
            sections: JSON.parse(JSON.stringify(state.sections)),
            timestamp: Date.now()
          };
          
          // Remove any history after current index
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          
          // Add new state
          newHistory.push(snapshot);
          
          // Keep max 50 states
          if (newHistory.length > 50) {
            newHistory.shift();
          }
          
          set({
            history: newHistory,
            historyIndex: newHistory.length - 1
          });
        },

        undo: () => {
          const state = get();
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            const previousState = state.history[newIndex];
            
            set({
              sections: JSON.parse(JSON.stringify(previousState.sections)),
              historyIndex: newIndex,
              isDirty: false // Set to false since we're going back to a previous state
            });
          }
        },

        redo: () => {
          const state = get();
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            const nextState = state.history[newIndex];
            
            set({
              sections: JSON.parse(JSON.stringify(nextState.sections)),
              historyIndex: newIndex,
              isDirty: true
            });
          }
        },

        canUndo: () => {
          const state = get();
          return state.historyIndex > 0;
        },

        canRedo: () => {
          const state = get();
          return state.historyIndex < state.history.length - 1;
        }
      }),
      {
        name: 'editor-store',
        partialize: (state) => ({
          selectedPageId: state.selectedPageId,
          selectedPageType: state.selectedPageType,
          sections: state.sections // Also persist sections
        })
      }
    )
  )
);