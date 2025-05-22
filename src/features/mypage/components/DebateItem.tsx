import React from 'react';
import { Link } from 'react-router-dom';
import { MyDebate } from '../types';

interface DebateItemProps {
  debate: MyDebate;
}

/**
 * 내가 투표한 토론 항목 컴포넌트
 */
const DebateItem: React.FC<DebateItemProps> = ({ debate }) => {
  return (
    <div className="border-b last:border-b-0 py-4">
      <div className="flex justify-between items-start mb-2">
        <Link 
          to={`/debate/${debate.id}`}
          className="text-lg font-medium text-gray-800 hover:text-primary-600 transition-colors"
        >
          {debate.title}
        </Link>
        <span className="text-sm text-gray-500">{debate.createdAt}</span>
      </div>
      
      <div className="flex items-center mt-2">
        <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
          투표: {debate.votedOption}
        </span>
        <span className="ml-3 text-sm text-gray-500">
          총 {debate.totalVotes}명 참여
        </span>
      </div>
    </div>
  );
};

export default DebateItem; 