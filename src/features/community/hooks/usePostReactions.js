import { useState, useCallback, useEffect } from 'react';
import useCommunityStore from '../store/communityStore';
import * as api from '../api/communityApi';
/**
 * 게시글 반응(좋아요/싫어요) 관련 로직을 제공하는 커스텀 훅
 */
const usePostReactions = (postId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const communityStore = useCommunityStore();
    // 컴포넌트 마운트 시 게시글 정보 로드
    useEffect(() => {
        if (postId && !communityStore.currentPost) {
            console.log(`[DEBUG] usePostReactions - 게시글 정보 로드 시작: ${postId}`);
            communityStore.fetchPostById(postId).catch(err => {
                console.error('[ERROR] usePostReactions - 게시글 로드 실패:', err);
            });
        }
    }, [postId, communityStore]);
    // 게시글 반응 처리 (좋아요/싫어요)
    const handleReaction = useCallback(async (type) => {
        if (!postId)
            return;
        try {
            setLoading(true);
            setError(null);
            // 현재 게시글 정보 확인
            let currentPost = communityStore.currentPost;
            // 게시글 정보가 없으면 먼저 불러오기
            if (!currentPost) {
                console.log(`[DEBUG] 게시글 정보 없음, 먼저 불러오기: ${postId}`);
                currentPost = await communityStore.fetchPostById(postId);
                if (!currentPost) {
                    console.warn('[WARN] 게시글 정보를 불러올 수 없습니다');
                    setLoading(false);
                    return false;
                }
            }
            console.log(`[DEBUG] 게시글 ${postId} 반응 처리 시작: ${type}`);
            // 낙관적 UI 업데이트 (API 응답 전에 먼저 UI 업데이트)
            const currentReaction = currentPost.myReaction;
            let newLikeCount = currentPost.likeCount || 0;
            let newDislikeCount = currentPost.dislikeCount || 0;
            let newMyReaction = type;
            // 같은 버튼을 다시 누르면 (취소)
            if (currentReaction === type) {
                // 취소 처리
                if (type === 'LIKE') {
                    newLikeCount = Math.max(0, newLikeCount - 1);
                }
                else {
                    newDislikeCount = Math.max(0, newDislikeCount - 1);
                }
                newMyReaction = undefined;
            }
            // 다른 버튼을 누르는 경우 (변경)
            else {
                // 이전 상태에 따라 카운트 조정
                if (currentReaction === 'LIKE') {
                    newLikeCount = Math.max(0, newLikeCount - 1);
                }
                else if (currentReaction === 'DISLIKE') {
                    newDislikeCount = Math.max(0, newDislikeCount - 1);
                }
                // 새 상태 적용
                if (type === 'LIKE') {
                    newLikeCount += 1;
                }
                else {
                    newDislikeCount += 1;
                }
            }
            // 현재 게시글 상태 업데이트 (낙관적 UI 업데이트)
            communityStore.updateCurrentPostReaction({
                myReaction: newMyReaction,
                likeCount: newLikeCount,
                dislikeCount: newDislikeCount
            });
            // 백엔드 API 호출 - API는 LIKE, DISLIKE만 허용함
            const apiReactionType = type === 'LIKE' || type === 'DISLIKE' ? type : 'LIKE';
            const response = await api.reactToPost(postId, apiReactionType);
            console.log(`[DEBUG] 게시글 반응 서버 응답:`, response);
            // API 응답과 낙관적 업데이트에 큰 차이가 있는 경우에만 다시 로드
            if (Math.abs(response.like - newLikeCount) > 1 ||
                Math.abs(response.dislike - newDislikeCount) > 1) {
                console.log('[DEBUG] 서버 응답과 로컬 상태의 차이가 큼, 게시글 다시 로드');
                // 전체 게시글 정보 다시 로드
                await communityStore.fetchPostById(postId);
            }
            setLoading(false);
            return true;
        }
        catch (err) {
            console.error('[ERROR] 게시글 반응 처리 실패:', err);
            setError('반응 처리에 실패했습니다.');
            // 에러 시 UI 복구를 위해 원래 상태로 되돌림
            await communityStore.fetchPostById(postId);
            setLoading(false);
            return false;
        }
    }, [postId, communityStore]);
    return {
        loading,
        error,
        handleReaction,
    };
};
export default usePostReactions;
