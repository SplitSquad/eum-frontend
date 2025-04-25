import React, { useState } from 'react';
import { useDebateStore } from '../../store';

interface ReplyFormProps {
  commentId: number;
  onSuccess?: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ commentId, onSuccess }) => {
  const { createReply } = useDebateStore();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 대댓글 작성 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!content.trim()) {
      setError('답글 내용을 입력해주세요.');
      return;
    }
    
    if (content.length > 500) {
      setError('답글은 최대 500자까지 입력 가능합니다.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      await createReply(commentId, content);
      
      // 성공 시 입력 초기화
      setContent('');
      
      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('답글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('답글 작성 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-3 rounded-lg">
      <div className="mb-2">
        {/* 답글 입력 영역 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="답글을 입력해주세요."
          className={`
            w-full p-2 border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-primary 
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
          rows={3}
          disabled={isSubmitting}
        />
        
        {/* 글자 수 카운터 */}
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs text-gray-500">
            {content.length}/500자
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
      
      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setContent('');
            if (onSuccess) onSuccess();
          }}
          className="px-3 py-1.5 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          type="submit"
          className={`
            px-3 py-1.5 text-sm text-white rounded
            ${isSubmitting ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'}
            transition
          `}
          disabled={isSubmitting}
        >
          {isSubmitting ? '저장 중...' : '답글 작성'}
        </button>
      </div>
    </form>
  );
};

export default ReplyForm; 