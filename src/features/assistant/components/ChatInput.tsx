import React from 'react';

interface Props {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  loading: boolean;
}

export default function ChatInput({ input, setInput, onSend, loading }: Props) {
  return (
    <div className="px-6 py-4 bg-white border-t flex items-center">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !loading && onSend()}
        disabled={loading}
        className="flex-1 px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring disabled:opacity-50"
        placeholder="질문을 입력하세요..."
      />
      <button
        onClick={onSend}
        disabled={loading}
        className="ml-4 px-6 py-2 bg-indigo-600 text-white rounded-full disabled:opacity-50"
      >
        전송
      </button>
    </div>
  );
}
