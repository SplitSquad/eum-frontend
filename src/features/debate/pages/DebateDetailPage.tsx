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

// Import the recharts library for pie charts
// The recharts package should be installed with: npm install recharts
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

interface VoteButtonProps {
  color: string;
  selected?: boolean;
}

const VoteButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'color' && prop !== 'selected',
})<VoteButtonProps>(({ theme, color, selected }) => ({
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

interface EmotionButtonProps {
  selected?: boolean;
}

const EmotionButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'selected',
})<EmotionButtonProps>(({ theme, selected }) => ({
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
  height: 280,
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
                    if (countryCode === 'KR') countryName = '대한민국';
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
              if (countryCode === 'KR') countryName = '대한민국';
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
                    if (countryCode === 'KR') countryName = '대한민국';
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
              if (countryCode === 'KR') countryName = '대한민국';
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
      { name: '찬성', value: agree },
      { name: '반대', value: disagree },
    ];
  };

  const COLORS = ['#e91e63', '#9c27b0'];

  // Render loading state
  if (loading) {
    return (
      <DebateLayout
        headerProps={{
          title: '토론 상세',
          showBackButton: true,
          onBackClick: handleGoBack,
          showUserIcons: true,
        }}
      >
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
      <DebateLayout
        headerProps={{
          title: '토론 상세',
          showBackButton: true,
          onBackClick: handleGoBack,
          showUserIcons: true,
        }}
      >
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

  return (
    <DebateLayout
      headerProps={{
        title: '토론 상세',
        showBackButton: true,
        onBackClick: handleGoBack,
        showUserIcons: true,
      }}
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* 개발용 디버그 버튼 */}
        {import.meta.env.DEV && (
          <Button variant="outlined" color="info" onClick={handleReloadDebateData} sx={{ mb: 2 }}>
            데이터 새로고침 (개발용)
          </Button>
        )}

        {/* 토론 메인 카드 */}
        <DebateCard>
          <CategoryIndicator color={categoryColor} />
          <Box sx={{ p: 3, pl: 4 }}>
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
                  {enhancedDebate.category}
                  <CountryFlag>
                    <FlagIcon fontSize="small" />
                    한국
                  </CountryFlag>
                  <span style={{ margin: '0 4px' }}>•</span>
                  {formatDate(enhancedDebate.createdAt)}
                </Typography>
                <Typography variant="h5" component="h1" fontWeight={700} gutterBottom>
                  {enhancedDebate.title}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ my: 3, lineHeight: 1.7 }}>
              {enhancedDebate.content}
            </Typography>
          </Box>
        </DebateCard>

        {/* 투표 섹션 */}
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          찬성과 반대, 당신의 의견은?
        </Typography>

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
            <Typography variant="subtitle1" fontWeight={600}>
              찬성
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              {enhancedDebate.proCount || 0}
            </Typography>
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
            <Typography variant="subtitle1" fontWeight={600}>
              반대
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              {enhancedDebate.conCount || 0}
            </Typography>
          </VoteButton>
        </VoteButtonGroup>

        {/* 감정표현 섹션 */}
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          이 토론에 대한 감정을 표현해주세요
        </Typography>

        <EmotionButtonGroup>
          <EmotionButton
            variant="outlined"
            selected={userEmotion === 'like'}
            onClick={() => handleEmotionSelect('like')}
            sx={{
              color: '#4caf50',
              borderColor: '#4caf50',
              backgroundColor: userEmotion === 'like' ? 'rgba(76, 175, 80, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.12)',
              },
            }}
          >
            <ThumbUpIcon />
            <Typography variant="body2">좋아요</Typography>
            <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
              {enhancedDebate.reactions.like || 0}
            </Typography>
          </EmotionButton>

          <EmotionButton
            variant="outlined"
            selected={userEmotion === 'dislike'}
            onClick={() => handleEmotionSelect('dislike')}
            sx={{
              color: '#f44336',
              borderColor: '#f44336',
              backgroundColor:
                userEmotion === 'dislike' ? 'rgba(244, 67, 54, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.12)',
              },
            }}
          >
            <ThumbUpIcon sx={{ transform: 'rotate(180deg)' }} />
            <Typography variant="body2">싫어요</Typography>
            <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
              {enhancedDebate.reactions.dislike || 0}
            </Typography>
          </EmotionButton>

          <EmotionButton
            variant="outlined"
            selected={userEmotion === 'sad'}
            onClick={() => handleEmotionSelect('sad')}
            sx={{
              color: '#2196f3',
              borderColor: '#2196f3',
              backgroundColor: userEmotion === 'sad' ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.12)',
              },
            }}
          >
            <SentimentVeryDissatisfiedIcon />
            <Typography variant="body2">슬퍼요</Typography>
            <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
              {enhancedDebate.reactions.sad || 0}
            </Typography>
          </EmotionButton>

          <EmotionButton
            variant="outlined"
            selected={userEmotion === 'angry'}
            onClick={() => handleEmotionSelect('angry')}
            sx={{
              color: '#ff9800',
              borderColor: '#ff9800',
              backgroundColor: userEmotion === 'angry' ? 'rgba(255, 152, 0, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 152, 0, 0.12)',
              },
            }}
          >
            <SentimentVeryDissatisfiedIcon />
            <Typography variant="body2">화나요</Typography>
            <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
              {enhancedDebate.reactions.angry || 0}
            </Typography>
          </EmotionButton>

          <EmotionButton
            variant="outlined"
            selected={userEmotion === 'confused'}
            onClick={() => handleEmotionSelect('confused')}
            sx={{
              color: '#9c27b0',
              borderColor: '#9c27b0',
              backgroundColor:
                userEmotion === 'confused' ? 'rgba(156, 39, 176, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(156, 39, 176, 0.12)',
              },
            }}
          >
            <SentimentSatisfiedAltIcon />
            <Typography variant="body2">글쎄요</Typography>
            <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
              {enhancedDebate.reactions.unsure || 0}
            </Typography>
          </EmotionButton>
        </EmotionButtonGroup>

        {/* 투표 결과 */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <ProgressSection>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{
                  background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                투표 결과
              </Typography>

              <VoteBarContainer>
                <Typography variant="body2" fontWeight={600} color="#e91e63" width={40}>
                  {voteRatio.agree}%
                </Typography>
                <VoteBar>
                  <AgreeBar width={voteRatio.agree}>{voteRatio.agree > 10 && '찬성'}</AgreeBar>
                  <DisagreeBar width={voteRatio.disagree}>
                    {voteRatio.disagree > 10 && '반대'}
                  </DisagreeBar>
                </VoteBar>
                <Typography variant="body2" fontWeight={600} color="#9c27b0" width={40}>
                  {voteRatio.disagree}%
                </Typography>
              </VoteBarContainer>

              <Typography variant="body2" textAlign="right">
                총 투표수: {(enhancedDebate.proCount || 0) + (enhancedDebate.conCount || 0)}
              </Typography>

              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
            </ProgressSection>
          </Box>

          <Box sx={{ flex: 1 }}>
            <ProgressSection>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{
                  background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                국가별 참여 현황
              </Typography>

              {enhancedDebate.countryStats && enhancedDebate.countryStats.length > 0 ? (
                enhancedDebate.countryStats.map((stat, index) => {
                  // 국가별로 다른 색상 사용 (각 국가마다 고유한 색상)
                  const countryColors = {
                    KR: '#4caf50', // 한국 - 초록
                    US: '#2196f3', // 미국 - 파랑
                    JP: '#f44336', // 일본 - 빨강
                    CN: '#ff9800', // 중국 - 주황
                    default: '#9c27b0', // 기타 - 보라
                  };

                  const color =
                    countryColors[stat.countryCode as keyof typeof countryColors] ||
                    countryColors.default;

                  return (
                    <CountryStatItem key={index}>
                      <CountryFlag>
                        <FlagIcon fontSize="small" />
                        <Typography variant="body2" fontWeight={500}>
                          {stat.countryName}
                        </Typography>
                      </CountryFlag>
                      <Box sx={{ flex: 1, ml: 1, mr: 1 }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '24px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: '#f0f0f0',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${stat.percentage}%`,
                              height: '100%',
                              backgroundColor: color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {stat.percentage > 15 && (
                              <Typography variant="caption" color="white" fontWeight="bold">
                                {stat.percentage}%
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'right' }}>
                        {stat.count}명 ({stat.percentage}%)
                      </Typography>
                    </CountryStatItem>
                  );
                })
              ) : (
                <Typography variant="body2" align="center" color="text.secondary" sx={{ py: 2 }}>
                  국가별 참여 정보가 없습니다.
                </Typography>
              )}
            </ProgressSection>
          </Box>
        </Box>

        {/* 댓글 섹션 */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            사람들의 다양한 의견을 존중해주세요.
          </Typography>

          {/* 입장 선택 안내 메시지 */}
          {stance ? (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                선택한 입장:{' '}
                <Box
                  component="span"
                  fontWeight="bold"
                  sx={{ color: stance === 'pro' ? '#4caf50' : '#f44336' }}
                >
                  {stance === 'pro' ? '찬성' : '반대'}
                </Box>
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                투표 버튼을 클릭하여 먼저 입장을 선택하면 댓글에 입장이 표시됩니다.
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
