'use client';

import React from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { useChatMessages } from '../utils/useChatMessages';
import { ChatContentProps } from '../types';

export default function ChatContent({
  categoryLabel = '전체',
  onCategoryChange,
}: ChatContentProps) {
  const { messages, input, setInput, loading, listRef, sendMessage } = useChatMessages(
    categoryLabel,
    onCategoryChange
  );

  return (
    <div className="h-full">
      <div className="flex h-[calc(100%-120px)]">
        <main className="flex-1 flex flex-col pl-8">
          <ChatMessageList messages={messages} loading={loading} listRef={listRef} />
          <ChatInput input={input} setInput={setInput} onSend={sendMessage} loading={loading} />
        </main>
      </div>
    </div>
  );
}
