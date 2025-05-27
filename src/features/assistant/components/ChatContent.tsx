'use client';

import React from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { useChatMessages } from '../utils/useChatMessages';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
//import { ChatContentProps } from '../types';

/**-----------------------------------웹로그 관련------------------------------------ **/
// userId 꺼내오는 헬퍼
export function getUserId(): number | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.userId ?? null;
  } catch {
    return null;
  }
}

// 로그 전송 타입 정의
interface WebLog {
  userId: number;
  content: string;
}

// BASE URL에 엔드포인트 설정
const BASE = import.meta.env.VITE_API_BASE_URL;

// 로그 전송 함수
export function sendWebLog(log: WebLog) {
  // jwt token 가져오기
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }
  fetch(`${BASE}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(log),
  }).catch(err => {
    console.error('WebLog 전송 실패:', err);
  });
  // 전송 완료
  console.log('WebLog 전송 성공:', log);
}
/**------------------------------------------------------------------------------------**/

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
 * - 조선시대 벽보/필사본 느낌의 한지 질감과 현대적 스타일을 조화시킨 채팅 인터페이스
 * - 필담을 나누는 듯한 느낌의 메시지 디자인
 * - 타자기 효과로 메시지를 한 글자씩 표시
 */
export default function ChatContent({
  categoryLabel = '전체',
  onCategoryChange,
}: ChatContentProps) {
  const { messages, input, setInput, loading, listRef, sendMessage } = useChatMessages(
    categoryLabel,
    onCategoryChange
  );

  return (
    <div className="h-full flex flex-col">
      {/* 메인 채팅 영역 */}
      <div
        className="flex-1 relative overflow-hidden"
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
        {/* 채팅 헤더 */}
        <div
          className="px-6 py-4 border-b"
          style={{
            borderColor: 'rgba(139, 69, 19, 0.15)',
            background:
              'linear-gradient(90deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 69, 19, 0.05) 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="text-lg font-bold"
              style={{
                color: '#8B4513',
                fontFamily: '"Noto Serif KR", serif',
                letterSpacing: '0.05em',
              }}
            >
              💬 필담 나누기
            </h3>
            <div
              className="px-3 py-1 rounded-full text-sm"
              style={{
                background: 'rgba(139, 69, 19, 0.1)',
                color: '#8B4513',
                fontFamily: '"Noto Sans KR", sans-serif',
                fontWeight: '500',
              }}
            >
              {categoryLabel} 분야
            </div>
          </div>
        </div>

        {/* 메시지 리스트 영역 */}
        <div
          ref={listRef}
          className="flex-1 overflow-auto p-6 space-y-4"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(245, 240, 225, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(240, 235, 210, 0.2) 0%, transparent 50%),
              linear-gradient(180deg, rgba(250, 245, 230, 0.1) 0%, rgba(245, 240, 225, 0.2) 100%)
            `,
          }}
        >
          {messages.map((m, index) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              {m.sender === 'user' ? (
                // 사용자 메시지 - 편지지 스타일
                <div className="max-w-[70%] group">
                  <div
                    className="relative p-4 rounded-2xl"
                    style={{
                      background: `
                        linear-gradient(145deg, rgba(139, 69, 19, 0.9) 0%, rgba(101, 67, 33, 0.95) 100%)
                      `,
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      boxShadow: `
                        0 4px 16px rgba(139, 69, 19, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `,
                      color: '#F5DEB3',
                      fontFamily: '"Noto Sans KR", sans-serif',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {/* 말풍선 꼬리 */}
                    <div
                      className="absolute top-4 -right-2 w-4 h-4 transform rotate-45"
                      style={{
                        background:
                          'linear-gradient(145deg, rgba(139, 69, 19, 0.9) 0%, rgba(101, 67, 33, 0.95) 100%)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        borderLeft: 'none',
                        borderBottom: 'none',
                      }}
                    />
                    <div className="relative z-10">{m.text}</div>
                  </div>
                  {/* 타임스탬프 */}
                  <div className="text-xs mt-1 text-right opacity-60" style={{ color: '#8B4513' }}>
                    방금 전
                  </div>
                </div>
              ) : (
                // AI 봇 메시지 - 한지 스타일
                <div className="max-w-[70%] group">
                  <div
                    className="relative p-4 rounded-2xl"
                    style={{
                      background: `
                        linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 245, 230, 0.95) 100%)
                      `,
                      border: '2px solid rgba(139, 69, 19, 0.2)',
                      boxShadow: `
                        0 4px 16px rgba(139, 69, 19, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.8)
                      `,
                      color: '#5D4037',
                      fontFamily: '"Noto Sans KR", sans-serif',
                      fontSize: '15px',
                      lineHeight: '1.7',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {/* 말풍선 꼬리 */}
                    <div
                      className="absolute top-4 -left-2 w-4 h-4 transform rotate-45"
                      style={{
                        background:
                          'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 245, 230, 0.95) 100%)',
                        border: '2px solid rgba(139, 69, 19, 0.2)',
                        borderRight: 'none',
                        borderBottom: 'none',
                      }}
                    />

                    {/* 한지 텍스처 오버레이 */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
                      style={{
                        backgroundImage: `
                          radial-gradient(circle at 2px 2px, rgba(139, 69, 19, 0.1) 1px, transparent 0)
                        `,
                        backgroundSize: '16px 16px',
                      }}
                    />

                    <div className="relative z-10">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <div className="mb-2 last:mb-0">{children}</div>,
                          strong: ({ children }) => (
                            <span className="font-semibold text-amber-800">{children}</span>
                          ),
                          em: ({ children }) => (
                            <span className="italic text-amber-700">{children}</span>
                          ),
                        }}
                        children={m.displayText ?? m.text}
                      />
                    </div>
                  </div>
                  {/* 타임스탬프 */}
                  <div className="text-xs mt-1 opacity-60" style={{ color: '#8B4513' }}>
                    AI 전문가
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 로딩 인디케이터 */}
          {loading && (
            <div className="flex justify-start mb-4">
              <div
                className="px-4 py-3 rounded-2xl"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 245, 230, 0.95) 100%)',
                  border: '2px solid rgba(139, 69, 19, 0.2)',
                  color: '#8B4513',
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">답변을 준비하고 있습니다...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 입력창 영역 */}
        <div
          className="px-6 py-4 border-t"
          style={{
            borderColor: 'rgba(139, 69, 19, 0.15)',
            background:
              'linear-gradient(90deg, rgba(139, 69, 19, 0.02) 0%, rgba(212, 175, 55, 0.05) 50%, rgba(139, 69, 19, 0.02) 100%)',
          }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
                disabled={loading}
                className="w-full px-4 py-3 rounded-full border-2 focus:outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderColor: 'rgba(139, 69, 19, 0.2)',
                  color: '#5D4037',
                  fontFamily: '"Noto Sans KR", sans-serif',
                  fontSize: '15px',
                  boxShadow: 'inset 0 2px 4px rgba(139, 69, 19, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                placeholder="궁금한 것을 자유롭게 물어보세요..."
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  e.target.style.boxShadow =
                    '0 0 0 3px rgba(212, 175, 55, 0.1), inset 0 2px 4px rgba(139, 69, 19, 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(139, 69, 19, 0.2)';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(139, 69, 19, 0.1)';
                }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="px-6 py-3 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background:
                  loading || !input.trim()
                    ? 'linear-gradient(145deg, rgba(139, 69, 19, 0.3) 0%, rgba(101, 67, 33, 0.3) 100%)'
                    : 'linear-gradient(145deg, rgba(139, 69, 19, 0.9) 0%, rgba(101, 67, 33, 0.95) 100%)',
                color: '#F5DEB3',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow:
                  loading || !input.trim()
                    ? 'none'
                    : '0 4px 16px rgba(139, 69, 19, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                fontFamily: '"Noto Sans KR", sans-serif',
                letterSpacing: '0.02em',
              }}
            >
              {loading ? '전송 중...' : '전송'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
