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
  savePage: () => Promise<void>;
  resetChanges: () => void;
  setIsDirty: (dirty: boolean) => void;
  toggleGlobalSettings: () => void;
  isGlobalSettingsOpen: boolean;
}

const initialState: EditorState & { isGlobalSettingsOpen: boolean } = {
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
  isGlobalSettingsOpen: false
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
          const grouped = {
            headerGroup: [] as Section[],
            asideGroup: [] as Section[],
            template: [] as Section[],
            footerGroup: [] as Section[]
          };

          sections.forEach((section) => {
            const config = SECTION_CONFIGS[section.type];
            if (config) {
              switch (config.category) {
                case 'header':
                  grouped.headerGroup.push(section);
                  break;
                case 'aside':
                  grouped.asideGroup.push(section);
                  break;
                case 'footer':
                  grouped.footerGroup.push(section);
                  break;
                default:
                  grouped.template.push(section);
                  break;
              }
            }
          });

          // Sort each group by sortOrder
          Object.keys(grouped).forEach((key) => {
            grouped[key as keyof typeof grouped].sort((a, b) => a.sortOrder - b.sortOrder);
          });

          set({
            sections: grouped,
            isDirty: false
          });
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
        }
      }),
      {
        name: 'editor-store',
        partialize: (state) => ({
          selectedPageId: state.selectedPageId,
          selectedPageType: state.selectedPageType
        })
      }
    )
  )
);