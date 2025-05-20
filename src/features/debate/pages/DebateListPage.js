import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebateStore } from '../store';
import { Box, Typography, Card, CardContent, CardActionArea, List, ListItemText, ListItemButton, Paper, CircularProgress, useTheme, useMediaQuery, } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import { styled } from '@mui/material/styles';
import DebateLayout from '../components/common/DebateLayout';
import { formatDate } from '../utils/dateUtils';
/**-----------------------------------웹로그 관련------------------------------------ **/
// userId 꺼내오는 헬퍼
export function getUserId() {
    try {
        const raw = localStorage.getItem('auth-storage');
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        return parsed?.state?.user?.userId ?? null;
    }
    catch {
        return null;
    }
}
// BASE URL에 엔드포인트 설정
const BASE = import.meta.env.VITE_API_BASE_URL;
// 로그 전송 함수
export function sendWebLog(log) {
    // jwt token 가져오기
    const token = localStorage.getItem('auth_token');
    if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }
    fetch(`${BASE}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify(log),
    }).catch(err => {
        console.error('WebLog 전송 실패:', err);
    });
    // 전송 완료
    console.log('WebLog 전송 성공:', log);
}
/**------------------------------------------------------------------------------------ **/
// 스타일 컴포넌트
const CategoryItem = styled(ListItemButton)(({ theme }) => ({
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '&.Mui-selected': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
        },
    },
    '& .MuiListItemText-primary': {
        fontWeight: 500,
    },
}));
const DebateListContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));
const DebateCard = styled(Card)(({ theme }) => ({
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(8px)',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    },
}));
const DebateCardContent = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
}));
const DebateItemWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
}));
const CategoryIndicator = styled(Box, {
    shouldForwardProp: prop => prop !== 'color',
})(({ color }) => ({
    width: 6,
    backgroundColor: color || '#1976d2',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
}));
const CategoryBadge = styled(Box, {
    shouldForwardProp: prop => prop !== 'color',
})(({ color }) => ({
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: 4,
    backgroundColor: color || '#e0e0e0',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 8,
}));
const VoteProgressWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
}));
const VoteProgressBar = styled(Box)(({ theme }) => ({
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    display: 'flex',
}));
const AgreeBar = styled(Box, {
    shouldForwardProp: prop => prop !== 'width',
})(({ width }) => ({
    width: `${width}%`,
    height: '100%',
    backgroundColor: '#4caf50',
}));
const DisagreeBar = styled(Box, {
    shouldForwardProp: prop => prop !== 'width',
})(({ width }) => ({
    width: `${width}%`,
    height: '100%',
    backgroundColor: '#f44336',
}));
const FlagWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    fontSize: 14,
}));
const SidebarContainer = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(8px)',
    borderRadius: 8,
    overflow: 'hidden',
    height: 'fit-content',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
}));
const DebateListPage = () => {
    const navigate = useNavigate();
    const { debates, isLoading: loading, error, getDebates: fetchDebates } = useDebateStore();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedCategory, setSelectedCategory] = useState('전체');
    // 카테고리 목록
    const categories = [
        { id: 'all', name: '전체' },
        { id: 'politics', name: '정치/사회' },
        { id: 'economy', name: '경제' },
        { id: 'culture', name: '생활/문화' },
        { id: 'technology', name: '과학/기술' },
        { id: 'sports', name: '스포츠' },
        { id: 'entertainment', name: '엔터테인먼트' },
    ];
    // 카테고리별 색상
    const categoryColors = {
        '정치/사회': '#1976d2',
        경제: '#ff9800',
        '생활/문화': '#4caf50',
        '과학/기술': '#9c27b0',
        스포츠: '#f44336',
        엔터테인먼트: '#2196f3',
    };
    // 특별 라벨
    const specialLabels = {
        1: { text: '오늘의 이슈', color: '#ff9800' },
        2: { text: '모스트 핫 이슈', color: '#f44336' },
        3: { text: '반반 이슈', color: '#9c27b0' },
    };
    useEffect(() => {
        fetchDebates();
    }, [fetchDebates]);
    const handleDebateClick = (id) => {
        navigate(`/debate/${id}`);
    };
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        // 웹로그 전송
        const userId = getUserId() ?? 0;
        const chatLogPayload = {
            UID: userId,
            ClickPath: location.pathname,
            TAG: category,
            CurrentPath: location.pathname,
            Event: 'chat',
            Content: null,
            Timestamp: new Date().toISOString(),
        };
        sendWebLog({ userId, content: JSON.stringify(chatLogPayload) });
        // 웹 로그 테스트 로그
        // console.log('토론 카테고리 웹로그', {
        //   UID: getUserId(),
        //   ClickPath: `/debate/${category}`,
        //   TAG: category,
        //   CurrentPath: location.pathname,
        //   Event: 'click',
        //   Content: null,
        //   Timestamp: new Date().toISOString(),
        // });
        console.log(`카테고리 선택: ${category}`);
        // 서버에 API 요청을 보내기 전에 로딩 상태 표시
        fetchDebates(1, 20, category === '전체' ? '' : category);
        console.log('현재 데이터:', debates);
        console.log('선택된 카테고리:', category);
    };
    // 필터링 로직 단순화
    const filteredDebates = useMemo(() => {
        console.log('필터링 수행:', selectedCategory);
        if (selectedCategory === '전체') {
            return debates;
        }
        // 카테고리가 정확히 일치하는 토론만 필터링
        return debates.filter((debate) => {
            // 백엔드에서 category 필드를 제공하지 않는 경우 대비
            const debateCategory = debate.category || '';
            const matched = debateCategory === selectedCategory;
            console.log(`카테고리 비교: ${debateCategory} vs ${selectedCategory} => ${matched}`);
            return matched;
        });
    }, [selectedCategory, debates]);
    // 특별 라벨 할당 (예시용)
    const getSpecialLabel = (debate) => {
        // 카테고리 뷰에서는 특별 라벨을 표시하지 않음
        return null;
    };
    // 찬성/반대 비율 계산
    const calculateVoteRatio = (agree, disagree) => {
        const total = agree + disagree;
        if (total === 0)
            return { agree: 50, disagree: 50 };
        const agreePercent = Math.round((agree / total) * 100);
        return {
            agree: agreePercent,
            disagree: 100 - agreePercent,
        };
    };
    // 사이드바 렌더링
    const renderSidebar = () => (_jsxs(SidebarContainer, { children: [_jsx(Box, { sx: { p: 2, borderBottom: '1px solid #eee' }, children: _jsx(Typography, { variant: "subtitle1", fontWeight: 600, children: "\uCE74\uD14C\uACE0\uB9AC" }) }), _jsx(List, { disablePadding: true, children: categories.map(category => (_jsx(CategoryItem, { onClick: () => handleCategoryClick(category.name), selected: selectedCategory === category.name, children: _jsx(ListItemText, { primary: category.name }) }, category.id))) })] }));
    // 메인 컨텐츠 렌더링
    const renderContent = () => (_jsxs(DebateListContainer, { children: [_jsx(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }, children: _jsxs(Typography, { variant: "h6", fontWeight: 600, children: [selectedCategory, " \uD1A0\uB860"] }) }), loading ? (_jsx(CircularProgress, { sx: { alignSelf: 'center', my: 4 } })) : error ? (_jsxs(Typography, { color: "error", sx: { my: 2 }, children: ["\uD1A0\uB860 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uB294\uB370 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4: ", error] })) : filteredDebates.length === 0 ? (_jsx(Paper, { sx: {
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(8px)',
                }, children: _jsx(Typography, { children: selectedCategory === '전체'
                        ? '등록된 토론이 없습니다.'
                        : `${selectedCategory} 카테고리에 등록된 토론이 없습니다.` }) })) : (filteredDebates.map((debate) => {
                const categoryColor = categoryColors[debate.category] || '#757575';
                const specialLabel = getSpecialLabel(debate);
                const voteRatio = calculateVoteRatio(debate.agreeCount || debate.proCount || 0, debate.disagreeCount || debate.conCount || 0);
                return (_jsx(DebateCard, { onClick: () => handleDebateClick(debate.id), children: _jsx(CardActionArea, { children: _jsxs(DebateItemWrapper, { children: [_jsx(CategoryIndicator, { color: categoryColor }), _jsxs(DebateCardContent, { sx: { width: '100%', pl: 3 }, children: [_jsxs(Box, { sx: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                            }, children: [_jsxs(Box, { children: [specialLabel && (_jsx(CategoryBadge, { color: specialLabel.color, children: specialLabel.text })), _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }, children: [debate.category || '기타', _jsxs(FlagWrapper, { children: [_jsx(FlagIcon, { fontSize: "small" }), "\uD55C\uAD6D"] })] }), _jsx(Typography, { variant: "h6", component: "div", fontWeight: 600, gutterBottom: true, children: debate.title })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: formatDate(debate.createdAt) })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: debate.description && debate.description.length > 100
                                                ? `${debate.description.substring(0, 100)}...`
                                                : debate.description }), _jsxs(VoteProgressWrapper, { children: [_jsxs(Typography, { variant: "body2", fontWeight: 600, color: "#4caf50", width: 40, children: [voteRatio.agree, "%"] }), _jsxs(VoteProgressBar, { children: [_jsx(AgreeBar, { width: voteRatio.agree }), _jsx(DisagreeBar, { width: voteRatio.disagree })] }), _jsxs(Typography, { variant: "body2", fontWeight: 600, color: "#f44336", width: 40, children: [voteRatio.disagree, "%"] })] })] })] }) }) }, debate.id));
            }))] }));
    return (_jsx(DebateLayout, { sidebar: renderSidebar(), headerProps: {
            title: '신규 토론',
            showUserIcons: true,
        }, children: renderContent() }));
};
export default DebateListPage;
