import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, Typography, styled } from '@mui/material';

// 게시글 타입 정의
type PostType = '모임' | '자유' | '전체';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 235, 235, 0.8)',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
  padding: '4px',
  '& .MuiToggleButtonGroup-grouped': {
    margin: '4px',
    border: 0,
    borderRadius: '16px !important',
    '&.Mui-selected': {
      backgroundColor: '#FFAAA5',
      color: '#fff',
      fontWeight: 'bold',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 170, 165, 0.2)',
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  fontWeight: 500,
  textTransform: 'none',
  minWidth: '80px',
  color: '#666',
  '&.Mui-selected': {
    color: 'white',
    backgroundColor: '#FFAAA5',
    '&:hover': {
      backgroundColor: '#FF9999',
    },
  },
}));

interface PostTypeSelectorProps {
  selectedPostType: PostType;
  onChange: (postType: PostType) => void;
}

/**
 * 게시글 타입(자유/모임) 선택 컴포넌트
 */
const PostTypeSelector: React.FC<PostTypeSelectorProps> = ({ selectedPostType, onChange }) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newPostType: PostType | null,
  ) => {
    if (newPostType !== null) {
      onChange(newPostType);
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          mr: 2,
          color: '#666',
        }}
      >
        게시글 유형:
      </Typography>
      <StyledToggleButtonGroup
        value={selectedPostType}
        exclusive
        onChange={handleChange}
        aria-label="게시글 유형"
      >
        <StyledToggleButton value="자유" aria-label="자유 게시글">
          자유
        </StyledToggleButton>
        <StyledToggleButton value="모임" aria-label="모임 게시글">
          모임
        </StyledToggleButton>
        <StyledToggleButton value="전체" aria-label="전체 게시글">
          전체
        </StyledToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default PostTypeSelector; 