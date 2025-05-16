import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDebateStore } from '../store';
import { Box, Typography, Card, CardContent, CardActionArea, List, ListItemText, ListItemButton, Paper, CircularProgress, useTheme, useMediaQuery, } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import { styled } from '@mui/material/styles';
import DebateLayout from '../components/common/DebateLayout';
import { formatDate } from '../utils/dateUtils';
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
const IssueSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));
const IssueTitleWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));
const IssueSectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
}));
const FireIcon = styled('span')(({ theme }) => ({
    fontSize: '1.5rem',
    marginRight: theme.spacing(0.5),
}));
const ViewAllLink = styled(Link)(({ theme }) => ({
    marginLeft: 'auto',
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontSize: '0.875rem',
    '&:hover': {
        textDecoration: 'underline',
    },
}));
const DebateCard = styled(Card)(({ theme }) => ({
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(4px)',
    marginBottom: theme.spacing(2),
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
const FlagWrapper = styled('span')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    fontSize: 14,
    marginLeft: theme.spacing(1),
}));
const SidebarContainer = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgb(255, 255, 255)',
    backdropFilter: 'blur(8px)',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: theme.spacing(2),
    maxHeight: `calc(100vh - ${theme.spacing(4)})`,
    overflowY: 'auto',
    alignSelf: 'flex-start',
    zIndex: 5,
    width: '100%',
    padding: 0,
}));
const MainIssuesPage = () => {
    const navigate = useNavigate();
    const { debates, isLoading: storeLoading, error: storeError, getDebates, todayIssues, hotIssue, balancedIssue, loadingTodayIssues, loadingHotIssue, loadingBalancedIssue, todayIssuesError, hotIssueError, balancedIssueError, fetchSpecialIssues, fetchTodayIssues, fetchHotIssue, fetchBalancedIssue, } = useDebateStore();
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
        전체: '#757575',
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
        // 일반 토론 목록 가져오기 (기본 목록 페이지일 경우)
        getDebates();
        // 모든 특별 이슈를 한 번의 API 호출로 가져오기
        fetchSpecialIssues();
        // 디버깅용 로그
        console.log('MainIssuesPage - 초기화 시 특별 이슈 데이터:', {
            todayIssues,
            hotIssue,
            balancedIssue,
            loadingTodayIssues,
            loadingHotIssue,
            loadingBalancedIssue,
        });
        // 개별 호출은 주석처리 (이전 코드와의 비교를 위해 남겨둠)
        // fetchTodayIssues();
        // fetchHotIssue();
        // fetchBalancedIssue();
    }, [getDebates, fetchSpecialIssues]);
    const handleDebateClick = (id) => {
        navigate(`/debate/${id}`);
    };
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        navigate('/debate/list');
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
    // 토론 카드 렌더링
    const renderDebateCard = (debate, specialLabel = null) => {
        if (!debate)
            return null; // debate가 null이면 렌더링하지 않음
        // category 필드 안전하게 처리
        const category = debate.category || '';
        const categoryColor = categoryColors[category] || '#757575';
        const voteRatio = calculateVoteRatio(debate.proCount, debate.conCount);
        // content를 description으로 사용 (description이 없는 경우)
        const description = debate.description || debate.content || '';
        let backgroundStyle = 'rgba(255, 255, 255, 0.5)'; // 기본 배경색
        const agreePercent = voteRatio.agree;
        const disagreePercent = voteRatio.disagree;
        const difference = Math.abs(agreePercent - disagreePercent);
        if (difference <= 5) {
            // 차이가 5% 미만일 경우: 연한 주황색에서 흰색으로 그라데이션
            backgroundStyle =
                'linear-gradient(to bottom right, rgba(255, 218, 185, 0.4), rgba(255, 255, 255, 0.8))';
        }
        else if (agreePercent > disagreePercent) {
            // 찬성이 높을 경우: 연한 연두색에서 흰색으로 그라데이션
            backgroundStyle =
                'linear-gradient(to bottom right, rgba(144, 238, 144, 0.3), rgba(255, 255, 255, 0.8))';
        }
        else {
            // 반대가 높을 경우: 연한 빨간색에서 흰색으로 그라데이션
            backgroundStyle =
                'linear-gradient(to bottom right, rgba(255, 182, 193, 0.3), rgba(255, 255, 255, 0.8))';
        }
        return (_jsx(DebateCard, { onClick: () => handleDebateClick(debate.id), sx: { background: backgroundStyle }, children: _jsx(CardActionArea, { children: _jsxs(DebateItemWrapper, { children: [_jsx(CategoryIndicator, { color: categoryColor }), _jsxs(DebateCardContent, { sx: { width: '100%', pl: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, children: [_jsxs(Box, { children: [specialLabel && (_jsx(CategoryBadge, { color: specialLabel.color, children: specialLabel.text })), _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }, component: "div", children: [category || '기타', _jsxs(FlagWrapper, { children: [_jsx(FlagIcon, { fontSize: "small" }), "\uD55C\uAD6D"] })] }), _jsx(Typography, { variant: "h6", component: "div", fontWeight: 600, gutterBottom: true, children: debate.title })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: formatDate(debate.createdAt) })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: description.length > 100 ? `${description.substring(0, 100)}...` : description }), _jsxs(VoteProgressWrapper, { children: [_jsxs(Typography, { variant: "body2", fontWeight: 600, color: "#4caf50", width: 40, children: [voteRatio.agree, "%"] }), _jsxs(VoteProgressBar, { children: [_jsx(AgreeBar, { width: voteRatio.agree }), _jsx(DisagreeBar, { width: voteRatio.disagree })] }), _jsxs(Typography, { variant: "body2", fontWeight: 600, color: "#f44336", width: 40, children: [voteRatio.disagree, "%"] })] })] })] }) }) }, debate.id));
    };
    // 오늘의 이슈 섹션
    const renderTodayIssues = () => {
        console.log('renderTodayIssues - 현재 todayIssues 데이터:', todayIssues);
        return (_jsxs(IssueSection, { children: [_jsxs(IssueTitleWrapper, { children: [_jsxs(IssueSectionTitle, { variant: "h5", children: [_jsx(FireIcon, { children: "\uD83D\uDD25" }), "\uC624\uB298\uC758 \uC774\uC288", _jsx(FireIcon, { children: "\uD83D\uDD25" })] }), _jsx(ViewAllLink, { to: "/debate/list", children: "\uB354 \uB9CE\uC740 \uC774\uC288 \uBCF4\uAE30 >" })] }), loadingTodayIssues ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 4 }, children: _jsx(CircularProgress, { size: 30 }) })) : todayIssuesError ? (_jsx(Paper, { sx: {
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(4px)',
                    }, children: _jsx(Typography, { color: "error", children: todayIssuesError }) })) : todayIssues.length > 0 ? (todayIssues.map(debate => renderDebateCard(debate, specialLabels[1]))) : (_jsx(Paper, { sx: {
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: 'rgba(253, 217, 217, 0.59)',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        boxShadow: 'none',
                    }, children: _jsx(Typography, { sx: { fontWeight: 'bold', color: '#E91E63' }, children: "\uB4F1\uB85D\uB41C \uD1A0\uB860\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) }))] }));
    };
    // 모스트 핫 이슈 섹션
    const renderHotIssues = () => {
        return (_jsxs(IssueSection, { children: [_jsx(IssueTitleWrapper, { children: _jsxs(IssueSectionTitle, { variant: "h5", children: [_jsx(FireIcon, { children: "\uD83D\uDD25" }), "\uBAA8\uC2A4\uD2B8 \uD56B \uC774\uC288", _jsx(FireIcon, { children: "\uD83D\uDD25" })] }) }), loadingHotIssue ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 4 }, children: _jsx(CircularProgress, { size: 30 }) })) : hotIssueError ? (_jsx(Paper, { sx: {
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(4px)',
                    }, children: _jsx(Typography, { color: "error", children: hotIssueError }) })) : hotIssue ? (renderDebateCard(hotIssue, specialLabels[2])) : (_jsx(Paper, { sx: {
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: 'rgba(253, 217, 217, 0.59)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: 'none',
                        border: 'none',
                    }, children: _jsx(Typography, { sx: { fontWeight: 'bold', color: '#E91E63' }, children: "\uB4F1\uB85D\uB41C \uD1A0\uB860\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) }))] }));
    };
    // 반반 이슈 섹션
    const renderBalancedIssues = () => {
        return (_jsxs(IssueSection, { children: [_jsx(IssueTitleWrapper, { children: _jsxs(IssueSectionTitle, { variant: "h5", children: [_jsx(FireIcon, { children: "\uD83D\uDD25" }), "\uBC18\uBC18 \uC774\uC288", _jsx(FireIcon, { children: "\uD83D\uDD25" })] }) }), loadingBalancedIssue ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 4 }, children: _jsx(CircularProgress, { size: 30 }) })) : balancedIssueError ? (_jsx(Paper, { sx: {
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(4px)',
                    }, children: _jsx(Typography, { color: "error", children: balancedIssueError }) })) : balancedIssue ? (renderDebateCard(balancedIssue, specialLabels[3])) : (_jsx(Paper, { sx: {
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: 'rgba(253, 217, 217, 0.59)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: 'none',
                        border: 'none',
                    }, children: _jsx(Typography, { sx: { fontWeight: 'bold', color: '#E91E63' }, children: "\uB4F1\uB85D\uB41C \uD1A0\uB860\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) }))] }));
    };
    // 이전 이슈 링크
    const renderOldIssuesLink = () => (_jsx(Box, { sx: { textAlign: 'center', mt: 4, mb: 2 }, children: _jsx(Link, { to: "/debate/list", style: {
                color: '#666',
                textDecoration: 'none',
                fontSize: '1rem',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '20px',
                display: 'inline-block',
            }, children: "\uC774\uC804 \uC774\uC288 \uC0B4\uD3B4\uBCF4\uAE30" }) }));
    // 메인 컨텐츠 렌더링
    const renderContent = () => (_jsxs(Box, { children: [renderTodayIssues(), renderHotIssues(), renderBalancedIssues(), renderOldIssuesLink()] }));
    return (_jsx(DebateLayout, { sidebar: renderSidebar(), headerProps: {
            title: '토론',
            showBackButton: false,
            showUserIcons: true,
        }, children: renderContent() }));
};
export default MainIssuesPage;
