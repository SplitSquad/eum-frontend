import React from 'react';
import { ReactionType } from '../../types';
import { useDebateStore } from '../../store';

// 감정표현 아이콘 및 텍스트 설정
const reactionConfig = {
  [ReactionType.LIKE]: {
    icon: '👍',
    label: '좋아요'
  },
  [ReactionType.DISLIKE]: {
    icon: '👎',
    label: '싫어요'
  },
  [ReactionType.HAPPY]: {
    icon: '😊',
    label: '행복해요'
  },
  [ReactionType.ANGRY]: {
    icon: '😠',
    label: '화나요'
  },
  [ReactionType.SAD]: {
    icon: '😢',
    label: '슬퍼요'
  },
  [ReactionType.UNSURE]: {
    icon: '🤔',
    label: '글쎄요'
  }
};

interface ReactionButtonsProps {
  targetId: number;
  targetType: 'debate' | 'comment' | 'reply';
  reactions: {
    like: number;
    dislike: number;
    happy: number;
    angry: number;
    sad: number;
    unsure: number;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ReactionButtons: React.FC<ReactionButtonsProps> = ({
  targetId,
  targetType,
  reactions,
  size = 'md',
  className = ''
}) => {
  const { addReaction } = useDebateStore();

  // 감정표현 크기에 따른 스타일 설정
  const sizeStyles = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-sm px-2 py-1 gap-1.5',
    lg: 'text-base px-2.5 py-1.5 gap-2'
  };

  // 감정표현 클릭 핸들러
  const handleReactionClick = (reactionType: ReactionType) => {
    addReaction(targetId, targetType, reactionType);
  };

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {Object.entries(reactionConfig).map(([type, config]) => {
        const reactionType = type as ReactionType;
        const count = reactions[reactionType];
        
        return (
          <button
            key={type}
            onClick={() => handleReactionClick(reactionType)}
            className={`
              flex items-center ${sizeStyles[size]} 
              rounded-full border border-gray-200 bg-white hover:bg-gray-50
              transition-colors duration-200 ease-in-out
            `}
            title={config.label}
            aria-label={`${config.label} ${count}개`}
          >
            <span className="mr-1">{config.icon}</span>
            <span className="text-gray-600">{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ReactionButtons; 