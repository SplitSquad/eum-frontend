export type RegionType = string[];

export interface RegionNode {
  value: string;
  children?: RegionNode[];
}
