import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Comment, Reply, ReactionType } from '../types';
import CommentApi from '../api/CommentApi';

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
    option: 'LIKE' | 'DISLIKE'
  ) => Promise<void>;

  // 추가된 댓글 관련 액션
  addCommentReaction: (
    postId: number,
    commentId: number,
    option: 'LIKE' | 'DISLIKE'
  ) => Promise<void>;
  addReply: (postId: number, commentId: number, content: string) => Promise<void>;
  getCommentReplies: (commentId: number) => Promise<Reply[]>;

  // 액션: 상태 초기화
  resetCommentsState: () => void;

  // 새로 추가된 댓글 관련 액션
  likeComment: (commentId: number) => Promise<void>;
  dislikeComment: (commentId: number) => Promise<void>;
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
          // 문자열과 숫자 타입 불일치 방지를 위해 명시적으로 숫자 변환
          const numericPostId = Number(postId);
          console.log('[DEBUG] 댓글 가져오기 시작:', { postId: numericPostId, storeState: get().comments.length });

          // 댓글 불러오기 중임을 표시
          set({ commentLoading: true, commentError: null });

          // CommentApi를 통해 댓글 데이터 불러오기
          const response = await CommentApi.getComments(numericPostId, 'post', page, size);
          console.log('[DEBUG] 댓글 스토어 - API 응답:', response);
          console.log('[DEBUG] 댓글 스토어 - 댓글 목록:', response.commentList);

          // API 응답 확인
          if (response.commentList && response.commentList.length > 0) {
            console.log('[DEBUG] 댓글 스토어 - 댓글이 존재합니다:', response.commentList.length);
            
            // 댓글 목록 보정 
            // 1. postId가 null인 경우 현재 postId로 채우기
            // 2. isState 값을 myReaction으로 변환 (좋아요 -> LIKE, 싫어요 -> DISLIKE)
            const fixedComments = response.commentList.map(comment => {
              // isState를 myReaction으로 변환
              let myReaction = undefined;
              if (comment.isState === '좋아요') {
                myReaction = 'LIKE';
              } else if (comment.isState === '싫어요') {
                myReaction = 'DISLIKE';
              }
              
              return {
                ...comment,
                postId: comment.postId || numericPostId,
                myReaction: myReaction, // isState 값을 myReaction으로 변환
                likeCount: comment.like,      // like를 likeCount로 복사
                dislikeCount: comment.dislike // dislike를 dislikeCount로 복사 
              };
            });
            
            // 상태 업데이트
            set({
              comments: fixedComments,
              commentLoading: false,
              commentPageInfo: {
                page,
                size,
                totalElements: response.total || 0,
                totalPages: Math.ceil((response.total || 0) / size),
              },
            });
            
            console.log('[DEBUG] 댓글 스토어 - 상태 업데이트 완료:', fixedComments.length);
          } else {
            console.log('[DEBUG] 댓글 스토어 - 댓글이 없습니다');
            set({
              comments: [],
              commentLoading: false,
              commentPageInfo: {
                page,
                size,
                totalElements: response.total || 0,
                totalPages: Math.ceil((response.total || 0) / size),
              },
            });
          }
        } catch (error) {
          console.error('[ERROR] 댓글 조회 실패:', error);
          set({
            commentError: '댓글을 불러오는데 실패했습니다.',
            commentLoading: false,
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
          const newComment = await CommentApi.createComment(postId, 'post', content.trim());

          console.log('[DEBUG] 새 댓글 생성 성공:', {
            commentId: newComment.commentId,
            postId: newComment.postId,
          });

          // 즉시 UI에 새 댓글 반영
          if (newComment) {
            // 새 댓글의 postId가 현재 요청한 postId와 일치하는지 확인
            if (Number(newComment.postId) === Number(postId)) {
              set(state => ({
                comments: [newComment, ...state.comments],
              }));

              console.log('[DEBUG] 댓글 상태 업데이트 완료');
            } else {
              console.warn('[WARN] 생성된 댓글의 postId가 요청한 postId와 일치하지 않음:', {
                requestedPostId: postId,
                returnedPostId: newComment.postId,
              });
            }
          }

          // 댓글 목록 갱신 (백그라운드에서 진행)
          // 문자열과 숫자 타입 불일치 방지를 위해 명시적으로 숫자 변환
          const numericPostId = Number(postId);
          console.log('[DEBUG] 댓글 목록 갱신 시작:', { numericPostId });

          await get().fetchComments(numericPostId);
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
          await CommentApi.updateComment(commentId, commentData.content);
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
          await CommentApi.deleteComment(commentId);
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
      addCommentReaction: async (postId: number, commentId: number, option: 'LIKE' | 'DISLIKE') => {
        try {
          // 백엔드 API 호출 먼저 실행
          const response = await CommentApi.reactToComment(commentId, option);
          
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
          await CommentApi.createReply(commentId, content);
          // 대댓글만 다시 가져오기
          await get().getCommentReplies(commentId);
        } catch (error) {
          console.error('답글 작성 실패:', error);
        }
      },

      getCommentReplies: async (commentId: number) => {
        try {
          const response = await CommentApi.getReplies(commentId);
          // 상태에 저장
          set((state: CommentState) => ({
            replies: {
              ...state.replies,
              [commentId]: response.replyList || [],
            },
          }));
          return response.replyList || [];
        } catch (error) {
          console.error('답글 조회 실패:', error);
          return [];
        }
      },

      // 답글 수정
      updateReply: async (commentId: number, replyId: number, content: string) => {
        try {
          set({ commentLoading: true, commentError: null });
          await CommentApi.updateReply(replyId, content);
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
          await CommentApi.deleteReply(replyId);
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
        option: 'LIKE' | 'DISLIKE'
      ) => {
        try {
          // 백엔드 API 호출 먼저 실행
          const response = await CommentApi.reactToReply(replyId, option);
          
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
                updatedReply.myReaction = 
                  updatedReply.myReaction === option ? undefined : option;

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
          const response = await CommentApi.reactToComment(commentId, 'LIKE');
          
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
          const response = await CommentApi.reactToComment(commentId, 'DISLIKE');
          
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
    }),
    { name: 'comment-store' }
  )
);

export default useCommentStore;
