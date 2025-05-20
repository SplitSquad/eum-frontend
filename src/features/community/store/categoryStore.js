import { create } from 'zustand';
export const useCategoryStore = create((set, get) => ({
    selectedMainCategory: null,
    selectedSubcategories: [],
    setMainCategory: category => {
        const current = get().selectedMainCategory;
        if (current === category)
            return;
        set({
            selectedMainCategory: category,
            selectedSubcategories: [], // reset subcategories
        });
        // 👉 여기서 API 호출도 trigger 가능 (옵션)
    },
    toggleSubcategory: subcategory => {
        const { selectedSubcategories } = get();
        console.log(selectedSubcategories);
        if (selectedSubcategories.includes(subcategory)) {
            set({ selectedSubcategories: selectedSubcategories.filter(s => s !== subcategory) });
        }
        else {
            set({ selectedSubcategories: [...selectedSubcategories, subcategory] });
        }
    },
    resetCategories: () => {
        set({ selectedMainCategory: null, selectedSubcategories: [] });
    },
}));
