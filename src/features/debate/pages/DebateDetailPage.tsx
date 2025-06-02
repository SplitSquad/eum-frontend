import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDebateStore } from '../store';
import { Debate, mapIsVotedStateToVoteType, ReactionType, mapIsStateToEmotionType } from '../types';
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  CircularProgress,
  Container,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplyIcon from '@mui/icons-material/Reply';
import ChatIcon from '@mui/icons-material/Chat';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';
import DebateLayout from '../components/common/DebateLayout';
import CommentSection from '../components/comment/CommentSection';
import DebateApi, { getVotesByDebateId } from '../api/debateApi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import FlagDisplay from '../../../shared/components/FlagDisplay';

// Import the recharts library for pie charts
// The recharts package should be installed with: npm install recharts
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslation } from '@/shared/i18n';

/**-----------------------------------웹로그 관련------------------------------------ **/
// userId 꺼내오는 헬퍼
export function getUserId(): number | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.userId ?? null;
  } catch {
    return null;
  }
}

// 로그 전송 타입 정의
interface WebLog {
  userId: number;
  content: string;
}

// BASE URL에 엔드포인트 설정
const BASE = import.meta.env.VITE_API_BASE_URL;

// 로그 전송 함수
export function sendWebLog(log: WebLog) {
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

interface CategoryIndicatorProps {
  color?: string;
}

const CategoryIndicator = styled(Box, {
  shouldForwardProp: prop => prop !== 'color',
})<CategoryIndicatorProps>(({ color }) => ({
  width: 6,
  backgroundColor: color || '#1976d2',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
}));

interface CategoryBadgeProps {
  color?: string;
}

const CategoryBadge = styled(Box, {
  shouldForwardProp: prop => prop !== 'color',
})<CategoryBadgeProps>(({ color }) => ({
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
  flexDirection: 'row',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  marginBottom: 0,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

interface VoteButtonProps {
  color: string;
  selected?: boolean;
}
const SidebarContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 80, // 헤더가 있다면 헤더 높이만큼 띄워주고
  maxHeight: 'calc(100vh - 80px)', // 뷰포트 높이에서 top 만큼 뺀 높이까지
  overflowY: 'auto', // 넘칠 시 내부 스크롤
  paddingRight: theme.spacing(2), // 스크롤바 나올 공간
}));
const VoteButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'color' && prop !== 'selected',
})<VoteButtonProps>(({ theme, color, selected }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.5, 1.5),
  minHeight: 32,
  height: 32,
  minWidth: 0,
  flex: 1,
  maxWidth: 160,
  borderRadius: 8,
  backgroundColor: selected ? `${color}22` : 'transparent',
  border: `2px solid ${color}`,
  color: color,
  boxSizing: 'border-box',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: `${color}33`,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 18,
    margin: 0,
    marginRight: theme.spacing(0.7),
    verticalAlign: 'middle',
  },
  '& .MuiTypography-root': {
    fontSize: 15,
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.1,
    verticalAlign: 'middle',
    padding: 0,
  },
  '& .vote-count': {
    fontSize: 14,
    fontWeight: 500,
    marginLeft: theme.spacing(0.7),
    color: '#888',
    minWidth: 18,
    textAlign: 'right',
    padding: 0,
  },
}));

const EmotionButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1.2),
  position: 'absolute',
  right: theme.spacing(2),
  bottom: theme.spacing(2),
  zIndex: 2,
  paddingBottom: theme.spacing(0.5),
  paddingTop: theme.spacing(0.5),
}));

interface EmotionButtonProps {
  selected?: boolean;
}

const EmotionButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'selected',
})<EmotionButtonProps>(({ theme, selected }) => ({
  minWidth: 40,
  height: 40,
  padding: 0,
  borderRadius: 8,
  backgroundColor: 'transparent !important',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'none !important',
  transition: 'transform 0.15s cubic-bezier(0.4,0,0.2,1)',
  '&:hover, &:active, &:focus': {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
    transform: 'scale(1.12)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 22,
    margin: 0,
  },
  '& .MuiTypography-root': {
    display: 'inline-block',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: 500,
    color: 'inherit',
    verticalAlign: 'middle',
  },
  '&:focus-visible': {
    outline: '2px solid #bdbdbd',
  },
  position: 'relative',
  '& .custom-tooltip': {
    display: 'none',
    position: 'absolute',
    bottom: '110%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#222',
    color: '#fff',
    fontSize: 12,
    borderRadius: 4,
    padding: '4px 10px',
    whiteSpace: 'nowrap',
    zIndex: 10,
    pointerEvents: 'none',
    opacity: 0.95,
  },
  '&:hover .custom-tooltip': {
    display: 'block',
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

interface BarProps {
  width: number;
}

const AgreeBar = styled(Box, {
  shouldForwardProp: prop => prop !== 'width',
})<BarProps>(({ width }) => ({
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
})<BarProps>(({ width }) => ({
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
  width: '100%',
  aspectRatio: '1',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

// Enhanced Debate type based on usage in this component
interface EnhancedDebate extends Debate {
  category?: string;
  isHot?: boolean;
  proCount: number;
  conCount: number;
  commentCount: number;
  comments?: Array<{
    id: number;
    userName: string;
    content: string;
    createdAt: string;
    stance?: 'pro' | 'con';
    reactions?: {
      like: number;
    };
  }>;
}

// Define the vote type
type VoteType = 'pro' | 'con';
type EmotionType = 'like' | 'dislike' | 'sad' | 'angry' | 'confused';

/**
 * 토론 상세 페이지
 * 선택한 토론의 상세 내용과 댓글을 표시
 */
const DebateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    currentDebate: debate,
    isLoading: loading,
    error,
    getDebateById: fetchDebateById,
    getComments: fetchComments,
    comments,
    voteOnDebate,
    createComment: submitComment,
    addReaction,
  } = useDebateStore();
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [userEmotion, setUserEmotion] = useState<EmotionType | null>(null);
  const [comment, setComment] = useState<string>('');
  const [stance, setStance] = useState<VoteType | null>(null);

  // 직접 API 접근을 위한 함수들
  const directVoteOnDebate = async (debateId: number, stance: 'pro' | 'con'): Promise<any> => {
    return await DebateApi.voteOnDebate({ debateId, stance });
  };

  const directAddReaction = async (
    targetId: number,
    targetType: 'debate',
    reactionType: ReactionType
  ): Promise<boolean> => {
    return await DebateApi.addReaction({ targetId, targetType, reactionType });
  };

  useEffect(() => {
    if (id) {
      fetchDebateById(parseInt(id));
    }
  }, [id, fetchDebateById]);

  // 토론 상세 불러온 후 댓글도 불러오기
  useEffect(() => {
    if (debate) {
      // 상태 초기화
      if (debate?.isVotedState === '찬성') {
        setUserVote('pro');
        setStance('pro');
      } else if (debate?.isVotedState === '반대') {
        setUserVote('con');
        setStance('con');
      } else {
        setUserVote(null);
        setStance(null);
      }
      const userId = getUserId() ?? 0;
      const chatLogPayload = {
        UID: userId,
        ClickPath: location.pathname,
        TAG: debate.category,
        CurrentPath: location.pathname,
        Event: 'click',
        Content: null,
        Timestamp: new Date().toISOString(),
      };
      sendWebLog({ userId, content: JSON.stringify(chatLogPayload) });

      // 코멘트 로드
      if (id) {
        fetchComments(parseInt(id));
      }

      // 감정표현 상태 확인
      const mappedEmotionType = debate.isState ? mapIsStateToEmotionType(debate.isState) : null;

      // 감정표현 상태가 있으면 설정
      if (mappedEmotionType) {
        setUserEmotion(mappedEmotionType);
      } else {
        setUserEmotion(null);
      }

      // 국가별 참여 정보 로깅
      if (debate.countryStats && debate.countryStats.length > 0) {
        console.log('국가별 참여 정보:', debate.countryStats);
      } else {
        console.log('국가별 참여 정보가 없습니다.');

        // 국가별 참여 정보가 없을 경우 즉시 API에서 가져옴
        if (id) {
          getVotesByDebateId(parseInt(id))
            .then(voteData => {
              if (voteData && voteData.nationPercent) {
                console.log('투표 API에서 국가별 참여 정보 로드됨:', voteData.nationPercent);

                // nationPercent를 countryStats로 변환
                const countryStats = Object.entries(voteData.nationPercent).map(
                  ([countryCode, percentage]) => {
                    // 국가 코드에서 국가명 추출
                    let countryName = countryCode;
                    if (countryCode === 'KR') countryName = t('debate.korea');
                    else if (countryCode === 'US') countryName = '미국';
                    else if (countryCode === 'JP') countryName = '일본';
                    else if (countryCode === 'CN') countryName = '중국';

                    return {
                      countryCode,
                      countryName,
                      count: Math.round(((percentage as number) / 100) * (voteData.voteCnt || 0)),
                      percentage: percentage as number,
                    };
                  }
                );

                // 토론 객체의 countryStats 업데이트
                debate.countryStats = countryStats;

                // 강제 리렌더링을 위해 상태 업데이트
                setUserVote(prev => prev);
              } else {
                console.log('투표 API에서 국가별 참여 정보를 가져오지 못했습니다.');
              }
            })
            .catch(error => {
              console.error('투표 API 호출 중 오류:', error);
            });
        }
      }
    }
  }, [debate, id, fetchComments]);

  const handleVote = (voteType: VoteType) => {
    if (!id || !debate) return;

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
      } else {
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
          const countryStats = Object.entries(response.nationPercent).map(
            ([countryCode, percentage]) => {
              // 국가 코드에서 국가명 추출 (간단한 매핑)
              let countryName = countryCode;
              if (countryCode === 'KR') countryName = t('debate.korea');
              else if (countryCode === 'US') countryName = '미국';
              else if (countryCode === 'JP') countryName = '일본';
              else if (countryCode === 'CN') countryName = '중국';

              return {
                countryCode,
                countryName,
                count: Math.round(((percentage as number) / 100) * (response.voteCnt || 0)),
                percentage: percentage as number,
              };
            }
          );

          // 상태 업데이트
          debate.countryStats = countryStats;

          // 강제 리렌더링을 위해 상태 업데이트
          setUserVote(prev => prev);
        }
        // 투표 실패하거나 응답에 nationPercent가 없는 경우 최신 투표 정보 가져오기
        else if (!success || !response.nationPercent) {
          // 최신 투표 정보 가져오기
          getVotesByDebateId(parseInt(id))
            .then(voteData => {
              if (voteData && voteData.nationPercent) {
                console.log('투표 API에서 국가별 참여 정보 로드됨:', voteData.nationPercent);

                // nationPercent를 countryStats로 변환
                const countryStats = Object.entries(voteData.nationPercent).map(
                  ([countryCode, percentage]) => {
                    // 국가 코드에서 국가명 추출 (간단한 매핑)
                    let countryName = countryCode;
                    if (countryCode === 'KR') countryName = t('debate.korea');
                    else if (countryCode === 'US') countryName = '미국';
                    else if (countryCode === 'JP') countryName = '일본';
                    else if (countryCode === 'CN') countryName = '중국';

                    return {
                      countryCode,
                      countryName,
                      count: Math.round(((percentage as number) / 100) * (voteData.voteCnt || 0)),
                      percentage: percentage as number,
                    };
                  }
                );

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
    } else if (userVote && userVote !== voteType) {
      // 이미 다른 옵션에 투표한 경우, 안내 메시지 표시
      alert('이미 다른 옵션에 투표하셨습니다. 먼저 기존 투표를 취소한 후 다시 시도해주세요.');
    } else {
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
      } else {
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
          const countryStats = Object.entries(response.nationPercent).map(
            ([countryCode, percentage]) => {
              // 국가 코드에서 국가명 추출 (간단한 매핑)
              let countryName = countryCode;
              if (countryCode === 'KR') countryName = t('debate.korea');
              else if (countryCode === 'US') countryName = '미국';
              else if (countryCode === 'JP') countryName = '일본';
              else if (countryCode === 'CN') countryName = '중국';

              return {
                countryCode,
                countryName,
                count: Math.round(((percentage as number) / 100) * (response.voteCnt || 0)),
                percentage: percentage as number,
              };
            }
          );

          // 상태 업데이트
          debate.countryStats = countryStats;

          // 강제 리렌더링을 위해 상태 업데이트
          setUserVote(prev => prev);
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

  const handleEmotionSelect = (emotionType: EmotionType) => {
    if (!id || !debate) return;

    // 감정 타입을 백엔드 ReactionType으로 변환
    let reactionType: ReactionType;

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
      [ReactionType.LIKE]: 'like' as keyof typeof debate.reactions,
      [ReactionType.DISLIKE]: 'dislike' as keyof typeof debate.reactions,
      [ReactionType.SAD]: 'sad' as keyof typeof debate.reactions,
      [ReactionType.ANGRY]: 'angry' as keyof typeof debate.reactions,
      [ReactionType.UNSURE]: 'unsure' as keyof typeof debate.reactions,
    };

    // reactionType에 따른 백엔드 감정표현 값 매핑
    let newEmotionState: string | undefined;
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
    let previousField: keyof typeof debate.reactions | null = null;
    if (userEmotion) {
      let prevReactionType: ReactionType;
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
    } else {
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

  const handleCommentSubmit = (e: React.FormEvent) => {
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
    '정치/사회': '#42a5f5', // 진한 파스텔 블루
    경제: '#ffb300', // 진한 파스텔 오렌지
    '생활/문화': '#66bb6a', // 진한 파스텔 그린
    '과학/기술': '#ab47bc', // 진한 파스텔 퍼플
    스포츠: '#e57373', // 진한 파스텔 레드
    엔터테인먼트: '#29b6f6', // 진한 파스텔 하늘색
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
  const calculateVoteRatio = (agree: number, disagree: number) => {
    const total = agree + disagree;
    if (total === 0) return { agree: 50, disagree: 50 };

    const agreePercent = Math.round((agree / total) * 100);
    return {
      agree: agreePercent,
      disagree: 100 - agreePercent,
    };
  };

  // Prepare data for pie chart
  const prepareChartData = (agree: number, disagree: number) => {
    return [
      { name: t('debate.yes'), value: agree },
      { name: t('debate.no'), value: disagree },
    ];
  };

  const COLORS = ['#e91e63', '#9c27b0'];

  // 카테고리 한글명 → 번역 텍스트 매핑
  const categoryNameMap: Record<string, string> = {
    '정치/사회': t('debate.categories.politics'),
    경제: t('debate.categories.economy'),
    '생활/문화': t('debate.categories.culture'),
    '과학/기술': t('debate.categories.technology'),
    스포츠: t('debate.categories.sports'),
    엔터테인먼트: t('debate.categories.entertainment'),
    기타: t('debate.categories.etc'),
  };

  // Pie chart custom label with color per slice
  const renderDiagonalLabel = props => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name, index } = props;
    const RADIAN = Math.PI / 180;
    const angle = midAngle;
    const radius = outerRadius + 18;
    const x = cx + radius * Math.cos(-angle * RADIAN);
    const y = cy + radius * Math.sin(-angle * RADIAN);
    // COLORS: ['#e91e63', '#9c27b0']
    const fill = COLORS[index % COLORS.length];
    return (
      <text
        x={x}
        y={y}
        fill={fill}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={13}
        fontWeight={600}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <DebateLayout>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}
        >
          <CircularProgress />
        </Box>
      </DebateLayout>
    );
  }

  // Render error state
  if (error || !debate) {
    return (
      <DebateLayout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="error" variant="h6">
              {error || '토론을 찾을 수 없습니다.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoBack}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              뒤로 가기
            </Button>
          </Box>
        </Container>
      </DebateLayout>
    );
  }

  const enhancedDebate = debate as EnhancedDebate;

  // Calculate vote percentages
  const voteRatio = calculateVoteRatio(enhancedDebate.proCount || 0, enhancedDebate.conCount || 0);
  const chartData = prepareChartData(enhancedDebate.proCount || 0, enhancedDebate.conCount || 0);
  const categoryColor =
    (enhancedDebate.category &&
      categoryColors[enhancedDebate.category as keyof typeof categoryColors]) ||
    '#757575';
  // 토론 콘텐츠 파싱 함수
  const parseDebateContent = (content: string) => {
    if (!content)
      return {
        topic: '',
        proOpinion: '',
        conOpinion: '',
        rawContent: content,
        beforeContent: '',
        afterContent: '',
      };

    // 실제 데이터 형태에 맞는 간단한 파싱
    // "토론주제:", "찬성측의견:", "반대측의견:" 형태를 찾음

    let beforeContent = '';
    let topic = '';
    let proOpinion = '';
    let conOpinion = '';
    let afterContent = '';

    // 토론주제 위치 찾기
    const topicMatch = content.match(/(.*?)토론주제\s*:\s*(.*?)(?=\s*찬성측의견|$)/is);
    if (topicMatch) {
      beforeContent = topicMatch[1].trim();

      // 토론주제 이후 부분에서 찬성/반대 의견 찾기
      const afterTopic = content.substring(topicMatch[0].length);
      topic = topicMatch[2].trim();

      // 찬성측의견 찾기
      const proMatch = afterTopic.match(/찬성측의견\s*:\s*(.*?)(?=\s*반대측의견|$)/is);
      if (proMatch) {
        proOpinion = proMatch[1].trim();

        // 반대측의견 찾기
        const conMatch = afterTopic.match(/반대측의견\s*:\s*(.*?)$/is);
        if (conMatch) {
          conOpinion = conMatch[1].trim();
        }
      }

      return {
        beforeContent,
        topic,
        proOpinion,
        conOpinion,
        afterContent: '', // 현재 예시에서는 이후 내용이 없음
        rawContent: content,
        isParsed: !!(topic && (proOpinion || conOpinion)),
      };
    }

    // 다른 형태의 구분자도 시도 (대안 패턴들)
    const altPatterns = [
      // "토론 주제:", "찬성측 의견:", "반대측 의견:" 형태
      {
        topic: /토론\s*주제\s*:\s*(.*?)(?=\s*찬성|$)/is,
        pro: /찬성(?:측)?\s*(?:의견)?\s*:\s*(.*?)(?=\s*반대|$)/is,
        con: /반대(?:측)?\s*(?:의견)?\s*:\s*(.*?)$/is,
      },
      // "주제:", "찬성:", "반대:" 형태
      {
        topic: /주제\s*:\s*(.*?)(?=\s*찬성|$)/is,
        pro: /찬성\s*:\s*(.*?)(?=\s*반대|$)/is,
        con: /반대\s*:\s*(.*?)$/is,
      },
    ];

    for (const patterns of altPatterns) {
      const topicMatch = content.match(patterns.topic);
      const proMatch = content.match(patterns.pro);
      const conMatch = content.match(patterns.con);

      if (topicMatch && topicMatch[1]) {
        // 토론주제 이전 내용 추출
        const topicIndex = content.indexOf(topicMatch[0]);
        beforeContent = content.substring(0, topicIndex).trim();

        topic = topicMatch[1].trim();
        proOpinion = proMatch && proMatch[1] ? proMatch[1].trim() : '';
        conOpinion = conMatch && conMatch[1] ? conMatch[1].trim() : '';

        if (topic && (proOpinion || conOpinion)) {
          return {
            beforeContent,
            topic,
            proOpinion,
            conOpinion,
            afterContent: '',
            rawContent: content,
            isParsed: true,
          };
        }
      }
    }

    // 파싱 실패 시 원본 반환
    return {
      beforeContent: '',
      topic: '',
      proOpinion: '',
      conOpinion: '',
      afterContent: '',
      rawContent: content,
      isParsed: false,
    };
  };

  /* 파싱 관련 데이터 변경 렌더링 파트*/
  // 토론 콘텐츠 렌더링 컴포넌트
  const DebateContentRenderer: React.FC<{ content: string }> = ({ content }) => {
    const parsed = parseDebateContent(content);

    // 파싱이 성공한 경우 구조화된 형태로 표시
    if (parsed.isParsed) {
      return (
        <Box sx={{ my: 3 }}>
          {/* 이전 내용 (구조화 이전 텍스트) */}
          {parsed.beforeContent && (
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              {parsed.beforeContent}
            </Typography>
          )}

          {/* 토론 주제 */}
          {parsed.topic && (
            <Paper
              sx={{
                p: 2.5,
                mb: 2,
                bgcolor: 'rgba(63, 81, 181, 0.05)',
                borderLeft: '4px solid #3f51b5',
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 1, color: '#3f51b5', display: 'flex', alignItems: 'center' }}
              >
                <Box
                  component="span"
                  sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#3f51b5', mr: 1 }}
                />
                토론 주제
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {parsed.topic}
              </Typography>
            </Paper>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* 찬성측 의견 */}
            {parsed.proOpinion && (
              <Paper
                sx={{
                  flex: 1,
                  p: 2.5,
                  bgcolor: 'rgba(76, 175, 80, 0.05)',
                  borderLeft: '4px solid #4caf50',
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ mb: 1, color: '#4caf50', display: 'flex', alignItems: 'center' }}
                >
                  <SentimentSatisfiedAltIcon sx={{ fontSize: 18, mr: 1 }} />
                  찬성측 의견
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {parsed.proOpinion}
                </Typography>
              </Paper>
            )}

            {/* 반대측 의견 */}
            {parsed.conOpinion && (
              <Paper
                sx={{
                  flex: 1,
                  p: 2.5,
                  bgcolor: 'rgba(244, 67, 54, 0.05)',
                  borderLeft: '4px solid #f44336',
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ mb: 1, color: '#f44336', display: 'flex', alignItems: 'center' }}
                >
                  <SentimentVeryDissatisfiedIcon sx={{ fontSize: 18, mr: 1 }} />
                  반대측 의견
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {parsed.conOpinion}
                </Typography>
              </Paper>
            )}
          </Box>

          {/* 이후 내용 (구조화 이후 텍스트) */}
          {parsed.afterContent && (
            <Typography variant="body1" sx={{ mt: 3, lineHeight: 1.7 }}>
              {parsed.afterContent}
            </Typography>
          )}
        </Box>
      );
    }

    // 파싱이 실패한 경우 원본 텍스트 그대로 표시
    return (
      <Typography variant="body1" sx={{ my: 3, lineHeight: 1.7 }}>
        {content}
      </Typography>
    );
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // 투표 차트 영역 컴포넌트
  const VoteChartSection: React.FC<{
    voteRatio: { agree: number; disagree: number };
    chartData: any[];
    COLORS: string[];
    t: any;
    enhancedDebate: any;
  }> = ({ voteRatio, chartData, COLORS, t, enhancedDebate }) => {
    const totalVotes = (enhancedDebate.proCount || 0) + (enhancedDebate.conCount || 0);
    return (
      <ProgressSection sx={{ mb: 0 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#222' }}>
          {t('debate.voteResults')}
        </Typography>
        {totalVotes === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120,
              py: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: '#888',
                fontWeight: 600,
                fontSize: 17,
                letterSpacing: 0.1,
                textAlign: 'center',
                border: '1.5px dashed #e0e0e0',
                borderRadius: 2,
                px: 2.5,
                py: 2,
                background: '#fafbfc',
                mt: 2,
              }}
            >
              {t('debate.noVotesYet')}
            </Typography>
          </Box>
        ) : (
          <>
            <VoteBarContainer>
              <Typography variant="body2" fontWeight={600} color="#e91e63" width={40}>
                {voteRatio.agree}%
              </Typography>
              <VoteBar>
                <AgreeBar width={voteRatio.agree}>
                  {voteRatio.agree > 10 && t('debate.yes')}
                </AgreeBar>
                <DisagreeBar width={voteRatio.disagree}>
                  {voteRatio.disagree > 10 && t('debate.no')}
                </DisagreeBar>
              </VoteBar>
              <Typography variant="body2" fontWeight={600} color="#9c27b0" width={40}>
                {voteRatio.disagree}%
              </Typography>
            </VoteBarContainer>
            <Typography variant="body2" textAlign="right">
              {t('debate.totalVotes')}: {totalVotes}
            </Typography>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="40%"
                    paddingAngle={5}
                    dataKey="value"
                    label={renderDiagonalLabel}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </>
        )}
      </ProgressSection>
    );
  };

  // 국가별 투표 현황 컴포넌트
  const CountryStatsSection: React.FC<{
    enhancedDebate: any;
    t: any;
  }> = ({ enhancedDebate, t }) => (
    <Box>
      <ProgressSection sx={{ mb: 0 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#222' }}>
          {t('debate.countryParticipation')}
        </Typography>
        {enhancedDebate.countryStats && enhancedDebate.countryStats.length > 0 ? (
          enhancedDebate.countryStats.map((stat: any, index: number) => {
            const countryColors = {
              KR: '#4caf50',
              US: '#2196f3',
              JP: '#f44336',
              CN: '#ff9800',
              default: '#9c27b0',
            };
            const color =
              countryColors[stat.countryCode as keyof typeof countryColors] ||
              countryColors.default;
            return (
              <CountryStatItem
                key={index}
                sx={{
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 1,
                  padding: theme => theme.spacing(1, 1.5),
                  minWidth: 0,
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <CountryFlag
                  sx={{ minWidth: 0, flexShrink: 0, flexWrap: 'wrap', wordBreak: 'break-all' }}
                >
                  <FlagDisplay nation={stat.countryCode} size="small" showName={true} />
                </CountryFlag>
                <Box sx={{ flex: 1, ml: 1, mr: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '24px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#f0f0f0',
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: `${Math.round(stat.percentage)}%`,
                        height: '100%',
                        backgroundColor: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 0,
                      }}
                    >
                      {stat.percentage > 15 && (
                        <Typography
                          variant="caption"
                          color="white"
                          fontWeight="bold"
                          sx={{
                            whiteSpace: 'normal',
                            wordBreak: 'break-all',
                            textAlign: 'center',
                            width: '100%',
                          }}
                        >
                          {Math.round(stat.percentage)}%
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: 0,
                    textAlign: 'right',
                    wordBreak: 'break-all',
                    whiteSpace: 'normal',
                    flexShrink: 0,
                  }}
                >
                  {stat.count}
                  {t('debate.ppl')} ({Math.round(stat.percentage)}%)
                </Typography>
              </CountryStatItem>
            );
          })
        ) : (
          <Typography variant="body2" align="center" color="text.secondary" sx={{ py: 2 }}>
            {t('debate.noParticipationData')}
          </Typography>
        )}
      </ProgressSection>
    </Box>
  );

  return (
    <DebateLayout
      sidebar={
        <SidebarContainer sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <VoteButtonGroup>
            <VoteButton
              variant="outlined"
              color="inherit"
              selected={userVote === 'pro'}
              onClick={() => handleVote('pro')}
              sx={{
                color: '#e91e63',
                borderColor: '#e91e63',
                '&:hover': {
                  backgroundColor: 'rgba(233, 30, 99, 0.1)',
                },
              }}
            >
              <SentimentSatisfiedAltIcon />
              <Typography component="span">{t('debate.yes')}</Typography>
              <span className="vote-count">{enhancedDebate.proCount || 0}</span>
            </VoteButton>
            <VoteButton
              variant="outlined"
              color="inherit"
              selected={userVote === 'con'}
              onClick={() => handleVote('con')}
              sx={{
                color: '#9c27b0',
                borderColor: '#9c27b0',
                '&:hover': {
                  backgroundColor: 'rgba(156, 39, 176, 0.1)',
                },
              }}
            >
              <SentimentVeryDissatisfiedIcon />
              <Typography component="span">{t('debate.no')}</Typography>
              <span className="vote-count">{enhancedDebate.conCount || 0}</span>
            </VoteButton>
          </VoteButtonGroup>
          <VoteChartSection
            voteRatio={voteRatio}
            chartData={chartData}
            COLORS={COLORS}
            t={t}
            enhancedDebate={enhancedDebate}
          />
          <CountryStatsSection enhancedDebate={enhancedDebate} t={t} />
        </SidebarContainer>
      }
    >
      <Container maxWidth="md" sx={{ py: 2 }}>
        {/* 토론 메인 카드 + 감정표현 버튼 + 뒤로가기 버튼 */}
        <DebateCard sx={{ position: 'relative' }}>
          <CategoryIndicator color={categoryColor} />
          {/* 상단 바: 뒤로가기 + 이모션 버튼 그룹 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              pt: 2,
              pb: 0,
            }}
          >
            <Button
              onClick={handleGoBack}
              sx={{
                minWidth: 40,
                height: 40,
                p: 0,
                borderRadius: 8,
                background: 'transparent !important',
                boxShadow: 'none !important',
                color: '#555',
                mr: 1,
                '&:hover, &:active, &:focus': {
                  background: 'transparent !important',
                  boxShadow: 'none !important',
                },
                outline: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disableRipple
              disableElevation
            >
              <ArrowBackIcon fontSize="medium" />
            </Button>
            <Box sx={{ flex: 1 }} />
            <EmotionButtonGroup
              sx={{ position: 'static', right: 'unset', bottom: 'unset', gap: 1.2 }}
            >
              <EmotionButton
                variant="text"
                selected={userEmotion === 'like'}
                onClick={() => handleEmotionSelect('like')}
                sx={{ color: '#4caf50' }}
              >
                <Box display="flex" alignItems="center" position="relative">
                  <ThumbUpIcon />
                  <span className="custom-tooltip">{t('debate.like')}</span>
                  <Typography>{enhancedDebate.reactions.like || 0}</Typography>
                </Box>
              </EmotionButton>
              <EmotionButton
                variant="text"
                selected={userEmotion === 'dislike'}
                onClick={() => handleEmotionSelect('dislike')}
                sx={{ color: '#f44336' }}
              >
                <Box display="flex" alignItems="center" position="relative">
                  <ThumbUpIcon sx={{ transform: 'rotate(180deg)' }} />
                  <span className="custom-tooltip">{t('debate.dislike')}</span>
                  <Typography>{enhancedDebate.reactions.dislike || 0}</Typography>
                </Box>
              </EmotionButton>
              <EmotionButton
                variant="text"
                selected={userEmotion === 'sad'}
                onClick={() => handleEmotionSelect('sad')}
                sx={{ color: '#2196f3' }}
              >
                <Box display="flex" alignItems="center" position="relative">
                  <SentimentVeryDissatisfiedIcon />
                  <span className="custom-tooltip">{t('debate.sad')}</span>
                  <Typography>{enhancedDebate.reactions.sad || 0}</Typography>
                </Box>
              </EmotionButton>
              <EmotionButton
                variant="text"
                selected={userEmotion === 'angry'}
                onClick={() => handleEmotionSelect('angry')}
                sx={{ color: '#ff9800' }}
              >
                <Box display="flex" alignItems="center" position="relative">
                  <SentimentVeryDissatisfiedIcon />
                  <span className="custom-tooltip">{t('debate.angry')}</span>
                  <Typography>{enhancedDebate.reactions.angry || 0}</Typography>
                </Box>
              </EmotionButton>
              <EmotionButton
                variant="text"
                selected={userEmotion === 'confused'}
                onClick={() => handleEmotionSelect('confused')}
                sx={{ color: '#9c27b0' }}
              >
                <Box display="flex" alignItems="center" position="relative">
                  <SentimentSatisfiedAltIcon />
                  <span className="custom-tooltip">{t('debate.unsure')}</span>
                  <Typography>{enhancedDebate.reactions.unsure || 0}</Typography>
                </Box>
              </EmotionButton>
            </EmotionButtonGroup>
          </Box>
          <Box sx={{ p: 3, pl: 4, pb: 8 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <Box>
                {enhancedDebate.isHot && (
                  <CategoryBadge color={specialLabels['모스트 핫 이슈']}>
                    모스트 핫 이슈
                  </CategoryBadge>
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
                  component="div"
                >
                  {enhancedDebate.category && (
                    <CategoryBadge color={categoryColor}>
                      {categoryNameMap[enhancedDebate.category] || enhancedDebate.category}
                    </CategoryBadge>
                  )}
                  <CountryFlag>
                    <FlagIcon fontSize="small" />
                    {t('debate.korea')}
                  </CountryFlag>
                  <span style={{ margin: '0 4px' }}>•</span>
                  {formatDate(enhancedDebate.createdAt)}
                </Typography>
                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight={700}
                  gutterBottom
                  key={t('debate.title')}
                >
                  {enhancedDebate.title}
                </Typography>
              </Box>
            </Box>

            <DebateContentRenderer content={enhancedDebate.content} />
          </Box>
        </DebateCard>
        {/* 댓글 섹션 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#222' }}>
            {t('debate.commentSection')}
          </Typography>

          {/* 입장 선택 안내 메시지 */}
          {stance ? (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('debate.currentVote')}{' '}
                <Box
                  component="span"
                  fontWeight="bold"
                  sx={{ color: stance === 'pro' ? '#4caf50' : '#f44336' }}
                >
                  {stance === 'pro' ? t('debate.yes') : t('debate.no')}
                </Box>
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('debate.commentGuide')}
              </Typography>
            </Box>
          )}

          {/* 실제 댓글 컴포넌트 사용 */}
          {id && <CommentSection debateId={parseInt(id)} />}
        </Box>
      </Container>
    </DebateLayout>
  );
};

export default DebateDetailPage;
