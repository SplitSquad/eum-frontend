'use client';
import React, { useState, useRef, useEffect } from 'react';
import { callAgentic } from '@/shared/utils/Agentic';
import { useModalStore } from '@/shared/store/ModalStore';
import { useTranslation } from '@/shared/i18n';
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
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [waveKey, setWaveKey] = useState(0);
  const { openModal, content } = useModalStore();

  // 스크롤 자동 내리기 함수
  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  const downloadImage = url => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'downloaded-image.jpg'; // 원하는 파일명으로 설정
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        console.error('이미지 다운로드 중 오류 발생:', error);
      });
  };

  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: t('chatbot.askHelp'),
      },
    ]);
  }, [language]);

  useEffect(() => {
    // 메시지나 로딩 상태가 변경될 때마다 부드럽게 스크롤 내리기
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
  }, [messages, loading]);

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

      const { response, metadata, state, url } = result;

      // 👉 state나 metadata 활용하고 싶으면 여기서 처리

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
        //  bot 메시지 추가
        setMessages(msgs => [...msgs, { id: nextId + 1, sender: 'bot', text: response }]);
      }
    } catch {
      setMessages(msgs => [
        ...msgs,
        { id: nextId + 2, sender: 'bot', text: t('chatbot.errorMessage') },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[450px] w-full bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* 헤더 영역 */}
      <div className="flex-shrink-0 p-4 pb-3 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">이</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-0">{t('chatbot.modalHeader')}</h2>
            <p className="text-xs text-gray-500">{t('chatbot.modalDescription')}</p>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 modal-chat-scroll">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <span className="text-white text-xs font-bold">이</span>
              </div>
            )}
            <span
              className={`inline-block max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md border border-blue-100'
              }`}
            >
              {m.imageUrl ? (
                m.imageUrl.includes('amazonaws') ? (
                  <>
                    <img src={m.imageUrl} alt="AI 응답 이미지" className="max-w-full rounded-md" />
                    <a
                      href={m.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      {t('chatbot.downloadImg')}
                    </a>
                  </>
                ) : (
                  <>
                    <img src={m.imageUrl} alt="AI 응답 이미지" className="max-w-full rounded-md" />
                    <button
                      onClick={() => downloadImage(m.imageUrl!)}
                      className="text-sm text-blue-600 underline"
                    >
                      {t('chatbot.downloadImg')}
                    </button>
                  </>
                )
              ) : m.post ? (
                <div className="space-y-2 text-sm text-gray-800">
                  {m.post.split('\n').map((line, idx) => {
                    const match = line.match(/^(제목|카테고리|내용):\s*(.*)/);
                    if (match) {
                      const [, label, content] = match;
                      return (
                        <div key={idx}>
                          <strong>{label}:</strong> {content}
                        </div>
                      );
                    } else {
                      // '글이 작성되었습니다.' 같은 일반 텍스트 출력
                      return <div key={idx}>{line}</div>;
                    }
                  })}
                </div>
              ) : m.calendar_check ? (
                (() => {
                  type CalendarEvent = {
                    summary: string;
                    description?: string;
                    start: { dateTime: string; timeZone?: string };
                    end: { dateTime: string; timeZone?: string };
                  };

                  let events: CalendarEvent[] = [];

                  try {
                    events = JSON.parse(m.calendar_check);
                  } catch (err) {
                    console.error('calendar_check 파싱 실패:', err);
                    return <div className="text-red-600">{t('chatbot.errorCalender')}</div>;
                  }

                  return (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-indigo-600 mb-1">
                        {t('chatbot.schedule')}
                      </div>
                      {events.map((event, index) => (
                        <div key={index} className="border rounded-lg p-4 shadow-sm bg-white">
                          <div className="text-lg font-semibold text-blue-600">{event.summary}</div>
                          <div className="text-sm text-gray-500 mb-1">
                            {event.description && event.description !== 'N/A'
                              ? event.description
                              : t('chatbot.noDescription')}
                          </div>
                          <div className="text-sm">
                            🕒 <span className="font-medium">{t('chatbot.startDate')}</span>{' '}
                            {new Date(event.start.dateTime).toLocaleString('ko-KR')}
                          </div>
                          <div className="text-sm">
                            🕓 <span className="font-medium">{t('chatbot.endDate')}</span>{' '}
                            {new Date(event.end.dateTime).toLocaleString('ko-KR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              ) : m.calendar_delete ? (
                (() => {
                  let event;
                  try {
                    const fixed = m.calendar_delete.replace(/'/g, '"');
                    event = JSON.parse(fixed);
                  } catch (err) {
                    console.error('calendar_delete 파싱 실패:', err);
                    return <div className="text-red-600">{t('chatbot.errorDelete')}</div>;
                  }

                  return (
                    <div className="border rounded-lg p-4 mb-2 shadow-sm bg-white opacity-60">
                      <div className="text-sm font-medium text-red-600 mb-2">
                        🗑️ {t('chatbot.deleteSchedule')}
                      </div>
                      <div className="text-lg font-semibold text-gray-700 line-through">
                        {event.summary}
                      </div>
                      <div className="text-sm text-gray-500 mb-1 line-through">
                        {event.description}
                      </div>
                      <div className="text-sm line-through">
                        🕒 <span className="font-medium">{t('chatbot.startDate')}</span>{' '}
                        {new Date(event.startDateTime).toLocaleString('ko-KR')}
                      </div>
                      <div className="text-sm line-through">
                        🕓 <span className="font-medium">{t('chatbot.endDate')}</span>{' '}
                        {new Date(event.endDateTime).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  );
                })()
              ) : m.calendar_add ? (
                (() => {
                  let event;
                  try {
                    // 문자열에 작은따옴표가 있어서 JSON.parse 전에 큰따옴표로 변환
                    const fixed = m.calendar_add.replace(/'/g, '"');
                    event = JSON.parse(fixed);
                  } catch (err) {
                    console.error('calendar_add 파싱 실패:', err);
                    return <div className="text-red-600">{t('chatbot.failSchedule')}</div>;
                  }

                  return (
                    <div className="border rounded-lg p-4 mb-2 shadow-sm bg-white">
                      <div className="text-sm font-medium text-green-600 mb-2">
                        ✅ {t('chatbot.successSchedule')}
                      </div>
                      <div className="text-lg font-semibold text-blue-600">{event.summary}</div>
                      <div className="text-sm text-gray-500 mb-1">{event.description}</div>
                      {event.location && (
                        <div className="text-sm">
                          📍 <span className="font-medium">{t('chatbot.location')}</span>{' '}
                          {event.location || t('chatbot.noLocation')}
                        </div>
                      )}
                      <div className="text-sm">
                        🕒 <span className="font-medium">{t('chatbot.startDate')}</span>{' '}
                        {new Date(event.startDateTime).toLocaleString('ko-KR')}
                      </div>
                      <div className="text-sm">
                        🕓 <span className="font-medium">{t('chatbot.endDate')}</span>{' '}
                        {new Date(event.endDateTime).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  );
                })()
              ) : m.calendar_edit ? (
                (() => {
                  let event;
                  try {
                    // 작은따옴표 → 큰따옴표로 변환하여 JSON 파싱
                    const fixed = m.calendar_edit.replace(/'/g, '"');
                    event = JSON.parse(fixed);
                  } catch (err) {
                    console.error('calendar_edit 파싱 실패:', err);
                    return <div className="text-red-600">{t('chatbot.failEdit')}</div>;
                  }

                  return (
                    <div className="border rounded-lg p-4 mb-2 shadow-sm bg-white">
                      <div className="text-sm font-medium text-yellow-600 mb-2">
                        {t('chatbot.successEdit')}
                      </div>
                      <div className="text-lg font-semibold text-blue-600">{event.summary}</div>
                      <div className="text-sm text-gray-500 mb-1">{event.description}</div>
                      {event.location && (
                        <div className="text-sm">
                          📍 <span className="font-medium">{t('chatbot.location')}</span>{' '}
                          {event.location || t('chatbot.noLocation')}
                        </div>
                      )}
                      <div className="text-sm">
                        🕒 <span className="font-medium">{t('chatbot.startDate')}</span>{' '}
                        {new Date(event.startDateTime).toLocaleString('ko-KR')}
                      </div>
                      <div className="text-sm">
                        🕓 <span className="font-medium">{t('chatbot.endDate')}</span>{' '}
                        {new Date(event.endDateTime).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  );
                })()
              ) : m.location ? (
                <ul className="space-y-2">
                  {Array.isArray(m.location) &&
                    m.location.map((item, index) => (
                      <li key={index} className="text-sm text-gray-800">
                        <div className="font-semibold text-base">{item.place_name}</div>
                        <div>
                          {t('chatbot.address')}: {item.address_name}
                        </div>
                        <div>
                          {t('chatbot.phone')}: {item.phone ? item.phone : '없음'}
                        </div>
                        <div>
                          {t('chatbot.distance')}: {item.distance}m
                        </div>
                      </li>
                    ))}
                </ul>
              ) : m.Amenities ? (
                <ul className="space-y-1">
                  {(m.Amenities.match(/\d+\.\s*[^0-9]+/g) || []).map((item, index) => {
                    const [_, num, name] = item.match(/(\d+\.)\s*(.+)/) || [];
                    return (
                      <li key={index}>
                        <span className="font-bold">{num}</span>{' '}
                        <a
                          href="#"
                          className="text-blue-600 underline"
                          onClick={e => {
                            e.preventDefault();
                            sendMessage(name.trim()); // ✅ 이렇게 해야 클릭 시 해당 항목으로 API 재질문 가능
                          }}
                        >
                          &lt;{name.trim()}&gt;
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : m.pdfUrl ? (
                <a
                  href={m.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 underline"
                >
                  {t('chatbot.openPdf')}
                </a>
              ) : m.search ? (
                <ul className="space-y-1">
                  {Array.isArray(m.search) &&
                    m.search.map((item: { title: string; link: string }, index: number) => (
                      <li key={index}>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 underline"
                        >
                          🔗 {item.title}
                        </a>
                      </li>
                    ))}
                </ul>
              ) : (
                m.text
              )}
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
              <span className="text-white text-xs font-bold">이</span>
            </div>
            <div className="bg-white text-gray-600 px-4 py-3 rounded-2xl rounded-bl-md text-sm border border-blue-100 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  ></div>
                </div>
                <span className="ml-1 text-gray-600">답변 중...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 입력창 */}
      <div className="flex-shrink-0 flex items-center gap-3 border-t border-blue-100 p-4 bg-white/90 backdrop-blur-sm">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
          disabled={loading}
          className="flex-1 min-w-0 px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white disabled:opacity-50 text-sm transition-all duration-200 placeholder-gray-400"
          placeholder={t('chatbot.placeHolder')}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          onMouseEnter={() => setWaveKey(k => k + 1)}
          onMouseLeave={() => setWaveKey(k => k + 1)}
          className="flex-shrink-0 w-11 h-11 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl"
          title={t('chatbot.send')}
        >
          {input.trim() ? (
            <>
              <style>{`
                .wave-dot {
                  animation: wave-bounce 0.8s infinite;
                  display: inline-block;
                  opacity: 1;
                  transition: opacity 0.2s;
                }
                .wave-dot-1 { animation-delay: 0s; }
                .wave-dot-2 { animation-delay: 0.08s; }
                .wave-dot-3 { animation-delay: 0.16s; }
                .wave-dot-4 { animation-delay: 0.24s; }
                .wave-dot-5 { animation-delay: 0.32s; }
                @keyframes wave-bounce {
                  0%,100% { transform: translateY(0); }
                  50% { transform: translateY(-14px); }
                }
                .group:hover .wave-dot:not(.wave-dot-3) {
                  opacity: 0 !important;
                }
                .group:hover .wave-dot-3 {
                  opacity: 1 !important;
                  animation: none !important;
                  position: absolute !important;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%) !important;
                }
              `}</style>
              <span
                key={waveKey}
                className="relative flex items-end gap-[3px] h-7 w-10 justify-center"
              >
                <span className="wave-dot wave-dot-1 w-1 h-1 bg-white rounded-full" />
                <span className="wave-dot wave-dot-2 w-1 h-1 bg-white rounded-full" />
                <span className="wave-dot wave-dot-3 w-1 h-1 bg-white rounded-full" />
                <span className="wave-dot wave-dot-4 w-1 h-1 bg-white rounded-full" />
                <span className="wave-dot wave-dot-5 w-1 h-1 bg-white rounded-full" />
              </span>
            </>
          ) : (
            // 기존 화살표 아이콘
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transform group-hover:translate-x-0.5 transition-transform"
            >
              <path
                d="M22 2L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
