import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableRow, TableHead, TablePagination } from '@mui/material';
import { Box } from '@mui/system';
import { usePostStore } from '../../store/postStore';
import PostListItem from './PostListItem';
import PostListEmptyRow from './PostListEmptyRow';
// import { PostSummary, PostType } from '../../types'; // 타입 import 불가로 임시 주석 처리
// import { PostFilter } from '../../types'; // 타입 import 불가로 임시 주석 처리
import { PostSummary, PostType } from '../../types-folder/index';

// 임시 타입 선언 (실제 타입 정의에 맞게 수정 필요)
// type PostSummary = {
//   postId: number;
//   title: string;
//   content: string;
//   category?: string;
//   createdAt?: string;
//   writerNickname?: string;
//   viewCount?: number;
//   likeCount?: number;
// };

type PostFilter = {
  page?: number;
  size?: number;
  sort?: string;
  postType?: PostType | string;
  region?: string;
  category?: string;
  tags?: string[];
  location?: string;
  tag?: string;
  sortBy?: 'latest' | 'popular';
  searchBy?: string;
  keyword?: string;
  resetSearch?: boolean;
};

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
  const handleCategoryChange = (category: PostType) => {
    //TODO 카테고리->postType으로 받으면 안 됨
    // 카테고리가 변경되면 필터 업데이트 및 데이터 재요청
    setSelectedCategory(category);
    fetchPosts({
      ...postFilter,
      page: 0, // 카테고리 변경 시 첫 페이지로 이동
      category: (category as any) === 'ALL' ? undefined : category,
    });
  };

  // 컴포넌트 마운트 시 또는 필터 변경 시 데이터 요청
  useEffect(() => {
    // 커스텀 필터가 전달된 경우, 이를 사용하여 데이터 요청
    if (filter) {
      setPostFilter(filter as any);
      fetchPosts(filter as any);
    } else {
      // 기본 필터로 데이터 요청 (이미 로드된 경우 중복 요청하지 않음)
      fetchPosts();
    }
  }, [filter]);

  // <Loading /> // 존재하지 않아 임시 주석 처리

  // if (postLoading && posts.length === 0) {
  //   return <Loading />;
  // }

  if (postError) {
    return <div>Error: {postError}</div>;
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {/* <PostListHeader selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} /> */}

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
