import { create } from 'zustand';

interface CategoryState {
  selectedMainCategory: string | null; // 펼쳐진 대분류
  selectedSubcategories: string[]; // 선택된 소분류 리스트
  setMainCategory: (category: string) => void;
  toggleSubcategory: (subcategory: string) => void;
  resetCategories: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  selectedMainCategory: null,
  selectedSubcategories: [],

  setMainCategory: category => {
    const current = get().selectedMainCategory;
    if (current === category) return;

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
    } else {
      set({ selectedSubcategories: [...selectedSubcategories, subcategory] });
    }
  },

  resetCategories: () => {
    set({ selectedMainCategory: null, selectedSubcategories: [] });
  },
}));
