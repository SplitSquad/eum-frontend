import React, { useState, useEffect } from 'react';
import CommentApi from '../../api/commentApi';

interface CommentFormProps {
  debateId: number;
  onSuccess?: (newComment?: any) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ debateId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [stance, setStance] = useState<'pro' | 'con' | null>(null);

  useEffect(() => {
    const storedStance = localStorage.getItem(`stance`);
    if (storedStance === 'pro' || storedStance === 'con') {
      setStance(storedStance as 'pro' | 'con');
    } else {
      setStance(null);
    }
    console.log(`저장된 stance 값 확인 ---!!!!! ${debateId}:`, storedStance);
  }, [debateId]); // debateId가 바뀔 때만 실행

  // 사용자 이름 로드
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');

    if (storedUserName && !storedUserName.startsWith('사용자')) {
      setUserName(storedUserName);
    } else {
      const commonUserName = '우린최고야'; // 실제 환경에 맞게 수정하세요
      localStorage.setItem('userName', commonUserName);
      setUserName(commonUserName);
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }

    if (content.length > 1000) {
      setError('댓글은 최대 1000자까지 입력 가능합니다.');
      return;
    }

    const tempId = -Date.now();

    try {
      setIsSubmitting(true);
      setError('');

      const userId = Number(localStorage.getItem('userId')) || 0;
      const currentUserName = userName || '우린최고야';

      const tempComment = {
        id: tempId,
        debateId,
        userId,
        userName: currentUserName,
        userProfileImage: '',
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stance: stance,
        replyCount: 0,
        reactions: {
          like: 0,
          dislike: 0,
        },
      };

      if (onSuccess) {
        onSuccess(tempComment);
      }

      setContent('');
      setError('');

      await CommentApi.createComment({
        debateId,
        content,
        stance,
      });
    } catch (err) {
      setError('댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('댓글 작성 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContent('');
    setError('');
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="mb-3">
        <h3 className="text-lg font-medium mb-2">의견 작성</h3>
        {/* 찬반 선택 */}/{/* 댓글 입력 영역 */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="토론 주제에 대한 의견을 작성해주세요."
          className={`
            w-full p-3 border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-primary 
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
          rows={5}
          disabled={isSubmitting}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSubmit(e as any);
            }
          }}
        />
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs text-gray-500">{content.length}/1000자</div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className={`
            px-4 py-2 text-white rounded-lg
            ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
            transition font-medium
          `}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              저장 중...
            </>
          ) : (
            '댓글 작성'
          )}
        </button>
      </div>
    </div>
  );
};

export default CommentForm;
