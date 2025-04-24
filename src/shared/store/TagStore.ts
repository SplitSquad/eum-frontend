import { create } from 'zustand';

interface TagStore {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

export const useTagStore = create<TagStore>(set => ({
  selectedTags: [],
  setSelectedTags: tags => set({ selectedTags: tags }),
  addTag: tag => set(state => ({ selectedTags: [...state.selectedTags, tag] })),
  removeTag: tag =>
    set(state => ({
      selectedTags: state.selectedTags.filter(t => t !== tag),
    })),
}));
