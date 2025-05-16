import React from 'react';
import { useCategoryStore } from '../store/categoryStore';
import { useRegionStore } from '../store/regionStore';
import { X } from 'lucide-react';

const SelectedTagButton = () => {
  const { selectedSubcategories, toggleSubcategory } = useCategoryStore();
  const { selectedCity, selectedDistrict, selectedNeighborhood } = useRegionStore();

  const selectedRegions = [selectedCity, selectedDistrict, selectedNeighborhood]
    .filter(Boolean)
    .join('/');
  const hasRegion = selectedRegions.length === 0;
  if (selectedSubcategories.length === 0 && selectedRegions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {!hasRegion && (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full border border-blue-400">
          📍 {selectedRegions}
        </span>
      )}
      {selectedSubcategories.map(subcategory => (
        <span
          key={subcategory}
          className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary"
        >
          {subcategory}
          <button
            onClick={() => toggleSubcategory(subcategory)}
            className="text-primary hover:text-red-500"
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
};

export default SelectedTagButton;
