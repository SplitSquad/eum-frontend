import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Avatar, Divider, Button, IconButton, Chip, CircularProgress, Alert, TextField, Card, List, ListItem, ListItemAvatar, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { styled } from '@mui/material/styles';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSnackbar } from 'notistack';
import SpringBackground from '../components/shared/SpringBackground';
import CommentSection from '../components/comment/CommentSection';
import useCommunityStore from '../store/communityStore';
import useAuthStore from '../../auth/store/authStore';
// import { Post, Comment, ReactionType } from '../types'; // 타입 import 불가로 임시 주석 처리
import { usePostReactions } from '../hooks';
import * as api from '../api/communityApi';
import { useLanguageContext } from '../../../features/theme/components/LanguageProvider';
// 스타일 컴포넌트
const StyledChip = styled(Chip)(({ theme }) => ({
    backgroundColor: 'rgba(255, 170, 165, 0.2)',
    color: '#FF6B6B',
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:hover': {
        backgroundColor: 'rgba(255, 170, 165, 0.4)',
    },
}));
const ReactionButton = styled(Button)(({ theme, active }) => ({
    backgroundColor: active ? 'rgba(255, 170, 165, 0.4)' : 'transparent',
    border: '1px solid rgba(255, 170, 165, 0.5)',
    borderRadius: '20px',
    color: active ? '#FF6B6B' : '#666',
    fontWeight: active ? 600 : 400,
    fontSize: '0.85rem',
    padding: '4px 10px',
    boxShadow: active ? '0 2px 5px rgba(255, 107, 107, 0.2)' : 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: active ? 'rgba(255, 170, 165, 0.5)' : 'rgba(255, 170, 165, 0.3)',
        boxShadow: active ? '0 3px 8px rgba(255, 107, 107, 0.3)' : '0 2px 5px rgba(255, 107, 107, 0.1)',
    },
    '&.Mui-disabled': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        color: 'rgba(0, 0, 0, 0.3)',
    },
}));
const CommentInput = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        '& fieldset': {
            borderColor: '#FFD7D7',
        },
        '&:hover fieldset': {
            borderColor: '#FFAAA5',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FF9999',
        },
    },
});
const CommentCard = styled(Card)({
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
});
/**
 * 게시글 상세 페이지 컴포넌트
 * 선택한 게시글의 상세 내용과 댓글을 표시
 */
const PostDetailPage = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { id: postId, postId: postIdAlt } = useParams();
    const actualPostId = postId || postIdAlt;
    const authStore = useAuthStore();
    const currentUser = authStore.user;
    const { currentLanguage } = useLanguageContext();
    // postId 타입 안전하게 변환
    const numericPostId = actualPostId ? parseInt(actualPostId, 10) : 0;
    // 로컬 상태 관리
    const [post, setPost] = useState(null); // 임시 타입 선언만 사용
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // communityStore 사용
    const communityStore = useCommunityStore();
    // 중복 호출 방지를 위한 ref
    const isInitialMount = useRef(true);
    // 언어 변경 요청 추적을 위한 ref 추가
    const abortControllerRef = useRef(null);
    const lastLanguageRef = useRef(currentLanguage);
    const { handleReaction } = usePostReactions(numericPostId);
    // isState 값을 myReaction으로 변환하는 함수
    const convertIsStateToMyReaction = (isState) => {
        if (!isState)
            return undefined;
        if (isState === '좋아요')
            return 'LIKE';
        if (isState === '싫어요')
            return 'DISLIKE';
        return undefined;
    };
    // 게시글 데이터 로딩
    const fetchPostData = async () => {
        if (!actualPostId)
            return;
        try {
            // 이전 요청이 진행 중이면 중단
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            // 새 요청을 위한 AbortController 생성
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;
            setLoading(true);
            setError(null);
            // 이미 게시글이 로드된 상태에서는 null로 설정하지 않음 (깜빡임 방지)
            if (!post) {
                setPost(null);
            }
            console.log('[DEBUG] 게시글 로딩 시작:', { actualPostId, language: currentLanguage });
            // API에서 직접 데이터를 가져오도록 수정
            const numericPostId = parseInt(actualPostId);
            try {
                // fetch 요청에 signal 전달 (필요시 중단 가능)
                const fetchedPost = await api.getPostById(numericPostId);
                // 요청이 중단되었다면 처리 중단
                if (signal.aborted) {
                    console.log('[INFO] 이전 요청이 중단되었습니다.');
                    return;
                }
                if (!fetchedPost || typeof fetchedPost !== 'object') {
                    console.error('[ERROR] 게시글 로드 실패: 유효하지 않은 데이터');
                    setError('게시글이 존재하지 않거나 삭제되었습니다.');
                    setLoading(false);
                    return;
                }
                // 백엔드 응답 필드에 맞게 매핑
                const mappedPost = {
                    ...fetchedPost,
                    viewCount: fetchedPost.views || 0,
                    likeCount: fetchedPost.like || 0,
                    dislikeCount: fetchedPost.dislike || 0,
                    // 원본 내용 사용 - 번역본 대기 없이 바로 표시
                    content: fetchedPost.content || '',
                    title: fetchedPost.title || '[제목 없음]',
                    myReaction: convertIsStateToMyReaction(fetchedPost.isState),
                    category: fetchedPost.category || '전체',
                    postType: fetchedPost.postType || '자유',
                    status: fetchedPost.status || 'ACTIVE',
                    createdAt: fetchedPost.createdAt || new Date().toISOString(),
                };
                console.log('[DEBUG] 게시글 API 로드 성공:', {
                    id: mappedPost.postId,
                    title: mappedPost.title,
                    language: currentLanguage,
                });
                // 컴포넌트 상태 업데이트
                setPost(mappedPost);
            }
            catch (apiError) {
                // 요청이 중단된 경우는 에러로 처리하지 않음
                if (signal.aborted) {
                    console.log('[INFO] 언어 변경으로 요청이 중단되었습니다.');
                    return;
                }
                console.error('[ERROR] API 호출 실패:', apiError);
                setError('게시글을 불러오는데 실패했습니다.');
            }
        }
        catch (err) {
            console.error('[ERROR] 게시글 로딩 중 오류:', err);
            setError(err?.message || '게시글을 불러오는데 실패했습니다. 다시 시도해주세요.');
        }
        finally {
            // 중단된 요청이 아닌 경우에만 로딩 상태 변경
            if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
                setLoading(false);
                abortControllerRef.current = null;
            }
        }
    };
    // 게시글 로딩 Effect - 게시글 ID 변경 시
    useEffect(() => {
        fetchPostData();
        // Clean up 함수
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [actualPostId]); // actualPostId가 변경될 때만 다시 실행
    // 언어 변경 감지 Effect - 개선된 버전
    useEffect(() => {
        // 초기 렌더링인 경우 스킵
        if (isInitialMount.current) {
            isInitialMount.current = false;
            lastLanguageRef.current = currentLanguage;
            return;
        }
        // 언어가 실제로 변경된 경우에만 실행
        if (currentLanguage !== lastLanguageRef.current) {
            console.log(`[INFO] 언어 변경 감지: ${lastLanguageRef.current} → ${currentLanguage}`);
            lastLanguageRef.current = currentLanguage;
            // 이미 로딩 중인 경우, 이전 요청 중단하고 새 요청 시작
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            // 약간의 지연 후 데이터 로드 (UI 갱신 시간 확보)
            const timer = setTimeout(() => {
                if (actualPostId) {
                    console.log('[INFO] 언어 변경으로 게시글 새로고침');
                    fetchPostData();
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [currentLanguage, actualPostId]); // 의존성 배열에 필요한 항목 추가
    // 게시글 삭제 핸들러
    const handleDeletePost = async () => {
        if (!post)
            return;
        try {
            console.log('[DEBUG] 게시글 삭제 요청 시작:', post.postId);
            await communityStore.deletePost(post.postId);
            console.log('[DEBUG] 게시글 삭제 완료');
            setDeleteDialogOpen(false);
            navigate('/community');
            enqueueSnackbar('게시글이 삭제되었습니다.', { variant: 'success' });
        }
        catch (error) {
            console.error('[ERROR] 게시글 삭제 실패:', error);
            enqueueSnackbar('게시글 삭제에 실패했습니다.', { variant: 'error' });
        }
    };
    // 게시글 수정 핸들러
    const handleEditPost = () => {
        if (post) {
            navigate(`/community/edit/${post.postId}`);
        }
    };
    const formatDateToAbsolute = (dateString) => {
        try {
            return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
        }
        catch (e) {
            console.error('날짜 형식 변환 오류:', e);
            return '날짜 정보 없음';
        }
    };
    const handleBack = () => {
        navigate('/community');
    };
    // 게시글 좋아요/싫어요 핸들러 (직접 구현 - 반응형 UI)
    const handlePostReaction = async (type) => {
        if (!post)
            return;
        if (!currentUser) {
            enqueueSnackbar('로그인이 필요합니다.', { variant: 'warning' });
            return;
        }
        try {
            // 현재 반응 상태 확인
            const currentReaction = post.myReaction;
            const isActive = currentReaction === type;
            console.log(`[DEBUG] 게시글 반응 처리 - 현재 상태: ${currentReaction}, 요청 타입: ${type}`);
            // 낙관적 UI 업데이트 (API 응답 전에 UI 먼저 업데이트)
            if (isActive) {
                // 같은 버튼 다시 클릭: 반응 취소
                setPost(prev => {
                    if (!prev)
                        return prev;
                    return {
                        ...prev,
                        likeCount: type === 'LIKE' ? Math.max(0, (prev.likeCount || 0) - 1) : prev.likeCount,
                        dislikeCount: type === 'DISLIKE' ? Math.max(0, (prev.dislikeCount || 0) - 1) : prev.dislikeCount,
                        myReaction: undefined,
                    };
                });
            }
            else {
                // 다른 버튼 클릭 또는 새 반응: 이전 반응 취소 후 새 반응 적용
                setPost(prev => {
                    if (!prev)
                        return prev;
                    return {
                        ...prev,
                        likeCount: type === 'LIKE'
                            ? (prev.likeCount || 0) + 1
                            : currentReaction === 'LIKE'
                                ? Math.max(0, (prev.likeCount || 0) - 1)
                                : prev.likeCount || 0,
                        dislikeCount: type === 'DISLIKE'
                            ? (prev.dislikeCount || 0) + 1
                            : currentReaction === 'DISLIKE'
                                ? Math.max(0, (prev.dislikeCount || 0) - 1)
                                : prev.dislikeCount || 0,
                        myReaction: type,
                    };
                });
            }
            // 서버 요청
            const response = await api.reactToPost(post.postId, type);
            console.log(`[DEBUG] 게시글 반응 응답:`, response);
            // 서버 응답에서 like/dislike 카운트만 업데이트하고 myReaction은 로컬 상태 유지
            if (response && post) {
                // 백엔드가 isState를 반환하지 않으므로 클라이언트에서 myReaction 유지
                // 사용자가 방금 수행한 작업에 따라 myReaction 결정
                const newMyReaction = isActive ? undefined : type;
                setPost(prev => {
                    if (!prev)
                        return prev;
                    return {
                        ...prev,
                        likeCount: response.like,
                        dislikeCount: response.dislike,
                        myReaction: newMyReaction,
                    };
                });
                console.log(`[DEBUG] 업데이트된 상태: myReaction=${newMyReaction}, 좋아요=${response.like}, 싫어요=${response.dislike}`);
            }
        }
        catch (error) {
            console.error('[ERROR] 게시글 반응 처리 실패:', error);
            enqueueSnackbar('반응 처리 중 오류가 발생했습니다.', { variant: 'error' });
            // 에러 발생 시 전체 게시글 데이터 다시 로드
            fetchPostData();
        }
    };
    // 현재 사용자가 게시글 작성자인지 확인
    const isPostAuthor = currentUser && post?.userId?.toString() === currentUser?.id?.toString();
    // 게시글 로딩 중 표시
    if (loading) {
        return (_jsx(Container, { maxWidth: "lg", children: _jsx(SpringBackground, { children: _jsx(Box, { mt: 4, display: "flex", justifyContent: "center", children: _jsx(CircularProgress, {}) }) }) }));
    }
    // 에러 발생 시 표시
    if (error) {
        return (_jsx(Container, { maxWidth: "lg", children: _jsx(SpringBackground, { children: _jsxs(Box, { mt: 4, children: [_jsx(Alert, { severity: "error", children: error }), _jsx(Button, { startIcon: _jsx(ArrowBackIcon, {}), onClick: handleBack, sx: { mt: 2 }, children: "\uBAA9\uB85D\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30" })] }) }) }));
    }
    // 게시글이 없는 경우 표시
    if (!post) {
        return (_jsx(Container, { maxWidth: "lg", children: _jsx(SpringBackground, { children: _jsxs(Box, { mt: 4, children: [_jsx(Alert, { severity: "warning", children: "\uAC8C\uC2DC\uAE00\uC774 \uC874\uC7AC\uD558\uC9C0 \uC54A\uAC70\uB098 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4." }), _jsx(Button, { startIcon: _jsx(ArrowBackIcon, {}), onClick: handleBack, sx: { mt: 2 }, children: "\uBAA9\uB85D\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30" })] }) }) }));
    }
    return (_jsx(SpringBackground, { children: _jsx(Container, { maxWidth: "md", sx: { py: 4, minHeight: 'calc(100vh - 70px)' }, children: loading ? (_jsx(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                }, children: _jsx(CircularProgress, { color: "secondary" }) })) : error ? (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })) : post ? (_jsxs(_Fragment, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }, children: [_jsx(IconButton, { onClick: handleBack, sx: { color: '#666' }, children: _jsx(ArrowBackIcon, {}) }), isPostAuthor && (_jsxs(Box, { children: [_jsx(Button, { startIcon: _jsx(EditIcon, {}), sx: { mr: 1, color: '#666', borderColor: '#ccc' }, variant: "outlined", size: "small", onClick: handleEditPost, children: "\uC218\uC815" }), _jsx(Button, { startIcon: _jsx(DeleteIcon, {}), sx: { color: '#f44336', borderColor: '#f44336' }, variant: "outlined", size: "small", onClick: () => setDeleteDialogOpen(true), children: "\uC0AD\uC81C" })] }))] }), _jsxs(Dialog, { open: deleteDialogOpen, onClose: () => setDeleteDialogOpen(false), children: [_jsx(DialogTitle, { children: "\uAC8C\uC2DC\uAE00 \uC0AD\uC81C" }), _jsxs(DialogContent, { children: [_jsx(Typography, { children: "\uC815\uB9D0\uB85C \uC774 \uAC8C\uC2DC\uAE00\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?" }), _jsx(Typography, { variant: "caption", color: "error", children: "\uC0AD\uC81C\uB41C \uAC8C\uC2DC\uAE00\uC740 \uBCF5\uAD6C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setDeleteDialogOpen(false), children: "\uCDE8\uC18C" }), _jsx(Button, { onClick: handleDeletePost, color: "error", children: "\uC0AD\uC81C" })] })] }), _jsxs(Box, { mb: 3, children: [_jsx(Typography, { variant: "h4", fontWeight: "bold", gutterBottom: true, children: post.title }), _jsxs(Box, { display: "flex", alignItems: "center", mb: 1, children: [_jsx(Avatar, { alt: post.userName, sx: { width: 32, height: 32, mr: 1 } }), _jsx(Typography, { variant: "body2", sx: { mr: 2 }, children: post.userName }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mr: 2 }, children: formatDateToAbsolute(post.createdAt ?? '') }), _jsxs(Box, { display: "flex", alignItems: "center", sx: { mr: 2 }, children: [_jsx(VisibilityIcon, { sx: { fontSize: 16, mr: 0.5 }, color: "action" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: post.viewCount })] })] }), post.tags && post.tags.length > 0 && (_jsx(Box, { mb: 2, children: post.tags.map((tag, index) => (_jsx(StyledChip, { label: tag.name || tag, size: "small" }, index))) }))] }), _jsxs(Box, { mb: 4, sx: {
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            p: 3,
                            borderRadius: 2,
                        }, children: [_jsx(Typography, { variant: "body1", component: "div", sx: {
                                    whiteSpace: 'pre-wrap',
                                    overflowWrap: 'break-word',
                                    minHeight: '150px',
                                }, children: post.content }), post.files && post.files.length > 0 && (_jsxs(Box, { mt: 3, children: [_jsx(Typography, { variant: "subtitle2", fontWeight: "bold", gutterBottom: true, children: "\uCCA8\uBD80\uD30C\uC77C" }), _jsx(List, { dense: true, children: post.files.map((file, index) => (_jsxs(ListItem, { sx: { px: 1 }, children: [_jsx(ListItemAvatar, { sx: { minWidth: 36 }, children: _jsx(InsertDriveFileIcon, { fontSize: "small", color: "primary" }) }), _jsx(ListItemText, { primary: _jsx(Typography, { variant: "body2", component: "a", href: file.url || file, target: "_blank", rel: "noopener noreferrer", sx: {
                                                            color: 'primary.main',
                                                            textDecoration: 'none',
                                                            '&:hover': { textDecoration: 'underline' },
                                                        }, children: file.name || `첨부파일 ${index + 1}` }), secondary: file.size ? `${(file.size / 1024).toFixed(1)} KB` : '', secondaryTypographyProps: { variant: 'caption' } })] }, index))) })] }))] }), _jsxs(Box, { display: "flex", justifyContent: "center", gap: 2, mb: 4, sx: { maxWidth: 500, mx: 'auto' }, children: [_jsxs(ReactionButton, { active: post.myReaction === 'LIKE', startIcon: post.myReaction === 'LIKE' ? _jsx(ThumbUpIcon, {}) : _jsx(ThumbUpOutlinedIcon, {}), onClick: () => handlePostReaction('LIKE'), fullWidth: true, disabled: post.myReaction === 'DISLIKE', theme: undefined, children: ["\uC88B\uC544\uC694 ", post.likeCount || 0] }), _jsxs(ReactionButton, { active: post.myReaction === 'DISLIKE', startIcon: post.myReaction === 'DISLIKE' ? _jsx(ThumbDownIcon, {}) : _jsx(ThumbDownOutlinedIcon, {}), onClick: () => handlePostReaction('DISLIKE'), fullWidth: true, disabled: post.myReaction === 'LIKE', theme: undefined, children: ["\uC2EB\uC5B4\uC694 ", post.dislikeCount || 0] })] }), _jsx(Divider, { sx: { my: 4 } }), _jsx(CommentSection, { postId: numericPostId })] })) : null }) }));
};
export default PostDetailPage;
