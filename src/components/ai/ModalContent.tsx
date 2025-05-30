'use client';
import React, { useState, useRef, useEffect } from 'react';
import { callAgentic } from '@/shared/utils/Agentic';
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
};

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
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
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
      } else if (state == 'post_state') {
        setMessages(msgs => [...msgs, { id: nextId + 1, sender: 'bot', post: response }]);
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
                      이미지 다운로드
                    </a>
                  </>
                ) : (
                  <>
                    <img src={m.imageUrl} alt="AI 응답 이미지" className="max-w-full rounded-md" />
                    <button
                      onClick={() => downloadImage(m.imageUrl!)}
                      className="text-sm text-blue-600 underline"
                    >
                      이미지 다운로드
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
              ) : m.location ? (
                <ul className="space-y-2">
                  {Array.isArray(m.location) &&
                    m.location.map((item, index) => (
                      <li key={index} className="text-sm text-gray-800">
                        <div className="font-semibold text-base">{item.place_name}</div>
                        <div>📍 주소: {item.address_name}</div>
                        <div>📞 전화번호: {item.phone ? item.phone : '없음'}</div>
                        <div>📏 거리: {item.distance}m</div>
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
                  📄 PDF 파일 열기
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
          onClick={() => sendMessage()}
          disabled={loading}
          className="ml-2 px-4 py-1 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </div>
  );
}
