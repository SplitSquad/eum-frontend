import React from 'react';
import { Link } from 'react-router-dom';
import { TableCell, TableRow, Chip, Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PostSummary } from '../../types-folder/index';

interface PostListItemProps {
  post: PostSummary;
}

/**
 * 게시글 목록의 각 행(row)을 표시하는 컴포넌트
 */
const PostListItem: React.FC<PostListItemProps> = ({ post }) => {
  // 날짜 포맷팅 (현재는 ISO 문자열 형태로 들어온다고 가정)
  const formattedDate = post.createdAt
    ? format(new Date(post.createdAt), 'yyyy.MM.dd', { locale: ko })
    : '';

  return (
    <TableRow
      hover
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 170, 165, 0.05)',
        },
        transition: 'background-color 0.2s',
      }}
    >
      {/* 번호 */}
      <TableCell align="center">{post.postId}</TableCell>

      {/* 카테고리 */}
      <TableCell align="center">
        <Chip
          label={post.category}
          size="small"
          sx={{
            bgcolor: 'rgba(255, 235, 235, 0.8)',
            color: '#FF6B6B',
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        />
      </TableCell>

      {/* 제목 */}
      <TableCell align="left">
        <Link
          to={`/community/post/${post.postId}`}
          style={{
            textDecoration: 'none',
            color: '#333',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {post.title}

          {/* 댓글 수가 있으면 표시 */}
          {post.commentCount > 0 && (
            <Typography
              component="span"
              sx={{
                color: '#FF6B6B',
                ml: 1,
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}
            >
              [{post.commentCount}]
            </Typography>
          )}
        </Link>
      </TableCell>

      {/* 작성자 */}
      <TableCell align="center">{post.writer?.nickname || '익명'}</TableCell>

      {/* 작성일 */}
      <TableCell align="center">{formattedDate}</TableCell>

      {/* 조회수 */}
      <TableCell align="center">{post.viewCount}</TableCell>

      {/* 추천수 */}
      <TableCell align="center">{post.likeCount}</TableCell>
    </TableRow>
  );
};

export default PostListItem;
