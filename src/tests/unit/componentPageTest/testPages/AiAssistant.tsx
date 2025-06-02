'use client';

import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import CategorySidebar, { Category } from '@/features/assistant/components/ChatCategory';
import ChatContent from '@/features/assistant/components/ChatContent';
import { Box, Typography } from '@mui/material';
import { useTranslation } from '../../../../shared/i18n';
import { useLanguageStore } from '@/features/theme/store/languageStore';
import { useAiAssistantStore } from '@/features/assistant/store/aiAssistantStore';

// Chatbot에서 다룰 각 정보 분류(카테고리)를 여기서 정의
const getCategoriesWithTranslation = (t: any): Category[] => [
  { key: 'all', label: t('aiAssistant.categories.all') },
  { key: 'visa', label: t('aiAssistant.categories.visa') },
  { key: 'social', label: t('aiAssistant.categories.social') },
  { key: 'tax', label: t('aiAssistant.categories.tax') },
  { key: 'health', label: t('aiAssistant.categories.health') },
  { key: 'employment', label: t('aiAssistant.categories.employment') },
  { key: 'life', label: t('aiAssistant.categories.life') },
];

/**
 * AiAssistant 컴포넌트
 * - 조선시대 벽보/필사본 느낌의 한지 질감과 현대적 스타일을 조화시킨 AI 전문가 페이지
 */

function formatDateTime(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

export default function AiAssistant() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { selectedCategory, setSelectedCategory, forceRefresh } = useAiAssistantStore();

  // 번역된 카테고리 목록 생성
  const categories = getCategoriesWithTranslation(t);

  // 선택된 key에 해당하는 카테고리 객체를 찾도록 구현
  const selected = categories.find(c => c.key === selectedCategory)!;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 한지 질감 배경 */}
      <div
        className="absolute inset-0 opacity-95"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(245, 240, 225, 0.8) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(240, 235, 210, 0.6) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(250, 245, 230, 0.7) 0%, transparent 50%),
            linear-gradient(135deg, #faf7f0 0%, #f5f2e8 25%, #f0ede0 50%, #ebe8db 75%, #e6e3d6 100%)
          `,
          backgroundSize: '400px 400px, 300px 300px, 500px 500px, 100% 100%',
          backgroundPosition: '0 0, 100% 100%, 50% 50%, 0 0',
        }}
      />

      {/* 한지 텍스처 오버레이 */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(139, 69, 19, 0.15) 1px, transparent 0),
            radial-gradient(circle at 3px 3px, rgba(160, 82, 45, 0.1) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px, 40px 40px',
        }}
      />

      {/* 메인 컨테이너 */}
      <div className="relative z-10 min-h-screen">
        {/* 상단 헤더 - 조선시대 현판 스타일 */}
        <div className="relative mb-8">
          {/* 현판 배경 */}
          <div
            className="mx-auto max-w-4xl relative"
            style={{
              background: 'linear-gradient(145deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
              borderRadius: '12px 12px 4px 4px',
              padding: '2px',
              boxShadow:
                '0 8px 32px rgba(139, 69, 19, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              className="relative px-8 py-6 text-center"
              style={{
                background: 'linear-gradient(145deg, #2C1810 0%, #3D2317 50%, #2C1810 100%)',
                borderRadius: '10px 10px 2px 2px',
                border: '1px solid rgba(139, 69, 19, 0.3)',
              }}
            >
              {/* 장식 모서리 */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-600 opacity-60"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-600 opacity-60"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-600 opacity-60"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-600 opacity-60"></div>

              <h1
                className="text-4xl font-bold mb-2"
                style={{
                  color: '#D4AF37',
                  fontFamily: '"Noto Serif KR", serif',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(212, 175, 55, 0.3)',
                  letterSpacing: '0.1em',
                }}
              >
                {t('aiAssistant.title')}
              </h1>
              <p
                className="text-lg opacity-90"
                style={{
                  color: '#F5DEB3',
                  fontFamily: '"Noto Serif KR", serif',
                  letterSpacing: '0.05em',
                }}
              >
                {t('aiAssistant.subtitle')}
              </p>
            </div>
          </div>

          {/* 현재 시간과 인사말 */}
          <div className="text-center mt-6 space-y-2">
            <div
              className="inline-block px-6 py-2 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(139, 69, 19, 0.2)',
                boxShadow: '0 4px 16px rgba(139, 69, 19, 0.1)',
              }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: '#8B4513', fontFamily: '"Noto Sans KR", sans-serif' }}
              >
                {formatDateTime(new Date())}
              </span>
            </div>
            <p
              className="text-lg"
              style={{
                color: '#5D4037',
                fontFamily: '"Noto Sans KR", sans-serif',
                fontWeight: '500',
              }}
            >
              {t('aiAssistant.greeting', { category: selected.label })}
            </p>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex gap-8 max-w-7xl mx-auto px-6 pb-8">
          {/* 왼쪽 사이드바 - 카테고리 */}
          <div className="w-80">
            <CategorySidebar categories={categories} selectedKey={selectedCategory} />
          </div>

          {/* 오른쪽 채팅 영역 */}
          <div className="flex-1">
            <ChatContent categoryLabel={selected.label} onCategoryChange={setSelectedCategory} />
          </div>
        </div>
      </div>

      {/* 추가 장식 요소들 */}
      <div className="fixed top-20 left-10 opacity-20 pointer-events-none">
        <div
          className="w-16 h-16 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 69, 19, 0.3) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
      </div>
      <div className="fixed bottom-20 right-10 opacity-20 pointer-events-none">
        <div
          className="w-20 h-20 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
      </div>
    </div>
  );
}
