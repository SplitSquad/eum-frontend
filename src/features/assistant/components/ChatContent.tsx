'use client';

import React, { useState, useRef, useEffect } from 'react';
import { fetchChatbotResponse } from '@/features/assistant/api/ChatApi';

// Message 인터페이스: 채팅 목록에 사용되는 메시지 객체 타입 정의
interface Message {
  id: number; // 고유 ID (렌더링 키로 사용)
  sender: 'user' | 'bot'; // 발신자 구분(user: 사용자, bot: 챗봇)
  text: string; // 채팅 내용 텍스트
}

// ChatContent 컴포넌트의 props 타입 정의
interface ChatContentProps {
  categoryLabel?: string; // 현재 카테고리명 (헤더에 표시)
  onCategoryChange?: (newKey: string) => void; // 챗봇 응답에 따라 카테고리 변경 요청 함수
}

/**
 * ChatContent 컴포넌트
 * - 카테고리별 AI 챗봇 상호작용 UI 및 로직을 담당
 */

export default function ChatContent({
  categoryLabel = '전체', // 기본값: '전체'
  onCategoryChange,
}: ChatContentProps) {
  // 채팅 메시지 목록을 관리하는 state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      sender: 'bot',
      text: `무엇을 도와드릴까요?`, // 초기 봇 환영 메시지
    },
  ]);
  // 입력창 텍스트 관리
  const [input, setInput] = useState('');
  // 로딩 상태 (응답 중) 관리
  const [loading, setLoading] = useState(false);
  // 메시지 리스트 스크롤 컨트롤을 위한 ref
  const listRef = useRef<HTMLDivElement>(null);

  /**
   * 사용자 입력 또는 추천 질문 클릭 시 메시지를 전송하고,
   * 챗봇 응답을 받아 상태 업데이트
   */

  const sendMessage = async (query?: string) => {
    const text = query ?? input.trim();
    if (!text) return; // 빈 메시지 방지

    // 사용자 메시지 추가
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setInput(''); // 입력창 초기화
    setLoading(true); // 로딩 시작

    try {
      // API 호출: 챗봇 응답 가져오기
      const data = await fetchChatbotResponse(text, '1');
      // 봇 응답 메시지 추가
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.response }]);

      // 응답 metadata를 기반으로 카테고리 매핑 및 변경 요청
      const map: Record<string, string> = {
        visa_law: 'visa',
        social_security: 'social',
        tax_finance: 'tax',
        medical_health: 'health',
        employment: 'life',
        daily_life: 'life',
        all: 'all',
      };
      const rag = data.metadata?.rag_type;
      const newKey = rag && map[rag] ? map[rag] : undefined;
      if (newKey && onCategoryChange) {
        onCategoryChange(newKey); // 사이드바 카테고리 변경
      }
    } catch (error) {
      // 오류 시 에러 메시지 추가
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 2, sender: 'bot', text: '응답 중 오류가 발생했습니다.' },
      ]);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // messages 또는 loading이 바뀔 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100">
      {/* 헤더 영역: 카테고리명, 현재 시간, 추천 질문 (추천 질문은 삭제해도 무방) */}
      <div className="px-6 py-4 bg-white border-b">
        <h1 className="text-2xl font-bold inline">{categoryLabel} AI 비서</h1>

        {/* 실시간 시간 표시 */}
        <span className="ml-4 text-gray-600">
          {new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(
            new Date()
          )}
        </span>
        <p className="mt-2 text-gray-700">
          안녕하세요! {categoryLabel} AI 비서입니다. 무엇을 도와드릴까요?
        </p>

        {/* 추천 질문 버튼 목록 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['한국에서 필요한 기본 서류는?', '한국에서 일하려면?', '한국어 배우는 방법?'].map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 채팅 메시지 리스트 */}
      <div ref={listRef} className="overflow-auto p-2 space-y-3 bg-gray-50 h-[50vh]">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-xl max-w-[70%] break-words ${
                m.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}

        {/* 로딩 표시 */}
        {loading && <div className="text-center text-gray-500">답변 중...</div>}
      </div>

      {/* 입력창 영역: 텍스트 입력 + 전송 버튼 */}
      <div className="px-6 py-4 bg-white border-t flex items-center">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
          disabled={loading}
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring disabled:opacity-50"
          placeholder="질문을 입력하세요..."
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          className="ml-4 px-6 py-2 bg-indigo-600 text-white rounded-full disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </div>
  );
}
