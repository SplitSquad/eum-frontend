import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Divider,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlagIcon from '@mui/icons-material/Flag'; // 신고 아이콘 추가
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
import ReportDialog, { ServiceType, ReportTargetType } from '../../common/components/ReportDialog';

// 임시 타입 선언 (실제 타입 정의에 맞게 수정 필요)
type ReactionType = 'LIKE' | 'DISLIKE';

type User = {
  id?: string | number;
  userId?: number;
  userName?: string;
  nickname?: string;
  profileImage?: string;
  role?: string;
};

type Comment = {
  commentId: number;
  content: string;
  writerNickname?: string;
  createdAt?: string;
  likeCount?: number;
  dislikeCount?: number;
  replyCount?: number;
  myReaction?: ReactionType;
  writer?: User;
  isLocked?: boolean;
  children?: Comment[];
};

type Post = {
  postId: number;
  title: string;
  content: string;
  writerId: number;
  writerNickname?: string;
  createdAt?: string;
  viewCount?: number;
  likeCount?: number;
  dislikeCount?: number;
  commentCount?: number;
  category?: string;
  postType?: string;
  status?: string;
  files?: any[];
  userName?: string;
  userId?: number;
  profileImage?: string;
  address?: string;
  location?: string;
  myReaction?: ReactionType;
  isState?: string | null;
  tags?: any[];
  id?: string | number;
};

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

const ReactionButton = styled(Button)(({ theme, active }: { theme: any; active: boolean }) => ({
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
const PostDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id: postId, postId: postIdAlt } = useParams<{ id?: string; postId?: string }>();
  const actualPostId = postId || postIdAlt;
  const authStore = useAuthStore();
  const currentUser = authStore.user;
  const { currentLanguage } = useLanguageContext();

  // postId 타입 안전하게 변환
  const numericPostId = actualPostId ? parseInt(actualPostId, 10) : 0;

  // 로컬 상태 관리
  const [post, setPost] = useState<Post | null>(null); // 임시 타입 선언만 사용
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // 신고 기능 관련 상태 추가
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  
  // 사용자가 작성한 게시글 ID 목록
  const [userPosts, setUserPosts] = useState<number[]>([]);

  // communityStore 사용
  const communityStore = useCommunityStore();

  // 중복 호출 방지를 위한 ref
  const isInitialMount = useRef(true);
  // 언어 변경 요청 추적을 위한 ref 추가
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastLanguageRef = useRef<string>(currentLanguage);

  const { handleReaction } = usePostReactions(numericPostId);
  
  // 현재 사용자가 작성한 게시글 목록 가져오기
  const fetchUserPosts = async () => {
    // 로그인 상태가 아니면 무시
    if (!currentUser || !currentUser.userId) return;
    
    try {
      // "/community/post/written" API 호출 - 현재 사용자가 작성한 게시글 목록 가져오기
      const response = await api.getUserPosts(currentUser.userId, 0, 100);
      
      if (response && response.postList) {
        // 게시글 ID 목록만 추출하여 저장
        const postIds = response.postList.map((post: any) => post.postId);
        console.log('[DEBUG] 사용자 작성 게시글 목록:', postIds);
        setUserPosts(postIds);
      }
    } catch (error) {
      console.error('[ERROR] 사용자 게시글 목록 로드 실패:', error);
    }
  };

  // 게시글 데이터 로딩
  const fetchPostData = async (noViewCount: boolean = false) => {
    if (!actualPostId) return;

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

      console.log('[DEBUG] 게시글 로딩 시작:', { actualPostId, language: currentLanguage, noViewCount });

      // API에서 직접 데이터를 가져오도록 수정
      const numericPostId = parseInt(actualPostId);

      try {
        // fetch 요청에 signal 전달 (필요시 중단 가능)
        // noViewCount 파라미터를 전달하여 언어 변경 시 조회수 증가를 방지
        const fetchedPost = await api.getPostById(numericPostId, signal, noViewCount);

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
          category: (fetchedPost as any).category || '전체',
          postType: (fetchedPost as any).postType || '자유',
          status: (fetchedPost as any).status || 'ACTIVE',
          createdAt: (fetchedPost as any).createdAt || new Date().toISOString(),
        } as Post;

        console.log('[DEBUG] 게시글 API 로드 성공:', {
          id: mappedPost.postId,
          title: mappedPost.title,
          language: currentLanguage,
        });

        // 컴포넌트 상태 업데이트
        setPost(mappedPost);
      } catch (apiError: any) {
        // 요청이 중단된 경우는 에러로 처리하지 않음
        if (signal.aborted) {
          console.log('[INFO] 언어 변경으로 요청이 중단되었습니다.');
          return;
        }

        console.error('[ERROR] API 호출 실패:', apiError);
        setError('게시글을 불러오는데 실패했습니다.');
      }
    } catch (err: any) {
      console.error('[ERROR] 게시글 로딩 중 오류:', err);
      setError(err?.message || '게시글을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      // 중단된 요청이 아닌 경우에만 로딩 상태 변경
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  // 게시글 로딩 Effect - 게시글 ID 변경 시
  useEffect(() => {
    // 리스트에서 왔는지 확인
    const fromPostList = sessionStorage.getItem('fromPostList') === 'true';
    
    console.log('[DEBUG] 게시글 상세 페이지 접근 방식:', { 
      fromPostList, 
      noViewCount: fromPostList 
    });
    
    // 리스트에서 왔으면 조회수 증가 방지(noViewCount=true), 아니면 조회수 증가
    fetchPostData(fromPostList);
    
    // 플래그 초기화
    sessionStorage.removeItem('fromPostList');
    
    // 사용자 작성 게시글 목록 갱신 (권한 확인용)
    fetchUserPosts();

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
          // 언어 변경 시에는 조회수를 증가시키지 않음
          fetchPostData(true);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentLanguage, actualPostId]); // 의존성 배열에 필요한 항목 추가

  // 사용자 작성 게시글 목록 가져오기 - 로그인 상태 변경 시
  useEffect(() => {
    if (currentUser && currentUser.userId) {
      fetchUserPosts();
    } else {
      setUserPosts([]);
    }
  }, [currentUser?.userId]); // 사용자 ID가 변경될 때만 다시 실행

  // 게시글 삭제 핸들러
  const handleDeletePost = async () => {
    if (!post) return;

    try {
      console.log('[DEBUG] 게시글 삭제 요청 시작:', post.postId);
      await communityStore.deletePost(post.postId);
      console.log('[DEBUG] 게시글 삭제 완료');
      setDeleteDialogOpen(false);
      navigate('/community');
      enqueueSnackbar('게시글이 삭제되었습니다.', { variant: 'success' });
    } catch (error) {
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

  const formatDateToAbsolute = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
    } catch (e) {
      console.error('날짜 형식 변환 오류:', e);
      return '날짜 정보 없음';
    }
  };

  const handleBack = () => {
    navigate('/community');
  };
  
  // 신고 다이얼로그 열기
  const handleOpenReportDialog = () => {
    if (!post || !post.userId) {
      console.error('게시글 작성자 정보가 없습니다.');
      enqueueSnackbar('신고할 수 없는 게시글입니다.', { variant: 'error' });
      return;
    }
    setReportDialogOpen(true);
  };

  // 신고 다이얼로그 닫기
  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
  };

  // 게시글 좋아요/싫어요 핸들러 (직접 구현 - 반응형 UI)
  const handlePostReaction = async (type: 'LIKE' | 'DISLIKE') => {
    if (!post) return;
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
          if (!prev) return prev;
          return {
            ...prev,
            likeCount: type === 'LIKE' ? Math.max(0, (prev.likeCount || 0) - 1) : prev.likeCount,
            dislikeCount:
              type === 'DISLIKE' ? Math.max(0, (prev.dislikeCount || 0) - 1) : prev.dislikeCount,
            myReaction: undefined,
          };
        });
      } else {
        // 다른 버튼 클릭 또는 새 반응: 이전 반응 취소 후 새 반응 적용
        setPost(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            likeCount:
              type === 'LIKE'
                ? (prev.likeCount || 0) + 1
                : currentReaction === 'LIKE'
                  ? Math.max(0, (prev.likeCount || 0) - 1)
                  : prev.likeCount || 0,
            dislikeCount:
              type === 'DISLIKE'
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
          if (!prev) return prev;
          return {
            ...prev,
            likeCount: response.like,
            dislikeCount: response.dislike,
            myReaction: newMyReaction,
          };
        });

        console.log(
          `[DEBUG] 업데이트된 상태: myReaction=${newMyReaction}, 좋아요=${response.like}, 싫어요=${response.dislike}`
        );
      }
    } catch (error) {
      console.error('[ERROR] 게시글 반응 처리 실패:', error);
      enqueueSnackbar('반응 처리 중 오류가 발생했습니다.', { variant: 'error' });
      // 에러 발생 시 전체 게시글 데이터 다시 로드
      fetchPostData();
    }
  };

  // isState 값을 myReaction으로 변환하는 함수
  const convertIsStateToMyReaction = (
    isState?: string | null | undefined
  ): ReactionType | undefined => {
    if (!isState) return undefined;
    if (isState === '좋아요') return 'LIKE';
    if (isState === '싫어요') return 'DISLIKE';
    return undefined;
  };

  // 디버깅 용도의 데이터 로깅
  console.log('===== 게시글 전체 데이터 =====', post);
  console.log('===== 사용자 전체 데이터 =====', currentUser);
  console.log('===== 사용자 작성 게시글 목록 =====', userPosts);
  
  // 작성자 여부 확인 - 사용자의 작성 게시글 목록에 현재 게시글 ID가 있는지 확인
  const isPostAuthor = Boolean(
    post && post.postId && userPosts.includes(post.postId)
  );
  
  // 관리자 권한 확인
  const isAdmin = Boolean(currentUser?.role === 'ROLE_ADMIN');
  
  // 수정/삭제 권한 확인
  const canEditDelete = isPostAuthor || isAdmin;
  
  // 디버깅을 위한 권한 상태 로그
  console.log('===== 권한 확인 결과 =====', {
    isPostAuthor,
    isAdmin,
    canEditDelete,
    postId: post?.postId,
    userPosts
  });

  // 게시글 로딩 중 표시
  if (loading) {
    return (
      <Container maxWidth="lg">
        <SpringBackground>
          <Box mt={4} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        </SpringBackground>
      </Container>
    );
  }

  // 에러 발생 시 표시
  if (error) {
    return (
      <Container maxWidth="lg">
        <SpringBackground>
          <Box mt={4}>
            <Alert severity="error">{error}</Alert>
            <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
              목록으로 돌아가기
            </Button>
          </Box>
        </SpringBackground>
      </Container>
    );
  }

  // 게시글이 없는 경우 표시
  if (!post) {
    return (
      <Container maxWidth="lg">
        <SpringBackground>
          <Box mt={4}>
            <Alert severity="warning">게시글이 존재하지 않거나 삭제되었습니다.</Alert>
            <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
              목록으로 돌아가기
            </Button>
          </Box>
        </SpringBackground>
      </Container>
    );
  }

  return (
    <SpringBackground>
      <Container maxWidth="md" sx={{ py: 4, minHeight: 'calc(100vh - 70px)' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : post ? (
          <>
            {/* 뒤로가기 버튼 */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <IconButton onClick={handleBack} sx={{ color: '#666' }}>
                <ArrowBackIcon />
              </IconButton>

              {/* 게시글 작성자 또는 관리자일 경우 수정/삭제 버튼 표시 */}
              {canEditDelete ? (
                <Box>
                  <Button
                    startIcon={<EditIcon />}
                    sx={{ mr: 1, color: '#666', borderColor: '#ccc' }}
                    variant="outlined"
                    size="small"
                    onClick={handleEditPost}
                  >
                    수정
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    sx={{ color: '#f44336', borderColor: '#f44336' }}
                    variant="outlined"
                    size="small"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    삭제
                  </Button>
                </Box>
              ) : (
                /* 신고 버튼 - 작성자가 아닌 로그인한 사용자에게만 표시 */
                currentUser && (
                  <Box>
                    <Button
                      startIcon={<FlagIcon />}
                      sx={{ color: '#f57c00', borderColor: '#f57c00' }}
                      variant="outlined"
                      size="small"
                      onClick={handleOpenReportDialog}
                    >
                      신고하기
                    </Button>
                  </Box>
                )
              )}
            </Box>

            {/* 게시글 삭제 확인 다이얼로그 */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
              <DialogTitle>게시글 삭제</DialogTitle>
              <DialogContent>
                <Typography>정말로 이 게시글을 삭제하시겠습니까?</Typography>
                <Typography variant="caption" color="error">
                  삭제된 게시글은 복구할 수 없습니다.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
                <Button onClick={handleDeletePost} color="error">
                  삭제
                </Button>
              </DialogActions>
            </Dialog>

            {/* 게시글 제목 및 정보 */}
            <Box mb={3}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {post.title}
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar alt={post.userName} sx={{ width: 32, height: 32, mr: 1 }} />
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {post.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  {formatDateToAbsolute(post.createdAt ?? '')}
                </Typography>
                <Box display="flex" alignItems="center" sx={{ mr: 2 }}>
                  <VisibilityIcon sx={{ fontSize: 16, mr: 0.5 }} color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {post.viewCount}
                  </Typography>
                </Box>
              </Box>

              {/* 태그 표시 */}
              {post.tags && post.tags.length > 0 && (
                <Box mb={2}>
                  {post.tags.map((tag: any, index) => (
                    <StyledChip key={index} label={tag.name || tag} size="small" />
                  ))}
                </Box>
              )}
            </Box>

            {/* 게시글 내용 */}
            <Box
              mb={4}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.7)',
                p: 3,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body1"
                component="div"
                sx={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  minHeight: '150px',
                }}
              >
                {post.content}
              </Typography>

              {/* 첨부파일 표시 (있는 경우) */}
              {post.files && post.files.length > 0 && (
                <Box mt={3}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    첨부파일
                  </Typography>
                  <List dense>
                    {post.files.map((file: any, index) => (
                      <ListItem key={index} sx={{ px: 1 }}>
                        <ListItemAvatar sx={{ minWidth: 36 }}>
                          <InsertDriveFileIcon fontSize="small" color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              component="a"
                              href={file.url || file}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                              }}
                            >
                              {file.name || `첨부파일 ${index + 1}`}
                            </Typography>
                          }
                          secondary={file.size ? `${(file.size / 1024).toFixed(1)} KB` : ''}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>

            {/* 게시글 평가 버튼 - disabled 속성 추가 */}
            <Box
              display="flex"
              justifyContent="center"
              gap={2}
              mb={4}
              sx={{ maxWidth: 500, mx: 'auto' }}
            >
              <ReactionButton
                active={post.myReaction === 'LIKE'}
                startIcon={post.myReaction === 'LIKE' ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                onClick={() => handlePostReaction('LIKE')}
                fullWidth
                disabled={post.myReaction === 'DISLIKE'}
                theme={undefined as any}
              >
                좋아요 {post.likeCount || 0}
              </ReactionButton>
              <ReactionButton
                active={post.myReaction === 'DISLIKE'}
                startIcon={
                  post.myReaction === 'DISLIKE' ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />
                }
                onClick={() => handlePostReaction('DISLIKE')}
                fullWidth
                disabled={post.myReaction === 'LIKE'}
                theme={undefined as any}
              >
                싫어요 {post.dislikeCount || 0}
              </ReactionButton>
            </Box>

            {/* 댓글 섹션 */}
            <Divider sx={{ my: 4 }} />
            <CommentSection postId={numericPostId} />

            {/* 신고 다이얼로그 */}
            {post && (
              <ReportDialog
                open={reportDialogOpen}
                onClose={handleCloseReportDialog}
                targetId={post.postId}
                targetType="POST"
                serviceType="COMMUNITY"
                reportedUserId={post.userId || 0}
              />
            )}
          </>
        ) : null}
      </Container>
    </SpringBackground>
  );
};

export default PostDetailPage;
