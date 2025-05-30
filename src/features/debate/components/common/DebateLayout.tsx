import React from 'react';
import {
  Box,
  Container,
  styled,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import Toast from './Toast';
import PageHeaderText from '@/components/layout/PageHeaderText';
import { useTranslation } from '@/shared/i18n';
import { useDebateStore } from '@/features/debate/store/debateStore';

const LayoutContent = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  gap: 8,
  alignItems: 'flex-start',
  height: 'auto',
  width: '100%',
  position: 'relative',
  zIndex: 5,
  padding: 0,
});
const debateCard = {
  background: 'rgba(255,255,255,0.5)',
  border: '1.5px solid #222',
  borderRadius: 10,
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
  marginBottom: 24,
  padding: 24,
  fontFamily: 'Inter, Pretendard, Arial, sans-serif',
};
const Sidebar = styled(Box)(({ theme }) => ({
  width: 320,
  borderRadius: 10,
  padding: '16px 12px',
  position: 'sticky',
  top: 200,
  alignSelf: 'flex-start',
  height: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  boxShadow: 'none',
  fontFamily: 'Inter, Pretendard, Arial, sans-serif',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
  zIndex: 5,
}));

const Main = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingRight: 16,
  background: 'transparent',
  boxShadow: 'none',
  fontFamily: 'Inter, Pretendard, Arial, sans-serif',
  minHeight: 0,
  width: 'auto',
  overflow: 'visible',
  [theme.breakpoints.down('md')]: {
    padding: 0,
  },
  position: 'relative',
  zIndex: 5,
}));

export interface DebateLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
  specialLabelText?: string;
}

/**
 * 토론 기능 공통 레이아웃 컴포넌트
 * 다른 개발자가 만든 레이아웃 컴포넌트로 쉽게 교체할 수 있는 구조
 */
const DebateLayout: React.FC<DebateLayoutProps> = ({
  children,
  sidebar,
  showSidebar = true,
  specialLabelText,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const { category } = useDebateStore();

  // 카테고리 목록 (key: 한글, value: 번역 텍스트)
  const categories: Record<string, string> = {
    //'': t('debate.categories.all'), // 전체
    '정치/사회': t('debate.categories.politics'),
    경제: t('debate.categories.economy'),
    '생활/문화': t('debate.categories.culture'),
    '과학/기술': t('debate.categories.technology'),
    스포츠: t('debate.categories.sports'),
    엔터테인먼트: t('debate.categories.entertainment'),
  };

  t('debate.title');
  t('debate.description');
  return (
    <div>
      {/* 페이지 헤더 */}
      <div style={{ minHeight: '100vh' }}>
        {/* 헤더 */}
        <div style={{ borderBottom: '1.5px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px 16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      fontSize: 34,
                      fontWeight: 700,
                      color: '#111',
                      fontFamily: debateCard.fontFamily,
                    }}
                  >
                    {t('debate.title')}
                  </span>
                </div>
                <p style={{ color: '#666', marginTop: 6, fontFamily: debateCard.fontFamily }}>
                  {t('debate.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
            padding: '32px 16px 0 16px',
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#111',
              fontFamily: debateCard.fontFamily,
              margin: 0,
            }}
          >
            {specialLabelText}
          </h2>
          <div style={{ flex: 1 }}></div>
        </div>
        <Divider sx={{ mb: 2, borderColor: '#e5e7eb', mx: 2 }} />
        <LayoutContent>
          <Main>{children}</Main>
          {showSidebar && sidebar && <Sidebar>{sidebar}</Sidebar>}
        </LayoutContent>
        <Toast />
      </div>
    </div>
  );
};

export default DebateLayout;
