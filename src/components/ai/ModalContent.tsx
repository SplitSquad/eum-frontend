'use client';

import React, { useState, useRef, useEffect } from 'react';
import { callAgentic } from '@/shared/utils/Agentic';
import { useChatStore, Message } from '@/shared/store/ChatStore';

/**
 * ModalContent 컴포넌트
 * - Agentic 백엔드와 통신하는 챗 인터페이스를 모달 내부에 렌더링
 * - Zustand 전역 스토어를 사용하여 메시지 상태를 관리
 */

export default function ModalContent() {
  // 메시지 리스트 스크롤 컨트롤용 ref
  const listRef = useRef<HTMLDivElement>(null);

  // Zustand 스토어에서 메시지 배열과 addMessage 액션을 가져옴
  const messages = useChatStore(s => s.messages);
  const addMessage = useChatStore(s => s.addMessage);

  // 입력창 텍스트 상태
  const [input, setInput] = useState('');
  // 로딩 상태 (Agentic 호출 중)
  const [loading, setLoading] = useState(false);

  // 컴포넌트 마운트 시 메시지가 비어 있으면 환영 메시지 추가
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({ id: Date.now(), sender: 'bot', text: '무엇을 도와드릴까요?' });
    }
  }, [messages, addMessage]);

  /**
   * 메시지 전송 핸들러
   * - 사용자 메시지를 스토어에 추가
   * - Agentic API 호출 후 봇 응답 추가
   * - 에러 시 예외 처리 메시지 추가
   */

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return; // 빈 입력 무시

    // 사용자 메시지 추가
    addMessage({ id: Date.now(), sender: 'user', text });
    setInput(''); // 입력창 초기화
    setLoading(true); // 로딩 스타트

    try {
      // Agentic 백엔드 호출
      const { response } = await callAgentic(text, 'user_id');
      // 봇 응답 메시지 추가
      addMessage({ id: Date.now() + 1, sender: 'bot', text: response });
    } catch (err) {
      console.error(err);
      // 오류 메시지 추가
      addMessage({ id: Date.now() + 2, sender: 'bot', text: '응답 중 오류가 발생' });
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // messages 또는 loading 상태 변경 시 자동 스크롤
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-[350px] w-[350px] bg-white rounded-lg shadow-lg">
      {/* 모달 헤더 */}
      <div className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-t-lg">채팅</div>

      {/* 메시지 리스트 영역 */}
      <div ref={listRef} className="flex-1 overflow-auto p-3 space-y-2 bg-gray-50">
        {messages.map((m: Message) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-xl max-w-[70%] break-words ${
                m.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}

        {/* 로딩 중 표시: sticky로 리스트 하단에 고정 */}
        {loading && (
          <div className="sticky bottom-0 w-full text-center py-2 bg-white/70">
            <span className="text-gray-500">답변 중...</span>
          </div>
        )}
      </div>

      {/* 입력창 영역: 텍스트 입력 및 전송 버튼 */}
      <div className="flex items-center border-t p-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
          disabled={loading}
          className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring disabled:opacity-50"
          placeholder="메시지를 입력하세요..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="ml-2 px-4 py-1 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </div>
  );
}
