import { RegionNode } from '@/shared/types/region.types';
import { regionTree } from '@/constants/regionTree';
import { useUserStore } from '../store/UserStore';
/**
 * 트리 구조의 지역 데이터를 평면 배열로 변환
 */
export const flattenRegionTree = (tree: RegionNode[]): string[] => {
  const result: string[] = [];

  const traverse = (nodes: RegionNode[]) => {
    nodes.forEach(node => {
      result.push(node.value);
      if (node.children) {
        traverse(node.children);
      }
    });
  };

  traverse(tree);
  return result;
};

export const convertToRegionTree = (rawTree: Record<string, any>): RegionNode[] => {
  return Object.entries(rawTree).map(([key, value]) => {
    const children = value.children ? convertToRegionTree(value.children) : undefined;
    return {
      value: key,
      ...(children ? { children } : {}),
    };
  });
};
export const getInitialRegion = () => {
  const address = useUserStore.getState().userProfile?.address || '';
  const [city, district, neighborhood] = address.split(' ');
  console.log(city);
  console.log(district);
  console.log(neighborhood);

  const cityNode = regionTree.find(node => node.value === city);
  const districtNode = cityNode?.children?.find(child => child.value === district);

  return {
    selectedCity: city || null,
    selectedDistrict: district || null,
    selectedNeighborhood: neighborhood || null,
    districts: cityNode?.children?.map(child => child.value) || [],
    neighborhoods: districtNode?.children?.map(child => child.value) || [],
  };
};
