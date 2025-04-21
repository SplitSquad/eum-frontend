import React from 'react';
import { Box, Button, styled } from '@mui/material';
import { CategoryType } from '../../types';

// 봄 테마 스타일의 탭 버튼
const SpringTab = styled(Button, {
  shouldForwardProp: prop => prop !== 'active',
})<{ active: boolean }>(({ active, theme }) => ({
  position: 'relative',
  padding: '10px 24px',
  borderRadius: '20px',
  fontSize: '1rem',
  fontWeight: active ? 600 : 400,
  color: active ? '#fff' : '#888',
  backgroundColor: active ? '#FFAAA5' : 'rgba(255, 255, 255, 0.7)',
  border: active ? 'none' : '1px solid rgba(255, 235, 235, 0.8)',
  boxShadow: active ? '0 4px 12px rgba(255, 170, 165, 0.3)' : 'none',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  marginRight: '8px',

  '&:hover': {
    backgroundColor: active ? '#FF9999' : 'rgba(255, 245, 245, 0.9)',
    transform: 'translateY(-2px)',
  },

  '&::after': active
    ? {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '120%',
        height: '120%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'ripple 1.5s ease-out infinite',
      }
    : {},

  '@keyframes ripple': {
    '0%': {
      width: '0%',
      height: '0%',
      opacity: 0.4,
    },
    '100%': {
      width: '120%',
      height: '120%',
      opacity: 0,
    },
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '0.85rem',
    padding: '8px 16px',
  },
}));

// 탭 컨테이너
const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: '8px',
  backgroundColor: 'rgba(255, 245, 245, 0.6)',
  borderRadius: '24px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 235, 235, 0.8)',
  margin: '0 auto 24px auto',
  maxWidth: 'fit-content',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'center',
  },
}));

interface CategoryTabsProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

/**
 * 카테고리 선택 탭 컴포넌트
 * 모임/자유 카테고리를 선택할 수 있는 봄 테마 스타일의 탭 UI
 */
const CategoryTabs: React.FC<CategoryTabsProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <TabContainer>
      <SpringTab
        active={selectedCategory === '모임'}
        onClick={() => onCategoryChange('모임')}
        disableElevation
      >
        모임
      </SpringTab>
      <SpringTab
        active={selectedCategory === '자유'}
        onClick={() => onCategoryChange('자유')}
        disableElevation
      >
        자유
      </SpringTab>
    </TabContainer>
  );
};

export default CategoryTabs;
