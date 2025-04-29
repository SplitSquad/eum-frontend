import React, { useState, useEffect } from 'react';
import { useDebateStore } from '../../store';
import { ReactionType } from '../../types';
import DebateApi from '../../api/debateApi';
import CommentApi from '../../api/commentApi';
import { 
  Box,
  IconButton,
  Badge,
  Tooltip,
  ButtonGroup
} from '@mui/material';

// 아이콘 import
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import MoodBadIcon from '@mui/icons-material/MoodBad';

// 색이 있는 아이콘 (선택된 상태)
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

interface ReactionButtonsProps {
  targetId: number;
  targetType: 'debate' | 'comment' | 'reply';
  reactions: {
    like: number;
    dislike: number;
    happy?: number;
    angry?: number;
    sad?: number;
    unsure?: number;
  };
  isState?: string; // 사용자의 현재 감정표현 상태
  size?: 'sm' | 'md' | 'lg';
}

// isState 값을 ReactionType으로 변환하는 함수
const mapIsStateToReactionType = (isState?: string): ReactionType | null => {
  if (!isState) return null;
  
  switch(isState) {
    case '좋아요': return ReactionType.LIKE;
    case '싫어요': return ReactionType.DISLIKE;
    case '기쁨': case '기뻐요': return ReactionType.HAPPY;
    case '화남': case '화나요': return ReactionType.ANGRY;
    case '슬픔': case '슬퍼요': return ReactionType.SAD;
    case '음...': case '글쎄요': return ReactionType.UNSURE;
    default: return null;
  }
};

const ReactionButtons: React.FC<ReactionButtonsProps> = ({
  targetId,
  targetType,
  reactions,
  isState,
  size = 'md'
}) => {
  // 로컬 상태 관리
  const [localReactions, setLocalReactions] = useState({
    like: 0,
    dislike: 0,
    happy: 0,
    angry: 0,
    sad: 0,
    unsure: 0
  });
  
  // 사용자의 현재 반응 상태 (타입별로 독립적으로 관리)
  const [userLikeState, setUserLikeState] = useState<boolean>(false);
  const [userDislikeState, setUserDislikeState] = useState<boolean>(false);
  const [userHappyState, setUserHappyState] = useState<boolean>(false);
  const [userAngryState, setUserAngryState] = useState<boolean>(false);
  const [userSadState, setUserSadState] = useState<boolean>(false);
  const [userUnsureState, setUserUnsureState] = useState<boolean>(false);
  
  // 실제 서버에서 받은 데이터 저장
  const [serverReactions, setServerReactions] = useState(reactions);

  // 초기 로드 및 props 변경 시 서버 데이터 업데이트
  useEffect(() => {
    setServerReactions(reactions);
  }, [reactions]);

  // 초기 로드 시 isState 값에 따라 사용자 반응 설정
  useEffect(() => {
    const initialReaction = mapIsStateToReactionType(isState);
    if (initialReaction) {
      // 모든 상태 초기화
      setUserLikeState(false);
      setUserDislikeState(false);
      setUserHappyState(false);
      setUserAngryState(false);
      setUserSadState(false);
      setUserUnsureState(false);
      
      // 현재 반응 상태 설정
      switch(initialReaction) {
        case ReactionType.LIKE:
          setUserLikeState(true);
          break;
        case ReactionType.DISLIKE:
          setUserDislikeState(true);
          break;
        case ReactionType.HAPPY:
          setUserHappyState(true);
          break;
        case ReactionType.ANGRY:
          setUserAngryState(true);
          break;
        case ReactionType.SAD:
          setUserSadState(true);
          break;
        case ReactionType.UNSURE:
          setUserUnsureState(true);
          break;
      }
    } else {
      // 모든 상태 초기화
      setUserLikeState(false);
      setUserDislikeState(false);
      setUserHappyState(false);
      setUserAngryState(false);
      setUserSadState(false);
      setUserUnsureState(false);
    }
  }, [isState]);

  // 버튼 크기 설정
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'small';
      case 'lg': return 'large';
      default: return 'medium';
    }
  };

  // 특정 반응의 상태 가져오기
  const getReactionState = (reactionType: ReactionType): boolean => {
    switch(reactionType) {
      case ReactionType.LIKE:
        return userLikeState;
      case ReactionType.DISLIKE:
        return userDislikeState;
      case ReactionType.HAPPY:
        return userHappyState;
      case ReactionType.ANGRY:
        return userAngryState;
      case ReactionType.SAD:
        return userSadState;
      case ReactionType.UNSURE:
        return userUnsureState;
      default:
        return false;
    }
  };

  // 특정 반응의 상태 설정하기
  const setReactionState = (reactionType: ReactionType, state: boolean) => {
    switch(reactionType) {
      case ReactionType.LIKE:
        setUserLikeState(state);
        break;
      case ReactionType.DISLIKE:
        setUserDislikeState(state);
        break;
      case ReactionType.HAPPY:
        setUserHappyState(state);
        break;
      case ReactionType.ANGRY:
        setUserAngryState(state);
        break;
      case ReactionType.SAD:
        setUserSadState(state);
        break;
      case ReactionType.UNSURE:
        setUserUnsureState(state);
        break;
    }
  };

  // 낙관적 UI 업데이트를 위한 반응 처리 핸들러
  const handleReaction = async (reactionType: ReactionType) => {
    // 좋아요와 싫어요를 위한 특별 처리
    if (reactionType === ReactionType.LIKE || reactionType === ReactionType.DISLIKE) {
      // 현재 반응 상태 가져오기
      const currentState = getReactionState(reactionType);
      
      // 다른 버튼 상태 (LIKE면 DISLIKE, DISLIKE면 LIKE)
      const oppositeType = reactionType === ReactionType.LIKE ? ReactionType.DISLIKE : ReactionType.LIKE;
      const oppositeState = getReactionState(oppositeType);
      
      // 이미 활성화된 상태면 토글 (비활성화)
      if (currentState) {
        // 반응 취소
        setReactionState(reactionType, false);
        
        // 카운트 업데이트
      setLocalReactions(prev => ({
        ...prev,
        [reactionType.toLowerCase()]: prev[reactionType.toLowerCase() as keyof typeof prev] - 1
      }));
      } 
      // 상대 버튼이 비활성화 상태일 때만 활성화 가능 (비활성화 된 버튼은 클릭 안됨)
      else if (!oppositeState) {
        // 새 반응 추가
        setReactionState(reactionType, true);
        
        // 카운트 업데이트
        setLocalReactions(prev => ({
          ...prev,
          [reactionType.toLowerCase()]: prev[reactionType.toLowerCase() as keyof typeof prev] + 1
        }));
      }
    } 
    // 기타 감정표현 (기쁨, 슬픔 등)은 기존대로 처리
    else {
      // 현재 반응 상태 가져오기
      const currentState = getReactionState(reactionType);
      
      // 반응 상태 토글
      const newState = !currentState;
      setReactionState(reactionType, newState);
      
      // 카운트 업데이트
      setLocalReactions(prev => ({
        ...prev,
        [reactionType.toLowerCase()]: prev[reactionType.toLowerCase() as keyof typeof prev] + (newState ? 1 : -1)
      }));
    }
    
    // 타입별로 다른 API 호출
    try {
      let response: any = null;
      
      // 대상에 따라 다른 API 호출
      switch (targetType) {
        case 'debate':
          // 토론 주제에 대한 감정표현
          response = await DebateApi.addReaction({
            targetId,
            targetType,
            reactionType
          });
          break;
        case 'comment':
          // 댓글에 대한 감정표현
          response = await CommentApi.reactToComment(targetId, reactionType);
          break;
        case 'reply':
          // 답글에 대한 감정표현
          response = await CommentApi.reactToReply(targetId, reactionType);
          break;
      }
      
      // 서버 응답에 따라 상태 업데이트
      if (response) {
        // 서버 응답 데이터를 상태에 저장
        setServerReactions(response);
        
        // 로컬 상태 증감 리셋
        setLocalReactions({
          like: 0,
          dislike: 0,
          happy: 0,
          angry: 0,
          sad: 0,
          unsure: 0
        });
        
        // 사용자 반응 상태 업데이트
        if (response.isState) {
          const newReaction = mapIsStateToReactionType(response.isState);
          if (newReaction) {
            // 모든 상태 초기화 후 현재 반응만 활성화
            setUserLikeState(newReaction === ReactionType.LIKE);
            setUserDislikeState(newReaction === ReactionType.DISLIKE);
            setUserHappyState(newReaction === ReactionType.HAPPY);
            setUserAngryState(newReaction === ReactionType.ANGRY);
            setUserSadState(newReaction === ReactionType.SAD);
            setUserUnsureState(newReaction === ReactionType.UNSURE);
          }
        } else if (response.isState === null || response.isState === '') {
          // 반응이 취소된 경우 - 특정 반응만 취소
          setReactionState(reactionType, false);
        }
      }
    } catch (error) {
      console.error('반응 추가 중 오류 발생:', error);
      
      // 오류 발생 시 원래 상태로 복원 (토글 취소)
      if (reactionType === ReactionType.LIKE || reactionType === ReactionType.DISLIKE) {
        // 원래 상태로 복원 - 버튼 상태를 오류 발생 전으로 되돌림
        const prevState = getReactionState(reactionType);
        setReactionState(reactionType, !prevState);
      } else {
        // 기타 감정표현 버튼은 이전 상태로 복원
        const prevState = getReactionState(reactionType);
        setReactionState(reactionType, !prevState);
      }
      
      // 로컬 증감 상태 초기화 (서버 값 사용)
      setLocalReactions({
        like: 0,
        dislike: 0,
        happy: 0,
        angry: 0,
        sad: 0,
        unsure: 0
      });
    }
  };

  // 서버 데이터와 로컬 데이터 병합
  const mergedReactions = {
    like: (serverReactions.like || 0) + localReactions.like,
    dislike: (serverReactions.dislike || 0) + localReactions.dislike,
    happy: (serverReactions.happy || 0) + localReactions.happy,
    angry: (serverReactions.angry || 0) + localReactions.angry,
    sad: (serverReactions.sad || 0) + localReactions.sad,
    unsure: (serverReactions.unsure || 0) + localReactions.unsure
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {/* 좋아요 버튼 */}
      <Tooltip title={userDislikeState ? "싫어요를 취소한 후 누를 수 있습니다" : "좋아요"}>
        <span>
        <Badge 
          badgeContent={mergedReactions.like} 
          color="primary" 
          showZero={false}
          sx={{ '& .MuiBadge-badge': { fontSize: size === 'sm' ? '0.7rem' : '0.8rem' } }}
        >
          <IconButton 
            size={getIconSize()} 
            onClick={() => handleReaction(ReactionType.LIKE)}
            sx={{ 
                color: userLikeState ? 'primary.main' : 'text.secondary',
              padding: size === 'sm' ? 0.5 : 1
            }}
              disabled={userDislikeState} // 싫어요 상태면 비활성화
          >
              {userLikeState ? 
              <ThumbUpIcon fontSize={getIconSize()} /> :
            <ThumbUpOutlinedIcon fontSize={getIconSize()} />
            }
          </IconButton>
        </Badge>
        </span>
      </Tooltip>
      
      {/* 싫어요 버튼 */}
      <Tooltip title={userLikeState ? "좋아요를 취소한 후 누를 수 있습니다" : "싫어요"}>
        <span>
        <Badge 
          badgeContent={mergedReactions.dislike} 
          color="error" 
          showZero={false}
          sx={{ '& .MuiBadge-badge': { fontSize: size === 'sm' ? '0.7rem' : '0.8rem' } }}
        >
          <IconButton 
            size={getIconSize()} 
            onClick={() => handleReaction(ReactionType.DISLIKE)}
            sx={{ 
                color: userDislikeState ? 'error.main' : 'text.secondary',
              padding: size === 'sm' ? 0.5 : 1
            }}
              disabled={userLikeState} // 좋아요 상태면 비활성화
          >
              {userDislikeState ? 
              <ThumbDownIcon fontSize={getIconSize()} /> :
            <ThumbDownOutlinedIcon fontSize={getIconSize()} />
            }
          </IconButton>
        </Badge>
        </span>
      </Tooltip>
      
      {/* 토론에만 표시되는 추가 감정표현 버튼들 */}
      {targetType === 'debate' && (
        <>
          {/* 기쁨 버튼 */}
          <Tooltip title="기쁨">
            <Badge 
              badgeContent={mergedReactions.happy} 
              color="success" 
              showZero={false}
              sx={{ '& .MuiBadge-badge': { fontSize: size === 'sm' ? '0.7rem' : '0.8rem' } }}
            >
              <IconButton 
                size={getIconSize()} 
                onClick={() => handleReaction(ReactionType.HAPPY)}
                sx={{ 
                  color: userHappyState ? 'success.main' : 'text.secondary',
                  padding: size === 'sm' ? 0.5 : 1
                }}
              >
                <MoodIcon fontSize={getIconSize()} />
              </IconButton>
            </Badge>
          </Tooltip>
          
          {/* 화남 버튼 */}
          <Tooltip title="화남">
            <Badge 
              badgeContent={mergedReactions.angry} 
              color="warning" 
              showZero={false}
              sx={{ '& .MuiBadge-badge': { fontSize: size === 'sm' ? '0.7rem' : '0.8rem' } }}
            >
              <IconButton 
                size={getIconSize()} 
                onClick={() => handleReaction(ReactionType.ANGRY)}
                sx={{ 
                  color: userAngryState ? 'warning.main' : 'text.secondary',
                  padding: size === 'sm' ? 0.5 : 1
                }}
              >
                <MoodBadIcon fontSize={getIconSize()} />
              </IconButton>
            </Badge>
          </Tooltip>
          
          {/* 슬픔 버튼 */}
          <Tooltip title="슬픔">
            <Badge 
              badgeContent={mergedReactions.sad} 
              color="info" 
              showZero={false}
              sx={{ '& .MuiBadge-badge': { fontSize: size === 'sm' ? '0.7rem' : '0.8rem' } }}
            >
              <IconButton 
                size={getIconSize()} 
                onClick={() => handleReaction(ReactionType.SAD)}
                sx={{ 
                  color: userSadState ? 'info.main' : 'text.secondary',
                  padding: size === 'sm' ? 0.5 : 1
                }}
              >
                <SentimentVeryDissatisfiedIcon fontSize={getIconSize()} />
              </IconButton>
            </Badge>
          </Tooltip>
          
          {/* 음... 버튼 */}
          <Tooltip title="음...">
            <Badge 
              badgeContent={mergedReactions.unsure} 
              color="default" 
              showZero={false}
              sx={{ '& .MuiBadge-badge': { fontSize: size === 'sm' ? '0.7rem' : '0.8rem' } }}
            >
              <IconButton 
                size={getIconSize()} 
                onClick={() => handleReaction(ReactionType.UNSURE)}
                sx={{ 
                  color: userUnsureState ? 'text.primary' : 'text.secondary',
                  padding: size === 'sm' ? 0.5 : 1
                }}
              >
                <SentimentNeutralIcon fontSize={getIconSize()} />
              </IconButton>
            </Badge>
          </Tooltip>
        </>
      )}
    </Box>
  );
};

export default ReactionButtons; 