import React from 'react';
import { Box, Button, styled } from '@mui/material';
import { useTranslation } from '../../../../shared/i18n';

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
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * 카테고리 선택 탭 컴포넌트
 * 여행, 취업, 유학, 거주 등의 카테고리를 선택할 수 있는 봄 테마 스타일의 탭 UI
 */
const CategoryTabs: React.FC<CategoryTabsProps> = ({ selectedCategory, onCategoryChange }) => {
  const { t } = useTranslation();
  
  // 카테고리 목록 정의 (내부값과 표시값 분리)
  const categories = [
    { key: 'all', value: '전체', displayName: t('community.filters.all') }, // 내부값: '전체', 표시값: 번역된 텍스트
    { key: 'travel', value: 'travel', displayName: t('community.categories.travel') },
    { key: 'living', value: 'living', displayName: t('community.categories.living') },
    { key: 'study', value: 'study', displayName: t('community.categories.study') },
    { key: 'job', value: 'job', displayName: t('community.categories.job') },
  ];
  
  return (
    <TabContainer>
      {categories.map((category) => (
        <SpringTab
          key={category.key}
          active={selectedCategory === category.value}
          onClick={() => onCategoryChange(category.value)}
          disableElevation
        >
          {category.displayName}
        </SpringTab>
      ))}
    </TabContainer>
  );
};

export default CategoryTabs;
