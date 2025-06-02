import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  List,
  ListItem,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
  styled,
  Divider,
  Pagination,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Reply as ReplyIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useComments } from '../../hooks/useComments';
import useAuthStore from '../../../auth/store/authStore';
import { useCommentForm, useCommentControls } from '../../hooks';
import CommentForm from './CommentForm';
// import { CommentType, ReplyType, ReactionType } from '../../types'; // 존재하지 않아 임시 주석 처리
// enum ReactionType으로 변경
// type ReactionType = 'LIKE' | 'DISLIKE';
enum ReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}
import { CommentApi } from '../../api/commentApi';
import { useSnackbar } from 'notistack';
import ReportDialog, {
  ReportTargetType,
  ServiceType,
} from '../../../common/components/ReportDialog';
import { useTranslation } from '../../../../shared/i18n';
import FlagDisplay from '../../../../shared/components/FlagDisplay';

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

function formatDateToAbsolute(dateString: string, t: any) {
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: ko });
  } catch (e) {
    console.error('날짜 형식 변환 오류:', e);
    return t('community.posts.noDate');
  }
}

interface CommentSectionProps {
  postId: number;
  comments?: Comment[];
  totalComments?: number;
  onReplyComment?: (commentId: number, content: string) => Promise<void>;
  onReactionComment?: (commentId: number, reaction: ReactionType) => Promise<void>;
  onEditComment?: (commentId: number, content: string) => Promise<void>;
  onDeleteComment?: (commentId: number) => Promise<void>;
}

// 실제 코드에서 사용하는 속성만 포함
// type ReactionType = ... (enum은 이미 선언됨)
type User = {
  id?: number | string;
  userId?: number | string;
  nickname?: string;
  name?: string;
  profileImage?: string;
  nation?: string;
};

type Reply = {
  replyId: number;
  commentId: number;
  content: string;
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
  myReaction?: ReactionType;
  liked?: boolean;
  disliked?: boolean;
  writer: User;
  translating?: boolean;
};

type Comment = {
  commentId: number;
  postId?: number;
  content: string;
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
  myReaction?: ReactionType;
  liked?: boolean;
  disliked?: boolean;
  writer: User;
  replies?: Reply[];
  replyCount?: number;
  reply?: number;
  translating?: boolean;
};

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments: propComments,
  totalComments: propTotal,
  onReplyComment: propReply,
  onReactionComment: propReact,
  onEditComment: propEdit,
  onDeleteComment: propDelete,
}) => {
  const { t } = useTranslation();
  // Local state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'oldest'>('latest');

  // Snackbar notifications
  const { enqueueSnackbar } = useSnackbar();

  // Auth
  const { user } = useAuthStore();
  const currentUserId =
    ((user as any)?.id ?? (user as any)?.userId)
      ? Number((user as any)?.id ?? (user as any)?.userId)
      : undefined;

  // Comment form controls
  const controls = useCommentControls(comments);

  // Initialize controls whenever comments list changes
  useEffect(() => {
    controls.initializeState();
  }, [comments.length]);

  // 댓글 목록 불러오기 - useCallback으로 최적화
  const fetchComments = useCallback(
    async (page: number = currentPage, sort: string = sortBy) => {
      setIsLoading(true);
      try {
        console.log('[DEBUG] 댓글 가져오기 시작 - postId:', postId, 'page:', page, 'sort:', sort);
        const response = await CommentApi.getComments(postId, 'post', page, pageSize, sort);
        console.log('[DEBUG] 댓글 응답 구조:', JSON.stringify(response, null, 2));

        if (response && response.commentList) {
          // commentApi 내부에서 각 댓글의 isState를 myReaction으로 이미 변환함
          setComments(response.commentList);

          // 댓글 총 개수 계산 (댓글 + 답글)
          let totalComments = response.total || 0;
          let totalReplies = 0;

          // 각 댓글의 답글 수를 합산하여 총 개수에 추가
          response.commentList.forEach(comment => {
            totalReplies += comment.replyCount || comment.reply || 0;
          });

          // 총 댓글 수 = 댓글 수 + 답글 수
          setTotal(totalComments + totalReplies);

          // 페이지네이션 정보 설정
          if (response.pageInfo) {
            setCurrentPage(response.pageInfo.page);
            setPageSize(response.pageInfo.size);
            setTotalPages(response.pageInfo.totalPages);
          } else {
            // 페이지네이션 정보가 없는 경우 계산
            setTotalPages(Math.ceil(totalComments / pageSize));
          }

          console.log(
            '[DEBUG] 댓글 총 개수:',
            totalComments,
            '페이지:',
            page,
            '전체 페이지:',
            Math.ceil(totalComments / pageSize)
          );
          console.log(
            '[DEBUG] 받은 댓글 수:',
            response.commentList.length,
            '답글 수:',
            totalReplies
          );
        } else {
          console.warn('[WARN] 댓글 응답 구조가 예상과 다름:', response);
          setComments([]);
          setTotal(0);
          setTotalPages(0);
        }
      } catch (error) {
        console.error('[ERROR] 댓글 가져오기 실패:', error);
        setComments([]);
        setTotal(0);
        setTotalPages(0);
        enqueueSnackbar(t('community.comments.loadFailed'), { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [postId, pageSize, enqueueSnackbar, sortBy]
  );

  // 페이지 변경 핸들러
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    // API는 0부터 시작하는 페이지 인덱스 사용
    const apiPageIndex = page - 1;
    fetchComments(apiPageIndex);
  };

  // 정렬 변경 핸들러 추가
  const handleSortChange = (newSort: 'latest' | 'popular' | 'oldest') => {
    console.log('[DEBUG] 댓글 정렬 변경:', sortBy, '→', newSort);
    setSortBy(newSort);
    setCurrentPage(0); // 첫 페이지로 리셋
    fetchComments(0, newSort); // 새로운 정렬로 첫 페이지부터 로드
  };

  // 대댓글 로드 함수 - useCallback으로 최적화
  const [loadingReplies, setLoadingReplies] = useState<Record<number, boolean>>({});
  const [replies, setReplies] = useState<Record<number, Reply[]>>({});

  const loadReplies = useCallback(
    async (commentId: number) => {
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

        if (response && response.replyList) {
          // API 응답에서 변환된 replyList 사용
          setReplies(prev => ({
            ...prev,
            [commentId]: response.replyList,
          }));

          console.log(
            `[DEBUG] 댓글 ${commentId}의 대댓글 ${response.replyList.length}개 로드 완료`
          );

          // 댓글 객체의 replyCount 업데이트 - 전체 댓글을 다시 불러오지 않고 해당 댓글만 업데이트
          setComments(prevComments =>
            prevComments.map(comment =>
              comment.commentId === commentId
                ? { ...comment, replyCount: response.replyList.length }
                : comment
            )
          );
        } else {
          console.warn('[WARN] 대댓글 응답 구조가 예상과 다름:', response);
          setReplies(prev => ({
            ...prev,
            [commentId]: [],
          }));
        }
      } catch (error) {
        console.error('[ERROR] 대댓글 로드 실패:', error);
        enqueueSnackbar('답글을 불러오는 중 오류가 발생했습니다.', { variant: 'error' });
      } finally {
        setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
      }
    },
    [loadingReplies, enqueueSnackbar]
  );

  // 답글 토글 핸들러 확장
  const handleReplyToggle = useCallback(
    async (commentId: number) => {
      // 기존 토글 함수 호출
      controls.handleReplyToggle(commentId);

      // 토글 상태가 true로 변경될 때(펼쳐질 때) 대댓글 로드
      // 이미 로드된 경우에는 다시 로드하지 않음
      if (
        !controls.replyToggles[commentId] &&
        (!replies[commentId] || replies[commentId].length === 0)
      ) {
        await loadReplies(commentId);
      }
    },
    [controls, loadReplies, replies]
  );

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
      const commentsWithReplies = comments.filter(
        comment =>
          (comment.reply && comment.reply > 0) || (comment.replyCount && comment.replyCount > 0)
      );

      if (commentsWithReplies.length === 0) return;

      // 이미 로드된 댓글 및 로딩 중인 댓글 필터링
      const commentsToLoad = commentsWithReplies.filter(
        comment => !replies[comment.commentId] && !loadingReplies[comment.commentId]
      );

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
      enqueueSnackbar(t('community.comments.commentRequired'), { variant: 'warning' });
      return;
    }

    if (!user) {
      enqueueSnackbar(t('auth.loginRequired'), { variant: 'warning' });
      return;
    }

    setSubmittingComment(true);
    try {
      console.log('[DEBUG] 댓글 작성 시작:', newCommentText.substring(0, 20) + '...');

      // 사용자 이름 확실하게 가져오기
      const userName = user.name || (user as any).nickname || t('community.comments.anonymous');
      console.log('[DEBUG] 댓글 작성에 사용할 사용자 이름:', userName);

      // 입력 필드 초기화
      setNewCommentText('');

      // 백엔드 API 호출
      const response = await CommentApi.createComment(postId, 'post', newCommentText);
      console.log('[DEBUG] 댓글 생성 응답:', response);

      if (response) {
        // 새 댓글을 기존 댓글 목록의 맨 앞에 추가 (UI 즉시 업데이트)
        const userProfileImage = (user as any).profileImage || '';
        const userId = (user as any)?.id ?? (user as any)?.userId;

        const newComment = {
          ...response,
          writer: {
            ...(response.writer || {}),
            userId: userId,
            nickname: userName,
            profileImage: userProfileImage,
          },
        };

        setComments(prevComments => [newComment, ...prevComments]);

        // 총 댓글 수 증가
        setTotal(prev => prev + 1);

        enqueueSnackbar(t('community.comments.saveSuccess'), { variant: 'success' });
      } else {
        // 응답이 없으면 전체 목록 새로고침
        fetchComments(0);
        enqueueSnackbar(t('community.comments.saveSuccess'), { variant: 'info' });
      }
    } catch (error) {
      console.error('[ERROR] 댓글 작성 실패:', error);
      enqueueSnackbar(t('community.comments.saveFailed'), { variant: 'error' });
    } finally {
      setSubmittingComment(false);
    }
  };

  // 댓글 수정
  const handleEditComment = async (commentId: number, content: string) => {
    try {
      const response = await CommentApi.updateComment(commentId, content);

      // 전체 댓글 목록을 다시 불러오지 않고 해당 댓글만 업데이트
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.commentId === commentId ? { ...comment, content } : comment
        )
      );

      enqueueSnackbar(t('community.comments.saveSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('[ERROR] 댓글 수정 실패:', error);
      enqueueSnackbar(t('community.comments.saveFailed'), { variant: 'error' });
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    try {
      await CommentApi.deleteComment(commentId);

      // 삭제된 댓글을 목록에서 제거하고 총 개수 감소
      setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
      setTotal(prev => Math.max(0, prev - 1));

      enqueueSnackbar(t('community.comments.deleteSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('[ERROR] 댓글 삭제 실패:', error);
      enqueueSnackbar(t('community.comments.deleteFailed'), { variant: 'error' });
      // 실패 시 댓글 목록 다시 로드
      fetchComments();
    }
  };

  // 특정 댓글을 ID로 찾는 헬퍼 함수
  const findCommentById = useCallback((comments: Comment[], id: number): Comment | undefined => {
    return comments.find(comment => comment.commentId === id);
  }, []);

  // 댓글 목록에서 특정 댓글 업데이트 헬퍼 함수 (수정)
  const updateCommentInList = useCallback(
    (
      commentsList: Comment[],
      commentId: number,
      updateFn: Comment | ((comment: Comment) => Comment)
    ): Comment[] => {
      return commentsList.map(comment => {
        if (comment.commentId === commentId) {
          return typeof updateFn === 'function' ? updateFn(comment) : { ...comment, ...updateFn };
        }
        return comment;
      });
    },
    []
  );

  // 댓글 반응 함수 - 서버 응답이 불완전해도 UI 상태가 유지되도록 개선
  const handleReactionComment = async (commentId: number, type: 'like' | 'dislike') => {
    if (!user) {
      enqueueSnackbar(t('auth.loginRequired'), { variant: 'warning' });
      return;
    }

    try {
      const comment = comments.find(c => c.commentId === commentId);
      if (!comment) return;

      // 현재 반응 상태 확인
      const currentReaction = comment.myReaction;
      console.log(
        `[DEBUG] 댓글 반응 처리 시작 - 댓글ID: ${commentId}, 타입: ${type}, 현재상태: ${currentReaction}`
      );

      // 새 반응 타입 결정
      const newReactionType = type === 'like' ? ReactionType.LIKE : ReactionType.DISLIKE;

      // 취소 여부 결정 (같은 버튼 다시 클릭)
      const isCancelling =
        (type === 'like' && currentReaction === ReactionType.LIKE) ||
        (type === 'dislike' && currentReaction === ReactionType.DISLIKE);

      // 최종 설정될 반응 타입
      const finalReaction = isCancelling ? undefined : newReactionType;

      console.log(
        `[DEBUG] 낙관적 UI 업데이트 - isCancelling: ${isCancelling}, finalReaction: ${finalReaction}`
      );

      // UI 즉시 업데이트 (낙관적 UI 업데이트)
      setComments(prevComments => {
        const updatedComments = prevComments.map(c => {
          if (c.commentId !== commentId) return c;

          let updatedLikeCount = c.likeCount || 0;
          let updatedDislikeCount = c.dislikeCount || 0;

          // 기존 반응 취소
          if (currentReaction === ReactionType.LIKE) {
            updatedLikeCount = Math.max(0, updatedLikeCount - 1);
          } else if (currentReaction === ReactionType.DISLIKE) {
            updatedDislikeCount = Math.max(0, updatedDislikeCount - 1);
          }

          // 새 반응 추가 (취소가 아닌 경우에만)
          if (!isCancelling) {
            if (type === 'like') {
              updatedLikeCount += 1;
            } else {
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

          console.log(
            `[DEBUG] 업데이트된 댓글 상태 - commentId: ${commentId}, myReaction: ${updatedComment.myReaction}`
          );
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

      console.log(
        `[DEBUG] API 호출 전 - commentId: ${commentId}, newReactionType: ${newReactionType}`
      );

      // API 호출 - 낙관적 UI 이후
      const response = await CommentApi.reactToComment(commentId, newReactionType);
      console.log(`[DEBUG] 댓글 반응 API 응답:`, response);

      // 서버 응답이 null, undefined 또는 에러인 경우
      if (!response || (typeof response === 'string' && response === 'error')) {
        console.log('[WARN] 서버 응답이 유효하지 않아 클라이언트 상태 유지');
        return; // 현재 UI 상태 유지
      }

      // 서버 응답으로 UI 상태 확인 및 조정
      let serverReaction: ReactionType | undefined;

      // 서버 응답에서 isState가 있는 경우
      if (response.isState) {
        if (response.isState === '좋아요') {
          serverReaction = ReactionType.LIKE;
        } else if (response.isState === '싫어요') {
          serverReaction = ReactionType.DISLIKE;
        } else {
          serverReaction = undefined;
        }
      }
      // 서버 응답에서 isState가 없는 경우 (API 응답 불완전)
      else {
        // like, dislike 값을 확인하여 상태 추론
        if (response.like > 0 && type === 'like') {
          serverReaction = ReactionType.LIKE;
        } else if (response.dislike > 0 && type === 'dislike') {
          serverReaction = ReactionType.DISLIKE;
        } else if (isCancelling) {
          // 취소하는 경우 그대로 undefined 사용
          serverReaction = undefined;
        } else {
          // 서버 응답이 부정확하면 요청했던 상태 사용 (낙관적 UI 유지)
          serverReaction = finalReaction;
        }
      }

      console.log(
        `[DEBUG] 서버 응답 반영 - commentId: ${commentId}, serverReaction: ${serverReaction}`
      );

      // 최종 UI 업데이트 - 서버 응답 기반이지만 필요시 클라이언트 상태 유지
      setComments(prevComments => {
        const updatedComments = prevComments.map(c => {
          if (c.commentId !== commentId) return c;

          // 현재 UI에 표시된 상태 확인
          const currentUiReaction = c.myReaction;

          // 서버 응답이 있으면 서버 응답 사용, 없으면 현재 UI 상태 유지
          const finalServerReaction =
            serverReaction !== undefined ? serverReaction : currentUiReaction;

          const updatedComment = {
            ...c,
            likeCount: response.like !== undefined ? response.like : c.likeCount,
            dislikeCount: response.dislike !== undefined ? response.dislike : c.dislikeCount,
            myReaction: finalServerReaction,
            liked: finalServerReaction === ReactionType.LIKE,
            disliked: finalServerReaction === ReactionType.DISLIKE,
          };

          console.log(
            `[DEBUG] 서버 응답 후 최종 댓글 상태 - commentId: ${commentId}, myReaction: ${updatedComment.myReaction}`
          );
          return updatedComment;
        });
        return updatedComments;
      });
    } catch (error) {
      console.error('[ERROR] 댓글 반응 처리 실패:', error);
      enqueueSnackbar(t('community.comments.saveFailed'), { variant: 'error' });
      // 에러 시 전체 다시 로드
      fetchComments();
    }
  };

  // 대댓글 반응 함수 - 서버 응답이 불완전해도 UI 상태가 유지되도록 개선
  const handleReactionReply = async (
    replyId: number,
    type: 'like' | 'dislike',
    commentId: number
  ) => {
    if (!user) {
      enqueueSnackbar(t('auth.loginRequired'), { variant: 'warning' });
      return;
    }

    try {
      const replyList = replies[commentId] || [];
      const reply = replyList.find(r => r.replyId === replyId);
      if (!reply) return;

      // 현재 반응 상태 확인
      const currentReaction = reply.myReaction;
      console.log(
        `[DEBUG] 답글 반응 처리 시작 - 답글ID: ${replyId}, 타입: ${type}, 현재상태: ${currentReaction}`
      );

      // 새 반응 타입 결정
      const newReactionType = type === 'like' ? ReactionType.LIKE : ReactionType.DISLIKE;

      // 취소 여부 결정 (같은 버튼 다시 클릭)
      const isCancelling =
        (type === 'like' && currentReaction === ReactionType.LIKE) ||
        (type === 'dislike' && currentReaction === ReactionType.DISLIKE);

      // 최종 설정될 반응 타입
      const finalReaction = isCancelling ? undefined : newReactionType;

      console.log(
        `[DEBUG] 낙관적 UI 업데이트 - isCancelling: ${isCancelling}, finalReaction: ${finalReaction}`
      );

      // UI 즉시 업데이트 (낙관적 UI 업데이트)
      setReplies(prev => {
        const updatedReplies = { ...prev };

        // 이 부분에서 원본 배열을 새로운 배열로 대체
        updatedReplies[commentId] = replyList.map(r => {
          if (r.replyId !== replyId) return r;

          let updatedLikeCount = r.likeCount || 0;
          let updatedDislikeCount = r.dislikeCount || 0;

          // 기존 반응 취소
          if (currentReaction === ReactionType.LIKE) {
            updatedLikeCount = Math.max(0, updatedLikeCount - 1);
          } else if (currentReaction === ReactionType.DISLIKE) {
            updatedDislikeCount = Math.max(0, updatedDislikeCount - 1);
          }

          // 새 반응 추가 (취소가 아닌 경우에만)
          if (!isCancelling) {
            if (type === 'like') {
              updatedLikeCount += 1;
            } else {
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

          console.log(
            `[DEBUG] 업데이트된 답글 상태 - replyId: ${replyId}, myReaction: ${updatedReply.myReaction}`
          );
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
      let serverReaction: ReactionType | undefined;

      // 서버 응답에서 isState가 있는 경우
      if (response.isState) {
        if (response.isState === '좋아요') {
          serverReaction = ReactionType.LIKE;
        } else if (response.isState === '싫어요') {
          serverReaction = ReactionType.DISLIKE;
        } else {
          serverReaction = undefined;
        }
      }
      // 서버 응답에서 isState가 없는 경우 (API 응답 불완전)
      else {
        // like, dislike 값을 확인하여 상태 추론
        if (response.like > 0 && type === 'like') {
          serverReaction = ReactionType.LIKE;
        } else if (response.dislike > 0 && type === 'dislike') {
          serverReaction = ReactionType.DISLIKE;
        } else if (isCancelling) {
          // 취소하는 경우 그대로 undefined 사용
          serverReaction = undefined;
        } else {
          // 서버 응답이 부정확하면 요청했던 상태 사용 (낙관적 UI 유지)
          serverReaction = finalReaction;
        }
      }

      console.log(
        `[DEBUG] 서버 응답 반영 - replyId: ${replyId}, serverReaction: ${serverReaction}`
      );

      // 최종 UI 업데이트 - 서버 응답 기반이지만 필요시 클라이언트 상태 유지
      setReplies(prev => {
        const updatedReplies = { ...prev };

        // commentId에 해당하는 배열이 있는지 확인
        if (updatedReplies[commentId]) {
          updatedReplies[commentId] = updatedReplies[commentId].map(r => {
            if (r.replyId !== replyId) return r;

            // 현재 UI에 표시된 상태 확인
            const currentUiReaction = r.myReaction;

            // 서버 응답이 있으면 서버 응답 사용, 없으면 현재 UI 상태 유지
            const finalServerReaction =
              serverReaction !== undefined ? serverReaction : currentUiReaction;

            const updatedReply = {
              ...r,
              likeCount: response.like !== undefined ? response.like : r.likeCount,
              dislikeCount: response.dislike !== undefined ? response.dislike : r.dislikeCount,
              myReaction: finalServerReaction,
              liked: finalServerReaction === ReactionType.LIKE,
              disliked: finalServerReaction === ReactionType.DISLIKE,
            };

            console.log(
              `[DEBUG] 서버 응답 후 최종 답글 상태 - replyId: ${replyId}, myReaction: ${updatedReply.myReaction}`
            );
            return updatedReply;
          });
        }

        return updatedReplies;
      });
    } catch (error) {
      console.error('[ERROR] 답글 반응 처리 실패:', error);
      enqueueSnackbar(t('community.comments.saveFailed'), { variant: 'error' });
      // 에러 시 해당 댓글의 답글만 다시 로드
      loadReplies(commentId);
    }
  };

  // 대댓글 작성 함수 최적화
  const handleReplyComment = async (commentId: number, content: string) => {
    if (!content.trim()) {
      enqueueSnackbar(t('community.comments.commentRequired'), { variant: 'warning' });
      return;
    }

    if (!user) {
      enqueueSnackbar(t('auth.loginRequired'), { variant: 'warning' });
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

      // 사용자 이름 확실하게 가져오기
      const userName = user.name || (user as any).nickname || t('community.comments.anonymous');
      console.log('[DEBUG] 답글 작성에 사용할 사용자 이름:', userName);

      // 임시 답글 객체 생성
      const tempReply: Reply = {
        replyId: -Date.now(), // 임시 ID (음수)
        commentId: numericCommentId,
        content: content,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        dislikeCount: 0,
        writer: {
          userId: (user as any)?.id ?? (user as any)?.userId,
          nickname: userName, // 사용자 실제 이름을 무조건 사용
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
      // 대댓글 optimistic 추가 시 total 증가
      setTotal(prev => prev + 1);

      // 댓글의 대댓글 카운트 증가
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.commentId === commentId
            ? {
                ...comment,
                replyCount: (comment.replyCount || 0) + 1,
                reply: (comment.reply || 0) + 1,
              }
            : comment
        )
      );

      // 백엔드 API 호출
      const response = await CommentApi.createReply(postId, numericCommentId, content);
      console.log('[DEBUG] 대댓글 작성 응답:', response);

      // 임시 답글을 실제 답글로 대체
      setReplies(prev => {
        const updatedReplies = { ...prev };
        if (updatedReplies[numericCommentId]) {
          updatedReplies[numericCommentId] = updatedReplies[numericCommentId].map(reply =>
            reply.replyId === tempReply.replyId
              ? {
                  ...response,
                  writer: {
                    // 백엔드 응답의 writer와 임시 답글의 writer 정보를 병합
                    ...(response.writer || {}),
                    userId: response.writer?.userId || tempReply.writer.userId,
                    nickname: response.writer?.nickname || userName, // 백엔드 응답에 이름이 없으면 원래 이름 유지
                    profileImage: response.writer?.profileImage || tempReply.writer.profileImage,
                  },
                  translating: false, // 번역 완료
                }
              : reply
          );
        }
        return updatedReplies;
      });

      enqueueSnackbar(t('community.comments.saveSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('[ERROR] 답글 작성 실패:', error);

      // 에러 발생 시 임시 답글 제거 및 카운트 복구
      setReplies(prev => {
        const updatedReplies = { ...prev };
        if (updatedReplies[commentId]) {
          updatedReplies[commentId] = updatedReplies[commentId].filter(reply => reply.replyId > 0);
        }
        return updatedReplies;
      });
      // 대댓글 추가 실패 시 total 롤백
      setTotal(prev => Math.max(0, prev - 1));

      // 댓글의 대댓글 카운트 복구
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.commentId === commentId
            ? {
                ...comment,
                replyCount: Math.max(0, (comment.replyCount || 0) - 1),
                reply: Math.max(0, (comment.reply || 0) - 1),
              }
            : comment
        )
      );

      enqueueSnackbar(t('community.comments.saveFailed'), { variant: 'error' });
    }
  };

  // 대댓글 수정 함수 최적화
  const handleEditReply = async (replyId: number, content: string) => {
    // 상위 댓글 ID 찾기 - try 블록 외부로 이동
    let parentCommentId: number | null = null;

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
          if (updatedReplies[parentCommentId as number]) {
            updatedReplies[parentCommentId as number] = updatedReplies[
              parentCommentId as number
            ].map((reply: Reply) => (reply.replyId === replyId ? { ...reply, content } : reply));
          }
          return updatedReplies;
        });

        enqueueSnackbar(t('community.comments.saveSuccess'), { variant: 'success' });
      }
    } catch (error) {
      console.error('[ERROR] 대댓글 수정 실패:', error);
      enqueueSnackbar(t('community.comments.saveFailed'), { variant: 'error' });

      // 에러 발생 시 해당 댓글의 대댓글만 다시 로드
      if (parentCommentId !== null) {
        loadReplies(parentCommentId);
      }
    }
  };

  // 대댓글 삭제 함수 최적화
  const handleDeleteReply = async (replyId: number) => {
    // 상위 댓글 ID 찾기 - try 블록 외부로 이동
    let parentCommentId: number | null = null;

    try {
      console.log(`[DEBUG] 대댓글 ${replyId} 삭제 시작`);

      // 상위 댓글 ID 검색
      Object.entries(replies).forEach(([commentId, replyList]) => {
        if (replyList.some(r => r.replyId === replyId)) {
          parentCommentId = Number(commentId);
        }
      });

      if (parentCommentId === null) return;

      await CommentApi.deleteReply(replyId);

      // 삭제된 대댓글을 목록에서 제거 (전체 새로고침 없이)
      setReplies(prev => {
        const updatedReplies = { ...prev };
        if (updatedReplies[parentCommentId as number]) {
          updatedReplies[parentCommentId as number] = updatedReplies[
            parentCommentId as number
          ].filter((reply: Reply) => reply.replyId !== replyId);
        }
        return updatedReplies;
      });
      // 대댓글 optimistic 삭제 시 total 감소
      setTotal(prev => Math.max(0, prev - 1));

      // 댓글의 대댓글 카운트 감소 (전체 새로고침 없이)
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.commentId === parentCommentId
            ? {
                ...comment,
                replyCount: Math.max(0, (comment.replyCount || 0) - 1),
                reply: Math.max(0, (comment.reply || 0) - 1),
              }
            : comment
        )
      );

      enqueueSnackbar(t('community.comments.deleteSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('[ERROR] 대댓글 삭제 실패:', error);
      enqueueSnackbar(t('community.comments.deleteFailed'), { variant: 'error' });

      // 에러 발생 시 대댓글만 다시 로드
      if (parentCommentId !== null) {
        loadReplies(parentCommentId);
        // 대댓글 삭제 실패 시 total 롤백
        setTotal(prev => prev + 1);
      }
    }
  };

  // CommentForm 제출 처리 함수
  const handleCommentForm = async (id: number, content: string, isReply: boolean = false) => {
    if (isReply) {
      await handleEditReply(id, content);
    } else {
      await handleEditComment(id, content);
    }
    controls.handleEditCancel(id);
    return true;
  };

  // Report dialog states
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    id: number;
    type: ReportTargetType;
    userId: number;
  } | null>(null);

  // Check if user is admin
  const isAdmin = user?.role === 'ROLE_ADMIN';

  // Handler for opening report dialog
  const handleOpenReportDialog = (
    targetId: number,
    targetType: ReportTargetType,
    userId: number
  ) => {
    if (!user) {
      enqueueSnackbar(t('auth.loginRequired'), { variant: 'warning' });
      return;
    }
    setReportTarget({ id: targetId, type: targetType, userId });
    setReportDialogOpen(true);
  };

  // Handler for closing report dialog
  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
    setReportTarget(null);
  };

  // 개별 댓글 카드 렌더링
  const renderCommentCard = (comment: Comment) => (
    <Box
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: 'white',
        boxShadow: 1,
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: 2,
        },
      }}
    >
      {/* 댓글 작성자 정보 및 작성 시간 */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Box display="flex" alignItems="center">
          <Avatar src={comment.writer?.profileImage || ''} sx={{ width: 40, height: 40, mr: 1 }}>
            {comment.writer?.nickname?.charAt(0) || '?'}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{comment.writer?.nickname}</Typography>
            {/* 국가 정보 표시 */}
            {comment.writer?.nation && (
              <Typography
                variant="caption"
                sx={{ fontSize: '0.7rem', color: '#999', mt: 0.2, display: 'block' }}
              >
                <FlagDisplay nation={comment.writer.nation} size="small" showName={false} />
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm', { locale: ko })}
              {comment.translating && (
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ ml: 1, color: 'info.main', fontStyle: 'italic' }}
                >
                  ({t('common.loading')})
                </Typography>
              )}
            </Typography>
          </Box>
        </Box>

        {/* 댓글 액션 버튼 (수정/삭제 또는 신고) */}
        {user && (
          <>
            {/* 작성자 본인이거나 관리자인 경우 수정/삭제 버튼 표시 */}
            {(currentUserId ?? user?.userId) === comment.writer?.userId || isAdmin ? (
              <IconButton
                onClick={e => {
                  controls.handleCommentMenuOpen(e, comment.commentId);
                }}
                size="small"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            ) : (
              /* 다른 사용자의 댓글인 경우 신고 버튼 표시 */
              <IconButton
                onClick={() =>
                  handleOpenReportDialog(
                    comment.commentId,
                    'COMMENT',
                    Number(comment.writer?.userId)
                  )
                }
                size="small"
                color="default"
                sx={{ '&:hover': { color: 'error.main' } }}
              >
                <FlagIcon fontSize="small" />
              </IconButton>
            )}
          </>
        )}
      </Box>

      {/* 댓글 내용 */}
      {controls.editMode[comment.commentId] ? (
        <CommentForm
          initialValue={comment.content}
          onSubmit={async content => {
            return await handleCommentForm(comment.commentId, content, false);
          }}
          onCancel={() => controls.handleEditCancel(comment.commentId)}
          buttonText={t('community.comments.editComment')}
        />
      ) : (
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {comment.content}
        </Typography>
      )}

      <CommentFooter>
        <ReactionButton
          variant={comment.myReaction === ReactionType.LIKE ? 'contained' : 'text'}
          startIcon={<ThumbUpIcon fontSize="small" />}
          size="small"
          onClick={() => handleReactionComment(comment.commentId, 'like')}
          color={comment.myReaction === ReactionType.LIKE ? 'primary' : 'inherit'}
          disabled={comment.myReaction === ReactionType.DISLIKE}
        >
          {comment.likeCount || 0}
        </ReactionButton>
        <ReactionButton
          variant={comment.myReaction === ReactionType.DISLIKE ? 'contained' : 'text'}
          startIcon={<ThumbDownIcon fontSize="small" />}
          size="small"
          onClick={() => handleReactionComment(comment.commentId, 'dislike')}
          color={comment.myReaction === ReactionType.DISLIKE ? 'error' : 'inherit'}
          disabled={comment.myReaction === ReactionType.LIKE}
        >
          {comment.dislikeCount || 0}
        </ReactionButton>
        <Button
          startIcon={<ReplyIcon fontSize="small" />}
          size="small"
          onClick={() => handleReplyToggle(comment.commentId)}
        >
          {t('community.comments.reply')} {replies[comment.commentId]?.length || 0}
        </Button>
      </CommentFooter>

      {/* 대댓글 부분 */}
      <Box ml={0} mt={1}>
        {controls.replyToggles[comment.commentId] && (
          <>
            {loadingReplies[comment.commentId] ? (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                {/* 대댓글 입력 폼 */}
                <Box ml={4} mt={2} mb={2}>
                  <Paper sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder={t('community.comments.enterComment')}
                      value={controls.replyContents[comment.commentId] || ''}
                      onChange={e => controls.handleReplyChange(comment.commentId, e.target.value)}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={1} gap={1}>
                      <Button onClick={() => controls.handleReplyToggle(comment.commentId)}>
                        {t('buttons.cancel')}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleReplyComment(
                            comment.commentId,
                            controls.replyContents[comment.commentId] || ''
                          )
                        }
                      >
                        {t('community.comments.writeComment')}
                      </Button>
                    </Box>
                  </Paper>
                </Box>

                {/* 대댓글 목록 */}
                <Box ml={4}>
                  {replies[comment.commentId] && replies[comment.commentId].length > 0 ? (
                    replies[comment.commentId].map(reply => (
                      <Paper
                        key={reply.replyId}
                        sx={{ p: 2, mb: 1, bgcolor: 'rgba(248, 248, 248, 0.9)' }}
                      >
                        {controls.editMode[reply.replyId] ? (
                          <CommentForm
                            initialValue={reply.content}
                            onSubmit={async content => {
                              return await handleCommentForm(reply.replyId, content, true);
                            }}
                            onCancel={() => controls.handleEditCancel(reply.replyId)}
                            buttonText={t('buttons.edit')}
                          />
                        ) : (
                          <>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              mb={1}
                            >
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar
                                  src={reply.writer?.profileImage}
                                  alt={reply.writer?.nickname || ''}
                                  sx={{ width: 24, height: 24 }}
                                />
                                <Typography variant="body2" fontWeight="bold">
                                  {reply.writer?.nickname}
                                </Typography>
                                {/* 국가 정보 표시 */}
                                {reply.writer?.nation && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: '0.7rem',
                                      color: '#999',
                                      mt: 0.2,
                                      display: 'block',
                                    }}
                                  >
                                    <FlagDisplay
                                      nation={reply.writer.nation}
                                      size="small"
                                      showName={false}
                                    />
                                  </Typography>
                                )}
                                <Typography variant="caption" color="text.secondary">
                                  {format(new Date(reply.createdAt), 'yyyy-MM-dd HH:mm', {
                                    locale: ko,
                                  })}
                                </Typography>
                              </Box>

                              {/* 대댓글 수정/삭제 또는 신고 버튼 */}
                              {user && (
                                <>
                                  {/* 작성자 본인이거나 관리자인 경우 수정/삭제 버튼 표시 */}
                                  {(currentUserId ?? user?.userId) === reply.writer?.userId ||
                                  isAdmin ? (
                                    <IconButton
                                      onClick={e => {
                                        controls.handleCommentMenuOpen(e, reply.replyId);
                                        // 대댓글 정보 설정
                                        controls.setActiveReplyInfo({
                                          replyId: reply.replyId,
                                          commentId: comment.commentId,
                                        });
                                      }}
                                      size="small"
                                    >
                                      <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                  ) : (
                                    /* 다른 사용자의 대댓글인 경우 신고 버튼 표시 */
                                    <IconButton
                                      onClick={() =>
                                        handleOpenReportDialog(
                                          reply.replyId,
                                          'REPLY',
                                          Number(reply.writer?.userId)
                                        )
                                      }
                                      size="small"
                                      color="default"
                                      sx={{ '&:hover': { color: 'error.main' } }}
                                    >
                                      <FlagIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                </>
                              )}
                            </Box>

                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {reply.content}
                            </Typography>

                            {/* 대댓글 좋아요/싫어요 */}
                            <Box display="flex" gap={1}>
                              <ReactionButton
                                variant={
                                  reply.myReaction === ReactionType.LIKE ? 'contained' : 'text'
                                }
                                startIcon={<ThumbUpIcon fontSize="small" />}
                                size="small"
                                onClick={() =>
                                  handleReactionReply(reply.replyId, 'like', comment.commentId)
                                }
                                color={
                                  reply.myReaction === ReactionType.LIKE ? 'primary' : 'inherit'
                                }
                                sx={{ minWidth: '60px', py: 0.5 }}
                                disabled={reply.myReaction === ReactionType.DISLIKE}
                              >
                                {reply.likeCount || 0}
                              </ReactionButton>
                              <ReactionButton
                                variant={
                                  reply.myReaction === ReactionType.DISLIKE ? 'contained' : 'text'
                                }
                                startIcon={<ThumbDownIcon fontSize="small" />}
                                size="small"
                                onClick={() =>
                                  handleReactionReply(reply.replyId, 'dislike', comment.commentId)
                                }
                                color={
                                  reply.myReaction === ReactionType.DISLIKE ? 'error' : 'inherit'
                                }
                                sx={{ minWidth: '60px', py: 0.5 }}
                                disabled={reply.myReaction === ReactionType.LIKE}
                              >
                                {reply.dislikeCount || 0}
                              </ReactionButton>
                            </Box>
                          </>
                        )}
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mb: 2 }}>
                      {t('community.comments.noComments')}
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );

  // 댓글 메뉴
  const renderCommentMenu = () => (
    <Menu
      id="comment-menu"
      anchorEl={controls.menuAnchorEl}
      keepMounted
      open={Boolean(controls.menuAnchorEl)}
      onClose={controls.handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          if (controls.activeReplyInfo) {
            // 대댓글 수정
            controls.handleEditStart(controls.activeReplyInfo.replyId);
            controls.handleMenuClose();
          } else if (controls.activeCommentId) {
            // 댓글 수정
            controls.handleEditStart(controls.activeCommentId);
            controls.handleMenuClose();
          }
        }}
      >
        {t('community.comments.editComment')}
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (controls.activeReplyInfo) {
            // 대댓글 삭제
            handleDeleteReply(controls.activeReplyInfo.replyId);
            controls.handleMenuClose();
          } else if (controls.activeCommentId) {
            // 댓글 삭제
            handleDeleteComment(controls.activeCommentId);
            controls.handleMenuClose();
          }
        }}
      >
        {t('community.comments.deleteComment')}
      </MenuItem>
    </Menu>
  );

  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{
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
        }}
      >
        {t('community.comments.totalComments', { count: total.toString() })}
      </Typography>

      {/* 댓글 정렬 버튼 */}
      <Box display="flex" gap={1} mb={3}>
        <Button
          variant={sortBy === 'latest' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => handleSortChange('latest')}
          sx={{
            backgroundColor: sortBy === 'latest' ? 'primary.main' : 'transparent',
            color: sortBy === 'latest' ? 'white' : 'primary.main',
            '&:hover': {
              backgroundColor: sortBy === 'latest' ? 'primary.dark' : 'primary.light',
            },
          }}
        >
          {t('community.filters.latest')}
        </Button>
        <Button
          variant={sortBy === 'popular' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => handleSortChange('popular')}
          sx={{
            backgroundColor: sortBy === 'popular' ? 'primary.main' : 'transparent',
            color: sortBy === 'popular' ? 'white' : 'primary.main',
            '&:hover': {
              backgroundColor: sortBy === 'popular' ? 'primary.dark' : 'primary.light',
            },
          }}
        >
          {t('community.filters.popular')}
        </Button>
        <Button
          variant={sortBy === 'oldest' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => handleSortChange('oldest')}
          sx={{
            backgroundColor: sortBy === 'oldest' ? 'primary.main' : 'transparent',
            color: sortBy === 'oldest' ? 'white' : 'primary.main',
            '&:hover': {
              backgroundColor: sortBy === 'oldest' ? 'primary.dark' : 'primary.light',
            },
          }}
        >
          {t('debate.comment.oldest')}
        </Button>
      </Box>

      {/* 새 댓글 작성 폼 */}
      <Box mb={4}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder={t('community.comments.enterComment')}
          value={newCommentText}
          onChange={e => setNewCommentText(e.target.value)}
          disabled={!user}
          sx={{
            mb: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
          }}
        />
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleSubmitComment}
            disabled={!newCommentText.trim() || !user || submittingComment}
          >
            {submittingComment ? t('common.loading') : t('community.comments.writeComment')}
          </Button>
        </Box>
      </Box>

      {/* 로딩 상태 */}
      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={32} />
        </Box>
      )}

      {/* 댓글 없음 상태 */}
      {!isLoading && comments.length === 0 && (
        <Box py={4} textAlign="center" bgcolor="rgba(255, 255, 255, 0.7)" borderRadius={2}>
          <Typography color="text.secondary">{t('community.comments.noComments')}</Typography>
        </Box>
      )}

      {/* 댓글 목록 */}
      {!isLoading && comments.length > 0 && (
        <List disablePadding>{comments.map(comment => renderCommentCard(comment))}</List>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage + 1} // API는 0부터 시작하지만 UI는 1부터 시작
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* 댓글 수정/삭제 메뉴 */}
      {renderCommentMenu()}

      {/* 신고 다이얼로그 */}
      {reportTarget && (
        <ReportDialog
          open={reportDialogOpen}
          onClose={handleCloseReportDialog}
          targetId={reportTarget.id}
          targetType={reportTarget.type}
          serviceType={'COMMUNITY'}
          reportedUserId={reportTarget.userId}
        />
      )}
    </Box>
  );
};

export default CommentSection;
