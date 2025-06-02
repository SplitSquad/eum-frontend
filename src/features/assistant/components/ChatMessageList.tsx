import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

interface Props {
  messages: Message[];
  loading: boolean;
  listRef: React.RefObject<HTMLDivElement>;
}

export default function ChatMessageList({ messages, loading, listRef }: Props) {
  return (
    <div ref={listRef} className="overflow-auto p-2 space-y-3 bg-gray-50 h-[50vh]">
      {messages.map(m => (
        <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          {m.sender === 'user' ? (
            <span className="inline-block px-4 py-2 rounded-xl max-w-[70%] break-words bg-blue-500 text-white">
              {m.text}
            </span>
          ) : (
            <span className="inline-block px-4 py-2 rounded-xl max-w-[70%] whitespace-pre-wrap break-words bg-gray-200 text-gray-800">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{ p: ({ children }) => <>{children}</> }}
              >
                {m.displayText ?? m.text}
              </ReactMarkdown>
            </span>
          )}
        </div>
      ))}
      {loading && <div className="text-center text-gray-500">답변 중...</div>}
    </div>
  );
}
