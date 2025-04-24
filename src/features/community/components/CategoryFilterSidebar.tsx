import React from 'react';
import { tagCategories } from '@/constants/tagCategories';
import { useTagStore } from '@/shared/store/TagStore';
import { useCategoryStore } from '../store/categoryStore';

const CategoryFilterSidebad = () => {
  const {
    selectedMainCategory,
    selectedSubcategories,
    setMainCategory,
    toggleSubcategory,
    resetCategories,
  } = useCategoryStore();

  return (
    <aside className="w-full md:w-64 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800" onClick={resetCategories}>
        카테고리
      </h2>
      <div className="space-y-3">
        {tagCategories.map(category => (
          <div key={category.title}>
            <button
              onClick={() => setMainCategory(category.title)}
              className="flex justify-between items-center w-full text-left text-gray-800 hover:text-primary font-medium"
            >
              {category.title}
            </button>
            {selectedMainCategory === category.title && (
              <ul className="mt-2 ml-2 space-y-1">
                {category.subCategories.map(sub => (
                  <li key={sub.name}>
                    <label className="inline-flex items-center text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(sub.name)}
                        onChange={() => toggleSubcategory(sub.name)}
                        className="mr-2"
                      />
                      {sub.name}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default CategoryFilterSidebad;
