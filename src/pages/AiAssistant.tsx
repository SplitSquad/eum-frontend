'use client';

import React from 'react';
import Container from '@mui/material/Container';
import CategorySidebar from '@/features/assistant/components/ChatCategory';
import { Category } from '@/features/assistant/types';
import ChatContent from '@/features/assistant/components/ChatContent';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from '@/shared/i18n';
import { useLanguageStore } from '@/features/theme/store/languageStore';
import { useAiAssistantStore } from '@/features/assistant/store/aiAssistantStore';

// Chatbot에서 다룰 각 정보 분류(카테고리)를 여기서 정의
const getCategoriesWithTranslation = (t: any): Category[] => [
  { key: 'all', label: t('aiAssistant.categories.all') },
  { key: 'visa', label: t('aiAssistant.categories.visa') },
  { key: 'social', label: t('aiAssistant.categories.social') },
  { key: 'tax', label: t('aiAssistant.categories.tax') },
  { key: 'health', label: t('aiAssistant.categories.health') },
  { key: 'employment', label: t('aiAssistant.categories.employment') },
  { key: 'life', label: t('aiAssistant.categories.life') },
];

function formatDateTime(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

/**
 * AiAssistant 컴포넌트
 */
export default function AiAssistant() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { selectedCategory, setSelectedCategory, messages, loading } = useAiAssistantStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 번역된 카테고리 목록 생성
  const categories = getCategoriesWithTranslation(t);

  // 선택된 key에 해당하는 카테고리 객체를 찾도록 구현
  const selected = categories.find(c => c.key === selectedCategory)!;

  // '전문가 매칭 중' 메시지는 loading이 true이고, 마지막 메시지가 user일 때만 표시
  const lastMsg = messages[messages.length - 1];
  const isMatching = loading && lastMsg?.sender === 'user';

  return (
    <Box sx={{ minHeight: '80vh', background: 'transparent', backdropFilter: 'blur(8px)' }}>
      <Container
        maxWidth="lg"
        sx={{
          pt: isMobile ? 2 : 6,
          pb: isMobile ? 3 : 8,
        }}
      >
        {/* 상단 헤더 */}
        <Box sx={{ mb: isMobile ? 3 : 6 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h4'}
            fontWeight={700}
            sx={{
              color: '#222',
              fontFamily: 'Inter, Pretendard, Arial, sans-serif',
              mb: isMobile ? 0.5 : 1,
              fontSize: isMobile ? '1.25rem' : undefined,
            }}
          >
            {t('aiAssistant.title')}
          </Typography>
          <Typography
            variant={isMobile ? 'body2' : 'subtitle1'}
            sx={{
              color: '#666',
              fontFamily: 'Inter, Pretendard, Arial, sans-serif',
              fontSize: isMobile ? '0.875rem' : undefined,
            }}
          >
            {t('aiAssistant.subtitle')}
          </Typography>
        </Box>

        {/* 분야별 안내 - 모바일일 땐 세로 스크롤, PC일 땐 가로 정렬 */}
        {!isMobile && (
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              pb: 1,
            }}
          >
            <CategorySidebar categories={categories} selectedKey={selectedCategory} horizontal />
          </Box>
        )}

        {/* 날짜, 인사, 자동선택 안내 - 카테고리와 채팅방 사이 */}
        {!isMobile && (
          <Box
            sx={{
              mb: isMobile ? 3 : 4,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #f7f7fa 0%, #e9e9ee 100%)',
              borderRadius: 4,
              boxShadow: '0 2px 12px 0 rgba(80,80,90,0.07)',
              px: { xs: 2, sm: 4 },
              py: { xs: 1, sm: 2 },
              gap: { xs: 1, sm: 3 },
              border: '1.5px solid #e0e0e7',
            }}
          >
            {/* 왼쪽: 날짜 + 인사 (반응형, flex-wrap) */}
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: '#ededf3',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: isMobile ? '0.75rem' : 15,
                  color: '#666',
                  letterSpacing: '0.01em',
                  boxShadow: '0 1px 2px 0 rgba(120,120,130,0.04)',
                  flexShrink: 0,
                  fontFamily: 'Inter, Pretendard, Arial, sans-serif',
                }}
              >
                {formatDateTime(new Date())}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: isMatching ? '#e0e0e7' : '#f3f3f7',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: isMobile ? '0.85rem' : 17,
                  color: isMatching ? '#888' : '#333',
                  letterSpacing: '0.01em',
                  boxShadow: '0 1px 2px 0 rgba(120,120,130,0.04)',
                  flexShrink: 1,
                  minWidth: 0,
                  transition: 'background 0.2s',
                  fontFamily: 'Inter, Pretendard, Arial, sans-serif',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                }}
              >
                {isMatching ? (
                  <span
                    style={{ color: '#888', fontWeight: 600, fontSize: isMobile ? '0.75rem' : 16 }}
                  >
                    {t('aiAssistant.matchingMessage')}
                  </span>
                ) : (
                  <>
                    <span
                      style={{
                        color: '#6c63ff',
                        fontWeight: 700,
                        fontSize: isMobile ? '0.9rem' : 17,
                        marginRight: 6,
                      }}
                    >
                      {selected.label}
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t('aiAssistant.greeting', { category: selected.label })}
                    </span>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {/* 메인 콘텐츠 영역 - 채팅창만 (모바일 시 패딩 축소) */}
        {!isMobile ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              px: isMobile ? 1 : 0,
            }}
          >
            {' '}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <ChatContent categoryLabel={selected.label} onCategoryChange={setSelectedCategory} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1, minWidth: 0, p: 0 }}>
            <ChatContent categoryLabel={selected.label} onCategoryChange={setSelectedCategory} />
          </Box>
        )}
      </Container>
    </Box>
  );
}
