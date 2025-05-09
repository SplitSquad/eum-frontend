'use client';

import React, { useState, useRef, useEffect } from 'react';
import { fetchChatbotResponse } from '@/features/assistant/api/ChatApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 채팅 메시지 객체 형태 정의
interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  displayText?: string;
  isTyping?: boolean;
}

// ChatContent 컴포넌트 props 타입 정의
interface ChatContentProps {
  categoryLabel?: string;
  onCategoryChange?: (newKey: string) => void;
}

/**
 * ChatContent 컴포넌트
 * - AI 챗봇과의 상호작용 UI를 렌더링하고,
 *   타자기 효과로 메시지를 한 글자씩 표시합니다.
 */
export default function ChatContent({
  categoryLabel = '전체',
  onCategoryChange,
}: ChatContentProps) {
  // 메시지 목록, 초기 봇 메시지 포함
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      sender: 'bot',
      text: '무엇을 도와드릴까요?',
      displayText: '무엇을 도와드릴까요?',
      isTyping: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  /**
   * 메시지 전송 핸들러
   */
  const sendMessage = async (query?: string) => {
    const text = query ?? input.trim();
    if (!text) return;

    // 사용자 메시지 추가
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const data = await fetchChatbotResponse(text, '1');
      // 봇 메시지 placeholder 추가
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: data.response,
          displayText: '',
          isTyping: true,
        },
      ]);

      // 예시: 카테고리 매핑 로직
      const map: Record<string, string> = {
        visa_law: 'visa',
        social_security: 'social',
        tax_finance: 'tax',
        medical_health: 'health',
        employment: 'employment',
        daily_life: 'life',
        all: 'all',
      };
      const rag = data.metadata?.rag_type;
      const newKey = rag && map[rag] ? map[rag] : undefined;
      if (newKey && onCategoryChange) onCategoryChange(newKey);
    } catch (error) {
      // 오류 메시지
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'bot',
          text: '응답 중 오류가 발생했습니다.',
          displayText: '응답 중 오류가 발생했습니다.',
          isTyping: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 타자기(타이핑) 효과: 마지막 봇 메시지를 한 글자씩 표시
   */
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.sender === 'bot' && last.isTyping) {
      let idx = 0;
      const { text, id: msgId } = last;
      const interval = setInterval(() => {
        idx += 1;
        setMessages(prev => {
          const copy = [...prev];
          if (copy[copy.length - 1].id === msgId) {
            copy[copy.length - 1] = {
              ...copy[copy.length - 1],
              displayText: text.slice(0, idx),
              isTyping: idx < text.length,
            };
          }
          return copy;
        });
        if (idx >= text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
    // 마지막 메시지 id 변경 시에만 effect 실행
  }, [messages[messages.length - 1]?.id]);

  /**
   * 메시지 추가 시 자동으로 스크롤 하단으로 이동
   */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100">
      {/* 헤더 영역 */}
      <div className="px-6 py-4 bg-white border-b">
        <h1 className="text-2xl font-bold inline">{categoryLabel} AI 비서</h1>
        <span className="ml-4 text-gray-600">
          {new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(
            new Date()
          )}
        </span>
        <p className="mt-2 text-gray-700">안녕하세요! {categoryLabel} AI 비서입니다.</p>
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

      {/* 메시지 리스트 영역 */}
      <div ref={listRef} className="overflow-auto p-2 space-y-3 bg-gray-50 h-[50vh]">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'user' ? (
              <span className="inline-block px-4 py-2 rounded-xl max-w-[70%] break-words bg-blue-500 text-white">
                {m.text}
              </span>
            ) : (
              <span className="inline-block px-4 py-2 rounded-xl max-w-[70%] whitespace-pre-wrap break-words bg-gray-200 text-gray-800">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{ p: ({ children }) => <>{children}</> }}
                  children={m.displayText ?? m.text}
                />
              </span>
            )}
          </div>
        ))}
        {loading && <div className="text-center text-gray-500">답변 중...</div>}
      </div>

      {/* 입력창 영역 */}
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
