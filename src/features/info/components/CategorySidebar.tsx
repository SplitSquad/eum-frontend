import React from 'react';

interface CategorySidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (cat: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  return (
    <aside className="w-48 space-y-2">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`block w-full px-4 py-2 text-left rounded-lg transition-colors ${
            selectedCategory === cat ? 'bg-green-100 text-green-700' : 'bg-white hover:bg-gray-100'
          }`}
        >
          {cat}
        </button>
      ))}
    </aside>
  );
};

export default CategorySidebar;
