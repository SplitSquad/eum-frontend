'use client';

import React, { useState, useRef, useEffect } from 'react';
import { fetchChatbotResponse } from '@/features/assistant/api/ChatApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from '../../../shared/i18n';
import { useLanguageStore } from '@/features/theme/store/languageStore';
import { useAiAssistantStore } from '@/features/assistant/store/aiAssistantStore';

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

const BASE = import.meta.env.VITE_API_BASE_URL;
export function sendWebLog(log: WebLog) {
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
  console.log('WebLog 전송 성공:', log);
}

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  displayText?: string;
  isTyping?: boolean;
}

interface ChatContentProps {
  categoryLabel?: string;
  onCategoryChange?: (newKey: string) => void;
}

export default function ChatContent({
  categoryLabel = '전체',
  onCategoryChange,
}: ChatContentProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { messages, setMessages, loading, setLoading } = useAiAssistantStore();

  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  // 1. 전체 채팅 컨테이너의 높이 고정 (아래 style 참조)
  // 2. 내부 채팅 영역은 flex로 column 분리, 메시지리스트에만 overflow-auto

  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage = {
        id: Date.now(),
        sender: 'bot' as const,
        text: t('aiAssistant.chat.initialMessage'),
        displayText: t('aiAssistant.chat.initialMessage'),
        isTyping: false,
      };
      setMessages([initialMessage]);
    }
  }, [messages.length, t]);

  const prevLanguageRef = useRef(language);
  useEffect(() => {
    if (prevLanguageRef.current !== language) {
      const initialMessage = {
        id: Date.now(),
        sender: 'bot' as const,
        text: t('aiAssistant.chat.initialMessage'),
        displayText: t('aiAssistant.chat.initialMessage'),
        isTyping: false,
      };
      setMessages([initialMessage]);
      prevLanguageRef.current = language;
    }
  }, [language, t]);

  const sendMessage = async (query?: string) => {
    const text = query ?? input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    const userId = getUserId() ?? 0;
    const chatLogPayload = {
      UID: userId,
      ClickPath: location.pathname,
      TAG: null,
      CurrentPath: location.pathname,
      Event: 'chat',
      Content: text,
      Timestamp: new Date().toISOString(),
    };
    sendWebLog({ userId, content: JSON.stringify(chatLogPayload) });
    setInput('');
    setLoading(true);

    try {
      const data = await fetchChatbotResponse(text, '1');
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
      // (생략) 카테고리 등 기타 기능
      const rag = data.metadata?.rag_type;
      const map: Record<string, string> = {
        visa_law: 'visa',
        social_security: 'social',
        tax_finance: 'tax',
        medical_health: 'health',
        employment: 'employment',
        daily_life: 'life',
        all: 'all',
      };
      const newKey = rag && map[rag] ? map[rag] : undefined;
      if (newKey && onCategoryChange) onCategoryChange(newKey);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'bot',
          text: t('aiAssistant.errors.responseError'),
          displayText: t('aiAssistant.errors.responseError'),
          isTyping: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 타이핑 효과
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
  }, [messages[messages.length - 1]?.id]);

  // 메시지 추가 시 스크롤 하단
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // -------------- 여기부터 실제 레이아웃 ---------------

  return (
    // 최상단 div: 고정 높이 채팅 레이아웃(원하는 값으로 조정 가능)
    <div
      className="flex flex-col"
      style={{
        height: '600px', // ★ 고정 높이
        minHeight: '400px', // 필요시 조정
        maxHeight: '90vh',
        width: '100%',
      }}
    >
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          borderRadius: '16px',
          border: '2px solid rgba(139, 69, 19, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0, // flexbox 스크롤 안정화
          height: '100%',
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
              {t('aiAssistant.chat.title')}
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
              {t('aiAssistant.chat.currentField', { category: categoryLabel })}
            </div>
          </div>
        </div>

        {/* 메시지 리스트: 여기에만 스크롤 (height, minHeight 꼭 적용) */}
        <div
          ref={listRef}
          className="flex-1 overflow-auto p-6 space-y-4"
          style={{
            minHeight: 0,
            maxHeight: '100%',
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
                  <div className="text-xs mt-1 text-right opacity-60" style={{ color: '#8B4513' }}>
                    {t('aiAssistant.chat.justNow')}
                  </div>
                </div>
              ) : (
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
                  <div className="text-xs mt-1 opacity-60" style={{ color: '#8B4513' }}>
                    {t('aiAssistant.chat.aiExpert')}
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
                  <span className="text-sm font-medium">{t('aiAssistant.chat.loading')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* 입력창 */}
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
                placeholder={t('aiAssistant.chat.placeholder')}
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
              {loading ? t('aiAssistant.chat.sending') : t('aiAssistant.chat.send')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
