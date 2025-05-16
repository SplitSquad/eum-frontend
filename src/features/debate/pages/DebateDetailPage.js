import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDebateStore } from '../store';
import { mapIsVotedStateToVoteType, ReactionType, mapIsStateToEmotionType } from '../types';
import { Box, Typography, Paper, Button, CircularProgress, Container, ListItem, } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { styled } from '@mui/material/styles';
import { formatDate } from '../utils/dateUtils';
import DebateLayout from '../components/common/DebateLayout';
import CommentSection from '../components/comment/CommentSection';
import DebateApi, { getVotesByDebateId } from '../api/debateApi';
// Import the recharts library for pie charts
// The recharts package should be installed with: npm install recharts
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
// Styled components
const DebateCard = styled(Paper)(({ theme }) => ({
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: theme.spacing(3),
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(8px)',
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
const VoteButtonGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));
const VoteButton = styled(Button, {
    shouldForwardProp: prop => prop !== 'color' && prop !== 'selected',
})(({ theme, color, selected }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: selected ? `${color}22` : 'transparent',
    border: `2px solid ${color}`,
    color: color,
    '&:hover': {
        backgroundColor: `${color}33`,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 36,
        marginBottom: theme.spacing(1),
    },
}));
const EmotionButtonGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));
const EmotionButton = styled(Button, {
    shouldForwardProp: prop => prop !== 'selected',
})(({ theme, selected }) => ({
    flex: '1 0 30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderRadius: 8,
    backgroundColor: selected ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },
    '& .MuiSvgIcon-root': {
        fontSize: 24,
        marginBottom: theme.spacing(0.5),
    },
}));
const ProgressSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(8px)',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: theme.spacing(3),
}));
const VoteBarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));
const VoteBar = styled(Box)(({ theme }) => ({
    flex: 1,
    height: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
}));
const AgreeBar = styled(Box, {
    shouldForwardProp: prop => prop !== 'width',
})(({ width }) => ({
    width: `${width}%`,
    height: '100%',
    backgroundColor: '#e91e63',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
}));
const DisagreeBar = styled(Box, {
    shouldForwardProp: prop => prop !== 'width',
})(({ width }) => ({
    width: `${width}%`,
    height: '100%',
    backgroundColor: '#9c27b0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
}));
const CountryStatItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
    borderRadius: 4,
    backgroundColor: 'rgba(248, 249, 250, 0.7)',
    marginBottom: theme.spacing(1),
}));
const CountryFlag = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: theme.palette.text.secondary,
}));
const CommentForm = styled('form')(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
}));
const CommentItem = styled(ListItem)(({ theme }) => ({
    borderBottom: '1px solid #eee',
    padding: theme.spacing(2, 1),
}));
const ChartContainer = styled(Box)(({ theme }) => ({
    height: 280,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));
/**
 * 토론 상세 페이지
 * 선택한 토론의 상세 내용과 댓글을 표시
 */
const DebateDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentDebate: debate, isLoading: loading, error, getDebateById: fetchDebateById, getComments: fetchComments, comments, voteOnDebate, createComment: submitComment, addReaction, } = useDebateStore();
    const [userVote, setUserVote] = useState(null);
    const [userEmotion, setUserEmotion] = useState(null);
    const [comment, setComment] = useState('');
    const [stance, setStance] = useState(null);
    // 직접 API 접근을 위한 함수들
    const directVoteOnDebate = async (debateId, stance) => {
        return await DebateApi.voteOnDebate({ debateId, stance });
    };
    const directAddReaction = async (targetId, targetType, reactionType) => {
        return await DebateApi.addReaction({ targetId, targetType, reactionType });
    };
    useEffect(() => {
        if (id) {
            fetchDebateById(parseInt(id));
        }
    }, [id, fetchDebateById]);
    // 토론 상세 불러온 후 댓글도 불러오기
    useEffect(() => {
        if (debate && id) {
            // 댓글 목록 로드
            fetchComments(parseInt(id));
            // 디버깅용 로그
            console.log('토론 데이터 로드됨:', debate);
            console.log('투표 상태 (isVotedState):', debate.isVotedState);
            console.log('감정표현 상태 (isState):', debate.isState);
            // 사용자 투표 상태 초기화
            if (debate.isVotedState) {
                const mappedVoteType = mapIsVotedStateToVoteType(debate.isVotedState);
                console.log('매핑된 투표 타입:', mappedVoteType);
                setUserVote(mappedVoteType);
                setStance(mappedVoteType); // 댓글 작성 시 선택할 수 있는 입장도 함께 설정
            }
            else {
                // 투표 상태가 없으면 초기화
                setUserVote(null);
                setStance(null);
            }
            // 사용자 감정표현 상태 초기화
            if (debate.isState) {
                const mappedEmotionType = mapIsStateToEmotionType(debate.isState);
                console.log('매핑된 감정 타입:', mappedEmotionType);
                // 유효한 감정표현 타입이면 설정
                if (mappedEmotionType) {
                    setUserEmotion(mappedEmotionType);
                }
                else {
                    setUserEmotion(null);
                }
            }
            else {
                // 감정표현 상태가 없으면 초기화
                setUserEmotion(null);
            }
            // 국가별 참여 정보 로깅
            if (debate.countryStats && debate.countryStats.length > 0) {
                console.log('국가별 참여 정보:', debate.countryStats);
            }
            else {
                console.log('국가별 참여 정보가 없습니다.');
            }
            // 항상 최신 투표 정보를 가져오기 위해 VoteController의 getVotes API 호출
            getVotesByDebateId(parseInt(id))
                .then(voteData => {
                if (voteData && voteData.nationPercent) {
                    console.log('투표 API에서 국가별 참여 정보 로드됨:', voteData.nationPercent);
                    // nationPercent를 countryStats로 변환
                    const countryStats = Object.entries(voteData.nationPercent).map(([countryCode, percentage]) => {
                        // 국가 코드에서 국가명 추출 (간단한 매핑)
                        let countryName = countryCode;
                        if (countryCode === 'KR')
                            countryName = '대한민국';
                        else if (countryCode === 'US')
                            countryName = '미국';
                        else if (countryCode === 'JP')
                            countryName = '일본';
                        else if (countryCode === 'CN')
                            countryName = '중국';
                        return {
                            countryCode,
                            countryName,
                            count: Math.round((percentage / 100) * (voteData.voteCnt || 0)),
                            percentage: percentage,
                        };
                    });
                    // 토론 객체의 countryStats 업데이트
                    debate.countryStats = countryStats;
                    // 컴포넌트 강제 리렌더링을 위해 상태 업데이트 (빈 객체로 업데이트해도 리렌더링 발생)
                    setUserVote(prev => prev);
                }
                else {
                    console.log('투표 API에서 국가별 참여 정보를 가져오지 못했습니다.');
                }
            })
                .catch(error => {
                console.error('투표 API 호출 중 오류:', error);
            });
        }
    }, [debate, id, fetchComments]);
    const handleVote = (voteType) => {
        if (!id || !debate)
            return;
        console.log('투표 요청:', voteType, '현재 상태:', userVote);
        // 이미 같은 옵션에 투표한 경우, 토글 처리 (투표 취소)
        if (userVote === voteType) {
            // 토글 전 현재 값 저장
            const originalProCount = debate.proCount;
            const originalConCount = debate.conCount;
            const originalVoteState = debate.isVotedState;
            // 미리 UI 업데이트 (낙관적 업데이트)
            setUserVote(null);
            setStance(null);
            // 로컬 debate 데이터 업데이트
            debate.isVotedState = undefined;
            if (voteType === 'pro') {
                debate.proCount = Math.max(0, debate.proCount - 1);
            }
            else {
                debate.conCount = Math.max(0, debate.conCount - 1);
            }
            // 직접 API 호출 - store 함수 사용하지 않음
            directVoteOnDebate(parseInt(id), voteType).then(response => {
                console.log('투표 토글 결과:', response);
                const success = response && !response.error;
                // 국가별 참여 통계 업데이트
                if (success && response.nationPercent && typeof response.nationPercent === 'object') {
                    console.log('투표 후 국가별 참여 정보:', response.nationPercent);
                    // nationPercent를 countryStats로 변환
                    const countryStats = Object.entries(response.nationPercent).map(([countryCode, percentage]) => {
                        // 국가 코드에서 국가명 추출 (간단한 매핑)
                        let countryName = countryCode;
                        if (countryCode === 'KR')
                            countryName = '대한민국';
                        else if (countryCode === 'US')
                            countryName = '미국';
                        else if (countryCode === 'JP')
                            countryName = '일본';
                        else if (countryCode === 'CN')
                            countryName = '중국';
                        return {
                            countryCode,
                            countryName,
                            count: Math.round((percentage / 100) * (response.voteCnt || 0)),
                            percentage: percentage,
                        };
                    });
                    // 상태 업데이트
                    debate.countryStats = countryStats;
                }
                // 투표 실패하거나 응답에 nationPercent가 없는 경우 최신 투표 정보 가져오기
                else if (!success || !response.nationPercent) {
                    // 최신 투표 정보 가져오기
                    getVotesByDebateId(parseInt(id))
                        .then(voteData => {
                        if (voteData && voteData.nationPercent) {
                            console.log('투표 API에서 국가별 참여 정보 로드됨:', voteData.nationPercent);
                            // nationPercent를 countryStats로 변환
                            const countryStats = Object.entries(voteData.nationPercent).map(([countryCode, percentage]) => {
                                // 국가 코드에서 국가명 추출 (간단한 매핑)
                                let countryName = countryCode;
                                if (countryCode === 'KR')
                                    countryName = '대한민국';
                                else if (countryCode === 'US')
                                    countryName = '미국';
                                else if (countryCode === 'JP')
                                    countryName = '일본';
                                else if (countryCode === 'CN')
                                    countryName = '중국';
                                return {
                                    countryCode,
                                    countryName,
                                    count: Math.round((percentage / 100) * (voteData.voteCnt || 0)),
                                    percentage: percentage,
                                };
                            });
                            // 상태 업데이트
                            debate.countryStats = countryStats;
                            // 컴포넌트 강제 리렌더링을 위해 상태 업데이트
                            setUserVote(prev => prev);
                        }
                    })
                        .catch(error => {
                        console.error('투표 API 호출 중 오류:', error);
                    });
                }
                // 실패 시에만 원래 상태로 되돌림
                if (!success) {
                    setUserVote(voteType);
                    setStance(voteType);
                    // debate 객체 원래대로 복원
                    debate.proCount = originalProCount;
                    debate.conCount = originalConCount;
                    debate.isVotedState = originalVoteState;
                }
            });
        }
        else if (userVote && userVote !== voteType) {
            // 이미 다른 옵션에 투표한 경우, 안내 메시지 표시
            alert('이미 다른 옵션에 투표하셨습니다. 먼저 기존 투표를 취소한 후 다시 시도해주세요.');
        }
        else {
            // 토글 전 현재 값 저장
            const originalProCount = debate.proCount;
            const originalConCount = debate.conCount;
            const originalVoteState = debate.isVotedState;
            // 아직 투표하지 않은 경우, 새로 투표
            // 미리 UI 업데이트 (낙관적 업데이트)
            setUserVote(voteType);
            setStance(voteType);
            // 로컬 debate 데이터 업데이트
            debate.isVotedState = voteType === 'pro' ? '찬성' : '반대';
            if (voteType === 'pro') {
                debate.proCount += 1;
            }
            else {
                debate.conCount += 1;
            }
            // 직접 API 호출 - store 함수 사용하지 않음
            directVoteOnDebate(parseInt(id), voteType).then(response => {
                console.log('투표 결과:', response);
                const success = response && !response.error;
                // 국가별 참여 통계 업데이트
                if (success && response.nationPercent && typeof response.nationPercent === 'object') {
                    console.log('투표 후 국가별 참여 정보:', response.nationPercent);
                    // nationPercent를 countryStats로 변환
                    const countryStats = Object.entries(response.nationPercent).map(([countryCode, percentage]) => {
                        // 국가 코드에서 국가명 추출 (간단한 매핑)
                        let countryName = countryCode;
                        if (countryCode === 'KR')
                            countryName = '대한민국';
                        else if (countryCode === 'US')
                            countryName = '미국';
                        else if (countryCode === 'JP')
                            countryName = '일본';
                        else if (countryCode === 'CN')
                            countryName = '중국';
                        return {
                            countryCode,
                            countryName,
                            count: Math.round((percentage / 100) * (response.voteCnt || 0)),
                            percentage: percentage,
                        };
                    });
                    // 상태 업데이트
                    debate.countryStats = countryStats;
                }
                // 실패 시에만 원래 상태로 되돌림
                if (!success) {
                    setUserVote(null);
                    setStance(null);
                    // debate 객체 원래대로 복원
                    debate.proCount = originalProCount;
                    debate.conCount = originalConCount;
                    debate.isVotedState = originalVoteState;
                }
            });
        }
    };
    const handleEmotionSelect = (emotionType) => {
        if (!id || !debate)
            return;
        // 감정 타입을 백엔드 ReactionType으로 변환
        let reactionType;
        switch (emotionType) {
            case 'confused':
                reactionType = ReactionType.UNSURE;
                break;
            case 'like':
                reactionType = ReactionType.LIKE;
                break;
            case 'dislike':
                reactionType = ReactionType.DISLIKE;
                break;
            case 'sad':
                reactionType = ReactionType.SAD;
                break;
            case 'angry':
                reactionType = ReactionType.ANGRY;
                break;
            default:
                reactionType = ReactionType.LIKE;
        }
        console.log('감정표현 요청:', emotionType, '→', reactionType, '현재 상태:', userEmotion);
        // 감정표현에 해당하는 반응 필드 매핑
        const reactionFieldMap = {
            [ReactionType.LIKE]: 'like',
            [ReactionType.DISLIKE]: 'dislike',
            [ReactionType.SAD]: 'sad',
            [ReactionType.ANGRY]: 'angry',
            [ReactionType.UNSURE]: 'unsure',
        };
        // reactionType에 따른 백엔드 감정표현 값 매핑
        let newEmotionState;
        switch (reactionType) {
            case ReactionType.LIKE:
                newEmotionState = '좋아요';
                break;
            case ReactionType.DISLIKE:
                newEmotionState = '싫어요';
                break;
            case ReactionType.SAD:
                newEmotionState = '슬퍼요';
                break;
            case ReactionType.ANGRY:
                newEmotionState = '화나요';
                break;
            case ReactionType.UNSURE:
                newEmotionState = '글쎄요';
                break;
            default:
                newEmotionState = undefined;
        }
        // 현재 감정 표현 필드
        const currentField = reactionFieldMap[reactionType];
        // 이전 감정 표현 필드 (있는 경우)
        let previousField = null;
        if (userEmotion) {
            let prevReactionType;
            switch (userEmotion) {
                case 'confused':
                    prevReactionType = ReactionType.UNSURE;
                    break;
                case 'like':
                    prevReactionType = ReactionType.LIKE;
                    break;
                case 'dislike':
                    prevReactionType = ReactionType.DISLIKE;
                    break;
                case 'sad':
                    prevReactionType = ReactionType.SAD;
                    break;
                case 'angry':
                    prevReactionType = ReactionType.ANGRY;
                    break;
                default:
                    prevReactionType = ReactionType.LIKE;
            }
            previousField = reactionFieldMap[prevReactionType];
        }
        // 이미 같은 감정에 반응한 경우, 토글 처리 (반응 취소)
        if (userEmotion === emotionType) {
            // 원래 값 저장
            const originalReactions = { ...debate.reactions };
            const originalEmotionState = debate.isState;
            // 미리 UI 업데이트 (낙관적 업데이트)
            setUserEmotion(null);
            // 로컬 debate 데이터 업데이트
            debate.reactions[currentField] = Math.max(0, debate.reactions[currentField] - 1);
            debate.isState = undefined;
            // 직접 API 호출 - store 함수 사용하지 않음
            directAddReaction(parseInt(id), 'debate', reactionType).then(success => {
                console.log('감정표현 토글 결과:', success ? '성공' : '실패');
                // 실패 시에만 원래 상태로 되돌림
                if (!success) {
                    setUserEmotion(emotionType);
                    debate.reactions = originalReactions;
                    debate.isState = originalEmotionState;
                }
            });
        }
        else {
            // 원래 값 저장
            const originalReactions = { ...debate.reactions };
            const originalEmotion = userEmotion;
            const originalEmotionState = debate.isState;
            // 미리 UI 업데이트 (낙관적 업데이트)
            setUserEmotion(emotionType);
            // 로컬 debate 데이터 업데이트
            const updatedReactions = { ...debate.reactions };
            // 새로운 감정 추가
            updatedReactions[currentField] += 1;
            // 이전 감정 제거 (있는 경우)
            if (previousField) {
                updatedReactions[previousField] = Math.max(0, updatedReactions[previousField] - 1);
            }
            // 업데이트 적용
            debate.reactions = updatedReactions;
            debate.isState = newEmotionState;
            // 직접 API 호출 - store 함수 사용하지 않음
            directAddReaction(parseInt(id), 'debate', reactionType).then(success => {
                console.log('감정표현 변경 결과:', success ? '성공' : '실패');
                // 실패 시에만 원래 상태로 되돌림
                if (!success) {
                    setUserEmotion(originalEmotion);
                    debate.reactions = originalReactions;
                    debate.isState = originalEmotionState;
                }
            });
        }
    };
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment.trim() && id) {
            submitComment(parseInt(id), comment, stance || undefined);
            setComment('');
        }
    };
    const handleGoBack = () => {
        navigate(-1);
    };
    // Category colors for styling
    const categoryColors = {
        '정치/사회': '#1976d2',
        경제: '#ff9800',
        '생활/문화': '#4caf50',
        '과학/기술': '#9c27b0',
        스포츠: '#f44336',
        엔터테인먼트: '#2196f3',
    };
    // Special labels (예시)
    const specialLabels = {
        '오늘의 이슈': '#ff9800',
        '모스트 핫 이슈': '#f44336',
        '반반 이슈': '#9c27b0',
    };
    // 디버깅용 데이터 리로드 함수
    const handleReloadDebateData = () => {
        if (id) {
            fetchDebateById(parseInt(id));
        }
    };
    // Calculate vote ratios
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
    // Prepare data for pie chart
    const prepareChartData = (agree, disagree) => {
        return [
            { name: '찬성', value: agree },
            { name: '반대', value: disagree },
        ];
    };
    const COLORS = ['#e91e63', '#9c27b0'];
    // Render loading state
    if (loading) {
        return (_jsx(DebateLayout, { headerProps: {
                title: '토론 상세',
                showBackButton: true,
                onBackClick: handleGoBack,
                showUserIcons: true,
            }, children: _jsx(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }, children: _jsx(CircularProgress, {}) }) }));
    }
    // Render error state
    if (error || !debate) {
        return (_jsx(DebateLayout, { headerProps: {
                title: '토론 상세',
                showBackButton: true,
                onBackClick: handleGoBack,
                showUserIcons: true,
            }, children: _jsx(Container, { maxWidth: "md", sx: { py: 4 }, children: _jsxs(Box, { sx: { textAlign: 'center', py: 4 }, children: [_jsx(Typography, { color: "error", variant: "h6", children: error || '토론을 찾을 수 없습니다.' }), _jsx(Button, { variant: "contained", color: "primary", onClick: handleGoBack, sx: { mt: 2, borderRadius: 2 }, children: "\uB4A4\uB85C \uAC00\uAE30" })] }) }) }));
    }
    const enhancedDebate = debate;
    // Calculate vote percentages
    const voteRatio = calculateVoteRatio(enhancedDebate.proCount || 0, enhancedDebate.conCount || 0);
    const chartData = prepareChartData(enhancedDebate.proCount || 0, enhancedDebate.conCount || 0);
    const categoryColor = (enhancedDebate.category &&
        categoryColors[enhancedDebate.category]) ||
        '#757575';
    return (_jsx(DebateLayout, { headerProps: {
            title: '토론 상세',
            showBackButton: true,
            onBackClick: handleGoBack,
            showUserIcons: true,
        }, children: _jsxs(Container, { maxWidth: "md", sx: { py: 4 }, children: [import.meta.env.DEV && (_jsx(Button, { variant: "outlined", color: "info", onClick: handleReloadDebateData, sx: { mb: 2 }, children: "\uB370\uC774\uD130 \uC0C8\uB85C\uACE0\uCE68 (\uAC1C\uBC1C\uC6A9)" })), _jsxs(DebateCard, { children: [_jsx(CategoryIndicator, { color: categoryColor }), _jsxs(Box, { sx: { p: 3, pl: 4 }, children: [_jsx(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, children: _jsxs(Box, { children: [enhancedDebate.isHot && (_jsx(CategoryBadge, { color: specialLabels['모스트 핫 이슈'], children: "\uBAA8\uC2A4\uD2B8 \uD56B \uC774\uC288" })), _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }, component: "div", children: [enhancedDebate.category, _jsxs(CountryFlag, { children: [_jsx(FlagIcon, { fontSize: "small" }), "\uD55C\uAD6D"] }), _jsx("span", { style: { margin: '0 4px' }, children: "\u2022" }), formatDate(enhancedDebate.createdAt)] }), _jsx(Typography, { variant: "h5", component: "h1", fontWeight: 700, gutterBottom: true, children: enhancedDebate.title })] }) }), _jsx(Typography, { variant: "body1", sx: { my: 3, lineHeight: 1.7 }, children: enhancedDebate.content })] })] }), _jsx(Typography, { variant: "h6", fontWeight: 600, gutterBottom: true, sx: {
                        background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }, children: "\uCC2C\uC131\uACFC \uBC18\uB300, \uB2F9\uC2E0\uC758 \uC758\uACAC\uC740?" }), _jsxs(VoteButtonGroup, { children: [_jsxs(VoteButton, { variant: "outlined", color: "inherit", selected: userVote === 'pro', onClick: () => handleVote('pro'), sx: {
                                color: '#e91e63',
                                borderColor: '#e91e63',
                                '&:hover': {
                                    backgroundColor: 'rgba(233, 30, 99, 0.1)',
                                },
                            }, children: [_jsx(SentimentSatisfiedAltIcon, {}), _jsx(Typography, { variant: "subtitle1", fontWeight: 600, children: "\uCC2C\uC131" }), _jsx(Typography, { variant: "body2", sx: { mt: 1, color: 'text.secondary' }, children: enhancedDebate.proCount || 0 })] }), _jsxs(VoteButton, { variant: "outlined", color: "inherit", selected: userVote === 'con', onClick: () => handleVote('con'), sx: {
                                color: '#9c27b0',
                                borderColor: '#9c27b0',
                                '&:hover': {
                                    backgroundColor: 'rgba(156, 39, 176, 0.1)',
                                },
                            }, children: [_jsx(SentimentVeryDissatisfiedIcon, {}), _jsx(Typography, { variant: "subtitle1", fontWeight: 600, children: "\uBC18\uB300" }), _jsx(Typography, { variant: "body2", sx: { mt: 1, color: 'text.secondary' }, children: enhancedDebate.conCount || 0 })] })] }), _jsx(Typography, { variant: "h6", fontWeight: 600, gutterBottom: true, sx: {
                        background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }, children: "\uC774 \uD1A0\uB860\uC5D0 \uB300\uD55C \uAC10\uC815\uC744 \uD45C\uD604\uD574\uC8FC\uC138\uC694" }), _jsxs(EmotionButtonGroup, { children: [_jsxs(EmotionButton, { variant: "outlined", selected: userEmotion === 'like', onClick: () => handleEmotionSelect('like'), sx: {
                                color: '#4caf50',
                                borderColor: '#4caf50',
                                backgroundColor: userEmotion === 'like' ? 'rgba(76, 175, 80, 0.08)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(76, 175, 80, 0.12)',
                                },
                            }, children: [_jsx(ThumbUpIcon, {}), _jsx(Typography, { variant: "body2", children: "\uC88B\uC544\uC694" }), _jsx(Typography, { variant: "caption", sx: { mt: 0.5, color: 'text.secondary' }, children: enhancedDebate.reactions.like || 0 })] }), _jsxs(EmotionButton, { variant: "outlined", selected: userEmotion === 'dislike', onClick: () => handleEmotionSelect('dislike'), sx: {
                                color: '#f44336',
                                borderColor: '#f44336',
                                backgroundColor: userEmotion === 'dislike' ? 'rgba(244, 67, 54, 0.08)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.12)',
                                },
                            }, children: [_jsx(ThumbUpIcon, { sx: { transform: 'rotate(180deg)' } }), _jsx(Typography, { variant: "body2", children: "\uC2EB\uC5B4\uC694" }), _jsx(Typography, { variant: "caption", sx: { mt: 0.5, color: 'text.secondary' }, children: enhancedDebate.reactions.dislike || 0 })] }), _jsxs(EmotionButton, { variant: "outlined", selected: userEmotion === 'sad', onClick: () => handleEmotionSelect('sad'), sx: {
                                color: '#2196f3',
                                borderColor: '#2196f3',
                                backgroundColor: userEmotion === 'sad' ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(33, 150, 243, 0.12)',
                                },
                            }, children: [_jsx(SentimentVeryDissatisfiedIcon, {}), _jsx(Typography, { variant: "body2", children: "\uC2AC\uD37C\uC694" }), _jsx(Typography, { variant: "caption", sx: { mt: 0.5, color: 'text.secondary' }, children: enhancedDebate.reactions.sad || 0 })] }), _jsxs(EmotionButton, { variant: "outlined", selected: userEmotion === 'angry', onClick: () => handleEmotionSelect('angry'), sx: {
                                color: '#ff9800',
                                borderColor: '#ff9800',
                                backgroundColor: userEmotion === 'angry' ? 'rgba(255, 152, 0, 0.08)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 152, 0, 0.12)',
                                },
                            }, children: [_jsx(SentimentVeryDissatisfiedIcon, {}), _jsx(Typography, { variant: "body2", children: "\uD654\uB098\uC694" }), _jsx(Typography, { variant: "caption", sx: { mt: 0.5, color: 'text.secondary' }, children: enhancedDebate.reactions.angry || 0 })] }), _jsxs(EmotionButton, { variant: "outlined", selected: userEmotion === 'confused', onClick: () => handleEmotionSelect('confused'), sx: {
                                color: '#9c27b0',
                                borderColor: '#9c27b0',
                                backgroundColor: userEmotion === 'confused' ? 'rgba(156, 39, 176, 0.08)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(156, 39, 176, 0.12)',
                                },
                            }, children: [_jsx(SentimentSatisfiedAltIcon, {}), _jsx(Typography, { variant: "body2", children: "\uAE00\uC384\uC694" }), _jsx(Typography, { variant: "caption", sx: { mt: 0.5, color: 'text.secondary' }, children: enhancedDebate.reactions.unsure || 0 })] })] }), _jsxs(Box, { sx: { display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }, children: [_jsx(Box, { sx: { flex: 1 }, children: _jsxs(ProgressSection, { children: [_jsx(Typography, { variant: "h6", fontWeight: 600, gutterBottom: true, sx: {
                                            background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }, children: "\uD22C\uD45C \uACB0\uACFC" }), _jsxs(VoteBarContainer, { children: [_jsxs(Typography, { variant: "body2", fontWeight: 600, color: "#e91e63", width: 40, children: [voteRatio.agree, "%"] }), _jsxs(VoteBar, { children: [_jsx(AgreeBar, { width: voteRatio.agree, children: voteRatio.agree > 10 && '찬성' }), _jsx(DisagreeBar, { width: voteRatio.disagree, children: voteRatio.disagree > 10 && '반대' })] }), _jsxs(Typography, { variant: "body2", fontWeight: 600, color: "#9c27b0", width: 40, children: [voteRatio.disagree, "%"] })] }), _jsxs(Typography, { variant: "body2", textAlign: "right", children: ["\uCD1D \uD22C\uD45C\uC218: ", (enhancedDebate.proCount || 0) + (enhancedDebate.conCount || 0)] }), _jsx(ChartContainer, { children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: chartData, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 80, paddingAngle: 5, dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: chartData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) }) })] }) }), _jsx(Box, { sx: { flex: 1 }, children: _jsxs(ProgressSection, { children: [_jsx(Typography, { variant: "h6", fontWeight: 600, gutterBottom: true, sx: {
                                            background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }, children: "\uAD6D\uAC00\uBCC4 \uCC38\uC5EC \uD604\uD669" }), enhancedDebate.countryStats && enhancedDebate.countryStats.length > 0 ? (enhancedDebate.countryStats.map((stat, index) => {
                                        // 국가별로 다른 색상 사용 (각 국가마다 고유한 색상)
                                        const countryColors = {
                                            KR: '#4caf50', // 한국 - 초록
                                            US: '#2196f3', // 미국 - 파랑
                                            JP: '#f44336', // 일본 - 빨강
                                            CN: '#ff9800', // 중국 - 주황
                                            default: '#9c27b0', // 기타 - 보라
                                        };
                                        const color = countryColors[stat.countryCode] ||
                                            countryColors.default;
                                        return (_jsxs(CountryStatItem, { children: [_jsxs(CountryFlag, { children: [_jsx(FlagIcon, { fontSize: "small" }), _jsx(Typography, { variant: "body2", fontWeight: 500, children: stat.countryName })] }), _jsx(Box, { sx: { flex: 1, ml: 1, mr: 1 }, children: _jsx(Box, { sx: {
                                                            width: '100%',
                                                            height: '24px',
                                                            borderRadius: '12px',
                                                            overflow: 'hidden',
                                                            background: '#f0f0f0',
                                                        }, children: _jsx(Box, { sx: {
                                                                width: `${stat.percentage}%`,
                                                                height: '100%',
                                                                backgroundColor: color,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }, children: stat.percentage > 15 && (_jsxs(Typography, { variant: "caption", color: "white", fontWeight: "bold", children: [stat.percentage, "%"] })) }) }) }), _jsxs(Typography, { variant: "body2", sx: { minWidth: '60px', textAlign: 'right' }, children: [stat.count, "\uBA85 (", stat.percentage, "%)"] })] }, index));
                                    })) : (_jsx(Typography, { variant: "body2", align: "center", color: "text.secondary", sx: { py: 2 }, children: "\uAD6D\uAC00\uBCC4 \uCC38\uC5EC \uC815\uBCF4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }))] }) })] }), _jsxs(Box, { sx: { mt: 4 }, children: [_jsx(Typography, { variant: "h6", fontWeight: 600, gutterBottom: true, sx: {
                                background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }, children: "\uC0AC\uB78C\uB4E4\uC758 \uB2E4\uC591\uD55C \uC758\uACAC\uC744 \uC874\uC911\uD574\uC8FC\uC138\uC694." }), stance ? (_jsx(Box, { sx: { mb: 2, p: 1, bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 }, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["\uC120\uD0DD\uD55C \uC785\uC7A5:", ' ', _jsx(Box, { component: "span", fontWeight: "bold", sx: { color: stance === 'pro' ? '#4caf50' : '#f44336' }, children: stance === 'pro' ? '찬성' : '반대' })] }) })) : (_jsx(Box, { sx: { mb: 2, p: 1, bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 }, children: _jsx(Typography, { variant: "body2", color: "text.secondary", children: "\uD22C\uD45C \uBC84\uD2BC\uC744 \uD074\uB9AD\uD558\uC5EC \uBA3C\uC800 \uC785\uC7A5\uC744 \uC120\uD0DD\uD558\uBA74 \uB313\uAE00\uC5D0 \uC785\uC7A5\uC774 \uD45C\uC2DC\uB429\uB2C8\uB2E4." }) })), id && _jsx(CommentSection, { debateId: parseInt(id) })] })] }) }));
};
export default DebateDetailPage;
