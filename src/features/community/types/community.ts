export type CategoryType = 'travel' | 'living' | 'study' | 'job' | 'all';
export type PostType = '자유' | '모임';
export type SortType = 'latest' | 'popular';
export type LocationType = '자유' | string;

export interface StrictPostFilter {
  category: CategoryType | string; // 번역된 값도 허용
  postType: PostType;
  location: LocationType;
  tag?: string;
  sortBy: SortType;
  page: number;
  size: number;
}

export interface CommunityPageState {
  selectedTags: string[];
  isSearchMode: boolean;
  searchTerm: string;
  availableTags: string[];
  selectedCategory: string;
}

export interface TagSelectionProps {
  selectedTags: string[];
  availableTags: string[];
  onTagSelect: (tag: string) => void;
  isLoading?: boolean;
}

export interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading?: boolean;
}

export interface PostCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags?: string[];
  category: string;
  postType: PostType;
} 