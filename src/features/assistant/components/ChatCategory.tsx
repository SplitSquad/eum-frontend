'use client';

import React from 'react';
import { Box } from '@mui/material';
import { CategorySidebarProps } from '../types';
import '../styles/ChatCategory.css';
/**
 * CategorySidebar 컴포넌트
 * - 카테고리 목록을 사이드바 형태로 렌더링
 * - 클릭 비활성화: 시각적 피드백만 제공
 */
export default function CategorySidebar({ categories, selectedKey }: CategorySidebarProps) {
  return (
    <aside className="category-sidebar">
      {categories.map(cat => {
        const isSelected = cat.key === selectedKey;
        return (
          <div key={cat.key} className={isSelected ? 'category-item selected' : 'category-item'}>
            <span className="category-label">{cat.label}</span>
          </div>
        );
      })}
    </aside>
  );
}
