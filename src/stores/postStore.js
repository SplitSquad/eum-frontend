import { get, set } from 'lodash';
// import { instance } from '../services/api'; // 존재하지 않아 임시 주석 처리
// import { BASE_URL } from '../constants/api'; // 존재하지 않아 임시 주석 처리
// import { PostPageResponseDto } from '../dtos/post-page-response.dto'; // 존재하지 않아 임시 주석 처리
const postStore = {
    fetchPosts: async (filter) => {
        const currentState = get();
        // 필터 초기화 없이 페이지 변경만 할 경우
        if (filter && filter.page !== undefined && Object.keys(filter).length === 1) {
            return get().searchPosts(currentState.postFilter.keyword, currentState.postFilter.searchType, {
                page: filter.page,
                size: 6,
                sort: currentState.postFilter.sortBy,
                postType: currentState.postFilter.postType,
                region: currentState.postFilter.location,
                category: currentState.postFilter.category,
            });
        }
        // 검색 취소(검색 상태 초기화)시 다른 필터는 유지
        if (filter?.resetSearch) {
            return get().searchPosts('', 'title', {
                page: filter.page !== undefined ? filter.page : currentState.postPageInfo.page,
                size: 6,
                sort: currentState.postFilter.sortBy,
                postType: currentState.postFilter.postType,
                region: currentState.postFilter.location,
                category: currentState.postFilter.category,
                tags: currentState.postFilter.tags,
            });
        }
        // 일반 필터 적용
        return get().searchPosts({
            page: filter?.page !== undefined ? filter.page : currentState.postPageInfo.page,
            size: 6,
            sort: currentState.postFilter.sortBy,
            postType: filter?.postType || currentState.postFilter.postType,
            region: filter?.region || currentState.postFilter.location,
            category: filter?.category || currentState.postFilter.category,
            tags: filter?.tags || currentState.postFilter.tags,
        });
    },
    searchPosts: async (keywordParam, searchType = 'title', options = {}) => {
        const currentState = get();
        set({ isPostsLoading: true, postError: null });
        try {
            // 키워드가 객체인 경우 (필터 객체로 직접 호출된 경우)
            if (typeof keywordParam === 'object' && keywordParam !== null) {
                options = keywordParam;
                keywordParam = currentState.postFilter.keyword;
            }
            // 검색 키워드가 없으면 빈 문자열로 처리
            const keyword = keywordParam || '';
            // 페이지 정보
            const page = options.page !== undefined ? options.page : 0;
            const size = options.size || 6;
            const sort = options.sort || currentState.postFilter.sortBy;
            // 필터 정보
            const postType = options.postType || currentState.postFilter.postType;
            const region = options.region || currentState.postFilter.location;
            const category = options.category || currentState.postFilter.category;
            const tags = options.tags || currentState.postFilter.tags;
            // const response = await instance.get<PostPageResponseDto>(`${BASE_URL}/api/v1/posts`, { // 임시 주석 처리
            //   params: {
            //     keyword: keyword,
            //     searchType: searchType,
            //     page,
            //     size,
            //     sort,
            //     postType,
            //     region,
            //     category,
            //     tags: tags?.join(','),
            //   },
            // });
            // set({
            //   posts: response.data.content,
            //   postPageInfo: {
            //     page,
            //     size,
            //     totalPages: response.data.totalPages,
            //     totalElements: response.data.totalElements,
            //   },
            //   postFilter: {
            //     ...currentState.postFilter,
            //     keyword: keyword,
            //     searchType: searchType,
            //     sortBy: sort,
            //     postType,
            //     location: region,
            //     category,
            //     tags,
            //   },
            //   isPostsLoading: false,
            // });
            // return response.data;
        }
        catch (error) {
            set({ isPostsLoading: false, postError: error });
            throw error;
        }
    },
};
export default postStore;
