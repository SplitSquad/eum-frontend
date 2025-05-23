import { convertToRegionTree, flattenRegionTree } from '@/shared/utils/RegionUtils';
import { sortedRegionTree } from './rawObject/sortedRegionTree';

export const regionTree = convertToRegionTree(sortedRegionTree);
//export const flatRegionList = flattenRegionTree(regionTree);
