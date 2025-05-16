import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { Typography, Box, Pagination, CircularProgress, Alert, useMediaQuery, useTheme, Paper, Fade, } from '@mui/material';
import PostCard from './PostCard';
import { usePostStore } from '../../store/postStore';
/**
 * 게시글 목록 컴포넌트
 * 게시글 카드를 그리드 형태로 표시
 */
const PostList = ({ title, posts: propPosts, loading: propLoading, error: propError, showPagination = true, emptyMessage = '게시글이 없습니다. 첫 번째 게시글을 작성해보세요!', }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // 초기 로드 상태를 추적하는 ref
    const hasInitialDataLoaded = useRef(false);
    // 스토어에서 상태와 액션을 가져옴
    const { posts: storePosts, postLoading, postError, postPageInfo, postFilter, setPostFilter, fetchPosts, } = usePostStore();
    // 현재 페이지 로컬 상태 (UI 표시용)
    const [currentPage, setCurrentPage] = useState(1);
    // 초기 데이터 로드 - 한 번만 실행되도록 수정
    useEffect(() => {
        // 외부에서 데이터를 받은 경우 스토어 사용 안함
        if (propPosts)
            return;
        // 이미 데이터를 로드했으면 중복 요청 방지
        if (hasInitialDataLoaded.current) {
            console.log('[DEBUG] PostList - 이미 초기 데이터가 로드됨, 중복 요청 방지');
            return;
        }
        // 데이터가 없고, 로딩 중이 아닐 때만 데이터 가져오기
        if (storePosts.length === 0 && !postLoading) {
            console.log('[DEBUG] PostList - 초기 데이터 로드 시작');
            fetchPosts();
            hasInitialDataLoaded.current = true;
        }
    }, [propPosts, fetchPosts, storePosts.length, postLoading]);
    // postPageInfo가 변경될 때 현재 페이지 업데이트
    useEffect(() => {
        if (propPosts)
            return;
        // postPageInfo.page는 0-based이므로 UI에 표시할 때는 1을 더함
        const uiPage = postPageInfo.page + 1;
        console.log('[DEBUG] postPageInfo 변경 감지 - 페이지 동기화:', uiPage);
        setCurrentPage(uiPage);
    }, [propPosts, postPageInfo]);
    // 필터 변경 시 효과 (페이지는 1로 리셋)
    useEffect(() => {
        // 외부에서 데이터를 받은 경우 필터 변경에 반응하지 않음
        if (propPosts)
            return;
        // 페이지 정보 변경이 아닌 다른 필터 변경 시에만 페이지 초기화
        if (postFilter.page === 0) {
            setCurrentPage(1);
        }
    }, [propPosts, postFilter]);
    // 페이지 변경 처리
    const handlePageChange = (event, page) => {
        console.log('[DEBUG] 페이지 변경:', page);
        // 현재 UI 표시용 페이지 업데이트
        setCurrentPage(page);
        // API 페이지는 0부터 시작
        const apiPage = page - 1;
        try {
            // 콘솔에 현재 필터 상태 기록
            console.log('[DEBUG] 페이지 변경 - 현재 필터 상태:', postFilter);
            // 스토어를 통해 데이터 요청
            fetchPosts({
                ...postFilter,
                page: apiPage,
                size: 6, // 페이지당 6개 아이템으로 고정
            });
            // 페이지 변경 후 맨 위로 스크롤
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        catch (error) {
            console.error('페이지 변경 중 오류 발생:', error);
        }
    };
    // 게시글 목록 조회 함수 (필터 변경 시 사용)
    const handleFilterChange = (newFilter) => {
        console.log('필터 변경:', newFilter);
        fetchPosts({
            ...postFilter,
            ...newFilter,
            page: 0, // 필터 변경 시 첫 페이지로 이동
            size: 6, // 페이지 크기 명시적으로 6으로 설정
        });
    };
    // 최종적으로 표시될 posts, loading, error
    const posts = propPosts || storePosts;
    const loading = propLoading !== undefined ? propLoading : postLoading;
    const error = propError !== undefined ? propError : postError;
    const totalPages = (propPosts ? Math.ceil(propPosts.length / 6) : postPageInfo.totalPages) || 1;
    const totalItems = propPosts ? propPosts.length : postPageInfo.totalElements;
    // 이전 게시글 데이터 저장 - 로딩 중에도 이전 데이터 표시
    const [prevPosts, setPrevPosts] = useState([]);
    // 로딩 시작 시 이전 게시글 저장
    useEffect(() => {
        if (!loading && posts.length > 0) {
            setPrevPosts(posts);
        }
    }, [loading, posts]);
    // 디버깅을 위한 임시 게시글 데이터
    const mockPosts = [
        {
            postId: 999,
            title: '테스트 게시글 (목업)',
            content: '렌더링 확인용 테스트 게시글입니다. 정상적으로 표시되면 스타일과 레이아웃이 작동하는 것입니다.',
            category: '모임',
            tags: [{ tagId: 1, name: '테스트', category: '자유' }],
            writer: {
                userId: 1,
                nickname: '테스트유저',
                profileImage: '',
                role: 'USER',
            },
            createdAt: new Date().toISOString(),
            viewCount: 0,
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 0,
            status: 'ACTIVE',
        },
    ];
    // 실제로 표시할 게시글 결정
    // 로딩 중이면 이전 게시글 사용, 데이터 없으면 모의 데이터 사용
    const displayPosts = loading
        ? prevPosts.length > 0
            ? prevPosts
            : posts
        : posts && posts.length > 0
            ? posts
            : mockPosts;
    // 로딩 중이지만 표시할 데이터가 있는 경우
    const isDataAvailableDuringLoading = loading && prevPosts.length > 0;
    return (_jsxs(Box, { sx: { width: '100%', mb: 4 }, children: [_jsx(Paper, { elevation: 0, sx: {
                    p: 2,
                    mb: 2,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 170, 165, 0.3)',
                }, children: _jsx(Typography, { variant: "body1", children: loading && !isDataAvailableDuringLoading
                        ? '게시글을 불러오는 중...'
                        : error
                            ? `오류: ${error}`
                            : `총 ${totalItems || displayPosts.length}개의 게시글이 있습니다.` }) }), title && (_jsx(Typography, { variant: "h5", component: "h2", sx: {
                    mb: 3,
                    fontWeight: 600,
                    color: '#555',
                    position: 'relative',
                    display: 'inline-block',
                }, children: title })), loading && !isDataAvailableDuringLoading && (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', my: 4 }, children: _jsx(CircularProgress, { size: 40, sx: { color: '#FF9999' } }) })), error && !loading && (_jsx(Alert, { severity: "error", sx: { my: 2 }, children: error })), _jsx(Fade, { in: true, style: { transitionDuration: '300ms' }, children: _jsx(Box, { sx: {
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                        gap: 3,
                        width: '100%',
                        opacity: isDataAvailableDuringLoading ? 0.7 : 1, // 로딩 중일 때 살짝 투명하게
                    }, children: displayPosts.map(post => (_jsx(PostCard, { post: post }, post.postId))) }) }), !loading && !error && displayPosts.length === 0 && (_jsx(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    backgroundColor: 'rgba(255, 240, 240, 0.5)',
                    borderRadius: '8px',
                    border: '1px dashed #FFAAA5',
                }, children: _jsx(Typography, { variant: "body1", sx: {
                        color: '#666',
                        textAlign: 'center',
                        maxWidth: '80%',
                    }, children: emptyMessage }) })), showPagination && totalPages > 1 && (_jsxs(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 4,
                    '& .MuiPagination-ul': {
                        '& .MuiPaginationItem-root': {
                            color: '#555',
                            '&.Mui-selected': {
                                backgroundColor: '#FFD7D7',
                                fontWeight: 'bold',
                            },
                        },
                    },
                }, children: [_jsx(Pagination, { count: totalPages, page: currentPage, onChange: handlePageChange, color: "standard", showFirstButton: true, showLastButton: true }), isDataAvailableDuringLoading && (_jsx(CircularProgress, { size: 20, sx: { color: '#FF9999', ml: 2 } }))] }))] }));
};
export default PostList;
