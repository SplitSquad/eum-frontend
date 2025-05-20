import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
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
    if (selectedSubcategories.length === 0 && selectedRegions.length === 0)
        return null;
    return (_jsxs("div", { className: "flex flex-wrap gap-2 my-4", children: [!hasRegion && (_jsxs("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full border border-blue-400", children: ["\uD83D\uDCCD ", selectedRegions] })), selectedSubcategories.map(subcategory => (_jsxs("span", { className: "flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary", children: [subcategory, _jsx("button", { onClick: () => toggleSubcategory(subcategory), className: "text-primary hover:text-red-500", children: _jsx(X, { size: 14 }) })] }, subcategory)))] }));
};
export default SelectedTagButton;
