'use client';
import React, { useState, useRef, useEffect } from 'react';
import { callAgentic } from '@/shared/utils/Agentic';
import { useModalStore } from '@/shared/store/ModalStore';
import { useTranslation } from '@/shared/i18n';
import { useLanguageStore } from '@/features/theme/store/languageStore';
import EeumProfile from '@/assets/images/characters/이음이.png';
// import { callJobAgent, processCoverLetterResponse } from '@/shared/utils/JobAgent';
// import { CoverLetterState } from '@/types/CoverLetterTypes';

type Message = {
  id: number;
  sender: 'user' | 'bot';
  text?: string;
  imageUrl?: string;
  pdfUrl?: string;
  search?: { title: string; link: string }[];
  Amenities?: string;
  location?: {
    place_name: string;
    address_name: string;
    phone: string;
    distance: string;
  }[];
  post?: string;
  calendar_add?: string;
  calendar_edit?: string;
  calendar_delete?: string;
  calendar_check?: string;
};

// 타입 추가
interface ModalContentProps {
  adjustKey?: number;
  btnRect?: DOMRect;
}

export default function ModalContent({ adjustKey, btnRect }: ModalContentProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      sender: 'bot',
      text: t('aiAssistant.chat.initialMessage'),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const { openModal, content } = useModalStore();

  // 언어가 변경될 때 초기 메시지 업데이트
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: t('aiAssistant.chat.initialMessage'),
      },
    ]);
  }, [language, t]);

  const downloadImage = url => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'downloaded-image.jpg';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        console.error(t('common.errors.downloadFailed'), error);
      });
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // 모달 위치 보정: 모달의 오른쪽 아래가 btnRect의 왼쪽 위와 겹치도록
  useEffect(() => {
    if (modalRef.current && btnRect) {
      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;
      const x = btnRect.left - modalWidth;
      const y = btnRect.top - modalHeight;
      const w: any = window;
      if (w.__lastModalPos?.x === x && w.__lastModalPos?.y === y) return;
      w.__lastModalPos = { x, y };
      openModal(content, { x, y });
    }
    // eslint-disable-next-line
  }, [btnRect]);

  const sendMessage = async (msgText?: string) => {
    const text = (msgText ?? input).trim();
    if (!text) return;
    setInput('');
    const nextId = Date.now();
    setMessages(msgs => [...msgs, { id: nextId, sender: 'user', text }]);
    setLoading(true);
    try {
      // 👉 API 한 번만 호출
      const result = await callAgentic(text, 'user_id');
      console.log('[Agentic 응답 전체]', result);

      const { response, metadata, state, url } = result;

      // 👉 state나 metadata 활용하고 싶으면 여기서 처리
      console.log('State:', state);
      console.log('Metadata:', metadata);
      console.log('url:', url);

      // const targetStates = ['cover_letter_state', 'event_state', 'find_food', 'job_search', 'weather'];
      if (state == 'cover_letter_state' || state === 'resume_service_state') {
        setMessages(msgs => [
          ...msgs,
          { id: nextId + 1, sender: 'bot', text: response },
          { id: nextId + 2, sender: 'bot', pdfUrl: url },
        ]);
      } else if (state === 'find_food_state') {
        let parsedLocation = [];
        try {
          parsedLocation = JSON.parse(response.replace(/'/g, '"'));
        } catch (err) {
          console.error('위치 결과 파싱 실패:', err);
        }
        setMessages(msgs => [...msgs, { id: nextId + 1, sender: 'bot', location: parsedLocation }]);
      } else if (state == 'calendar_check_state') {
        setMessages(msgs => [...msgs, { id: nextId + 1, sender: 'bot', calendar_check: response }]);
      } else if (state == 'calendar_delete') {
        setMessages(msgs => [
          ...msgs,
          { id: nextId + 1, sender: 'bot', calendar_delete: response },
        ]);
      } else if (state == 'calendar_general_add') {
        setMessages(msgs => [...msgs, { id: nextId + 1, sender: 'bot', calendar_add: response }]);
      } else if (state == 'calendar_general_edit') {
        setMessages(msgs => [...msgs, { id: nextId + 1, sender: 'bot', calendar_edit: response }]);
      } else if (state == 'location_category') {
        setMessages(msgs => [...msgs, { id: nextId + 1, sender: 'bot', Amenities: response }]);
      } else if (state === 'event_state' || state === 'job_search_state') {
        let parsedSearch = [];
        try {
          parsedSearch = JSON.parse(response.replace(/'/g, '"')); // 작은따옴표 → 큰따옴표
        } catch (err) {
          console.error('검색 결과 파싱 실패:', err);
        }
        setMessages(msgs => [...msgs, { id: nextId + 1, sender: 'bot', search: parsedSearch }]);
      } else if (url !== 'None') {
        // const combinedMessage = `${response}\n👉 관련 링크: ${url}`;
        setMessages(msgs => [
          ...msgs,
          { id: nextId + 1, sender: 'bot', text: response },
          { id: nextId + 2, sender: 'bot', imageUrl: url },
        ]);
      } else {
        // 👉 bot 메시지 추가
        setMessages(msgs => [...msgs, { id: nextId + 1, sender: 'bot', text: response }]);
      }
    } catch {
      setMessages(msgs => [
        ...msgs,
        { id: nextId + 2, sender: 'bot', text: t('aiAssistant.errors.responseError') },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={modalRef} 
      className="flex flex-col h-[520px] w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(220, 220, 230, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(210, 210, 220, 0.10) 0%, transparent 50%),
          linear-gradient(145deg, #f7f8fa 0%, #ececf0 100%)
        `,
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.25),
          0 10px 20px -5px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        border: '2px solid #e0e0e7',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* 모달 헤더 - 개선된 디자인 */}
      <div 
        className="flex items-center px-5 py-4 border-b flex-shrink-0"
        style={{
          background: `
            linear-gradient(135deg, #f7f7fa 0%, #e9e9ee 100%)
          `,
          borderColor: '#e0e0e7',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          boxShadow: '0 2px 8px rgba(120,120,130,0.06)',
        }}
      >
        <div 
          className="w-10 h-10 rounded-full mr-3 flex-shrink-0 overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #fff 0%, #f0f0f3 100%)',
            border: '2px solid #e0e0e7',
            boxShadow: '0 2px 8px rgba(120,120,130,0.08)',
          }}
        >
          <img
            src={EeumProfile}
            alt="이음이"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 
            className="font-bold text-gray-800"
            style={{
              fontSize: '16px',
              fontFamily: '"Noto Serif KR", serif',
              letterSpacing: '0.02em',
              color: '#444',
            }}
          >
            {t('aiAssistant.title')}
          </h3>
          <p 
            className="text-xs mt-1"
            style={{
              color: '#666',
              fontFamily: '"Noto Sans KR", sans-serif',
              fontWeight: '500',
            }}
          >
            {t('aiAssistant.chat.aiExpert')}
          </p>
        </div>
        <div 
          className="px-3 py-1 rounded-full text-xs"
          style={{
            background: '#f0f0f3',
            color: '#555',
            fontFamily: '"Noto Sans KR", sans-serif',
            fontWeight: '600',
            border: '1px solid #e0e0e7',
          }}
        >
          온라인
        </div>
      </div>

      {/* 메시지 리스트 - 개선된 디자인 */}
      <div 
        ref={listRef} 
        className="flex-1 overflow-auto p-5 space-y-4"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, rgba(220, 220, 230, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(210, 210, 220, 0.05) 0%, transparent 50%),
            linear-gradient(180deg, #f7f8fa 0%, #ececf0 100%)
          `,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(139, 69, 19, 0.3) transparent',
        }}
      >
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} items-end mb-3`}
          >
            {m.sender === 'user' ? (
              <div className="max-w-[75%] group">
                <div
                  className="inline-block px-4 py-3 rounded-2xl break-words relative"
                  style={{
                    background: `
                      linear-gradient(145deg, #4f46e5 0%, #3730a3 100%)
                    `,
                    color: '#ffffff',
                    boxShadow: `
                      0 4px 12px rgba(79, 70, 229, 0.3),
                      inset 0 1px 0 rgba(255,255,255,0.1)
                    `,
                    border: '1.5px solid #4338ca',
                    fontFamily: '"Noto Sans KR", sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    letterSpacing: '0.01em',
                    fontWeight: '500',
                  }}
                >
                  <div
                    className="absolute top-3 -right-1.5 w-3 h-3 transform rotate-45"
                    style={{
                      background: 'linear-gradient(145deg, #4f46e5 0%, #3730a3 100%)',
                      border: '1.5px solid #4338ca',
                      borderLeft: 'none',
                      borderBottom: 'none',
                    }}
                  />
                  <div className="relative z-10" style={{ color: '#ffffff' }}>{m.text}</div>
                </div>
                <div 
                  className="text-xs mt-1 text-right opacity-60"
                  style={{ color: '#888', fontFamily: '"Noto Sans KR", sans-serif' }}
                >
                  방금 전
                </div>
              </div>
            ) : (
              <div className="flex max-w-[85%] group">
                <div 
                  className="w-7 h-7 rounded-full mr-3 mt-1 flex-shrink-0 overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #fff 0%, #f0f0f3 100%)',
                    border: '1.5px solid #e0e0e7',
                    boxShadow: '0 2px 6px rgba(120,120,130,0.06)',
                  }}
                >
                  <img
                    src={EeumProfile}
                    alt="이음이"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div
                    className="inline-block px-4 py-3 rounded-2xl break-words relative"
                    style={{
                      background: `
                        linear-gradient(145deg, #fff 0%, #f7f7fa 100%)
                      `,
                      color: '#444',
                      boxShadow: `
                        0 4px 12px rgba(120,120,130,0.08),
                        inset 0 1px 0 rgba(255,255,255,0.1)
                      `,
                      border: '1.5px solid #e0e0e7',
                      fontFamily: '"Noto Sans KR", sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      letterSpacing: '0.01em',
                    }}
                  >
                    <div
                      className="absolute top-3 -left-1.5 w-3 h-3 transform rotate-45"
                      style={{
                        background: 'linear-gradient(145deg, #fff 0%, #f7f7fa 100%)',
                        border: '1.5px solid #e0e0e7',
                        borderRight: 'none',
                        borderBottom: 'none',
                      }}
                    />
                    <div className="relative z-10">
                      {m.imageUrl ? (
                        m.imageUrl.includes('amazonaws') ? (
                          <>
                            <img 
                              src={m.imageUrl} 
                              alt="AI 응답 이미지" 
                              className="max-w-full rounded-lg mb-2"
                              style={{
                                boxShadow: '0 4px 8px rgba(120,120,130,0.1)',
                                border: '1px solid #e0e0e7',
                              }}
                            />
                            <a
                              href={m.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm underline hover:no-underline transition-all"
                              style={{
                                color: '#6c63ff',
                                fontWeight: '600',
                                fontFamily: '"Noto Sans KR", sans-serif',
                              }}
                            >
                              {t('common.actions.downloadImage')}
                            </a>
                          </>
                        ) : (
                          <>
                            <img 
                              src={m.imageUrl} 
                              alt="AI 응답 이미지" 
                              className="max-w-full rounded-lg mb-2"
                              style={{
                                boxShadow: '0 4px 8px rgba(120,120,130,0.1)',
                                border: '1px solid #e0e0e7',
                              }}
                            />
                            <button
                              onClick={() => downloadImage(m.imageUrl!)}
                              className="text-sm underline hover:no-underline transition-all"
                              style={{
                                color: '#6c63ff',
                                fontWeight: '600',
                                fontFamily: '"Noto Sans KR", sans-serif',
                              }}
                            >
                              {t('common.actions.downloadImage')}
                            </button>
                          </>
                        )
                      ) : (
                        m.text
                      )}
                    </div>
                  </div>
                  <div 
                    className="text-xs mt-1 opacity-60"
                    style={{ color: '#888', fontFamily: '"Noto Sans KR", sans-serif' }}
                  >
                    방금 전
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[85%] group">
              <div 
                className="w-7 h-7 rounded-full mr-3 mt-1 flex-shrink-0 overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #fff 0%, #f0f0f3 100%)',
                  border: '1.5px solid #e0e0e7',
                  boxShadow: '0 2px 6px rgba(120,120,130,0.06)',
                }}
              >
                <img
                  src={EeumProfile}
                  alt="이음이"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="inline-block px-4 py-3 rounded-2xl"
                style={{
                  background: `
                    linear-gradient(145deg, #fff 0%, #f7f7fa 100%)
                  `,
                  color: '#888',
                  boxShadow: `
                    0 4px 12px rgba(120,120,130,0.08),
                    inset 0 1px 0 rgba(255,255,255,0.1)
                  `,
                  border: '1.5px solid #e0e0e7',
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        animationDelay: '0ms',
                        background: 'linear-gradient(145deg, #bfc0c7 0%, #a0a1a8 100%)',
                      }}
                    ></div>
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        animationDelay: '150ms',
                        background: 'linear-gradient(145deg, #bfc0c7 0%, #a0a1a8 100%)',
                      }}
                    ></div>
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        animationDelay: '300ms',
                        background: 'linear-gradient(145deg, #bfc0c7 0%, #a0a1a8 100%)',
                      }}
                    ></div>
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ fontFamily: '"Noto Sans KR", sans-serif' }}
                  >
                    {t('aiAssistant.chat.loading')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 입력창 - 개선된 디자인 */}
      <div 
        className="flex items-center p-5 border-t flex-shrink-0"
        style={{
          background: `
            linear-gradient(135deg, #f7f7fa 0%, #e9e9ee 100%)
          `,
          borderColor: '#e0e0e7',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
            disabled={loading}
            className="w-full px-4 py-3 rounded-full border-2 focus:outline-none transition-all duration-300 disabled:opacity-50"
            placeholder={t('aiAssistant.chat.placeholder')}
            style={{
              background: 'rgba(255, 255, 255, 0.97)',
              borderColor: '#e0e0e7',
              color: '#444',
              fontFamily: '"Noto Sans KR", sans-serif',
              fontSize: '14px',
              boxShadow: 'inset 0 2px 4px rgba(180,180,200,0.07)',
              backdropFilter: 'blur(10px)',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#bfc0c7';
              e.target.style.boxShadow = '0 0 0 3px rgba(180,180,200,0.10), inset 0 2px 4px rgba(180,180,200,0.07)';
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
          className="ml-3 px-5 py-3 rounded-full font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          style={{
            background: loading || !input.trim() 
              ? 'linear-gradient(145deg, #e5e7eb 0%, #d1d5db 100%)' 
              : 'linear-gradient(145deg, #6c63ff 0%, #5a52d5 100%)',
            color: loading || !input.trim() ? '#9ca3af' : 'white',
            boxShadow: loading || !input.trim() 
              ? 'none' 
              : '0 4px 16px rgba(108, 99, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            fontSize: '14px',
            fontFamily: '"Noto Sans KR", sans-serif',
            letterSpacing: '0.02em',
            border: loading || !input.trim() ? '1px solid #d1d5db' : '1px solid rgba(108, 99, 255, 0.2)',
          }}
        >
          {loading ? t('aiAssistant.chat.sending') : t('aiAssistant.chat.send')}
        </button>
      </div>
    </div>
  );
}