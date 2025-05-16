import { create } from 'zustand';
export const useTagStore = create(set => ({
    selectedTags: [],
    setSelectedTags: tags => set({ selectedTags: tags }),
    addTag: tag => set(state => ({ selectedTags: [...state.selectedTags, tag] })),
    removeTag: tag => set(state => ({
        selectedTags: state.selectedTags.filter(t => t !== tag),
    })),
}));
