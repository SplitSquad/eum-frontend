import { convertToRegionTree, flattenRegionTree } from '@/shared/utils/RegionUtils';
import { rawRegionTree } from './rawObject/rawRegionTree';
export const regionTree = convertToRegionTree(rawRegionTree);
export const flatRegionList = flattenRegionTree(regionTree);
