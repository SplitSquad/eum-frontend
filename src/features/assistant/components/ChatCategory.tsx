'use client';

import React from 'react';

// Category 타입 정의: key는 내부 식별자, label은 화면 표시명
export interface Category {
  key: string; // 내부 식별자 (예: 'all', 'visa', ...)
  label: string; // 사용자에게 보여줄 이름 (예: '전체', '체류자격/비자', ...)
}

// 사이드바 컴포넌트에 전달할 props 타입 정의
interface CategorySidebarProps {
  categories: Category[];
  selectedKey: string; // 현재 선택된 카테고리의 key
  onSelect: (key: string) => void; // 카테고리 선택 핸들러
}

/**
 * CategorySidebar 컴포넌트
 * - 카테고리 목록을 사이드바 형태로 렌더링
 * - 클릭시 선택된 카테고리 업데이트
 */
export default function CategorySidebar({ categories, selectedKey, onSelect }: CategorySidebarProps) {
  return (
    <div className="w-64 bg-white rounded-lg shadow p-4 space-y-2">
      {/* 카테고리 리스트 (클릭 가능한 버튼) */}
      {categories.map(cat => {
        const isSelected = cat.key === selectedKey;
        return (
          <div
            key={cat.key}
            className={`
              flex items-center w-full text-left px-3 py-2 rounded-lg cursor-pointer
              ${isSelected ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
            `}
            onClick={() => onSelect(cat.key)}
          >
            <span className="ml-2">{cat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
