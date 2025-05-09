import React from 'react';
import { TableCell, TableRow } from '@mui/material';

/**
 * 게시글이 없을 때 표시되는 빈 행 컴포넌트
 */
const PostListEmptyRow: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
        게시글이 없습니다. 첫 번째 게시글을 작성해보세요!
      </TableCell>
    </TableRow>
  );
};

export default PostListEmptyRow; 