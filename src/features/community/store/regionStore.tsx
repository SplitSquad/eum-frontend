import { create } from 'zustand';
import { regionTree } from '@/constants/regionTree';
import { RegionType } from '@/shared/types/region.types';
import { getInitialRegion } from '@/shared/utils/RegionUtils';

const { selectedCity, selectedDistrict, selectedNeighborhood, districts, neighborhoods } =
  getInitialRegion();

interface RegionState {
  selectedCity: string | null;
  selectedDistrict: string | null;
  selectedNeighborhood: string | null;

  districts: string[];
  neighborhoods: string[];

  setCity: (city: string) => void;
  setDistrict: (district: string) => void;
  setNeighborhood: (neighborhood: string) => void;

  resetRegion: () => void;
}

export const useRegionStore = create<RegionState>((set, get) => ({
  selectedCity,
  selectedDistrict,
  selectedNeighborhood,
  districts,
  neighborhoods,

  setCity: (city: string) => {
    const cityNode = regionTree.find(node => node.value === city);
    const districts = cityNode?.children?.map(child => child.value) || [];

    set({
      selectedCity: city,
      selectedDistrict: null,
      selectedNeighborhood: null,
      districts,
      neighborhoods: [],
    });
  },

  // 구 선택 시 동 목록 세팅
  setDistrict: (district: string) => {
    const { selectedCity } = get();
    const cityNode = regionTree.find(node => node.value === selectedCity);
    const districtNode = cityNode?.children?.find(child => child.value === district);
    const neighborhoods = districtNode?.children?.map(child => child.value) || [];

    set({
      selectedDistrict: district,
      selectedNeighborhood: null,
      neighborhoods,
    });
  },

  // 동 선택
  setNeighborhood: (neighborhood: string) => {
    set({ selectedNeighborhood: neighborhood });
  },

  // 모든 선택 초기화
  resetRegion: () => {
    set({
      selectedCity: null,
      selectedDistrict: null,
      selectedNeighborhood: null,
      districts: [],
      neighborhoods: [],
    });
  },
}));
