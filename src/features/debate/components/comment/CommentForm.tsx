import React, { useState } from 'react';
import { useDebateStore } from '../../store';

interface CommentFormProps {
  debateId: number;
  onSuccess?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ debateId, onSuccess }) => {
  const { createComment } = useDebateStore();
  const [content, setContent] = useState('');
  const [stance, setStance] = useState<'pro' | 'con'>('pro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 댓글 작성 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }
    
    if (content.length > 1000) {
      setError('댓글은 최대 1000자까지 입력 가능합니다.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      await createComment(debateId, content, stance);
      
      // 성공 시 입력 초기화
      setContent('');
      
      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('댓글 작성 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
      <div className="mb-3">
        <h3 className="text-lg font-medium mb-2">의견 작성</h3>
        
        {/* 찬반 선택 */}
        <div className="flex gap-4 mb-3">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="stance"
              value="pro"
              checked={stance === 'pro'}
              onChange={() => setStance('pro')}
              className="h-4 w-4 text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-green-700">찬성</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="stance"
              value="con"
              checked={stance === 'con'}
              onChange={() => setStance('con')}
              className="h-4 w-4 text-red-600 focus:ring-red-500"
            />
            <span className="ml-2 text-red-700">반대</span>
          </label>
        </div>
        
        {/* 댓글 입력 영역 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="토론 주제에 대한 의견을 작성해주세요."
          className={`
            w-full p-3 border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-primary 
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
          rows={5}
          disabled={isSubmitting}
        />
        
        {/* 글자 수 카운터 */}
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs text-gray-500">
            {content.length}/1000자
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
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          type="submit"
          className={`
            px-4 py-2 text-white rounded-lg
            ${isSubmitting ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'}
            transition
          `}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              저장 중...
            </>
          ) : '댓글 작성'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 