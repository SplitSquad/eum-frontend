import { useCallback, useMemo } from 'react';
import { useTranslation } from '../../../shared/i18n';
import { debugLog } from '../../../shared/utils/debug';

export const useOptimizedHandlers = (
  filter: any,
  setFilter: (filter: any) => void,
  fetchPosts: (filter: any) => void,
  isSearchMode: boolean,
  searchTerm: string
) => {
  const { t } = useTranslation();

  // 메모이제이션된 카테고리 변경 핸들러
  const handleCategoryChange = useCallback(
    (category: string) => {
      debugLog('카테고리 변경', { 이전: filter.category, 새로운: category });
      
      if (category === filter.category) return;

      const newFilter = {
        category,
        postType: filter.postType,
        location: filter.location,
        tag: undefined,
        sortBy: 'latest' as const,
        page: 0,
        size: 6,
      };

      setFilter(newFilter);
      fetchPosts(newFilter);
    },
    [filter.category, filter.postType, filter.location, setFilter, fetchPosts]
  );

  // 메모이제이션된 태그 선택 핸들러
  const handleTagSelect = useCallback(
    (tag: string, selectedTags: string[], getOriginalTagName: (tag: string) => string) => {
      debugLog('태그 선택/해제', { tag, 현재선택: selectedTags });

      let newSelectedTags: string[];
      if (selectedTags.includes(tag)) {
        newSelectedTags = selectedTags.filter(t => t !== tag);
      } else {
        newSelectedTags = [...selectedTags, tag];
      }

      const originalTagNames = newSelectedTags.map(t => getOriginalTagName(t));

      const newFilter = {
        ...filter,
        tag: originalTagNames.length > 0 ? originalTagNames.join(',') : undefined,
        page: 0,
      };

      setFilter(newFilter);
      fetchPosts(newFilter);

      return newSelectedTags;
    },
    [filter, setFilter, fetchPosts]
  );

  // 메모이제이션된 정렬 변경 핸들러
  const handleSortChange = useCallback(
    (sortBy: 'latest' | 'popular') => {
      debugLog('정렬 방식 변경', sortBy);

      const newFilter = { ...filter, sortBy, page: 0 };
      setFilter(newFilter);
      fetchPosts(newFilter);
    },
    [filter, setFilter, fetchPosts]
  );

  // 메모이제이션된 검색 핸들러
  const handleSearch = useCallback(
    (searchPosts: (term: string, type: string) => void, searchType: string) => {
      if (!searchTerm.trim()) {
        debugLog('검색어가 비어있어 전체 목록 조회');
        fetchPosts({ ...filter, page: 0 });
        return;
      }

      debugLog('검색 실행', { searchTerm, searchType });
      searchPosts(searchTerm, searchType);
    },
    [searchTerm, filter, fetchPosts]
  );

  // 메모이제이션된 카테고리별 태그 매핑
  const categoryTags = useMemo(() => ({
    travel: [t('community.tags.tourism'), t('community.tags.food'), t('community.tags.transport'), t('community.tags.accommodation'), t('community.tags.embassy')],
    living: [t('community.tags.realEstate'), t('community.tags.livingEnvironment'), t('community.tags.culture'), t('community.tags.housing')],
    study: [t('community.tags.academic'), t('community.tags.studySupport'), t('community.tags.visa'), t('community.tags.dormitory')],
    job: [t('community.tags.career'), t('community.tags.labor'), t('community.tags.jobFair'), t('community.tags.partTime')],
    [t('community.filters.all')]: [],
  }), [t]);

  return {
    handleCategoryChange,
    handleTagSelect,
    handleSortChange,
    handleSearch,
    categoryTags,
  };
};