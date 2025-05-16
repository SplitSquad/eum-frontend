'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import Container from '@mui/material/Container';
import CategorySidebar from '@/features/assistant/components/ChatCategory';
import ChatContent from '@/features/assistant/components/ChatContent';
// Chatbot에서 다룰 각 정보 분류(카테고리)를 여기서 정의
const categories = [
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
    const [selectedKey, setSelectedKey] = useState('all'); // default는 전체로 설정
    // 선택된 key에 해당하는 카테고리 객체를 찾도록 구현
    const selected = categories.find(c => c.key === selectedKey);
    return (
    // 공통 레이아웃 감싸기(AppLayout 내부에 헤더/푸터/모달 챗봇 포함)
    _jsx(_Fragment, { children: _jsx(Container, { maxWidth: "lg", sx: {
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                position: 'relative',
                zIndex: 5,
            }, children: _jsxs("div", { className: "flex h-screen overflow-hidden space-x-6", children: [_jsx(CategorySidebar, { categories: categories, selectedKey: selectedKey }), _jsx("div", { className: "flex-1 flex flex-col overflow-hidden", children: _jsx(ChatContent, { categoryLabel: selected.label, onCategoryChange: setSelectedKey }) })] }) }) }));
}
