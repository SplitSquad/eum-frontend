'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Container from '@/components/layout/Contianer';
import CategorySidebar, { Category } from '@/features/assistant/components/ChatCategory';
import ChatContent from '@/features/assistant/components/ChatContent';

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
  const selected = categories.find(c => c.key === selectedKey)!;

  return (
    // 공통 레이아웃 감싸기(AppLayout 내부에 헤더/푸터/모달 챗봇 포함)
    <>
      {/* 페이지 고정 너비 및 패딩을 주는 컨테이너 */}
      <Container>
        <div className="flex h-screen overflow-hidden space-x-6 py-8">
          {/* 사이드바: 카테고리 목록 전달, 선택 시 setSelectedKey 호출 (key는 챗봇 카테고리 변경에 사용) */}
          <CategorySidebar
            categories={categories}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
          />

          {/* 메인 채팅 영역: 선택된 카테고리 라벨과 카테고리 변경 함수 전달 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatContent categoryLabel={selected.label} onCategoryChange={setSelectedKey} />
          </div>
        </div>
      </Container>
    </>
  );
}
