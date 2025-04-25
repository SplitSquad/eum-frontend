import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Comment, Reply, ReactionType } from '../types/index';
import * as commentApi from '../api/commentApi';

// 댓글 관련 상태 타입
interface CommentState {
  // 댓글 관련 상태
  comments: Comment[];
  commentLoading: boolean;
  commentError: string | null;
  commentPageInfo: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  replies: Record<number, Reply[]>;
}

// 댓글 관련 액션 타입
interface CommentActions {
  // 댓글 관련 액션
  fetchComments: (postId: number, page?: number, size?: number) => Promise<void>;
  createComment: (postId: number, content: string, parentId?: number) => Promise<void>;
  updateComment: (
    commentId: number,
    commentData: { content: string; language: string }
  ) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;

  // 답글(대댓글) 관련
  updateReply: (commentId: number, replyId: number, content: string) => Promise<void>;
  deleteReply: (commentId: number, replyId: number) => Promise<void>;
  reactToReply: (
    postId: number,
    commentId: number,
    replyId: number,
    option: ReactionType
  ) => Promise<void>;

  // 추가된 댓글 관련 액션
  addCommentReaction: (
    postId: number,
    commentId: number,
    option: ReactionType
  ) => Promise<void>;
  addReply: (postId: number, commentId: number, content: string) => Promise<void>;
  getCommentReplies: (commentId: number) => Promise<Reply[]>;

  // 액션: 상태 초기화
  resetCommentsState: () => void;

  // 새로 추가된 댓글 관련 액션
  likeComment: (commentId: number) => Promise<void>;
  dislikeComment: (commentId: number) => Promise<void>;

  // 새로 추가된 답글 관련 액션
  createReply: (postId: number, commentId: number, content: string) => Promise<void>;
}

// 댓글 관련 상태 관리 스토어
export const useCommentStore = create<CommentState & CommentActions>()(
  devtools(
    (set, get) => ({
      // 댓글 관련 상태 초기값
      comments: [],
      commentLoading: false,
      commentError: null,
      commentPageInfo: {
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
      },
      replies: {},

      // 액션: 댓글 관련
      fetchComments: async (postId: number, page: number = 0, size: number = 10) => {
        try {
          set({ commentLoading: true, commentError: null });
          
          // 숫자 타입 검증 및 기본값 적용
          const numericPostId = Number(postId);
          if (isNaN(numericPostId) || numericPostId <= 0) {
            throw new Error('유효하지 않은 게시글 ID');
          }
          
          // API 호출
          const response = await commentApi.CommentApi.getComments(numericPostId, 'post', page, size);
          console.log('[DEBUG] 댓글 불러오기 응답:', response);
          
          // API 에러 체크
          if ('error' in response && response.error) {
            throw new Error(String(response.error));
          }
          
          // 댓글 및 페이지 정보 추출
          const fetchedComments = response.commentList || [];
          const total = response.total || 0;
          
          // 각 댓글에서 필요한 필드 맵핑 및 락 데이터 설정
          const processedComments = fetchedComments.map((comment: any) => {
            // content가 없는 경우 원본 내용으로 대체하거나 기본값 설정
            // 번역 대기 없이 바로 표시하기 위함
            if (!comment.content) {
              comment.content = '[원본 내용을 불러올 수 없습니다.]';
            }
            
            return {
              ...comment,
              // 필수 기본값 설정으로 락 방지
              likeCount: comment.like || 0,
              dislikeCount: comment.dislike || 0,
              replyCount: comment.reply || 0,
              myReaction: comment.isState ? (
                comment.isState === '좋아요' ? 'LIKE' : 
                comment.isState === '싫어요' ? 'DISLIKE' : undefined
              ) : undefined,
              writer: {
                userId: comment.userId || 0,
                nickname: comment.userName || '익명',
                profileImage: comment.userProfileImage || '',
                role: 'USER'
              },
              isLocked: false
            };
          });
          
          // 상태 업데이트
          set({
            comments: processedComments,
            commentPageInfo: {
              page,
              size,
              totalElements: total,
              totalPages: Math.ceil(total / size)
            },
            commentLoading: false
          });
          
          console.log('[DEBUG] 처리된 댓글 상태:', {
            count: processedComments.length,
            total,
            page
          });
          
          // 댓글의 답글 정보도 함께 로드
          // 첫 5개의 댓글에 대해서만 미리 답글 데이터 로드 (성능 최적화)
          const topComments = processedComments.slice(0, 5);
          for (const comment of topComments) {
            if (comment.replyCount > 0) {
              get().getCommentReplies(comment.commentId);
            }
          }
        } catch (error) {
          console.error('[ERROR] 댓글 불러오기 실패:', error);
          set({ 
            commentLoading: false, 
            commentError: error instanceof Error ? error.message : '댓글을 불러오는 중 오류가 발생했습니다.' 
          });
        }
      },

      createComment: async (postId: number, content: string, parentId?: number): Promise<void> => {
        try {
          // 파라미터 유효성 검사
          if (!content || content.trim() === '') {
            console.error('[ERROR] 댓글 내용이 비어있습니다.');
            set({
              commentError: '댓글 내용을 입력해주세요.',
              commentLoading: false,
            });
            return;
          }

          console.log('[DEBUG] 댓글 생성 시작:', {
            postId,
            contentLength: content.length,
            parentId,
          });

          // API 호출 (백엔드 API에 맞게 수정)
          const newComment = await commentApi.CommentApi.createComment(postId, 'post', content.trim());

          console.log('[DEBUG] 새 댓글 생성 성공:', {
            commentId: newComment.commentId,
            postId: newComment.postId,
          });

          // 즉시 UI에 새 댓글 반영 - 누락된 필드 추가해서 정확하게 표시
          if (newComment) {
            const enhancedComment = {
              ...newComment,
              // 필수 필드 보완
              likeCount: newComment.like || 0,
              dislikeCount: newComment.dislike || 0,
              replyCount: newComment.reply || 0,
              content: newComment.content || content.trim(), // 실패하면 원본 사용
              writer: {
                userId: newComment.userId || 0,
                nickname: newComment.userName || '익명',
                profileImage: newComment.userProfileImage || '',
                role: 'USER'
              },
              isLocked: false,
              createdAt: newComment.createdAt || new Date().toISOString(),
            };

            // 새 댓글을 상태에 추가 (맨 위에 추가)
            set(state => ({
              comments: [enhancedComment, ...state.comments],
              // 총 댓글 수 증가
              commentPageInfo: {
                ...state.commentPageInfo,
                totalElements: state.commentPageInfo.totalElements + 1
              }
            }));

            console.log('[DEBUG] 댓글 상태 업데이트 완료');
          } else {
            console.warn('[WARN] 댓글이 생성되었지만 응답 데이터가 없습니다');
          }

          // 백그라운드에서 전체 댓글 목록 갱신 (지연 적용하여 UX 개선)
          setTimeout(() => {
            const numericPostId = Number(postId);
            console.log('[DEBUG] 백그라운드 댓글 목록 갱신 시작');
            get().fetchComments(numericPostId);
          }, 1000);
        } catch (error) {
          console.error('[ERROR] 댓글 생성 실패:', error);
          set({
            commentError: '댓글 작성에 실패했습니다.',
            commentLoading: false,
          });
        }
      },

      updateComment: async (
        commentId: number,
        commentData: { content: string; language: string }
      ) => {
        try {
          set({ commentLoading: true, commentError: null });
          // 백엔드 API에 맞게 수정
          await commentApi.CommentApi.updateComment(commentId, commentData.content);
          set({ commentLoading: false });
        } catch (error) {
          set({
            commentError: '댓글 수정에 실패했습니다.',
            commentLoading: false,
          });
          console.error('댓글 수정 오류:', error);
        }
      },

      deleteComment: async (commentId: number) => {
        try {
          set({ commentLoading: true, commentError: null });
          await commentApi.CommentApi.deleteComment(commentId);
          set({ commentLoading: false });
        } catch (error) {
          set({
            commentError: '댓글 삭제에 실패했습니다.',
            commentLoading: false,
          });
          console.error('댓글 삭제 오류:', error);
        }
      },

      // 새로 추가된 댓글 관련 액션
      addCommentReaction: async (postId: number, commentId: number, option: ReactionType) => {
        try {
          // 백엔드 API 호출 먼저 실행
          const response = await commentApi.CommentApi.reactToComment(commentId, option);
          
          // 로컬 상태 업데이트 (UI 반응성 향상을 위해)
          set((state: CommentState) => {
            const updatedComments = state.comments.map(comment => {
              if (comment.commentId === commentId) {
                const updatedComment = { ...comment };

                // API 응답 결과를 사용하여 좋아요/싫어요 카운트 업데이트
                updatedComment.likeCount = response.like;
                updatedComment.dislikeCount = response.dislike;

                // 현재 반응 상태 업데이트
                // 이전 반응과 같으면 취소, 다르면 새로 설정
                updatedComment.myReaction =
                  updatedComment.myReaction === option ? undefined : option;

                return updatedComment;
              }
              return comment;
            });

            return { comments: updatedComments };
          });

          // 백엔드의 최신 상태 반영을 위한 추가 갱신은 유지 (필요시)
          setTimeout(() => {
            if (postId) {
              get().fetchComments(postId);
            }
          }, 500);
        } catch (error) {
          console.error('댓글 반응 추가 실패:', error);
        }
      },

      addReply: async (postId: number, commentId: number, content: string) => {
        try {
          await commentApi.CommentApi.createReply(postId, commentId, content);
          // 대댓글만 다시 가져오기
          await get().getCommentReplies(commentId);
        } catch (error) {
          console.error('답글 작성 실패:', error);
        }
      },

      getCommentReplies: async (commentId: number): Promise<Reply[]> => {
        try {
          // 이미 로딩 중이거나 데이터가 있는 경우, 중복 요청 방지
          const { replies } = get();
          
          if (replies[commentId] && replies[commentId].length > 0) {
            console.log('[DEBUG] 이미 답글 데이터가 있음, 중복 요청 방지');
            return replies[commentId];
          }
          
          console.log('[DEBUG] 답글 가져오기 시작:', commentId);
          
          // API 호출
          const response = await commentApi.CommentApi.getReplies(commentId);
          console.log('[DEBUG] 답글 API 응답:', response);
          
          // 응답 데이터 처리
          if (response && response.replyList) {
            // 응답 데이터 변환 - 키 이름 변환, 필요 필드 추가
            const processedReplies = response.replyList.map((reply: any) => {
              // content가 없는 경우 기본값 설정 - 번역 대기하지 않고 표시
              if (!reply.content) {
                reply.content = '[원본 내용을 불러올 수 없습니다.]';
              }
              
              return {
                ...reply,
                // 필수 기본값으로 널 방지
                replyId: reply.replyId,
                commentId: reply.commentId || commentId,
                likeCount: reply.like || 0,
                dislikeCount: reply.dislike || 0,
                myReaction: reply.isState ? (
                  reply.isState === '좋아요' ? 'LIKE' : 
                  reply.isState === '싫어요' ? 'DISLIKE' : undefined
                ) : undefined,
                writer: {
                  userId: reply.userId || 0,
                  nickname: reply.userName || '익명',
                  profileImage: '',
                  role: 'USER'
                },
                isLocked: false
              };
            });
            
            // 댓글 ID별 답글 저장소에 추가
            set(state => ({
              replies: {
                ...state.replies,
                [commentId]: processedReplies
              }
            }));
            
            console.log('[DEBUG] 답글 저장 완료:', {
              commentId,
              count: processedReplies.length
            });
            
            return processedReplies;
          }
          
          return [];
        } catch (error) {
          console.error('[ERROR] 답글 조회 실패:', error);
          return [];
        }
      },

      // 답글 수정
      updateReply: async (commentId: number, replyId: number, content: string) => {
        try {
          set({ commentLoading: true, commentError: null });
          await commentApi.CommentApi.updateReply(replyId, content);
          // 같은 commentId에 대한 최신 답글 다시 불러오기
          await get().getCommentReplies(commentId);
          set({ commentLoading: false });
        } catch (error) {
          set({ commentError: '답글 수정에 실패했습니다.', commentLoading: false });
        }
      },

      // 답글 삭제
      deleteReply: async (commentId: number, replyId: number) => {
        try {
          set({ commentLoading: true, commentError: null });
          await commentApi.CommentApi.deleteReply(replyId);
          await get().getCommentReplies(commentId);
          set({ commentLoading: false });
        } catch (error) {
          set({ commentError: '답글 삭제에 실패했습니다.', commentLoading: false });
        }
      },

      // 답글에 반응 추가하기
      reactToReply: async (
        postId: number,
        commentId: number,
        replyId: number,
        option: ReactionType
      ) => {
        try {
          // 백엔드 API 호출 먼저 실행
          const response = await commentApi.CommentApi.reactToReply(replyId, option);
          
          // 로컬 상태 업데이트 (UI 반응성 향상을 위해)
          set((state: CommentState) => {
            const commentReplies = state.replies[commentId] || [];
            const updatedReplies = commentReplies.map(reply => {
              if (reply.replyId === replyId) {
                const updatedReply = { ...reply };

                // API 응답 결과를 사용하여 좋아요/싫어요 카운트 업데이트
                updatedReply.likeCount = response.like;
                updatedReply.dislikeCount = response.dislike;

                // 현재 반응 상태 업데이트
                // 이전 반응과 같으면 취소, 다르면 새로 설정
                updatedReply.myReaction = updatedReply.myReaction === option ? undefined : option;

                return updatedReply;
              }
              return reply;
            });

            return {
              replies: {
                ...state.replies,
                [commentId]: updatedReplies,
              },
            };
          });

          // 백엔드의 최신 상태 반영을 위한 추가 갱신은 유지
          setTimeout(() => {
            get().getCommentReplies(commentId);
          }, 500);
        } catch (error) {
          console.error('답글 반응 추가 실패:', error);
        }
      },

      // 액션: 상태 초기화
      resetCommentsState: () => {
        set({
          comments: [],
          commentLoading: false,
          commentError: null,
          commentPageInfo: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
          },
          replies: {},
        });
      },

      // 새로 추가된 댓글 관련 액션
      likeComment: async (commentId: number) => {
        try {
          set({ commentLoading: true, commentError: null });

          // 실제 API 호출
          const response = await commentApi.CommentApi.reactToComment(commentId, 'LIKE' as ReactionType);
          
          // 댓글 좋아요 후 현재 댓글 업데이트
          const comments = [...get().comments];
          const index = comments.findIndex(c => c.commentId === commentId);
          if (index !== -1) {
            comments[index] = {
              ...comments[index],
              likeCount: response.like,
              dislikeCount: response.dislike,
              myReaction: 'LIKE',
            };
          }

          set({ comments, commentLoading: false });
        } catch (error) {
          set({ commentError: (error as Error).message, commentLoading: false });
        }
      },

      dislikeComment: async (commentId: number) => {
        try {
          set({ commentLoading: true, commentError: null });

          // 실제 API 호출
          const response = await commentApi.CommentApi.reactToComment(commentId, 'DISLIKE' as ReactionType);
          
          // 댓글 싫어요 후 현재 댓글 업데이트
          const comments = [...get().comments];
          const index = comments.findIndex(c => c.commentId === commentId);
          if (index !== -1) {
            comments[index] = {
              ...comments[index],
              likeCount: response.like,
              dislikeCount: response.dislike,
              myReaction: 'DISLIKE',
            };
          }

          set({ comments, commentLoading: false });
        } catch (error) {
          set({ commentError: (error as Error).message, commentLoading: false });
        }
      },

      // 새로 추가된 답글 관련 액션
      createReply: async (postId: number, commentId: number, content: string): Promise<void> => {
        try {
          // 파라미터 유효성 검사
          if (!content || content.trim() === '') {
            console.error('[ERROR] 답글 내용이 비어있습니다.');
            set({
              commentError: '답글 내용을 입력해주세요.',
              commentLoading: false,
            });
            return;
          }

          console.log('[DEBUG] 답글 생성 시작:', {
            postId,
            commentId,
            contentLength: content.length,
          });

          // API 호출
          const newReply = await commentApi.CommentApi.createReply(postId, commentId, content.trim());

          console.log('[DEBUG] 답글 생성 응답:', newReply);

          if (newReply) {
            // 누락될 수 있는 필드를 보완하여 즉시 UI에 반영
            const enhancedReply = {
              ...newReply,
              commentId: newReply.commentId || 0,
              likeCount: newReply.like || 0,
              dislikeCount: newReply.dislike || 0,
              content: newReply.content || content.trim(), // 실패하면 원본 사용
              writer: {
                userId: newReply.userId || 0,
                nickname: newReply.userName || '익명',
                profileImage: newReply.userProfileImage || '',
                role: 'USER'
              },
              isLocked: false,
              createdAt: newReply.createdAt || new Date().toISOString(),
              parentId: commentId
            };

            // 상태 업데이트: 해당 댓글의 답글 목록에 새 답글 추가
            set(state => {
              // 해당 댓글 찾기
              const updatedComments = state.comments.map(comment => {
                if (comment.commentId === commentId) {
                  // 각 댓글에 replies 배열이 없을 수 있으므로 임시 타입 생성
                  type CommentWithReplies = Comment & { replies?: Reply[] };
                  const commentWithReplies = comment as CommentWithReplies;
                  
                  // 해당 댓글의 답글 목록 업데이트
                  const updatedReplies = commentWithReplies.replies 
                    ? [enhancedReply, ...commentWithReplies.replies] 
                    : [enhancedReply];
                  
                  // 답글 개수 증가
                  return {
                    ...comment,
                    replies: updatedReplies,
                    replyCount: (comment.replyCount || 0) + 1
                  } as CommentWithReplies;
                }
                return comment;
              });

              return {
                ...state,
                comments: updatedComments,
              };
            });

            console.log('[DEBUG] 답글 상태 업데이트 완료');
          }

          // 백그라운드에서 전체 댓글 및 답글 목록 갱신 (지연 적용하여 UX 개선)
          setTimeout(() => {
            console.log('[DEBUG] 백그라운드 답글 목록 갱신 시작');
            get().getCommentReplies(commentId);
          }, 1000);
        } catch (error) {
          console.error('[ERROR] 답글 생성 실패:', error);
          set({
            commentError: '답글 작성에 실패했습니다.',
            commentLoading: false,
          });
        }
      },
    }),
    { name: 'comment-store' }
  )
);

export default useCommentStore;
