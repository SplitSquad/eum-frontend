import React from 'react';
import DropDownGroup from '@/components/forms/DropDownGroup';
import { useRegionStore } from '@/features/community/store/regionStore';
import { regionTree } from '@/constants/regionTree'; // import 꼭 확인

const RegionFilter = () => {
  const {
    selectedCity,
    selectedDistrict,
    selectedNeighborhood,
    districts,
    neighborhoods,
    setCity,
    setDistrict,
    setNeighborhood,
  } = useRegionStore();

  const labels = ['시', '구', '동'];
  const selected = [selectedCity || '', selectedDistrict || '', selectedNeighborhood || ''];
  const hasNeighborhoods = neighborhoods.length > 0;
  const safeNeighborhoods = hasNeighborhoods ? neighborhoods : ['해당 없음'];

  const itemsList = [
    regionTree.map(n => n.value), // 시 리스트
    districts, // 구 리스트
    safeNeighborhoods, // 동 리스트 (없으면 '해당 없음')
  ];

  const handleSelect = (level: number, value: string) => {
    if (level === 0) setCity(value);
    if (level === 1) setDistrict(value);
    if (level === 2) setNeighborhood(value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <DropDownGroup
        labels={labels}
        itemsList={itemsList}
        selected={selected}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default RegionFilter;
