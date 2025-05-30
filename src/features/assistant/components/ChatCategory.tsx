'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useTranslation } from '../../../shared/i18n';

// Category 타입 정의: key는 내부 식별자, label은 화면 표시명
export interface Category {
  key: string; // 내부 식별자 (예: 'all', 'visa', ...)
  label: string; // 사용자에게 보여줄 이름 (예: '전체', '체류자격/비자', ...)
}

// 사이드바 컴포넌트에 전달할 props 타입 정의
interface CategorySidebarProps {
  categories: Category[];
  selectedKey: string; // 현재 선택된 카테고리의 key
  // onSelect 제거: 외부에서 props로만 바꾸도록
}

/**
 * CategorySidebar 컴포넌트
 * - 조선시대 벽보/필사본 느낌의 한지 질감과 현대적 스타일을 조화시킨 카테고리 사이드바
 * - 클릭 비활성화: 시각적 피드백만 제공
 */
export default function CategorySidebar({ categories, selectedKey }: CategorySidebarProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      {/* 메인 카테고리 패널 */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `
            linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 245, 230, 0.95) 100%)
          `,
          borderRadius: '16px',
          border: '2px solid rgba(139, 69, 19, 0.2)',
          boxShadow: `
            0 8px 32px rgba(139, 69, 19, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(139, 69, 19, 0.1)
          `,
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* 상단 헤더 */}
        <div
          className="px-6 py-4 border-b"
          style={{
            borderColor: 'rgba(139, 69, 19, 0.15)',
            background:
              'linear-gradient(90deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 69, 19, 0.05) 100%)',
          }}
        >
          <h3
            className="text-lg font-bold text-center"
            style={{
              color: '#8B4513',
              fontFamily: '"Noto Serif KR", serif',
              letterSpacing: '0.05em',
              textShadow: '0 1px 2px rgba(139, 69, 19, 0.1)',
            }}
          >
            {t('aiAssistant.sidebar.title')}
          </h3>
          <div
            className="mt-2 h-0.5 mx-auto w-16"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            }}
          />
        </div>

        {/* 카테고리 리스트 */}
        <div className="p-4 space-y-2">
          {categories.map((cat, index) => {
            const isSelected = cat.key === selectedKey;
            return (
              <div
                key={cat.key}
                className={`
                  relative group transition-all duration-300
                  ${isSelected ? 'transform scale-105' : 'hover:scale-102'}
                `}
                style={{
                  cursor: 'default',
                }}
              >
                {/* 선택된 항목 배경 */}
                {isSelected && (
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(139, 69, 19, 0.1) 100%)',
                      boxShadow: 'inset 0 1px 3px rgba(212, 175, 55, 0.3)',
                    }}
                  />
                )}

                {/* 호버 효과
                <div
                  className={`
                    absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300
                    ${!isSelected ? 'group-hover:opacity-100' : ''}
                  `}
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(139, 69, 19, 0.05) 0%, rgba(160, 82, 45, 0.05) 100%)',
                  }}
                /> */}

                {/* 카테고리 내용 */}
                <div
                  className={`
                    relative flex items-center px-4 py-3 rounded-lg transition-all duration-300
                    ${isSelected ? 'text-amber-800 font-semibold' : 'text-gray-700 font-medium'}
                  `}
                  style={{
                    fontFamily: '"Noto Sans KR", sans-serif',
                    letterSpacing: '0.02em',
                  }}
                >
                  {/* 선택 표시 점 */}
                  <div
                    className={`
                      w-2 h-2 rounded-full mr-3 transition-all duration-300
                      ${isSelected ? 'bg-amber-600 shadow-lg' : 'bg-gray-300'}
                    `}
                    style={{
                      boxShadow: isSelected ? '0 0 8px rgba(212, 175, 55, 0.6)' : 'none',
                    }}
                  />

                  {/* 카테고리 라벨 */}
                  <span className="flex-1 select-none">{cat.label}</span>

                  {/* 선택된 항목 화살표 */}
                  {isSelected && (
                    <div
                      className="ml-2 text-amber-600 transition-transform duration-300"
                      style={{ fontSize: '12px' }}
                    >
                      ▶
                    </div>
                  )}
                </div>

                {/* 하단 구분선 (마지막 항목 제외) */}
                {index < categories.length - 1 && (
                  <div
                    className="absolute bottom-0 left-4 right-4 h-px"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(139, 69, 19, 0.1) 50%, transparent 100%)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 하단 장식 */}
        <div
          className="px-6 py-3 border-t"
          style={{
            borderColor: 'rgba(139, 69, 19, 0.15)',
            background:
              'linear-gradient(90deg, rgba(139, 69, 19, 0.02) 0%, rgba(212, 175, 55, 0.05) 50%, rgba(139, 69, 19, 0.02) 100%)',
          }}
        >
          <div className="text-center">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs"
              style={{
                background: 'rgba(139, 69, 19, 0.1)',
                color: '#8B4513',
                fontFamily: '"Noto Sans KR", sans-serif',
                fontWeight: '500',
              }}
            >
              {t('aiAssistant.sidebar.autoSelectInfo')}
            </div>
          </div>
        </div>
      </div>

      {/* 사이드 장식 요소들 */}
      <div
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />
      <div
        className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139, 69, 19, 0.3) 0%, transparent 70%)',
          filter: 'blur(3px)',
        }}
      />
    </div>
  );
}
