import React, { useState } from 'react';
import { useDebateStore } from '../../store';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Pagination from '../shared/Pagination';

interface CommentSectionProps {
  debateId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ debateId }) => {
  const {
    comments,
    totalComments,
    commentPages,
    currentCommentPage,
    isLoading,
    getComments
  } = useDebateStore();

  const [showCommentForm, setShowCommentForm] = useState(false);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    getComments(debateId, page);
  };

  // 댓글 정렬 옵션
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'popular', label: '인기순' }
  ];

  // 댓글이 없는 경우
  const renderEmptyComments = () => (
    <div className="text-center py-10">
      <p className="text-gray-500">아직 댓글이 없습니다.</p>
      <button
        onClick={() => setShowCommentForm(true)}
        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
      >
        첫 댓글 작성하기
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">댓글 {totalComments}개</h2>
        
        <div className="flex gap-2">
          {/* 정렬 옵션 선택 */}
          <select
            className="px-3 py-2 border rounded-md text-sm"
            onChange={(e) => {
              // TODO: 정렬 변경 구현
              console.log('정렬 변경:', e.target.value);
            }}
            defaultValue="latest"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* 댓글 작성 버튼 */}
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            {showCommentForm ? '취소' : '댓글 작성'}
          </button>
        </div>
      </div>

      {/* 댓글 작성 폼 */}
      {showCommentForm && (
        <CommentForm
          debateId={debateId}
          onSuccess={() => {
            setShowCommentForm(false);
            getComments(debateId);
          }}
        />
      )}

      {/* 댓글 목록 */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : comments.length === 0 ? (
          renderEmptyComments()
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onUpdate={() => getComments(debateId, currentCommentPage)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {commentPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentCommentPage}
            totalPages={commentPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CommentSection; 