// 대시보드 위젯 공통 모던-전통 조화 테마 스타일

export const widgetPaperBase = {
  borderRadius: 3,
  // 글래스모피즘 제거, 모던 화이트 + 전통 요소 조합
  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 248, 245, 0.95) 100%)',
  boxShadow: '0 4px 20px 0 rgba(139, 69, 19, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.04)',
  border: '1px solid rgba(139, 69, 19, 0.15)', // 전통 갈색 테두리 (연하게)
  minHeight: 320,
  overflow: 'hidden',
  position: 'relative',
  p: 2.5,
  // 전통 한지 질감 추가 (아주 연하게)
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 2px 2px, rgba(139, 69, 19, 0.03) 1px, transparent 0),
      radial-gradient(circle at 4px 4px, rgba(160, 82, 45, 0.02) 1px, transparent 0)
    `,
    backgroundSize: '20px 20px, 40px 40px',
    opacity: 0.6,
    pointerEvents: 'none',
    zIndex: 0,
  },
  // 내용은 위에 표시
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
};

export const widgetGradients = {
  // 모던 화이트 + 전통 요소 조합된 그라디언트
  pink: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 248, 0.95) 50%, rgba(250, 245, 240, 0.95) 100%)',
  purple: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 245, 255, 0.95) 50%, rgba(245, 240, 250, 0.95) 100%)',
  yellow: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 240, 0.95) 50%, rgba(250, 248, 235, 0.95) 100%)',
  green: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 255, 248, 0.95) 50%, rgba(240, 250, 240, 0.95) 100%)',
  blue: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 255, 0.95) 50%, rgba(240, 245, 250, 0.95) 100%)',
  traditional: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 248, 245, 0.95) 50%, rgba(245, 240, 235, 0.95) 100%)', // 한지 느낌
};

export const widgetCardBase = {
  borderRadius: 2,
  // 모던 화이트 스타일
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 2px 12px 0 rgba(139, 69, 19, 0.06), 0 1px 4px 0 rgba(0, 0, 0, 0.04)',
  border: '1px solid rgba(139, 69, 19, 0.1)', // 전통 요소 (연한 갈색 테두리)
  transition: '0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 4px 20px 0 rgba(139, 69, 19, 0.12), 0 2px 8px 0 rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(139, 69, 19, 0.2)',
    transform: 'translateY(-2px)', // 살짝 떠오르는 효과
  },
};

export const widgetTabsBase = {
  // 모던 + 전통 조화
  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(250, 248, 245, 0.8) 100%)',
  borderRadius: 2,
  minHeight: 36,
  border: '1px solid rgba(139, 69, 19, 0.1)',
  '& .MuiTab-root': {
    color: '#8B4513', // 전통 갈색
    fontWeight: 600,
    fontSize: '0.9rem',
    fontFamily: '"Noto Sans KR", "Inter", sans-serif',
    transition: 'all 0.3s ease',
    '&.Mui-selected': {
      color: '#5D4037', // 짙은 갈색
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 240, 235, 0.9) 100%)',
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(139, 69, 19, 0.1)',
    },
    '&:hover': {
      background: 'rgba(139, 69, 19, 0.05)',
      borderRadius: 2,
    },
  },
};

export const widgetChipBase = {
  // 모던 + 전통 요소
  bgcolor: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(160, 82, 45, 0.08) 100%)',
  color: '#8B4513', // 전통 갈색
  fontWeight: 600,
  fontSize: '0.8rem',
  borderRadius: 2,
  border: '1px solid rgba(139, 69, 19, 0.15)',
  fontFamily: '"Noto Sans KR", sans-serif',
  transition: 'all 0.2s ease',
  '&:hover': {
    bgcolor: 'rgba(139, 69, 19, 0.15)',
    borderColor: 'rgba(139, 69, 19, 0.25)',
    transform: 'translateY(-1px)',
  },
};

// 추가: 전통 요소가 강한 헤더 스타일
export const widgetHeaderTraditional = {
  background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08) 0%, rgba(101, 67, 33, 0.06) 100%)',
  borderBottom: '1px solid rgba(139, 69, 19, 0.15)',
  borderRadius: '2px 2px 0 0',
  padding: '12px 16px',
  marginBottom: '16px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%)',
  },
};

// 추가: 모던한 버튼 스타일
export const widgetButtonModern = {
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 248, 245, 0.9) 100%)',
  border: '1px solid rgba(139, 69, 19, 0.2)',
  borderRadius: 2,
  color: '#8B4513',
  fontWeight: 600,
  fontSize: '0.85rem',
  fontFamily: '"Noto Sans KR", "Inter", sans-serif',
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(139, 69, 19, 0.08)',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.05) 0%, rgba(101, 67, 33, 0.03) 100%)',
    borderColor: 'rgba(139, 69, 19, 0.3)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 16px rgba(139, 69, 19, 0.15)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}; 