import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead, TablePagination } from '@mui/material';
import { Box } from '@mui/system';
import { usePostStore } from '../../store/postStore';
import Loading from '@components/Loading';
import { PostSummary, PostType } from '../../types';
import PostListHeader from './PostListHeader';
import PostListEmptyRow from './PostListEmptyRow';
import PostListItem from './PostListItem';
import { PostFilter } from '../../types';

interface PostListProps {
  filter?: PostFilter;
}

const PostList: React.FC<PostListProps> = ({ filter }) => {
  // postStore에서 직접 상태와 액션을 가져옵니다
  const {
    posts,
    postLoading,
    postError,
    postPageInfo,
    postFilter,
    selectedCategory,
    fetchPosts,
    setPostFilter,
    setSelectedCategory,
  } = usePostStore();

  // 페이지네이션 처리
  const handleChangePage = (event: unknown, newPage: number) => {
    fetchPosts({ ...postFilter, page: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    fetchPosts({
      ...postFilter,
      page: 0,
      size: parseInt(event.target.value, 10),
    });
  };

  // 카테고리 변경 이벤트 핸들러
  const handleCategoryChange = (category: string) => {
    // 카테고리가 변경되면 필터 업데이트 및 데이터 재요청
    setSelectedCategory(category);
    
    // 카테고리 ID를 표시 이름으로 변환
    let categoryName = '전체';
    if (category === 'travel') categoryName = '여행';
    else if (category === 'living') categoryName = '주거';
    else if (category === 'study') categoryName = '유학';
    else if (category === 'job') categoryName = '취업';
    else if (category !== '전체') categoryName = category;
    
    fetchPosts({
      ...postFilter,
      page: 0, // 카테고리 변경 시 첫 페이지로 이동
      category: categoryName
    });
  };

  // 컴포넌트 마운트 시 또는 필터 변경 시 데이터 요청
  useEffect(() => {
    // 커스텀 필터가 전달된 경우, 이를 사용하여 데이터 요청
    if (filter) {
      setPostFilter(filter);
      fetchPosts(filter);
    } else {
      // 기본 필터로 데이터 요청 (이미 로드된 경우 중복 요청하지 않음)
      fetchPosts();
    }
  }, [filter]);

  if (postLoading && posts.length === 0) {
    return <Loading />;
  }

  if (postError) {
    return <div>Error: {postError}</div>;
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <PostListHeader selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

      <Table sx={{ minWidth: 650 }} aria-label="post list">
        <TableHead>
          <TableRow>
            <TableCell width="5%" align="center">
              No
            </TableCell>
            <TableCell width="10%" align="center">
              카테고리
            </TableCell>
            <TableCell width="50%" align="left">
              제목
            </TableCell>
            <TableCell width="10%" align="center">
              작성자
            </TableCell>
            <TableCell width="10%" align="center">
              작성일
            </TableCell>
            <TableCell width="5%" align="center">
              조회
            </TableCell>
            <TableCell width="5%" align="center">
              추천
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.length > 0 ? (
            posts.map((post: PostSummary) => <PostListItem key={post.postId} post={post} />)
          ) : (
            <PostListEmptyRow />
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={postPageInfo.totalElements}
        page={postPageInfo.page}
        onPageChange={handleChangePage}
        rowsPerPage={postPageInfo.size}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default PostList;
