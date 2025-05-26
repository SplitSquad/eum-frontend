import { useState, useRef, useEffect } from 'react';
import { fetchChatbotResponse } from '@/features/assistant/api/ChatApi';
import { Message } from '../types';

export function useChatMessages(categoryLabel: string, onCategoryChange?: (key: string) => void) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      sender: 'bot',
      text: '무엇을 도와드릴까요?',
      displayText: '무엇을 도와드릴까요?',
      isTyping: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (query?: string) => {
    const text = query ?? input.trim();
    if (!text) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
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
      // 카테고리 매핑 로직
      const map: Record<string, string> = {
        visa_law: 'visa',
        social_security: 'social',
        tax_finance: 'tax',
        medical_health: 'health',
        employment: 'employment',
        daily_life: 'life',
        all: 'all',
      };
      const rag = data.metadata?.rag_type;
      const newKey = rag && map[rag] ? map[rag] : undefined;
      if (newKey && onCategoryChange) onCategoryChange(newKey);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'bot',
          text: '응답 중 오류가 발생했습니다.',
          displayText: '응답 중 오류가 발생했습니다.',
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

  // 스크롤 하단 이동
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return {
    messages,
    setMessages,
    input,
    setInput,
    loading,
    setLoading,
    listRef,
    sendMessage,
  };
}
