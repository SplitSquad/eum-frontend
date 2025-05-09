import { useState } from 'react';

/**
 * 댓글 폼 관련 상태 및 로직을 관리하는 커스텀 훅
 *
 * @param initialContent 초기 입력 내용
 * @param onSubmit 제출 핸들러 함수
 * @returns 댓글 폼 관련 상태 및 함수들
 */
const useCommentForm = (
  initialContent: string = '',
  onSubmit?: (content: string) => Promise<boolean | undefined | void>
) => {
  // 댓글 내용 상태
  const [content, setContent] = useState(initialContent);
  // 로딩 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 오류 상태
  const [error, setError] = useState<string | null>(null);

  // 댓글 입력 변경 핸들러
  const handleChange = (value: string) => {
    setContent(value);
    if (error) setError(null);
  };

  // 댓글 초기화
  const resetForm = () => {
    setContent('');
    setError(null);
  };

  // 댓글 제출 핸들러
  const handleSubmit = async () => {
    // 빈 내용 체크
    if (!content.trim()) {
      setError('내용을 입력해주세요');
      return false;
    }

    // 제출 함수가 없으면 종료
    if (!onSubmit) return false;

    try {
      setIsSubmitting(true);
      setError(null);

      // 댓글 제출 함수 호출
      const result = await onSubmit(content.trim());

      // 성공 시 초기화
      resetForm();
      return result !== undefined ? result : true;
    } catch (err) {
      // 오류 처리
      const errorMessage = err instanceof Error ? err.message : '댓글 작성에 실패했습니다';
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
    resetForm,
    isEmpty: !content.trim(),
  };
};

export default useCommentForm;
