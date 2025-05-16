import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, TextField, Button, Avatar, Paper, List, Menu, MenuItem, IconButton, CircularProgress, styled, } from '@mui/material';
import { ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon, MoreVert as MoreVertIcon, Reply as ReplyIcon, } from '@mui/icons-material';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import useAuthStore from '../../../auth/store/authStore';
import { useCommentControls } from '../../hooks';
import CommentForm from './CommentForm';
// import { CommentType, ReplyType, ReactionType } from '../../types'; // 존재하지 않아 임시 주석 처리
// enum ReactionType으로 변경
// type ReactionType = 'LIKE' | 'DISLIKE';
var ReactionType;
(function (ReactionType) {
    ReactionType["LIKE"] = "LIKE";
    ReactionType["DISLIKE"] = "DISLIKE";
})(ReactionType || (ReactionType = {}));
import { CommentApi } from '../../api/commentApi';
import { useSnackbar } from 'notistack';
const CommentCardWrapper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}));
const CommentHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
}));
const CommentContent = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    whiteSpace: 'pre-wrap',
}));
const CommentFooter = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));
const ReactionButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.8rem',
    padding: '4px 8px',
    minWidth: 'auto',
}));
function formatDateToAbsolute(dateString) {
    try {
        return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
    }
    catch (e) {
        console.error('날짜 형식 변환 오류:', e);
        return '날짜 정보 없음';
    }
}
const CommentSection = ({ postId, comments: propComments, totalComments: propTotal, onReplyComment: propReply, onReactionComment: propReact, onEditComment: propEdit, onDeleteComment: propDelete, }) => {
    // Local state
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [total, setTotal] = useState(0);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
    // Snackbar notifications
    const { enqueueSnackbar } = useSnackbar();
    // Auth
    const { user } = useAuthStore();
    const currentUserId = (user?.id ?? user?.userId)
        ? Number(user?.id ?? user?.userId)
        : undefined;
    // Comment form controls
    const controls = useCommentControls(comments);
    // Initialize controls whenever comments list changes
    useEffect(() => {
        controls.initializeState();
    }, [comments.length]);
    // 댓글 목록 불러오기 - useCallback으로 최적화
    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log('[DEBUG] 댓글 가져오기 시작 - postId:', postId);
            const response = await CommentApi.getComments(postId);
            console.log('[DEBUG] 댓글 응답 구조:', JSON.stringify(response, null, 2));
            if (response && response.commentList) {
                // commentApi 내부에서 각 댓글의 isState를 myReaction으로 이미 변환함
                setComments(response.commentList);
                setTotal(response.total || 0);
                console.log('[DEBUG] 받은 댓글 수:', response.commentList.length);
            }
            else {
                console.warn('[WARN] 댓글 응답 구조가 예상과 다름:', response);
                setComments([]);
                setTotal(0);
            }
        }
        catch (error) {
            console.error('[ERROR] 댓글 가져오기 실패:', error);
            setComments([]);
            setTotal(0);
            enqueueSnackbar('댓글을 불러오는 중 오류가 발생했습니다.', { variant: 'error' });
        }
        finally {
            setIsLoading(false);
        }
    }, [postId, enqueueSnackbar]);
    // 대댓글 로드 함수 - useCallback으로 최적화
    const [loadingReplies, setLoadingReplies] = useState({});
    const [replies, setReplies] = useState({});
    const loadReplies = useCallback(async (commentId) => {
        // 이미 로딩 중이거나 이미 로드된 경우 중복 요청 방지
        if (loadingReplies[commentId]) {
            console.log(`[DEBUG] 대댓글 로드 건너뜀 - commentId: ${commentId} (이미 로딩 중)`);
            return;
        }
        setLoadingReplies(prev => ({ ...prev, [commentId]: true }));
        try {
            console.log('[DEBUG] 대댓글 로드 시작 - commentId:', commentId);
            const response = await CommentApi.getReplies(commentId);
            console.log('[DEBUG] 대댓글 응답:', response);
            // replyList 배열이 있으면 그대로 사용
            if (Array.isArray(response)) {
                // 백엔드가 배열을 직접 반환하는 경우
                console.log('[DEBUG] 응답이 배열 형태:', response.length);
                // myReaction 필드를 liked/disliked 불리언으로 변환
                const processedReplies = response.map(reply => ({
                    ...reply,
                    liked: reply.isState === '좋아요',
                    disliked: reply.isState === '싫어요',
                    myReaction: reply.isState === '좋아요'
                        ? ReactionType.LIKE
                        : reply.isState === '싫어요'
                            ? ReactionType.DISLIKE
                            : undefined,
                }));
                setReplies(prev => ({
                    ...prev,
                    [commentId]: processedReplies,
                }));
                console.log(`[DEBUG] 댓글 ${commentId}의 대댓글 ${processedReplies.length}개 로드 완료`);
                // 댓글 객체의 replyCount 업데이트 - 전체 댓글을 다시 불러오지 않고 해당 댓글만 업데이트
                setComments(prevComments => prevComments.map(comment => comment.commentId === commentId
                    ? { ...comment, replyCount: processedReplies.length }
                    : comment));
                return;
            }
            // 응답 구조 분석 및 대댓글 배열 추출
            const replyArray = [];
            // 숫자 키로 된 객체에서 대댓글 추출 (0, 1, 2, ...)
            if (response && typeof response === 'object') {
                for (const key in response) {
                    if (!isNaN(Number(key)) &&
                        response[key] &&
                        typeof response[key] === 'object') {
                        const replyData = response[key];
                        // 백엔드 응답 -> 프론트엔드 타입 변환
                        if (replyData.replyId || replyData.commentId) {
                            const reply = {
                                replyId: replyData.replyId || replyData.commentId,
                                commentId: commentId,
                                content: replyData.content || '',
                                createdAt: replyData.createdAt || new Date().toISOString(),
                                likeCount: replyData.like || 0,
                                dislikeCount: replyData.dislike || 0,
                                myReaction: replyData.isState === '좋아요'
                                    ? ReactionType.LIKE
                                    : replyData.isState === '싫어요'
                                        ? ReactionType.DISLIKE
                                        : undefined,
                                liked: replyData.isState === '좋아요',
                                disliked: replyData.isState === '싫어요',
                                writer: replyData.writer || {
                                    userId: replyData?.id ?? replyData?.userId,
                                    nickname: replyData.userName || '익명',
                                    profileImage: replyData.userPicture || '',
                                },
                            };
                            replyArray.push(reply);
                        }
                    }
                }
            }
            console.log('[DEBUG] 추출된 대댓글 배열:', replyArray);
            setReplies(prev => ({
                ...prev,
                [commentId]: replyArray,
            }));
            // 댓글 객체의 replyCount 업데이트
            setComments(prevComments => prevComments.map(comment => comment.commentId === commentId
                ? { ...comment, replyCount: replyArray.length }
                : comment));
            console.log(`[DEBUG] 댓글 ${commentId}의 대댓글 ${replyArray.length}개 로드 완료`);
        }
        catch (error) {
            console.error('[ERROR] 대댓글 로드 실패:', error);
            enqueueSnackbar('답글을 불러오는 중 오류가 발생했습니다.', { variant: 'error' });
        }
        finally {
            setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
        }
    }, [loadingReplies, enqueueSnackbar]);
    // 답글 토글 핸들러 확장
    const handleReplyToggle = useCallback(async (commentId) => {
        // 기존 토글 함수 호출
        controls.handleReplyToggle(commentId);
        // 토글 상태가 true로 변경될 때(펼쳐질 때) 대댓글 로드
        // 이미 로드된 경우에는 다시 로드하지 않음
        if (!controls.replyToggles[commentId] &&
            (!replies[commentId] || replies[commentId].length === 0)) {
            await loadReplies(commentId);
        }
    }, [controls, loadReplies, replies]);
    // 초기 마운트 시 댓글 가져오기
    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId, fetchComments]);
    // 댓글 중 대댓글이 있는 댓글만 자동으로 대댓글 로드 - 최적화 버전
    useEffect(() => {
        const loadRepliesForCommentsWithReplies = async () => {
            // reply 개수가 있는 댓글만 필터링
            const commentsWithReplies = comments.filter(comment => (comment.reply && comment.reply > 0) || (comment.replyCount && comment.replyCount > 0));
            if (commentsWithReplies.length === 0)
                return;
            // 이미 로드된 댓글 및 로딩 중인 댓글 필터링
            const commentsToLoad = commentsWithReplies.filter(comment => !replies[comment.commentId] && !loadingReplies[comment.commentId]);
            console.log('[DEBUG] 대댓글 자동 로드 - 대댓글 있는 댓글:', commentsWithReplies.length);
            console.log('[DEBUG] 대댓글 자동 로드 - 로드할 댓글:', commentsToLoad.length);
            // 한 번에 하나씩만 로드해서 서버 부하 방지
            if (commentsToLoad.length > 0) {
                const commentToLoad = commentsToLoad[0];
                await loadReplies(commentToLoad.commentId);
            }
        };
        // 댓글이 있고 자동 로드가 필요한 경우에만 실행
        if (comments.length > 0) {
            loadRepliesForCommentsWithReplies();
        }
    }, [comments, loadReplies, loadingReplies, replies]);
    // 새 댓글 작성 처리
    const handleSubmitComment = async () => {
        if (!newCommentText.trim()) {
            enqueueSnackbar('댓글 내용을 입력해주세요.', { variant: 'warning' });
            return;
        }
        if (!user) {
            enqueueSnackbar('로그인이 필요합니다.', { variant: 'warning' });
            return;
        }
        setSubmittingComment(true);
        try {
            console.log('[DEBUG] 댓글 작성 시작:', newCommentText.substring(0, 20) + '...');
            // 먼저 UI에 임시 댓글 추가 (사용자가 작성한 원문 그대로 표시)
            const tempComment = {
                commentId: -Date.now(), // 임시 고유 ID (음수로 설정하여 실제 ID와 충돌 방지)
                postId,
                content: newCommentText,
                createdAt: new Date().toISOString(),
                likeCount: 0,
                dislikeCount: 0,
                replyCount: 0,
                writer: {
                    userId: user?.id ?? user?.userId,
                    nickname: user.name || '사용자',
                    profileImage: '',
                },
                translating: true, // 번역 중임을 표시하는 플래그
            };
            // 먼저 UI에 댓글 추가
            setComments(prev => [tempComment, ...prev]);
            setTotal(prev => prev + 1);
            // 입력 필드 초기화
            setNewCommentText('');
            // 백엔드 API 호출
            const response = await CommentApi.createComment(postId, 'post', newCommentText);
            console.log('[DEBUG] 댓글 생성 응답:', response);
            // 임시 댓글을 실제 댓글로 대체
            setComments(prev => prev.map(comment => comment.commentId === tempComment.commentId
                ? {
                    ...response,
                    translating: false, // 번역 완료
                }
                : comment));
            enqueueSnackbar('댓글이 등록되었습니다.', { variant: 'success' });
        }
        catch (error) {
            console.error('[ERROR] 댓글 작성 실패:', error);
            // 에러 발생 시 임시 댓글 제거
            setComments(prev => prev.filter(comment => comment.commentId > 0));
            setTotal(prev => Math.max(0, prev - 1));
            enqueueSnackbar('댓글 작성에 실패했습니다.', { variant: 'error' });
        }
        finally {
            setSubmittingComment(false);
        }
    };
    // 댓글 수정
    const handleEditComment = async (commentId, content) => {
        try {
            const response = await CommentApi.updateComment(commentId, content);
            // 전체 댓글 목록을 다시 불러오지 않고 해당 댓글만 업데이트
            setComments(prevComments => prevComments.map(comment => comment.commentId === commentId ? { ...comment, content } : comment));
            enqueueSnackbar('댓글이 수정되었습니다.', { variant: 'success' });
        }
        catch (error) {
            console.error('[ERROR] 댓글 수정 실패:', error);
            enqueueSnackbar('댓글 수정에 실패했습니다.', { variant: 'error' });
        }
    };
    // 댓글 삭제
    const handleDeleteComment = async (commentId) => {
        try {
            await CommentApi.deleteComment(commentId);
            // 삭제된 댓글을 목록에서 제거하고 총 개수 감소
            setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
            setTotal(prev => Math.max(0, prev - 1));
            enqueueSnackbar('댓글이 삭제되었습니다.', { variant: 'success' });
        }
        catch (error) {
            console.error('[ERROR] 댓글 삭제 실패:', error);
            enqueueSnackbar('댓글 삭제에 실패했습니다.', { variant: 'error' });
            // 실패 시 댓글 목록 다시 로드
            fetchComments();
        }
    };
    // 특정 댓글을 ID로 찾는 헬퍼 함수
    const findCommentById = useCallback((comments, id) => {
        return comments.find(comment => comment.commentId === id);
    }, []);
    // 댓글 목록에서 특정 댓글 업데이트 헬퍼 함수 (수정)
    const updateCommentInList = useCallback((commentsList, commentId, updateFn) => {
        return commentsList.map(comment => {
            if (comment.commentId === commentId) {
                return typeof updateFn === 'function' ? updateFn(comment) : { ...comment, ...updateFn };
            }
            return comment;
        });
    }, []);
    // 댓글 반응 함수 - 서버 응답이 불완전해도 UI 상태가 유지되도록 개선
    const handleReactionComment = async (commentId, type) => {
        if (!user) {
            enqueueSnackbar('로그인이 필요합니다.', { variant: 'warning' });
            return;
        }
        try {
            const comment = comments.find(c => c.commentId === commentId);
            if (!comment)
                return;
            // 현재 반응 상태 확인
            const currentReaction = comment.myReaction;
            console.log(`[DEBUG] 댓글 반응 처리 시작 - 댓글ID: ${commentId}, 타입: ${type}, 현재상태: ${currentReaction}`);
            // 새 반응 타입 결정
            const newReactionType = type === 'like' ? ReactionType.LIKE : ReactionType.DISLIKE;
            // 취소 여부 결정 (같은 버튼 다시 클릭)
            const isCancelling = (type === 'like' && currentReaction === ReactionType.LIKE) ||
                (type === 'dislike' && currentReaction === ReactionType.DISLIKE);
            // 최종 설정될 반응 타입
            const finalReaction = isCancelling ? undefined : newReactionType;
            console.log(`[DEBUG] 낙관적 UI 업데이트 - isCancelling: ${isCancelling}, finalReaction: ${finalReaction}`);
            // UI 즉시 업데이트 (낙관적 UI 업데이트)
            setComments(prevComments => {
                const updatedComments = prevComments.map(c => {
                    if (c.commentId !== commentId)
                        return c;
                    let updatedLikeCount = c.likeCount || 0;
                    let updatedDislikeCount = c.dislikeCount || 0;
                    // 기존 반응 취소
                    if (currentReaction === ReactionType.LIKE) {
                        updatedLikeCount = Math.max(0, updatedLikeCount - 1);
                    }
                    else if (currentReaction === ReactionType.DISLIKE) {
                        updatedDislikeCount = Math.max(0, updatedDislikeCount - 1);
                    }
                    // 새 반응 추가 (취소가 아닌 경우에만)
                    if (!isCancelling) {
                        if (type === 'like') {
                            updatedLikeCount += 1;
                        }
                        else {
                            updatedDislikeCount += 1;
                        }
                    }
                    const updatedComment = {
                        ...c,
                        likeCount: updatedLikeCount,
                        dislikeCount: updatedDislikeCount,
                        myReaction: finalReaction,
                        liked: finalReaction === ReactionType.LIKE,
                        disliked: finalReaction === ReactionType.DISLIKE,
                    };
                    console.log(`[DEBUG] 업데이트된 댓글 상태 - commentId: ${commentId}, myReaction: ${updatedComment.myReaction}`);
                    return updatedComment;
                });
                return updatedComments;
            });
            // 현재 UI 상태 저장 (서버 응답이 불완전할 경우 사용)
            const requestedState = {
                type,
                isCancelling,
                finalReaction,
            };
            console.log(`[DEBUG] API 호출 전 - commentId: ${commentId}, newReactionType: ${newReactionType}`);
            // API 호출 - 낙관적 UI 이후
            const response = await CommentApi.reactToComment(commentId, newReactionType);
            console.log(`[DEBUG] 댓글 반응 API 응답:`, response);
            // 서버 응답이 null, undefined 또는 에러인 경우
            if (!response || (typeof response === 'string' && response === 'error')) {
                console.log('[WARN] 서버 응답이 유효하지 않아 클라이언트 상태 유지');
                return; // 현재 UI 상태 유지
            }
            // 서버 응답으로 UI 상태 확인 및 조정
            let serverReaction;
            // 서버 응답에서 isState가 있는 경우
            if (response.isState) {
                if (response.isState === '좋아요') {
                    serverReaction = ReactionType.LIKE;
                }
                else if (response.isState === '싫어요') {
                    serverReaction = ReactionType.DISLIKE;
                }
                else {
                    serverReaction = undefined;
                }
            }
            // 서버 응답에서 isState가 없는 경우 (API 응답 불완전)
            else {
                // like, dislike 값을 확인하여 상태 추론
                if (response.like > 0 && type === 'like') {
                    serverReaction = ReactionType.LIKE;
                }
                else if (response.dislike > 0 && type === 'dislike') {
                    serverReaction = ReactionType.DISLIKE;
                }
                else if (isCancelling) {
                    // 취소하는 경우 그대로 undefined 사용
                    serverReaction = undefined;
                }
                else {
                    // 서버 응답이 부정확하면 요청했던 상태 사용 (낙관적 UI 유지)
                    serverReaction = finalReaction;
                }
            }
            console.log(`[DEBUG] 서버 응답 반영 - commentId: ${commentId}, serverReaction: ${serverReaction}`);
            // 최종 UI 업데이트 - 서버 응답 기반이지만 필요시 클라이언트 상태 유지
            setComments(prevComments => {
                const updatedComments = prevComments.map(c => {
                    if (c.commentId !== commentId)
                        return c;
                    // 현재 UI에 표시된 상태 확인
                    const currentUiReaction = c.myReaction;
                    // 서버 응답이 있으면 서버 응답 사용, 없으면 현재 UI 상태 유지
                    const finalServerReaction = serverReaction !== undefined ? serverReaction : currentUiReaction;
                    const updatedComment = {
                        ...c,
                        likeCount: response.like !== undefined ? response.like : c.likeCount,
                        dislikeCount: response.dislike !== undefined ? response.dislike : c.dislikeCount,
                        myReaction: finalServerReaction,
                        liked: finalServerReaction === ReactionType.LIKE,
                        disliked: finalServerReaction === ReactionType.DISLIKE,
                    };
                    console.log(`[DEBUG] 서버 응답 후 최종 댓글 상태 - commentId: ${commentId}, myReaction: ${updatedComment.myReaction}`);
                    return updatedComment;
                });
                return updatedComments;
            });
        }
        catch (error) {
            console.error('[ERROR] 댓글 반응 처리 실패:', error);
            enqueueSnackbar('댓글 반응 처리에 실패했습니다.', { variant: 'error' });
            // 에러 시 전체 다시 로드
            fetchComments();
        }
    };
    // 대댓글 반응 함수 - 서버 응답이 불완전해도 UI 상태가 유지되도록 개선
    const handleReactionReply = async (replyId, type, commentId) => {
        if (!user) {
            enqueueSnackbar('로그인이 필요합니다.', { variant: 'warning' });
            return;
        }
        try {
            const replyList = replies[commentId] || [];
            const reply = replyList.find(r => r.replyId === replyId);
            if (!reply)
                return;
            // 현재 반응 상태 확인
            const currentReaction = reply.myReaction;
            console.log(`[DEBUG] 답글 반응 처리 시작 - 답글ID: ${replyId}, 타입: ${type}, 현재상태: ${currentReaction}`);
            // 새 반응 타입 결정
            const newReactionType = type === 'like' ? ReactionType.LIKE : ReactionType.DISLIKE;
            // 취소 여부 결정 (같은 버튼 다시 클릭)
            const isCancelling = (type === 'like' && currentReaction === ReactionType.LIKE) ||
                (type === 'dislike' && currentReaction === ReactionType.DISLIKE);
            // 최종 설정될 반응 타입
            const finalReaction = isCancelling ? undefined : newReactionType;
            console.log(`[DEBUG] 낙관적 UI 업데이트 - isCancelling: ${isCancelling}, finalReaction: ${finalReaction}`);
            // UI 즉시 업데이트 (낙관적 UI 업데이트)
            setReplies(prev => {
                const updatedReplies = { ...prev };
                // 이 부분에서 원본 배열을 새로운 배열로 대체
                updatedReplies[commentId] = replyList.map(r => {
                    if (r.replyId !== replyId)
                        return r;
                    let updatedLikeCount = r.likeCount || 0;
                    let updatedDislikeCount = r.dislikeCount || 0;
                    // 기존 반응 취소
                    if (currentReaction === ReactionType.LIKE) {
                        updatedLikeCount = Math.max(0, updatedLikeCount - 1);
                    }
                    else if (currentReaction === ReactionType.DISLIKE) {
                        updatedDislikeCount = Math.max(0, updatedDislikeCount - 1);
                    }
                    // 새 반응 추가 (취소가 아닌 경우에만)
                    if (!isCancelling) {
                        if (type === 'like') {
                            updatedLikeCount += 1;
                        }
                        else {
                            updatedDislikeCount += 1;
                        }
                    }
                    const updatedReply = {
                        ...r,
                        likeCount: updatedLikeCount,
                        dislikeCount: updatedDislikeCount,
                        myReaction: finalReaction,
                        liked: finalReaction === ReactionType.LIKE,
                        disliked: finalReaction === ReactionType.DISLIKE,
                    };
                    console.log(`[DEBUG] 업데이트된 답글 상태 - replyId: ${replyId}, myReaction: ${updatedReply.myReaction}`);
                    return updatedReply;
                });
                return updatedReplies;
            });
            // 현재 UI 상태 저장 (서버 응답이 불완전할 경우 사용)
            const requestedState = {
                type,
                isCancelling,
                finalReaction,
            };
            console.log(`[DEBUG] API 호출 전 - replyId: ${replyId}, newReactionType: ${newReactionType}`);
            // API 호출 - 낙관적 UI 이후
            const response = await CommentApi.reactToReply(replyId, newReactionType);
            console.log(`[DEBUG] 답글 반응 API 응답:`, response);
            // 서버 응답이 null, undefined 또는 에러인 경우
            if (!response || (typeof response === 'string' && response === 'error')) {
                console.log('[WARN] 서버 응답이 유효하지 않아 클라이언트 상태 유지');
                return; // 현재 UI 상태 유지
            }
            // 서버 응답으로 UI 상태 확인 및 조정
            let serverReaction;
            // 서버 응답에서 isState가 있는 경우
            if (response.isState) {
                if (response.isState === '좋아요') {
                    serverReaction = ReactionType.LIKE;
                }
                else if (response.isState === '싫어요') {
                    serverReaction = ReactionType.DISLIKE;
                }
                else {
                    serverReaction = undefined;
                }
            }
            // 서버 응답에서 isState가 없는 경우 (API 응답 불완전)
            else {
                // like, dislike 값을 확인하여 상태 추론
                if (response.like > 0 && type === 'like') {
                    serverReaction = ReactionType.LIKE;
                }
                else if (response.dislike > 0 && type === 'dislike') {
                    serverReaction = ReactionType.DISLIKE;
                }
                else if (isCancelling) {
                    // 취소하는 경우 그대로 undefined 사용
                    serverReaction = undefined;
                }
                else {
                    // 서버 응답이 부정확하면 요청했던 상태 사용 (낙관적 UI 유지)
                    serverReaction = finalReaction;
                }
            }
            console.log(`[DEBUG] 서버 응답 반영 - replyId: ${replyId}, serverReaction: ${serverReaction}`);
            // 최종 UI 업데이트 - 서버 응답 기반이지만 필요시 클라이언트 상태 유지
            setReplies(prev => {
                const updatedReplies = { ...prev };
                // commentId에 해당하는 배열이 있는지 확인
                if (updatedReplies[commentId]) {
                    updatedReplies[commentId] = updatedReplies[commentId].map(r => {
                        if (r.replyId !== replyId)
                            return r;
                        // 현재 UI에 표시된 상태 확인
                        const currentUiReaction = r.myReaction;
                        // 서버 응답이 있으면 서버 응답 사용, 없으면 현재 UI 상태 유지
                        const finalServerReaction = serverReaction !== undefined ? serverReaction : currentUiReaction;
                        const updatedReply = {
                            ...r,
                            likeCount: response.like !== undefined ? response.like : r.likeCount,
                            dislikeCount: response.dislike !== undefined ? response.dislike : r.dislikeCount,
                            myReaction: finalServerReaction,
                            liked: finalServerReaction === ReactionType.LIKE,
                            disliked: finalServerReaction === ReactionType.DISLIKE,
                        };
                        console.log(`[DEBUG] 서버 응답 후 최종 답글 상태 - replyId: ${replyId}, myReaction: ${updatedReply.myReaction}`);
                        return updatedReply;
                    });
                }
                return updatedReplies;
            });
        }
        catch (error) {
            console.error('[ERROR] 답글 반응 처리 실패:', error);
            enqueueSnackbar('답글 반응 처리에 실패했습니다.', { variant: 'error' });
            // 에러 시 해당 댓글의 답글만 다시 로드
            loadReplies(commentId);
        }
    };
    // 대댓글 작성 함수 최적화
    const handleReplyComment = async (commentId, content) => {
        if (!content.trim()) {
            enqueueSnackbar('답글 내용을 입력해주세요.', { variant: 'warning' });
            return;
        }
        if (!user) {
            enqueueSnackbar('로그인이 필요합니다.', { variant: 'warning' });
            return;
        }
        try {
            console.log(`[DEBUG] 댓글 ${commentId}에 대댓글 작성 시작:`, content);
            // 반드시 숫자형으로 변환하여 전달
            const numericCommentId = Number(commentId);
            // 유효성 검사 추가: 숫자가 아니면 에러 처리
            if (isNaN(numericCommentId)) {
                throw new Error('유효하지 않은 댓글 ID입니다.');
            }
            // 댓글 내용 유효성 검사 추가
            if (!content || content.trim() === '') {
                throw new Error('답글 내용이 비어있습니다.');
            }
            // 임시 답글 객체 생성
            const tempReply = {
                replyId: -Date.now(), // 임시 ID (음수)
                commentId: numericCommentId,
                content: content,
                createdAt: new Date().toISOString(),
                likeCount: 0,
                dislikeCount: 0,
                writer: {
                    userId: user?.id ?? user?.userId,
                    nickname: user.name || '사용자',
                    profileImage: '',
                },
                translating: true, // 번역 중임을 표시
            };
            // 사용자 입력 초기화
            controls.handleReplyChange(commentId, '');
            // 먼저 UI에 임시 답글 추가
            setReplies(prev => ({
                ...prev,
                [numericCommentId]: [...(prev[numericCommentId] || []), tempReply],
            }));
            // 댓글의 대댓글 카운트 증가
            setComments(prevComments => prevComments.map(comment => comment.commentId === commentId
                ? {
                    ...comment,
                    replyCount: (comment.replyCount || 0) + 1,
                    reply: (comment.reply || 0) + 1,
                }
                : comment));
            // 백엔드 API 호출
            const response = await CommentApi.createReply(postId, numericCommentId, content);
            console.log('[DEBUG] 대댓글 작성 응답:', response);
            // 임시 답글을 실제 답글로 대체
            setReplies(prev => {
                const updatedReplies = { ...prev };
                if (updatedReplies[numericCommentId]) {
                    updatedReplies[numericCommentId] = updatedReplies[numericCommentId].map(reply => reply.replyId === tempReply.replyId
                        ? {
                            ...response,
                            translating: false, // 번역 완료
                        }
                        : reply);
                }
                return updatedReplies;
            });
            enqueueSnackbar('답글이 등록되었습니다.', { variant: 'success' });
        }
        catch (error) {
            console.error('[ERROR] 답글 작성 실패:', error);
            // 에러 발생 시 임시 답글 제거 및 카운트 복구
            setReplies(prev => {
                const updatedReplies = { ...prev };
                if (updatedReplies[commentId]) {
                    updatedReplies[commentId] = updatedReplies[commentId].filter(reply => reply.replyId > 0);
                }
                return updatedReplies;
            });
            // 댓글의 대댓글 카운트 복구
            setComments(prevComments => prevComments.map(comment => comment.commentId === commentId
                ? {
                    ...comment,
                    replyCount: Math.max(0, (comment.replyCount || 0) - 1),
                    reply: Math.max(0, (comment.reply || 0) - 1),
                }
                : comment));
            enqueueSnackbar('답글 작성에 실패했습니다.', { variant: 'error' });
        }
    };
    // 대댓글 수정 함수 최적화
    const handleEditReply = async (replyId, content) => {
        // 상위 댓글 ID 찾기 - try 블록 외부로 이동
        let parentCommentId = null;
        try {
            console.log(`[DEBUG] 대댓글 ${replyId} 수정 시작:`, content);
            await CommentApi.updateReply(replyId, content);
            // 상위 댓글 ID 검색
            Object.entries(replies).forEach(([commentId, replyList]) => {
                if (replyList.some(r => r.replyId === replyId)) {
                    parentCommentId = Number(commentId);
                }
            });
            if (parentCommentId !== null) {
                // 수정된 대댓글만 업데이트 (전체 새로고침 없이)
                setReplies(prev => {
                    const updatedReplies = { ...prev };
                    if (updatedReplies[parentCommentId]) {
                        updatedReplies[parentCommentId] = updatedReplies[parentCommentId].map((reply) => (reply.replyId === replyId ? { ...reply, content } : reply));
                    }
                    return updatedReplies;
                });
                enqueueSnackbar('답글이 수정되었습니다.', { variant: 'success' });
            }
        }
        catch (error) {
            console.error('[ERROR] 대댓글 수정 실패:', error);
            enqueueSnackbar('답글 수정에 실패했습니다.', { variant: 'error' });
            // 에러 발생 시 해당 댓글의 대댓글만 다시 로드
            if (parentCommentId !== null) {
                loadReplies(parentCommentId);
            }
        }
    };
    // 대댓글 삭제 함수 최적화
    const handleDeleteReply = async (replyId) => {
        // 상위 댓글 ID 찾기 - try 블록 외부로 이동
        let parentCommentId = null;
        try {
            console.log(`[DEBUG] 대댓글 ${replyId} 삭제 시작`);
            // 상위 댓글 ID 검색
            Object.entries(replies).forEach(([commentId, replyList]) => {
                if (replyList.some(r => r.replyId === replyId)) {
                    parentCommentId = Number(commentId);
                }
            });
            if (parentCommentId === null)
                return;
            await CommentApi.deleteReply(replyId);
            // 삭제된 대댓글을 목록에서 제거 (전체 새로고침 없이)
            setReplies(prev => {
                const updatedReplies = { ...prev };
                if (updatedReplies[parentCommentId]) {
                    updatedReplies[parentCommentId] = updatedReplies[parentCommentId].filter((reply) => reply.replyId !== replyId);
                }
                return updatedReplies;
            });
            // 댓글의 대댓글 카운트 감소 (전체 새로고침 없이)
            setComments(prevComments => prevComments.map(comment => comment.commentId === parentCommentId
                ? {
                    ...comment,
                    replyCount: Math.max(0, (comment.replyCount || 0) - 1),
                    reply: Math.max(0, (comment.reply || 0) - 1),
                }
                : comment));
            enqueueSnackbar('답글이 삭제되었습니다.', { variant: 'success' });
        }
        catch (error) {
            console.error('[ERROR] 대댓글 삭제 실패:', error);
            enqueueSnackbar('답글 삭제에 실패했습니다.', { variant: 'error' });
            // 에러 발생 시 대댓글만 다시 로드
            if (parentCommentId !== null) {
                loadReplies(parentCommentId);
            }
        }
    };
    // CommentForm 제출 처리 함수
    const handleCommentForm = async (id, content, isReply = false) => {
        if (isReply) {
            await handleEditReply(id, content);
        }
        else {
            await handleEditComment(id, content);
        }
        controls.handleEditCancel(id);
        return true;
    };
    // 개별 댓글 카드 렌더링
    const renderCommentCard = (comment) => (_jsxs(Box, { sx: {
            mb: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'white',
            boxShadow: 1,
            transition: 'box-shadow 0.3s',
            '&:hover': {
                boxShadow: 2,
            },
        }, children: [_jsxs(Box, { display: "flex", alignItems: "center", mb: 1, children: [_jsx(Avatar, { src: comment.writer?.profileImage || '', sx: { width: 40, height: 40, mr: 1 }, children: comment.writer?.nickname?.charAt(0) || '?' }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", children: comment.writer?.nickname || '익명' }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [format(new Date(comment.createdAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko }), comment.translating && (_jsx(Typography, { component: "span", variant: "caption", sx: { ml: 1, color: 'info.main', fontStyle: 'italic' }, children: "(\uBC88\uC5ED \uC911...)" }))] })] })] }), _jsx(Typography, { variant: "body1", sx: {
                    mb: 2,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }, children: comment.content }), _jsxs(CommentFooter, { children: [_jsx(ReactionButton, { variant: comment.myReaction === ReactionType.LIKE ? 'contained' : 'text', startIcon: _jsx(ThumbUpIcon, { fontSize: "small" }), size: "small", onClick: () => handleReactionComment(comment.commentId, 'like'), color: comment.myReaction === ReactionType.LIKE ? 'primary' : 'inherit', disabled: comment.myReaction === ReactionType.DISLIKE, children: comment.likeCount || 0 }), _jsx(ReactionButton, { variant: comment.myReaction === ReactionType.DISLIKE ? 'contained' : 'text', startIcon: _jsx(ThumbDownIcon, { fontSize: "small" }), size: "small", onClick: () => handleReactionComment(comment.commentId, 'dislike'), color: comment.myReaction === ReactionType.DISLIKE ? 'error' : 'inherit', disabled: comment.myReaction === ReactionType.LIKE, children: comment.dislikeCount || 0 }), _jsxs(Button, { startIcon: _jsx(ReplyIcon, { fontSize: "small" }), size: "small", onClick: () => handleReplyToggle(comment.commentId), children: ["\uB2F5\uAE00 ", replies[comment.commentId]?.length || 0] })] }), _jsx(Box, { ml: 0, mt: 1, children: controls.replyToggles[comment.commentId] && (_jsx(_Fragment, { children: loadingReplies[comment.commentId] ? (_jsx(Box, { display: "flex", justifyContent: "center", my: 2, children: _jsx(CircularProgress, { size: 24 }) })) : (_jsxs(_Fragment, { children: [_jsx(Box, { ml: 4, mt: 2, mb: 2, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(TextField, { fullWidth: true, multiline: true, rows: 2, placeholder: "\uB2F5\uAE00\uC744 \uC791\uC131\uD574\uC8FC\uC138\uC694", value: controls.replyContents[comment.commentId] || '', onChange: e => controls.handleReplyChange(comment.commentId, e.target.value) }), _jsxs(Box, { display: "flex", justifyContent: "flex-end", mt: 1, gap: 1, children: [_jsx(Button, { onClick: () => controls.handleReplyToggle(comment.commentId), children: "\uCDE8\uC18C" }), _jsx(Button, { variant: "contained", onClick: () => handleReplyComment(comment.commentId, controls.replyContents[comment.commentId] || ''), children: "\uB2F5\uAE00 \uC791\uC131" })] })] }) }), _jsx(Box, { ml: 4, children: replies[comment.commentId] && replies[comment.commentId].length > 0 ? (replies[comment.commentId].map(reply => (_jsx(Paper, { sx: { p: 2, mb: 1, bgcolor: 'rgba(248, 248, 248, 0.9)' }, children: controls.editMode[reply.replyId] ? (_jsx(CommentForm, { initialValue: reply.content, onSubmit: async (content) => {
                                            return await handleCommentForm(reply.replyId, content, true);
                                        }, onCancel: () => controls.handleEditCancel(reply.replyId), buttonText: "\uC218\uC815" })) : (_jsxs(_Fragment, { children: [_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, children: [_jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [_jsx(Avatar, { src: reply.writer?.profileImage, alt: reply.writer?.nickname || '', sx: { width: 24, height: 24 } }), _jsx(Typography, { variant: "body2", fontWeight: "bold", children: reply.writer?.nickname || '익명' }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: formatDateToAbsolute(reply.createdAt) })] }), (currentUserId ?? user?.userId) === reply.writer?.userId && (_jsx(IconButton, { onClick: e => {
                                                            controls.handleCommentMenuOpen(e, reply.replyId);
                                                            // 대댓글 정보 설정
                                                            controls.setActiveReplyInfo({
                                                                replyId: reply.replyId,
                                                                commentId: comment.commentId,
                                                            });
                                                        }, size: "small", children: _jsx(MoreVertIcon, { fontSize: "small" }) }))] }), _jsx(Typography, { variant: "body2", sx: { mb: 1 }, children: reply.content }), _jsxs(Box, { display: "flex", gap: 1, children: [_jsx(ReactionButton, { variant: reply.myReaction === ReactionType.LIKE ? 'contained' : 'text', startIcon: _jsx(ThumbUpIcon, { fontSize: "small" }), size: "small", onClick: () => handleReactionReply(reply.replyId, 'like', comment.commentId), color: reply.myReaction === ReactionType.LIKE ? 'primary' : 'inherit', sx: { minWidth: '60px', py: 0.5 }, disabled: reply.myReaction === ReactionType.DISLIKE, children: reply.likeCount || 0 }), _jsx(ReactionButton, { variant: reply.myReaction === ReactionType.DISLIKE ? 'contained' : 'text', startIcon: _jsx(ThumbDownIcon, { fontSize: "small" }), size: "small", onClick: () => handleReactionReply(reply.replyId, 'dislike', comment.commentId), color: reply.myReaction === ReactionType.DISLIKE ? 'error' : 'inherit', sx: { minWidth: '60px', py: 0.5 }, disabled: reply.myReaction === ReactionType.LIKE, children: reply.dislikeCount || 0 })] })] })) }, reply.replyId)))) : (_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { ml: 2, mb: 2 }, children: "\uB2F5\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uCCAB \uBC88\uC9F8 \uB2F5\uAE00\uC744 \uC791\uC131\uD574\uBCF4\uC138\uC694." })) })] })) })) })] }));
    // 댓글 메뉴
    const renderCommentMenu = () => (_jsxs(Menu, { id: "comment-menu", anchorEl: controls.menuAnchorEl, keepMounted: true, open: Boolean(controls.menuAnchorEl), onClose: controls.handleMenuClose, children: [_jsx(MenuItem, { onClick: () => {
                    if (controls.activeReplyInfo) {
                        // 대댓글 수정
                        controls.handleEditStart(controls.activeReplyInfo.replyId);
                        controls.handleMenuClose();
                    }
                    else if (controls.activeCommentId) {
                        // 댓글 수정
                        controls.handleEditStart(controls.activeCommentId);
                        controls.handleMenuClose();
                    }
                }, children: "\uC218\uC815" }), _jsx(MenuItem, { onClick: () => {
                    if (controls.activeReplyInfo) {
                        // 대댓글 삭제
                        handleDeleteReply(controls.activeReplyInfo.replyId);
                        controls.handleMenuClose();
                    }
                    else if (controls.activeCommentId) {
                        // 댓글 삭제
                        handleDeleteComment(controls.activeCommentId);
                        controls.handleMenuClose();
                    }
                }, children: "\uC0AD\uC81C" })] }));
    return (_jsxs(Box, { children: [_jsxs(Typography, { variant: "h6", fontWeight: "bold", gutterBottom: true, sx: {
                    position: 'relative',
                    display: 'inline-block',
                    paddingBottom: 1,
                    marginBottom: 3,
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: 2,
                        bgcolor: 'primary.light',
                        borderRadius: 1,
                    },
                }, children: ["\uB313\uAE00 ", total, "\uAC1C"] }), _jsxs(Box, { mb: 4, children: [_jsx(TextField, { fullWidth: true, multiline: true, rows: 3, placeholder: "\uB313\uAE00\uC744 \uC791\uC131\uD574\uC8FC\uC138\uC694", value: newCommentText, onChange: e => setNewCommentText(e.target.value), disabled: !user, sx: {
                            mb: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '8px',
                        } }), _jsx(Box, { display: "flex", justifyContent: "flex-end", children: _jsx(Button, { variant: "contained", onClick: handleSubmitComment, disabled: !newCommentText.trim() || !user || submittingComment, children: submittingComment ? '등록 중...' : '댓글 작성' }) })] }), isLoading && (_jsx(Box, { display: "flex", justifyContent: "center", my: 4, children: _jsx(CircularProgress, { size: 32 }) })), !isLoading && comments.length === 0 && (_jsx(Box, { py: 4, textAlign: "center", bgcolor: "rgba(255, 255, 255, 0.7)", borderRadius: 2, children: _jsx(Typography, { color: "text.secondary", children: "\uCCAB \uBC88\uC9F8 \uB313\uAE00\uC744 \uC791\uC131\uD574\uBCF4\uC138\uC694!" }) })), !isLoading && comments.length > 0 && (_jsx(List, { disablePadding: true, children: comments.map(comment => renderCommentCard(comment)) })), renderCommentMenu()] }));
};
export default CommentSection;
