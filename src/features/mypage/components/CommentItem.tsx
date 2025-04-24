import React from 'react';
import { Link } from 'react-router-dom';
import { MyComment } from '../types';

interface CommentItemProps {
  comment: MyComment;
}

/**
 * 내가 작성한 댓글 항목 컴포넌트
 */
const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="border-b last:border-b-0 py-4">
      <div className="flex justify-between items-start mb-2">
        <Link 
          to={`/community/post/${comment.postId}`}
          className="text-primary-600 hover:underline transition-colors text-sm"
        >
          {comment.postTitle}
        </Link>
        <span className="text-sm text-gray-500">{comment.createdAt}</span>
      </div>
      
      <p className="text-gray-700 mb-1">
        {comment.content}
      </p>
    </div>
  );
};

export default CommentItem; 