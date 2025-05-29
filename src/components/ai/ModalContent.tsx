'use client';
import React, { useState, useRef, useEffect } from 'react';
import { callAgentic } from '@/shared/utils/Agentic';
// import { callJobAgent, processCoverLetterResponse } from '@/shared/utils/JobAgent';
// import { CoverLetterState } from '@/types/CoverLetterTypes';

type Message = { id: number; sender: 'user' | 'bot'; text: string };

export default function ModalContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      sender: 'bot',
      text: '무엇을 도와드릴까요? (예: 일정 작성, 게시글 작성 등)',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    const nextId = Date.now();
    setMessages(msgs => [...msgs, { id: nextId, sender: 'user', text }]);
    setLoading(true);
    try {
      const { response } = await callAgentic(text, 'user_id');
      setMessages(msgs => [...msgs, { id: nextId + 1, sender: 'bot', text: response }]);
    } catch {
      setMessages(msgs => [
        ...msgs,
        { id: nextId + 2, sender: 'bot', text: '응답 중 오류가 발생했습니다.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] w-[350px] bg-white rounded-lg shadow-lg">
      {/* 메시지 리스트 */}
      <div ref={listRef} className="flex-1 overflow-auto p-3 space-y-2 bg-gray-50">
        {messages.map(m => (
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
        {loading && (
          <div className="sticky bottom-0 w-full text-center py-2 bg-white/70">
            <span className="text-gray-500">답변 중...</span>
          </div>
        )}
      </div>
      {/* 입력창 */}
      <div className="flex items-center border-t p-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
          disabled={loading}
          className="flex-1 px-3 py-1 bg-white border rounded-lg focus:outline-none focus:ring disabled:opacity-50"
          placeholder="질문이나 요청을 입력하세요..."
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
