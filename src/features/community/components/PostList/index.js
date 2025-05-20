import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead, TablePagination } from '@mui/material';
import { Box } from '@mui/system';
import { usePostStore } from '../../store/postStore';
import PostListItem from './PostListItem';
import PostListEmptyRow from './PostListEmptyRow';
const PostList = ({ filter }) => {
    // postStore에서 직접 상태와 액션을 가져옵니다
    const { posts, postLoading, postError, postPageInfo, postFilter, selectedCategory, fetchPosts, setPostFilter, setSelectedCategory, } = usePostStore();
    // 페이지네이션 처리
    const handleChangePage = (event, newPage) => {
        fetchPosts({ ...postFilter, page: newPage });
    };
    const handleChangeRowsPerPage = (event) => {
        fetchPosts({
            ...postFilter,
            page: 0,
            size: parseInt(event.target.value, 10),
        });
    };
    // 카테고리 변경 이벤트 핸들러
    const handleCategoryChange = (category) => {
        //TODO 카테고리->postType으로 받으면 안 됨
        // 카테고리가 변경되면 필터 업데이트 및 데이터 재요청
        setSelectedCategory(category);
        fetchPosts({
            ...postFilter,
            page: 0, // 카테고리 변경 시 첫 페이지로 이동
            category: category === 'ALL' ? undefined : category,
        });
    };
    // 컴포넌트 마운트 시 또는 필터 변경 시 데이터 요청
    useEffect(() => {
        // 커스텀 필터가 전달된 경우, 이를 사용하여 데이터 요청
        if (filter) {
            setPostFilter(filter);
            fetchPosts(filter);
        }
        else {
            // 기본 필터로 데이터 요청 (이미 로드된 경우 중복 요청하지 않음)
            fetchPosts();
        }
    }, [filter]);
    // <Loading /> // 존재하지 않아 임시 주석 처리
    // if (postLoading && posts.length === 0) {
    //   return <Loading />;
    // }
    if (postError) {
        return _jsxs("div", { children: ["Error: ", postError] });
    }
    return (_jsxs(Box, { sx: { width: '100%', mt: 2 }, children: [_jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "post list", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { width: "5%", align: "center", children: "No" }), _jsx(TableCell, { width: "10%", align: "center", children: "\uCE74\uD14C\uACE0\uB9AC" }), _jsx(TableCell, { width: "50%", align: "left", children: "\uC81C\uBAA9" }), _jsx(TableCell, { width: "10%", align: "center", children: "\uC791\uC131\uC790" }), _jsx(TableCell, { width: "10%", align: "center", children: "\uC791\uC131\uC77C" }), _jsx(TableCell, { width: "5%", align: "center", children: "\uC870\uD68C" }), _jsx(TableCell, { width: "5%", align: "center", children: "\uCD94\uCC9C" })] }) }), _jsx(TableBody, { children: posts.length > 0 ? (posts.map((post) => _jsx(PostListItem, { post: post }, post.postId))) : (_jsx(PostListEmptyRow, {})) })] }), _jsx(TablePagination, { component: "div", count: postPageInfo.totalElements, page: postPageInfo.page, onPageChange: handleChangePage, rowsPerPage: postPageInfo.size, onRowsPerPageChange: handleChangeRowsPerPage, rowsPerPageOptions: [5, 10, 25] })] }));
};
export default PostList;
