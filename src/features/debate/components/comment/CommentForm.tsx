import React, { useState, useEffect } from 'react';
import CommentApi from '../../api/commentApi';

interface CommentFormProps {
  debateId: number;
  onSuccess?: (newComment?: any) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ debateId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [stance, setStance] = useState<'pro' | 'con'>('pro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  // TODO: 사용자 이름 가져오기
  // 컴포넌트 마운트 시 사용자 이름 가져오기
  useEffect(() => {
    // localStorage에서 사용자 이름 가져오기
    const storedUserName = localStorage.getItem('userName');

    // 기존 이름이 있으면 그대로 사용
    if (storedUserName && !storedUserName.startsWith('사용자')) {
      setUserName(storedUserName);
    } else {
      // 로컬스토리지에 이름이 없거나 '사용자'로 시작하는 경우, 공통적으로 사용하는 다른 이름 확인 * #ERROR Local Starage 이름 저장 확인
      // 여기서는 실제 유저 이름을 사용해야 함 - 임의로 생성하지 않음
      const commonUserName = '우린최고야'; // 실제 환경에서는 세션이나 다른 방식으로 이름을 가져와야 함
      localStorage.setItem('userName', commonUserName);
      setUserName(commonUserName);
    }
  }, []);

  // 댓글 작성 핸들러 - 직접 API 호출 방식으로 수정
  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 유효성 검사
    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }

    if (content.length > 1000) {
      setError('댓글은 최대 1000자까지 입력 가능합니다.');
      return;
    }

    // 임시 ID 생성
    const tempId = -Date.now();

    try {
      setIsSubmitting(true);
      setError('');

      // 현재 로그인한 사용자 정보 가져오기
      const userId = Number(localStorage.getItem('userId')) || 0;

      // 사용자 이름은 반드시 userName 상태값 사용 (이미 위에서 초기화됨)
      const currentUserName = userName || '우린최고야'; // 기본값으로 실제 이름 사용

      // 낙관적 UI 업데이트를 위한 임시 댓글 생성
      const tempComment = {
        id: tempId,
        debateId,
        userId,
        userName: currentUserName,
        userProfileImage: '', // 프로필 이미지 추가
        content: content, // 댓글 내용에 stance 접두사를 제거 (순수한 내용만 사용)
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stance: stance || 'pro',
        replyCount: 0,
        reactions: {
          like: 0,
          dislike: 0,
        },
        // 국가 정보 제거 (요청에 따라)
      };

      // 낙관적 UI 업데이트: 임시 댓글을 즉시 표시
      if (onSuccess) {
        onSuccess(tempComment);
      }

      // 입력 초기화
      setContent('');
      setError('');

      // 백엔드 API 호출 (비동기로 실행)
      CommentApi.createComment({
        debateId,
        content,
        stance,
      })
        .then(result => {
          console.log('댓글 작성 성공:', result);
          // 콘솔에 선택한 입장 기록
          console.log('선택한 입장:', stance);

          // UI 갱신을 위한 콜백은 이미 위에서 실행했으므로 여기서는 처리하지 않음
        })
        .catch(error => {
          console.error('댓글 작성 실패:', error);
          setError('댓글 작성 중 오류가 발생했습니다.');
        });
    } catch (err) {
      setError('댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('댓글 작성 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소 핸들러
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

        {/* 찬반 선택 
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
        </div>*/}

        {/* 댓글 입력 영역 */}
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
            // Ctrl+Enter로 제출 가능하게 함
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSubmit(e as any);
            }
          }}
        />

        {/* 글자 수 카운터 */}
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs text-gray-500">{content.length}/1000자</div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>

      {/* 버튼 영역 */}
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
