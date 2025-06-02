'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useTranslation } from '../../../shared/i18n';
import LampIcon from '@/assets/icons/common/전등.png';

// Category 타입 정의: key는 내부 식별자, label은 화면 표시명
export interface Category {
  key: string; // 내부 식별자 (예: 'all', 'visa', ...)
  label: string; // 사용자에게 보여줄 이름 (예: '전체', '체류자격/비자', ...)
}

// 사이드바 컴포넌트에 전달할 props 타입 정의
interface CategorySidebarProps {
  categories: Category[];
  selectedKey: string; // 현재 선택된 카테고리의 key
  horizontal?: boolean;
}

/**
 * CategorySidebar 컴포넌트
 * - 조선시대 벽보/필사본 느낌의 한지 질감과 현대적 스타일을 조화시킨 카테고리 사이드바
 * - 클릭 비활성화: 시각적 피드백만 제공
 */
const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedKey,
  horizontal,
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative" style={{ width: '100%' }}>
      {/* 메인 카테고리 패널 */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `
            linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%)
          `,
          borderRadius: '16px',
          border: '2px solid rgba(120, 120, 120, 0.13)',
          boxShadow: `
            0 8px 32px rgba(120, 120, 120, 0.10),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(120, 120, 120, 0.08)
          `,
          backdropFilter: 'blur(10px)',
          paddingTop: 12,
          paddingBottom: 8,
          width: '100%',
        }}
      >
        {/* 상단 아이콘 + 텍스트 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            minHeight: 32,
            marginBottom: 4,
            gap: 8,
            rowGap: 2,
            textAlign: 'left',
            width: '100%',
            wordBreak: 'keep-all',
          }}
        >
          <img
            src={LampIcon}
            alt="분야별 안내"
            style={{ height: 24, width: 24, objectFit: 'contain', flexShrink: 0 }}
          />
          <span
            style={{
              fontWeight: 700,
              color: '#555',
              fontSize: 19,
              fontFamily: 'Inter, Pretendard, Arial, sans-serif',
              letterSpacing: '0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
              lineHeight: 1.3,
              minWidth: 0,
              wordBreak: 'keep-all',
            }}
          >
            {t('aiAssistant.sidebar.title')}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginLeft: 10,
                flexWrap: 'wrap',
                minWidth: 0,
                wordBreak: 'keep-all',
              }}
            >
              <span style={{ color: '#888', fontSize: 17, fontWeight: 700 }}>*</span>
              <span
                style={{
                  fontStyle: 'italic',
                  color: '#888',
                  fontWeight: 500,
                  fontSize: 14,
                  wordBreak: 'keep-all',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.3,
                }}
              >
                {t('aiAssistant.sidebar.autoSelectInfo')}
              </span>
            </span>
          </span>
        </div>
        {/* 카테고리 리스트 */}
        <Box
          sx={
            horizontal
              ? {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  flexWrap: 'wrap',
                  width: '100%',
                  pb: 1,
                }
              : {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  width: '100%',
                }
          }
        >
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
                        'linear-gradient(135deg, rgba(180, 180, 180, 0.13) 0%, rgba(120, 120, 120, 0.07) 100%)',
                      boxShadow: 'inset 0 1px 3px rgba(180, 180, 180, 0.18)',
                    }}
                  />
                )}
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
                      ${isSelected ? 'bg-gray-500 shadow-lg' : 'bg-gray-300'}
                    `}
                    style={{
                      boxShadow: isSelected ? '0 0 8px rgba(180, 180, 180, 0.4)' : 'none',
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
                        'linear-gradient(90deg, transparent 0%, rgba(120, 120, 120, 0.08) 50%, transparent 100%)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </Box>
      </div>
      {/* 사이드 장식 요소들 */}
      <div
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(180, 180, 180, 0.18) 0%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />
      <div
        className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(120, 120, 120, 0.13) 0%, transparent 70%)',
          filter: 'blur(3px)',
        }}
      />
    </div>
  );
};

export default CategorySidebar;
