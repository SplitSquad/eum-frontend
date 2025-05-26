'use client';

import React, { useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import CategorySidebar from '@/features/assistant/components/ChatCategory';
import { Category } from '@/features/assistant/types';
import ChatContent from '@/features/assistant/components/ChatContent';
import { Box, Typography } from '@mui/material';

// Chatbot에서 다룰 각 정보 분류(카테고리)를 여기서 정의
const categories: Category[] = [
  { key: 'all', label: '🌏 전체' },
  { key: 'visa', label: '📑 체류자격/비자' },
  { key: 'social', label: '🏛 사회보장제도' },
  { key: 'tax', label: '💰 세금/금융' },
  { key: 'health', label: '🚑 의료/건강' },
  { key: 'employment', label: '💼 구인/구직' },
  { key: 'life', label: '👨‍👩‍👧 일상생활' },
];

/**
 * AiAssistant 컴포넌트
 * - 챗봇 카테고리와 채팅 내용 두 개로 메인 레이아웃을 구성
 */

export default function AiAssistant() {
  // 현재 선택된 카테고리 키를 상태로 관리
  const [selectedKey, setSelectedKey] = useState<string>('all'); // default는 전체로 설정
  // 선택된 key에 해당하는 카테고리 객체를 찾도록 구현
  const selected = useMemo(() => categories.find(c => c.key === selectedKey)!, [selectedKey]);
  return (
    <>
      {/* 페이지 최상단 헤더 */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          px: 3,
          py: 2,
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: '#555',
            fontFamily: '"Noto Sans KR", sans-serif',
          }}
        >
          {selected.label} AI 비서
        </Typography>
        <span style={{ color: '#888', fontSize: 16 }}>
          {new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(
            new Date()
          )}
        </span>
        <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 16 }}>
          안녕하세요! {selected.label} AI 비서입니다.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['한국에서 필요한 기본 서류는?', '한국에서 일하려면?', '한국어 배우는 방법?'].map(q => (
            <button
              key={q}
              // ChatContent의 sendMessage를 prop으로 빼려면 리팩토링 필요. 일단 버튼만 노출.
              style={{
                padding: '4px 16px',
                background: '#e3f2fd',
                color: '#1976d2',
                borderRadius: 16,
                fontSize: 14,
                border: 'none',
                marginRight: 8,
                marginBottom: 8,
                cursor: 'pointer',
              }}
              disabled
            >
              {q}
            </button>
          ))}
        </Box>
      </Box>

      <div className="flex h-screen overflow-hidden space-x-6">
        {/* 사이드바: 카테고리 목록 전달, 선택 시 setSelectedKey 호출 (key는 챗봇 카테고리 변경에 사용) */}
        <CategorySidebar categories={categories} selectedKey={selectedKey} />

        {/* 메인 채팅 영역: 선택된 카테고리 라벨과 카테고리 변경 함수 전달 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatContent categoryLabel={selected.label} onCategoryChange={setSelectedKey} />
        </div>
      </div>
    </>
  );
}
