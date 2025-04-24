import React from 'react';
import { Link } from 'react-router-dom';
import { Debate } from '../../types';
import VoteProgress from '../shared/VoteProgress';

interface DebateItemProps {
  debate: Debate;
  colorScheme?: 'green' | 'red' | 'yellow' | 'blue';
  onVote?: (id: number, stance: 'pro' | 'con') => void;
}

const DebateItem: React.FC<DebateItemProps> = ({
  debate,
  colorScheme = 'green',
  onVote
}) => {
  const {
    id,
    title,
    content,
    createdAt,
    viewCount,
    proCount,
    conCount,
    commentCount
  } = debate;

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 색상 스키마에 따른 스타일
  const colorStyles = {
    green: 'border-l-green-500',
    red: 'border-l-red-500',
    yellow: 'border-l-yellow-500',
    blue: 'border-l-blue-500'
  };

  // 투표 핸들러
  const handleVote = (stance: 'pro' | 'con', e: React.MouseEvent) => {
    e.preventDefault(); // 링크 이동 방지
    e.stopPropagation(); // 버블링 방지
    
    if (onVote) {
      onVote(id, stance);
    }
  };

  // 내용 요약 (100자 제한)
  const summarizeContent = (text: string, limit = 100) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit - 3) + '...';
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-sm overflow-hidden 
      border-l-4 ${colorStyles[colorScheme]} 
      transition-all duration-200 hover:shadow-md
    `}>
      <Link to={`/debate/${id}`} className="block">
        <div className="p-4">
          {/* 제목 */}
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          
          {/* 내용 요약 */}
          <p className="text-gray-600 text-sm mb-3">
            {summarizeContent(content)}
          </p>
          
          {/* 메타 정보 */}
          <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-3">
              <span>{formatDate(createdAt)}</span>
              <span>조회 {viewCount}</span>
              <span>댓글 {commentCount}</span>
            </div>
          </div>
          
          {/* 찬반 투표 상태 */}
          <VoteProgress
            proCount={proCount}
            conCount={conCount}
            size="sm"
          />
          
          {/* 찬반 투표 버튼 */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => handleVote('pro', e)}
              className="flex-1 py-2 rounded bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition"
            >
              찬성 ({proCount})
            </button>
            <button
              onClick={(e) => handleVote('con', e)}
              className="flex-1 py-2 rounded bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition"
            >
              반대 ({conCount})
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DebateItem; 