import apiClient from './apiClient';
/**
 * 댓글 API 관련 상수
 */
const COMMENTS_BASE_URL = '/community/comment';
const REPLIES_BASE_URL = '/community/reply';
/**
 * isState 문자열을 myReaction 타입으로 변환하는 헬퍼 함수
 */
function convertIsStateToMyReaction(isState) {
    if (isState === '좋아요')
        return 'LIKE';
    if (isState === '싫어요')
        return 'DISLIKE';
    return undefined;
}
/**
 * 댓글 객체를 변환하는 헬퍼 함수 (백엔드 응답 -> 프론트엔드 형식)
 */
function transformCommentData(comment, postId) {
    // isState를 myReaction으로 변환
    const myReaction = convertIsStateToMyReaction(comment.isState);
    return {
        ...comment,
        postId: comment.postId || postId, // postId가 null이면 인자로 받은 postId 사용
        myReaction: myReaction, // isState -> myReaction으로 변환
        likeCount: comment.like || 0, // like -> likeCount로 매핑
        dislikeCount: comment.dislike || 0, // dislike -> dislikeCount로 매핑
    };
}
/**
 * 댓글 관련 API
 */
export const CommentApi = {
    /**
     * 댓글 목록 조회
     */
    getComments: async (postId, targetType = 'post', // targetType은 내부적으로만 사용, 백엔드에 전달하지 않음
    page = 0, size = 5) => {
        try {
            // 백엔드 API 요청 형식에 맞게 수정
            const response = await apiClient.get(`${COMMENTS_BASE_URL}?postId=${postId}&page=${page}&size=${size}&sort=latest`);
            // 댓글 목록 변환 - isState를 myReaction으로 변환
            const transformedComments = response.commentList
                ? response.commentList.map(comment => transformCommentData(comment, postId))
                : [];
            // 응답 데이터 변환 - 백엔드 응답 구조와 프론트엔드 예상 구조 간 차이를 처리
            // commentList -> comments 변환, 필요시 페이지 정보도 구성
            const convertedResponse = {
                ...response,
                commentList: transformedComments,
                pageInfo: {
                    page: page,
                    size: size,
                    totalElements: response.total || 0,
                    totalPages: Math.ceil((response.total || 0) / size),
                },
            };
            return convertedResponse;
        }
        catch (error) {
            console.error('댓글 목록 조회 실패:', error);
            throw error;
        }
    },
    /**
     * 댓글 생성
     */
    createComment: async (postId, targetType = 'post', // targetType은 내부적으로만 사용
    content) => {
        try {
            // 숫자형으로 강제 변환하여 타입 문제 방지
            const numericPostId = Number(postId);
            console.log('[DEBUG] 댓글 생성 API 요청 시작:', {
                postId: numericPostId,
                content: content.substring(0, 20) + '...',
                url: COMMENTS_BASE_URL,
            });
            // 백엔드 API 요청 형식에 맞게 수정
            const payload = {
                postId: numericPostId,
                content,
                language: 'ko', // 백엔드 요구사항에 맞게 추가
            };
            console.log('[DEBUG] 댓글 생성 요청 페이로드:', payload);
            const response = await apiClient.post(COMMENTS_BASE_URL, payload);
            console.log('[DEBUG] 댓글 생성 응답:', response);
            // 응답에 postId가 없거나 null인 경우, 요청한 postId를 사용하여 보완
            if (!response.postId) {
                console.log('[DEBUG] 응답에 postId가 없어 요청 값으로 보완:', numericPostId);
                return {
                    ...response,
                    postId: numericPostId,
                };
            }
            return response;
        }
        catch (error) {
            console.error('[ERROR] 댓글 생성 실패:', error);
            throw error;
        }
    },
    /**
     * 댓글 수정
     */
    updateComment: async (commentId, content) => {
        try {
            // 백엔드 API 요청 형식에 맞게 수정
            const response = await apiClient.patch(`${COMMENTS_BASE_URL}/${commentId}`, {
                content,
                language: 'ko', // 백엔드 요구사항에 맞게 추가
            });
            return response;
        }
        catch (error) {
            console.error('댓글 수정 실패:', error);
            throw error;
        }
    },
    /**
     * 댓글 삭제
     */
    deleteComment: async (commentId) => {
        try {
            await apiClient.delete(`${COMMENTS_BASE_URL}/${commentId}`);
        }
        catch (error) {
            console.error('댓글 삭제 실패:', error);
            throw error;
        }
    },
    /**
     * 댓글 리액션 추가
     */
    reactToComment: async (commentId, reactionType) => {
        try {
            // 백엔드 API 요청 형식에 맞게 수정 - emotion 필드 사용
            const emotionMapping = {
                LIKE: '좋아요',
                DISLIKE: '싫어요',
            };
            console.log(`[DEBUG] 댓글 ${commentId}에 반응 시도:`, reactionType);
            const response = await apiClient.post(`${COMMENTS_BASE_URL}/${commentId}`, { emotion: emotionMapping[reactionType] });
            console.log(`[DEBUG] 댓글 ${commentId}에 반응 결과:`, response);
            // 백엔드 응답이 객체가 아니거나 like/dislike 필드가 없는 경우 기본값 제공
            if (!response || typeof response !== 'object') {
                console.warn('[WARN] 댓글 반응 응답이 예상과 다름, 기본값 반환');
                return { like: 0, dislike: 0 };
            }
            // 반환 값에 myReaction 정보 추가
            return {
                like: response.like || 0,
                dislike: response.dislike || 0,
                isState: response.isState, // isState 필드 유지해서 반환
            };
        }
        catch (error) {
            console.error('댓글 리액션 추가 실패:', error);
            throw error;
        }
    },
    /**
     * 대댓글 목록 조회
     */
    getReplies: async (commentId, page = 0, size = 5) => {
        try {
            // 백엔드 API 요청 형식에 맞게 수정
            const response = await apiClient.get(`${REPLIES_BASE_URL}?commentId=${commentId}`);
            // 응답 데이터 변환 - 백엔드 응답 구조와 프론트엔드 예상 구조 간 차이를 처리
            const convertedResponse = {
                ...response,
                replyList: response.replyList || [],
                pageInfo: {
                    page: page,
                    size: size,
                    totalElements: response.total || 0,
                    totalPages: Math.ceil((response.total || 0) / size),
                },
            };
            return convertedResponse;
        }
        catch (error) {
            console.error('대댓글 목록 조회 실패:', error);
            throw error;
        }
    },
    /**
     * 대댓글 생성
     */
    createReply: async (postId, commentId, content) => {
        try {
            console.log('[DEBUG] 대댓글 생성 시작:', {
                postId,
                commentId,
                content: content && content.length > 0 ? content.substring(0, 20) + '...' : '(내용 없음)',
            });
            // content가 undefined이거나 빈 문자열인 경우 예외 처리
            if (!content || content.trim() === '') {
                throw new Error('댓글 내용이 비어있습니다.');
            }
            // postId와 commentId가 유효한 숫자인지 확인
            if (isNaN(Number(postId)) || isNaN(Number(commentId))) {
                throw new Error('유효하지 않은 게시글 ID 또는 댓글 ID입니다.');
            }
            // 백엔드 API 요청 형식에 맞게 수정
            const payload = {
                postId: Number(postId),
                commentId: Number(commentId),
                content,
                language: 'ko', // 백엔드 요구사항에 맞게 추가
            };
            console.log('[DEBUG] 대댓글 생성 페이로드:', payload);
            const response = await apiClient.post(REPLIES_BASE_URL, payload);
            console.log('[DEBUG] 대댓글 생성 응답:', response);
            return response;
        }
        catch (error) {
            console.error('대댓글 생성 실패:', error);
            throw error;
        }
    },
    /**
     * 대댓글 수정
     */
    updateReply: async (replyId, content) => {
        try {
            // 백엔드 API 요청 형식에 맞게 수정
            const response = await apiClient.patch(`${REPLIES_BASE_URL}/${replyId}`, {
                content,
                language: 'ko', // 백엔드 요구사항에 맞게 추가
            });
            return response;
        }
        catch (error) {
            console.error('대댓글 수정 실패:', error);
            throw error;
        }
    },
    /**
     * 대댓글 삭제
     */
    deleteReply: async (replyId) => {
        try {
            await apiClient.delete(`${REPLIES_BASE_URL}/${replyId}`);
        }
        catch (error) {
            console.error('대댓글 삭제 실패:', error);
            throw error;
        }
    },
    /**
     * 대댓글 리액션 추가
     */
    reactToReply: async (replyId, reactionType) => {
        try {
            // 백엔드 API 요청 형식에 맞게 수정 - emotion 필드 사용
            const emotionMapping = {
                LIKE: '좋아요',
                DISLIKE: '싫어요',
            };
            const response = await apiClient.post(`${REPLIES_BASE_URL}/${replyId}`, { emotion: emotionMapping[reactionType] });
            return response;
        }
        catch (error) {
            console.error('대댓글 리액션 추가 실패:', error);
            throw error;
        }
    },
};
export default CommentApi;
