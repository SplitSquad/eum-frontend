import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../../../shared/i18n';
import { debugLog } from '../../../shared/utils/debug';
import { StrictPostFilter, PostType } from '../types/community';

export type PageType = 'board' | 'group';

interface CommunityPageState {
  selectedTags: string[];
  isSearchMode: boolean;
  searchTerm: string;
  availableTags: string[];
  isTransitioning: boolean;
}

interface CommunityPageActions {
  setSelectedTags: (tags: string[]) => void;
  setIsSearchMode: (mode: boolean) => void;
  setSearchTerm: (term: string) => void;
  setAvailableTags: (tags: string[]) => void;
  setIsTransitioning: (transitioning: boolean) => void;
}

export const useCommunityPageState = (
  pageType: PageType,
  setSelectedCategory: (category: string) => void,
  fetchPosts: (filter: StrictPostFilter) => void,
  fetchTopPosts: (count: number) => void
): CommunityPageState & CommunityPageActions => {
  const { t } = useTranslation();
  const location = useLocation();
  const lastPathnameRef = useRef<string>('');
  
  // 상태 정의
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // 페이지 진입 시 상태 초기화 - 의존성 없이 안전하게 처리
  useEffect(() => {
    // 경로가 실제로 변경된 경우에만 실행
    if (lastPathnameRef.current === location.pathname) {
      return;
    }
    
    debugLog(`${pageType} 페이지 진입 감지 - 경로 변경: ${lastPathnameRef.current} → ${location.pathname}`);
    
    lastPathnameRef.current = location.pathname;
    
    // 상태 초기화를 비동기로 처리하여 렌더링 차단 방지
    const timer = setTimeout(() => {
      // 번역된 값 대신 한국어 고정값 사용
      const defaultCategory = '전체';
      
      debugLog(`${pageType} 페이지 상태 초기화 시작`);
      
      // 상태 초기화
      setSelectedCategory(defaultCategory);
      setSelectedTags([]);
      setAvailableTags([]);
      setIsSearchMode(false);
      setSearchTerm('');
      
      // 기본 필터 생성 - 모든 값을 한국어 고정값으로 설정
      const initialFilter: StrictPostFilter = {
        category: '전체', // 한국어 고정값
        postType: pageType === 'board' ? '자유' as PostType : '모임' as PostType,
        location: pageType === 'board' ? '자유' : '전체', // 한국어 고정값
        tag: undefined,
        sortBy: 'latest' as const,
        page: 0,
        size: 6,
      };
      
      // 데이터 로드
      try {
        fetchPosts(initialFilter);
        fetchTopPosts(5);
        debugLog(`${pageType} 페이지 초기 데이터 로드 완료`);
      } catch (error) {
        console.error(`${pageType} 페이지 데이터 로드 실패:`, error);
      }
    }, 0); // 마이크로태스크로 실행
    
    return () => clearTimeout(timer);
    
  }, [location.pathname]); // 오직 pathname 변경 시에만 실행

  return {
    // 상태
    selectedTags,
    isSearchMode,
    searchTerm,
    availableTags,
    isTransitioning,
    
    // 액션
    setSelectedTags,
    setIsSearchMode,
    setSearchTerm,
    setAvailableTags,
    setIsTransitioning,
  };
}; 