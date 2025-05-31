import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Snackbar,
  Menu,
  Paper,
  Fab,
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
import * as api from '../api/communityApi';
import { useLanguageContext } from '../../../features/theme/components/LanguageProvider';
import ReportDialog, { ServiceType, ReportTargetType } from '../../common/components/ReportDialog';
import { useTranslation } from '../../../shared/i18n';
import FlagDisplay from '../../../shared/components/FlagDisplay';
import { ViewTracker } from '../utils/viewTracker';

// 임시 타입 선언 (실제 타입 정의에 맞게 수정 필요)
type ReactionType = 'LIKE' | 'DISLIKE';

type User = {
  id?: string | number;
  userId?: number;
  userName?: string;
  nickname?: string;
  profileImage?: string;
  role?: string;
  nation?: string; // 국가 정보 추가
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
  nation?: string; // 작성자 국가 정보 추가
  writer?: User; // 작성자 정보 객체 추가
};

// 원본 게시글 타입
type fetchedOriginPost = {
  title?: string;
  content?: string;
};

// 스타일 컴포넌트
const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(202, 202, 202, 0.2)',
  color: '#b9b9b9',
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(202, 202, 202, 0.4)',
  },
}));

const ReactionButton = styled(Button)(({ theme, active }: { theme: any; active: boolean }) => ({
  backgroundColor: active ? 'rgba(202, 202, 202, 0.4)' : 'transparent',
  border: '1px solid rgba(202, 202, 202, 0.5)',
  borderRadius: '20px',
  color: active ? '#b9b9b9' : '#666',
  fontWeight: active ? 600 : 400,
  fontSize: '0.85rem',
  padding: '4px 10px',
  boxShadow: active ? '0 2px 5px rgba(202, 202, 202, 0.2)' : 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: active ? 'rgba(202, 202, 202, 0.5)' : 'rgba(202, 202, 202, 0.3)',
    boxShadow: active ? '0 3px 8px rgba(202, 202, 202, 0.3)' : '0 2px 5px rgba(202, 202, 202, 0.1)',
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
      borderColor: '#b9b9b9',
    },
    '&:hover fieldset': {
      borderColor: '#b9b9b9',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#b9b9b9',
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id: postId, postId: postIdAlt } = useParams<{ id?: string; postId?: string }>();
  const actualPostId = postId || postIdAlt;
  const authStore = useAuthStore();
  const currentUser = authStore.user;
  const { currentLanguage } = useLanguageContext();

  // 태그 번역 함수
  const translateTag = (tagName: string): string => {
    // 태그 이름을 번역 키로 매핑
    const tagTranslationMap: Record<string, string> = {
      '관광/체험': t('community.tags.tourism'),
      '식도락/맛집': t('community.tags.food'),
      '교통/이동': t('community.tags.transport'),
      '숙소/지역정보': t('community.tags.accommodation'),
      '대사관/응급': t('community.tags.embassy'),
      '부동산/계약': t('community.tags.realEstate'),
      '생활환경/편의': t('community.tags.livingEnvironment'),
      '문화/생활': t('community.tags.culture'),
      '주거지 관리/유지': t('community.tags.housing'),
      '학사/캠퍼스': t('community.tags.academic'),
      '학업지원/시설': t('community.tags.studySupport'),
      '행정/비자/서류': t('community.tags.visa'),
      '기숙사/주거': t('community.tags.dormitory'),
      '이력/채용준비': t('community.tags.career'),
      '비자/법률/노동': t('community.tags.labor'),
      '잡페어/네트워킹': t('community.tags.jobFair'),
      '알바/파트타임': t('community.tags.partTime'),
      테스트: t('community.tags.test'),
    };

    return tagTranslationMap[tagName] || tagName;
  };

  // postId 타입 안전하게 변환
  const numericPostId = actualPostId ? parseInt(actualPostId, 10) : 0;

  // 로컬 상태 관리
  const [post, setPost] = useState<Post | null>(null); // 임시 타입 선언만 사용
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [originTitle, setOriginTitle] = useState<string | null>(null);
  const [originContent, setOriginContent] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

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

  // 게시글 데이터 로딩 - 렌더링 최적화 버전
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

      // 로딩 상태 설정 (기존 데이터는 유지)
      setLoading(true);
      setError(null);

      console.log('[DEBUG] 게시글 로딩 시작 (최적화 버전):', {
        actualPostId,
        language: currentLanguage,
        noViewCount,
        hasExistingPost: !!post,
      });

      const numericPostId = parseInt(actualPostId);

      try {
        // 1단계: ViewTracker로 조회 기록 확인 (조회수 증가 여부 결정)
        let shouldIncreaseViewCount = false;
        if (!noViewCount) {
          const alreadyViewed = ViewTracker.hasViewedPost(numericPostId);
          shouldIncreaseViewCount = !alreadyViewed;

          console.log('[DEBUG] ViewTracker 조회 확인:', {
            postId: numericPostId,
            alreadyViewed,
            shouldIncreaseViewCount,
          });
        }

        // 2단계: 게시글, 원문 게시글 가져오기 데이터 가져오기 (조회수 증가 결정에 따라)
        const fetchedPost = await api.getPostById(numericPostId, signal, !shouldIncreaseViewCount);

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
          content: fetchedPost.content || '',
          title: fetchedPost.title || '[제목 없음]',
          myReaction: convertIsStateToMyReaction(fetchedPost.isState),
          category: (fetchedPost as any).category || '전체',
          postType: (fetchedPost as any).postType || '자유',
          status: (fetchedPost as any).status || 'ACTIVE',
          createdAt: (fetchedPost as any).createdAt || new Date().toISOString(),
          writer: {
            userId: (fetchedPost as any).userId || 0,
            nickname: (fetchedPost as any).userName || '알 수 없음',
            profileImage: '',
            role: 'USER',
            nation: (fetchedPost as any).nation || '',
          },
        } as Post;

        // 3단계: 새로운 조회인 경우 ViewTracker 기록 및 웹 로그 전송
        if (shouldIncreaseViewCount) {
          // 조회 기록 추가
          ViewTracker.markAsViewed(numericPostId);

          // 웹 로그 전송
          ViewTracker.sendViewLog(
            numericPostId,
            mappedPost.title,
            mappedPost.content,
            mappedPost.tags?.map(tag => (typeof tag === 'string' ? tag : tag.name)),
            location.pathname
          );

          console.log('[DEBUG] 새로운 게시글 조회 기록됨:', {
            postId: numericPostId,
            title: mappedPost.title,
            viewCount: mappedPost.viewCount,
          });
        }

        console.log('[DEBUG] 게시글 로드 성공 (최적화):', {
          id: mappedPost.postId,
          title: mappedPost.title,
          language: currentLanguage,
          shouldIncreaseViewCount,
          viewCount: mappedPost.viewCount,
        });
        const fetchedOriginPost = (await api.getPostOriginal(numericPostId)) as fetchedOriginPost;
        if (fetchedOriginPost && typeof fetchedOriginPost === 'object') {
          setOriginTitle(fetchedOriginPost.title || '[제목 없음]');
          setOriginContent(fetchedOriginPost.content || '');
          console.log('[DEBUG] 원문 게시글 로드 성공:', {
            title: fetchedOriginPost.title,
            content: fetchedOriginPost.content,
          });
        }
        // 상태 업데이트 (React 18 자동 배칭 활용)
        setPost(mappedPost);
        setLoading(false);
      } catch (apiError: any) {
        // 요청이 중단된 경우는 에러로 처리하지 않음
        if (signal.aborted) {
          console.log('[INFO] 언어 변경으로 요청이 중단되었습니다.');
          return;
        }

        console.error('[ERROR] API 호출 실패:', apiError);
        setError(t('community.posts.loadFailed'));
        setLoading(false);
      }
    } catch (err: any) {
      console.error('[ERROR] 게시글 로딩 중 오류:', err);
      setError(err?.message || t('community.posts.loadFailed'));
      setLoading(false);
    } finally {
      // 중단된 요청이 아닌 경우에만 AbortController 정리
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
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
      noViewCount: fromPostList,
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

      // ViewTracker 정리 (메모리 누수 방지)
      ViewTracker.cleanup();
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

      // 게시글 타입에 따라 적절한 페이지로 돌아가기
      if (post.postType === '모임') {
        navigate('/community/groups'); // 소모임 페이지로
      } else if (post.postType === '자유') {
        navigate('/community/board'); // 자유게시판으로
      } else {
        // 기본값: 소모임 페이지
        navigate('/community');
      }

      enqueueSnackbar(t('community.posts.deleteSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('[ERROR] 게시글 삭제 실패:', error);
      enqueueSnackbar(t('community.posts.deleteFailed'), { variant: 'error' });
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
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: ko });
    } catch (e) {
      console.error('날짜 형식 변환 오류:', e);
      return t('community.posts.noDate');
    }
  };

  const handleBack = () => {
    // 게시글 타입에 따라 적절한 페이지로 돌아가기
    if (post?.postType === '모임') {
      navigate('/community/groups'); // 소모임 페이지로
    } else if (post?.postType === '자유') {
      navigate('/community/board'); // 자유게시판으로
    } else {
      // 기본값: 소모임 페이지 (기존 /community는 GroupListPage로 이동)
      navigate('/community');
    }
  };

  // 신고 다이얼로그 열기
  const handleOpenReportDialog = () => {
    if (!post || !post.userId) {
      console.error('게시글 작성자 정보가 없습니다.');
      enqueueSnackbar(t('community.posts.noPermission'), { variant: 'error' });
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
      enqueueSnackbar(t('auth.loginRequired'), { variant: 'warning' });
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
  const isPostAuthor = Boolean(post && post.postId && userPosts.includes(post.postId));

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
    userPosts,
  });

  // 게시글 로딩 중 표시
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box mt={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // 에러 발생 시 표시
  if (error) {
    return (
      <Container maxWidth="lg">
        <Box mt={4}>
          <Alert severity="error">{error}</Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
            {t('community.posts.back')}
          </Button>
        </Box>
      </Container>
    );
  }

  // 게시글이 없는 경우 표시
  if (!post) {
    return (
      <Container maxWidth="lg">
        <Box mt={4}>
          <Alert severity="warning">{t('community.posts.loadFailed')}</Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
            {t('community.posts.back')}
          </Button>
        </Box>
      </Container>
    );
  }
  const toggleOriginalView = () => {
    setShowOriginal(prev => !prev);
  };

  return (
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
                  {t('community.posts.edit')}
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  sx={{ color: '#f44336', borderColor: '#f44336' }}
                  variant="outlined"
                  size="small"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  {t('community.posts.delete')}
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
                    {t('community.posts.report')}
                  </Button>
                </Box>
              )
            )}
          </Box>

          {/* 게시글 삭제 확인 다이얼로그 */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>{t('community.posts.delete')}</DialogTitle>
            <DialogContent>
              <Typography>{t('community.posts.deleteConfirm')}</Typography>
              <Typography variant="caption" color="error">
                삭제된 게시글은 복구할 수 없습니다.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>{t('buttons.cancel')}</Button>
              <Button onClick={handleDeletePost} color="error">
                {t('community.posts.delete')}
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
              <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mr: 2 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {post.userName}
                </Typography>
                {/* 국가 정보 표시 */}
                {post.writer?.nation && (
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#999' }}>
                    <FlagDisplay nation={post.writer.nation} size="small" showName={false} />
                  </Typography>
                )}
              </Box>
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
                {post.tags.map((tag: any, index) => {
                  const tagName = tag.name || tag;
                  return <StyledChip key={index} label={translateTag(tagName)} size="small" />;
                })}
              </Box>
            )}
            <Button
              variant={showOriginal ? 'contained' : 'outlined'}
              size="small"
              onClick={toggleOriginalView}
            >
              {showOriginal ? '원문 숨기기' : '원문 보기'}
            </Button>
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
              {showOriginal && originContent !== null ? originContent : post.content}
            </Typography>

            {/* 첨부파일 표시 (있는 경우) */}
            {post.files && post.files.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                  {t('community.posts.attachFiles')}
                </Typography>

                {/* 이미지 파일과 일반 파일 분리 */}
                {(() => {
                  const imageFiles = post.files.filter((file: any) => {
                    const url = file.url || file;
                    const fileName = file.name || url.split('/').pop() || '';
                    return (
                      /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName) ||
                      /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)
                    );
                  });

                  const nonImageFiles = post.files.filter((file: any) => {
                    const url = file.url || file;
                    const fileName = file.name || url.split('/').pop() || '';
                    return (
                      !/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName) &&
                      !/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)
                    );
                  });

                  return (
                    <>
                      {/* 이미지 갤러리 */}
                      {imageFiles.length > 0 && (
                        <Box mb={nonImageFiles.length > 0 ? 3 : 0}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            이미지 ({imageFiles.length}개)
                          </Typography>
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                              gap: 2,
                              maxHeight: '400px',
                              overflowY: 'auto',
                            }}
                          >
                            {imageFiles.map((file: any, index: number) => {
                              const imageUrl = file.url || file;
                              const fileName =
                                file.name || imageUrl.split('/').pop() || `이미지 ${index + 1}`;

                              return (
                                <Box
                                  key={index}
                                  sx={{
                                    position: 'relative',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      transform: 'translateY(-4px)',
                                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                      '& .zoom-icon': {
                                        opacity: 1,
                                      },
                                    },
                                  }}
                                  onClick={() => window.open(imageUrl, '_blank')}
                                >
                                  <img
                                    src={imageUrl}
                                    alt={fileName}
                                    style={{
                                      width: '100%',
                                      height: '150px',
                                      objectFit: 'cover',
                                      display: 'block',
                                    }}
                                    onError={e => {
                                      e.currentTarget.style.display = 'none';
                                      // 이미지 로드 실패 시 폴백 표시
                                      const parent = e.currentTarget.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `
                                            <div style="
                                              width: 100%;
                                              height: 150px;
                                              background: #f5f5f5;
                                              display: flex;
                                              flex-direction: column;
                                              align-items: center;
                                              justify-content: center;
                                              color: #999;
                                            ">
                                              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                              </svg>
                                              <span style="margin-top: 8px; font-size: 12px;">이미지 로드 실패</span>
                                            </div>
                                          `;
                                      }
                                    }}
                                  />

                                  {/* 이미지 오버레이 정보 */}
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                      color: 'white',
                                      p: 1.5,
                                      fontSize: '0.75rem',
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{ fontWeight: 500, display: 'block' }}
                                    >
                                      {fileName.length > 25
                                        ? fileName.substring(0, 25) + '...'
                                        : fileName}
                                    </Typography>
                                    {file.size && (
                                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        {(file.size / 1024).toFixed(1)} KB
                                      </Typography>
                                    )}
                                  </Box>

                                  {/* 확대 아이콘 */}
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: 8,
                                      right: 8,
                                      width: 24,
                                      height: 24,
                                      borderRadius: '50%',
                                      background: 'rgba(0,0,0,0.5)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      opacity: 0,
                                      transition: 'opacity 0.3s ease',
                                    }}
                                    className="zoom-icon"
                                  >
                                    <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                      <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
                                    </svg>
                                  </Box>
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      )}

                      {/* 일반 파일 목록 */}
                      {nonImageFiles.length > 0 && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            첨부파일 ({nonImageFiles.length}개)
                          </Typography>
                          <List dense sx={{ bgcolor: '#f9f9f9', borderRadius: 2, p: 1 }}>
                            {nonImageFiles.map((file: any, index: number) => (
                              <ListItem
                                key={index}
                                sx={{
                                  px: 2,
                                  py: 1,
                                  mb: 1,
                                  bgcolor: 'white',
                                  borderRadius: 1,
                                  '&:last-child': { mb: 0 },
                                  '&:hover': { bgcolor: '#f5f5f5' },
                                  transition: 'background-color 0.2s ease',
                                }}
                              >
                                <ListItemAvatar sx={{ minWidth: 40 }}>
                                  <InsertDriveFileIcon fontSize="small" sx={{ color: '#FF9999' }} />
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
                                        color: '#FF9999',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        '&:hover': {
                                          textDecoration: 'underline',
                                          color: '#ff7777',
                                        },
                                      }}
                                    >
                                      {file.name ||
                                        `${t('community.posts.attachFiles')} ${index + 1}`}
                                    </Typography>
                                  }
                                  secondary={
                                    file.size && (
                                      <Typography variant="caption" sx={{ color: '#999' }}>
                                        {(file.size / 1024).toFixed(1)} KB
                                      </Typography>
                                    )
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </>
                  );
                })()}
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
              {t('community.posts.likePost')} {post.likeCount || 0}
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
              {t('community.posts.dislikePost')} {post.dislikeCount || 0}
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
  );
};

export default PostDetailPage;
