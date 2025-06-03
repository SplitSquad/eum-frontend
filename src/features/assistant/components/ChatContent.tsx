'use client';

import React, { useState, useRef, useEffect } from 'react';
import { fetchChatbotResponse } from '@/features/assistant/api/ChatApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from '../../../shared/i18n';
import { useLanguageStore } from '@/features/theme/store/languageStore';
import { useAiAssistantStore } from '@/features/assistant/store/aiAssistantStore';
import EeumProfile from '@/assets/images/characters/이음이.png';
import { useTheme, useMediaQuery } from '@mui/material';

// 스크롤바 스타일 CSS
const scrollbarStyles = `
  .chat-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 69, 19, 0.5) rgba(139, 69, 19, 0.1);
  }
  
  .chat-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .chat-scrollbar::-webkit-scrollbar-track {
    background: rgba(139, 69, 19, 0.1);
    border-radius: 4px;
  }
  
  .chat-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(139, 69, 19, 0.5);
    border-radius: 4px;
    transition: background 0.3s ease;
  }
  
  .chat-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 69, 19, 0.7);
  }
`;

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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: Date.now(),
        sender: 'bot',
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
      const initialMessage: Message = {
        id: Date.now(),
        sender: 'bot',
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
        if (listRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = listRef.current;
          const isNearBottom = scrollTop + clientHeight >= scrollHeight - 20;
          if (isNearBottom) {
            listRef.current.scrollTo({
              top: listRef.current.scrollHeight,
              behavior: 'smooth',
            });
          }
        }
        if (idx >= text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [messages[messages.length - 1]?.id]);

  // 메시지 추가 시 스크롤 하단으로 부드럽게 이동
  useEffect(() => {
    if (listRef.current) {
      const scrollToEnd = () => {
        if (listRef.current) {
          listRef.current.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      };
      scrollToEnd();
      setTimeout(scrollToEnd, 100);
      setTimeout(scrollToEnd, 300);
    }
  }, [messages.length, loading]);

  // 타이핑 중에도 스크롤 따라가기
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.sender === 'bot' && last.isTyping && listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      if (isNearBottom) {
        requestAnimationFrame(() => {
          if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
          }
        });
      }
    }
  }, [messages[messages.length - 1]?.displayText]);

  // 스크롤 위치 감지하여 버튼 표시 여부 결정
  useEffect(() => {
    const handleScroll = () => {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 20;
        setShowScrollButton(!isNearBottom && messages.length > 3);
      }
    };
    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
      return () => listElement.removeEventListener('scroll', handleScroll);
    }
  }, [messages.length]);

  // 스크롤 맨 아래로 이동하는 함수
  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setShowScrollButton(false);
    }
  };

  return (
    <>
      <style>{scrollbarStyles}</style>

      {/* 최상단 div: 고정 높이 채팅 레이아웃 */}
      <div
        className="chat-area"
        style={{
          background: '#f7f8fa',
          borderRadius: 16,
          padding: isMobile ? 12 : 24,
          height: isMobile ? '60vh' : '70vh',
          boxShadow: '0 2px 8px rgba(80,80,90,0.06)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          className="flex-1 relative overflow-hidden"
          style={{
            borderRadius: '16px',
            border: '2px solid #e0e0e7',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            height: '100%',
          }}
        >
          {/* 채팅 헤더 */}
          <div
            className="px-6 py-4 border-b flex-shrink-0"
            style={{
              borderColor: '#e0e0e7',
              background: 'linear-gradient(90deg, #f7f7fa 0%, #ececf0 100%)',
            }}
          >
            <div className="flex items-center justify-between">
              <h3
                className="font-bold"
                style={{
                  color: '#444',
                  fontFamily: '"Noto Serif KR", serif',
                  letterSpacing: '0.05em',
                  fontSize: isMobile ? '1rem' : '1.125rem',
                }}
              >
                {t('aiAssistant.chat.title')}
              </h3>
              <div
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  background: '#f0f0f3',
                  color: '#555',
                  fontFamily: '"Noto Sans KR", sans-serif',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                }}
              >
                {t('aiAssistant.chat.currentField', { category: categoryLabel })}
              </div>
            </div>
          </div>

          {/* 메시지 리스트 */}
          <div
            ref={listRef}
            className="flex-1 overflow-auto p-6 space-y-4 chat-scrollbar relative"
            style={{
              minHeight: 0,
              background: `
                radial-gradient(circle at 20% 30%, rgba(220, 220, 230, 0.18) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(210, 210, 220, 0.13) 0%, transparent 50%),
                linear-gradient(180deg, #f7f8fa 0%, #ececf0 100%)
              `,
              scrollBehavior: 'smooth',
              padding: isMobile ? 8 : 24,
            }}
          >
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                } mb-4 items-end`}
              >
                {m.sender === 'user' ? (
                  <div className="max-w-[70%] group">
                    {/* 사용자 말풍선 (오른쪽) */}
                    <div
                      className="relative p-4 rounded-2xl"
                      style={{
                        background: `
                          linear-gradient(145deg, #e0e0e7 0%, #cfd0d7 100%)
                        `,
                        border: '1.5px solid #bfc0c7',
                        boxShadow: `
                          0 4px 16px rgba(120,120,130,0.10),
                          inset 0 1px 0 rgba(255,255,255,0.08)
                        `,
                        color: '#444',
                        fontFamily: '"Noto Sans KR", sans-serif',
                        fontSize: isMobile ? '0.875rem' : '15px',
                        lineHeight: isMobile ? 1.4 : 1.6,
                        letterSpacing: '0.02em',
                      }}
                    >
                      <div
                        className="absolute top-4 -right-2 w-4 h-4 transform rotate-45"
                        style={{
                          background: 'linear-gradient(145deg, #e0e0e7 0%, #cfd0d7 100%)',
                          border: '1.5px solid #bfc0c7',
                          borderLeft: 'none',
                          borderBottom: 'none',
                        }}
                      />
                      <div className="relative z-10">{m.text}</div>
                    </div>
                    <div
                      className="mt-1 text-right opacity-60"
                      style={{
                        color: '#888',
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                      }}
                    >
                      {t('aiAssistant.chat.justNow')}
                    </div>
                  </div>
                ) : (
                  <div className="flex max-w-[80%] group">
                    {/* 이음이 프로필 */}
                    <img
                      src={EeumProfile}
                      alt="이음이 프로필"
                      className="rounded-full object-cover flex-shrink-0"
                      style={{
                        width: isMobile ? 28 : 32,
                        height: isMobile ? 28 : 32,
                        marginRight: isMobile ? 8 : 12,
                        border: '2px solid #e0e0e7',
                        background: '#f7f8fa',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        className="relative p-4 rounded-2xl"
                        style={{
                          background: `
                            linear-gradient(145deg, #fff 0%, #ececf0 100%)
                        `,
                          border: '2px solid #e0e0e7',
                          boxShadow: `
                            0 4px 16px rgba(120,120,130,0.07),
                            inset 0 1px 0 rgba(255,255,255,0.08)
                        `,
                          color: '#444',
                          fontFamily: '"Noto Sans KR", sans-serif',
                          fontSize: isMobile ? '0.875rem' : '15px',
                          lineHeight: isMobile ? 1.5 : 1.7,
                          letterSpacing: '0.02em',
                        }}
                      >
                        <div
                          className="absolute top-4 -left-2 w-4 h-4 transform rotate-45"
                          style={{
                            background: 'linear-gradient(145deg, #fff 0%, #ececf0 100%)',
                            border: '2px solid #e0e0e7',
                            borderRight: 'none',
                            borderBottom: 'none',
                          }}
                        />
                        <div
                          className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 2px 2px, rgba(180, 180, 200, 0.08) 1px, transparent 0)
                          `,
                            backgroundSize: '16px 16px',
                          }}
                        />
                        <div className="relative z-10">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <div className="mb-1 last:mb-0">{children}</div>,
                              strong: ({ children }) => (
                                <span
                                  className="font-semibold text-gray-700"
                                  style={{
                                    fontSize: isMobile ? '0.875rem' : undefined,
                                  }}
                                >
                                  {children}
                                </span>
                              ),
                              em: ({ children }) => (
                                <span
                                  className="italic text-gray-500"
                                  style={{
                                    fontSize: isMobile ? '0.875rem' : undefined,
                                  }}
                                >
                                  {children}
                                </span>
                              ),
                            }}
                            children={m.displayText ?? m.text}
                          />
                        </div>
                      </div>
                      <div
                        className="mt-1 opacity-60"
                        style={{
                          color: '#888',
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                        }}
                      >
                        {t('aiAssistant.chat.aiExpert')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* 로딩 인디케이터 */}
            {loading && (
              <div className="flex justify-start mb-4">
                <div
                  className="px-3 py-2 rounded-2xl"
                  style={{
                    background: 'linear-gradient(145deg, #fff 0%, #ececf0 100%)',
                    border: '2px solid #e0e0e7',
                    color: '#888',
                    fontSize: isMobile ? '0.875rem' : '0.875rem',
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                    <span
                      className="font-medium"
                      style={{
                        fontSize: isMobile ? '0.875rem' : '0.875rem',
                        fontFamily: '"Noto Sans KR", sans-serif',
                      }}
                    >
                      {t('aiAssistant.chat.loading')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 스크롤 맨 아래로 이동 버튼 */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute"
              style={{
                bottom: isMobile ? 16 : 24,
                right: isMobile ? 16 : 32,
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                borderRadius: '50%',
                boxShadow:
                  '0 4px 16px rgba(120,120,130,0.13), inset 0 1px 0 rgba(255,255,255,0.08)',
                background: 'linear-gradient(145deg, #e0e0e7 0%, #cfd0d7 100%)',
                border: '1.5px solid #bfc0c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                zIndex: 10,
              }}
              title="최신 메시지로 이동"
            >
              <svg
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
                viewBox="0 0 24 24"
                fill="none"
                style={{ margin: 'auto' }}
              >
                <path
                  d="M7 14L12 19L17 14M12 19V5"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* 입력창 */}
          <div
            className="px-6 py-4 border-t flex-shrink-0"
            style={{
              borderColor: '#e0e0e7',
              background: 'linear-gradient(90deg, #f7f7fa 0%, #ececf0 100%)',
              position: 'sticky',
              bottom: 0,
              zIndex: 10,
              padding: isMobile ? '8px 12px' : '24px',
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
                  disabled={loading}
                  className="w-full rounded-full border-2 focus:outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.97)',
                    borderColor: '#e0e0e7',
                    color: '#444',
                    fontFamily: '"Noto Sans KR", sans-serif',
                    fontSize: isMobile ? '0.875rem' : '15px',
                    padding: isMobile ? '8px 12px' : '12px 16px',
                    boxShadow: 'inset 0 2px 4px rgba(180,180,200,0.07)',
                    backdropFilter: 'blur(10px)',
                  }}
                  placeholder={t('aiAssistant.chat.placeholder')}
                  onFocus={e => {
                    e.target.style.borderColor = '#bfc0c7';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(180,180,200,0.10), inset 0 2px 4px rgba(180,180,200,0.07)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e0e0e7';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(180,180,200,0.07)';
                  }}
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    loading || !input.trim()
                      ? 'linear-gradient(145deg, #e0e0e7 0%, #cfd0d7 100%)'
                      : 'linear-gradient(145deg, #bfc0c7 0%, #888a99 100%)',
                  color: loading || !input.trim() ? '#aaa' : '#fff',
                  border: '1.5px solid #bfc0c7',
                  boxShadow:
                    loading || !input.trim()
                      ? 'none'
                      : '0 4px 16px rgba(120,120,130,0.13), inset 0 1px 0 rgba(255,255,255,0.08)',
                  fontFamily: '"Noto Sans KR", sans-serif',
                  letterSpacing: '0.02em',
                  padding: isMobile ? '8px 12px' : '12px 16px',
                  fontSize: isMobile ? '0.875rem' : '15px',
                }}
              >
                {loading ? t('aiAssistant.chat.sending') : t('aiAssistant.chat.send')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
