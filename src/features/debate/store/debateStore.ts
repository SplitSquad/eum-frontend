import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  Debate,
  DebateComment,
  DebateReply,
  DebateSortOption,
  ReactionType,
  DebateReqDto,
} from '../types';
import DebateApi, {
  getTodayIssues,
  getHotIssue,
  getBalancedIssue,
  getSpecialIssues,
} from '../api/debateApi';
import CommentApi from '../api/commentApi';
import { handleApiError } from '../utils/errorHandler';

interface DebateState {
  // 목록 관련 상태
  debates: Debate[];
  totalDebates: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;

  // 필터 및 정렬 상태
  sortBy: DebateSortOption;
  filter: string;
  category: string;
  searchKeyword: string;
  searchBy: string;

  // 상세 조회 관련 상태
  currentDebate: Debate | null;

  // 댓글 관련 상태
  comments: DebateComment[];
  totalComments: number;
  commentPages: number;
  currentCommentPage: number;

  // 대댓글 관련 상태
  replies: Record<number, DebateReply[]>; // commentId를 키로 사용하는 객체

  // 특별 이슈 관련 상태
  todayIssues: Debate[];
  hotIssue: Debate | null;
  balancedIssue: Debate | null;
  loadingSpecialIssues: boolean;
  loadingTodayIssues: boolean;
  loadingHotIssue: boolean;
  loadingBalancedIssue: boolean;
  specialIssuesError: string | null;
  todayIssuesError: string | null;
  hotIssueError: string | null;
  balancedIssueError: string | null;

  // 액션
  getDebates: (page?: number, size?: number, categoryParam?: string) => Promise<void>;
  searchDebates: (
    keyword: string,
    searchBy?: string,
    page?: number,
    size?: number
  ) => Promise<void>;
  getVotedDebates: (userId: number, page?: number, size?: number) => Promise<void>;
  getDebateById: (id: number) => Promise<void>;
  getComments: (debateId: number, page?: number, size?: number) => Promise<void>;
  getReplies: (commentId: number, page?: number, size?: number) => Promise<void>;
  createComment: (debateId: number, content: string, stance?: 'pro' | 'con') => Promise<void>;
  updateComment: (commentId: number, content: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  createReply: (commentId: number, content: string) => Promise<DebateReply | null>;
  updateReply: (replyId: number, content: string) => Promise<boolean>;
  deleteReply: (replyId: number) => Promise<boolean | void>;
  voteOnDebate: (debateId: number, stance: 'pro' | 'con') => Promise<boolean>;
  addReaction: (
    targetId: number,
    targetType: 'debate' | 'comment' | 'reply',
    reactionType: ReactionType
  ) => Promise<boolean>;
  createDebate: (data: DebateReqDto) => Promise<number | null>;
  setSortBy: (sortBy: DebateSortOption) => void;
  setFilter: (filter: string) => void;
  setCategory: (category: string) => void;
  resetSearchFilters: () => void;
  resetDebateState: () => void;

  // 특별 이슈 관련 액션
  fetchSpecialIssues: () => Promise<void>;
  fetchTodayIssues: () => Promise<void>;
  fetchHotIssue: () => Promise<void>;
  fetchBalancedIssue: () => Promise<void>;
}

export const useDebateStore = create<DebateState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        debates: [],
        totalDebates: 0,
        totalPages: 0,
        currentPage: 1,
        isLoading: false,
        error: null,
        sortBy: 'latest',
        filter: 'all',
        category: '',
        searchKeyword: '',
        searchBy: 'title',
        currentDebate: null,
        comments: [],
        totalComments: 0,
        commentPages: 0,
        currentCommentPage: 1,
        replies: {},

        // 특별 이슈 초기 상태
        todayIssues: [],
        hotIssue: null,
        balancedIssue: null,
        loadingSpecialIssues: false,
        loadingTodayIssues: false,
        loadingHotIssue: false,
        loadingBalancedIssue: false,
        specialIssuesError: null,
        todayIssuesError: null,
        hotIssueError: null,
        balancedIssueError: null,

        // 액션 구현
        getDebates: async (page = 1, size = 5, categoryParam) => {
          try {
            set({ isLoading: true, error: null });

            // 카테고리 파라미터가 제공되면 그것을 사용, 아니면 현재 상태의 카테고리 사용
            const category = categoryParam !== undefined ? categoryParam : get().category;

            const response = await DebateApi.getDebates({
              page,
              size,
              sortBy: get().sortBy,
              filter: get().filter,
              category,
            });

            set({
              debates: response.debates,
              totalDebates: response.total,
              totalPages: response.totalPages,
              currentPage: page,
              isLoading: false,
              category,
            });
          } catch (error) {
            const errorMessage = handleApiError(error, '토론 목록 조회에 실패했습니다.', true);
            set({
              isLoading: false,
              error: errorMessage,
            });
          }
        },

        searchDebates: async (keyword, searchBy = 'title', page = 1, size = 5) => {
          try {
            set({ isLoading: true, error: null, searchKeyword: keyword, searchBy });

            const response = await DebateApi.getDebates({
              page,
              size,
              sortBy: get().sortBy,
              category: get().category,
              keyword,
              searchBy,
            });

            set({
              debates: response.debates,
              totalDebates: response.total,
              totalPages: response.totalPages,
              currentPage: page,
              isLoading: false,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '토론 검색 실패',
            });
          }
        },

        getVotedDebates: async (userId, page = 1, size = 5) => {
          try {
            set({ isLoading: true, error: null });

            const response = await DebateApi.getVotedDebates(userId, page, size);

            set({
              debates: response.debates,
              totalDebates: response.total,
              totalPages: response.totalPages,
              currentPage: page,
              isLoading: false,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '투표한 토론 목록 조회 실패',
            });
          }
        },

        getDebateById: async id => {
          try {
            set({ isLoading: true, error: null });

            // includeComments=true로 댓글과 대댓글까지 함께 가져옴
            const debate = await DebateApi.getDebateById(id, true);

            if (debate) {
              // 토론 상세 정보 설정
              set(state => {
                const updateState: Partial<DebateState> = {
                  currentDebate: debate,
                  isLoading: false,
                };

                // 댓글 데이터가 포함되어 있으면 댓글 상태도 업데이트
                if (debate.comments) {
                  updateState.comments = debate.comments;
                  updateState.totalComments =
                    debate.commentOptions?.total || debate.comments.length;
                  updateState.commentPages = debate.commentOptions?.totalPages || 1;
                  updateState.currentCommentPage = debate.commentOptions?.page || 0;
                }

                // 대댓글 데이터가 포함되어 있으면 대댓글 상태도 업데이트
                if (debate.replies) {
                  updateState.replies = debate.replies;
                }

                return updateState;
              });
            } else {
              throw new Error('토론 주제를 찾을 수 없습니다.');
            }
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '토론 상세 조회 실패',
            });
          }
        },

        getComments: async (debateId, page = 1, size = 10) => {
          try {
            set({ isLoading: true, error: null });

            // 사용자의 언어 설정 확인 (localStorage에서 가져오거나 기본값 사용)
            const userLanguage = localStorage.getItem('userLanguage') || 'ko';

            const response = await CommentApi.getComments({
              debateId,
              page,
              size,
              sortBy: 'latest',
              language: userLanguage, // 사용자 언어 설정 추가
            });

            set({
              comments: response.comments,
              totalComments: response.total,
              commentPages: response.totalPages,
              currentCommentPage: page,
              isLoading: false,
            });

            // 댓글 로드 후 각 댓글의 답글도 바로 로드 (비동기로 처리)
            if (response.comments && response.comments.length > 0) {
              response.comments.forEach(async comment => {
                if (comment.replyCount > 0) {
                  // 각 댓글에 대한 답글을 미리 로드
                  get().getReplies(comment.id);
                }
              });
            }
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '댓글 목록 조회 실패',
            });
          }
        },

        getReplies: async (commentId, page = 1, size = 5) => {
          try {
            // 이미 대댓글이 로드되었는지 확인
            const currentReplies = get().replies || {};
            const hasReplies = currentReplies[commentId] && currentReplies[commentId].length > 0;

            // 이미 대댓글이 있는 경우 중복 요청 방지
            if (hasReplies) {
              console.log(`댓글 ID ${commentId}의 대댓글이 이미 로드되어 있어 요청 생략`);
              return;
            }

            set({ isLoading: true, error: null });

            // 대댓글 가져오기
            const responses = await CommentApi.getReplies({
              commentId,
              page,
              size,
            });

            if (responses) {
              set(state => {
                // 기존 replies 객체 복사
                const updatedReplies = { ...state.replies };

                // 해당 댓글의 대댓글 목록 설정
                updatedReplies[commentId] = responses;

                return {
                  replies: updatedReplies,
                  isLoading: false,
                };
              });
            }
          } catch (error) {
            console.error(`대댓글 로드 실패 (댓글 ID: ${commentId}):`, error);
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '대댓글 로드 실패',
            });
          }
        },

        createComment: async (debateId, content, stance) => {
          try {
            set({ isLoading: true, error: null });

            // 즉시 UI에 댓글 추가 (사용자가 작성한 원문)
            const tempComment: DebateComment = {
              id: -Date.now(), // 임시 ID (음수로 설정하여 실제 ID와 충돌 방지)
              debateId,
              userId: 0, // 실제 userId는 백엔드에서 설정됨
              userName: localStorage.getItem('userName') || '사용자',
              content, // 사용자가 작성한 원문 그대로 표시
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              stance: stance || 'pro',
              replyCount: 0,
              reactions: {
                like: 0,
                dislike: 0,
                happy: 0,
                angry: 0,
                sad: 0,
                unsure: 0,
              },
            };

            // 즉시 UI에 임시 댓글 추가
            set(state => ({
              comments: [tempComment, ...state.comments],
              totalComments: state.totalComments + 1,
              isLoading: false,
            }));

            // 백엔드 API 호출
            const comment = await CommentApi.createComment({
              debateId,
              content,
              stance,
            });

            if (comment) {
              // 임시 댓글을 실제 댓글로 교체
              set(state => {
                const updatedComments = state.comments.map(c =>
                  c.id === tempComment.id ? comment : c
                );

                // 임시 댓글이 목록에 없으면 추가
                if (!updatedComments.some(c => c.id === comment.id)) {
                  updatedComments.unshift(comment);
                }

                // 현재 토론에 댓글 수 업데이트
                const updatedCurrentDebate = state.currentDebate
                  ? {
                      ...state.currentDebate,
                      commentCount: state.currentDebate.commentCount + 1,
                    }
                  : null;

                return {
                  comments: updatedComments,
                  totalComments: state.totalComments,
                  currentDebate: updatedCurrentDebate,
                  isLoading: false,
                };
              });
            }
          } catch (error) {
            console.error('댓글 작성 실패:', error);
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '댓글 작성 실패',
            });

            // 에러가 발생해도 UI에 표시된 임시 댓글은 유지
          }
        },

        updateComment: async (commentId, content) => {
          try {
            set({ isLoading: true, error: null });

            const success = await CommentApi.updateComment(commentId, content);

            if (success) {
              // 성공 시 댓글 목록 업데이트
              set(state => {
                const updatedComments = state.comments.map(comment =>
                  comment.id === commentId ? { ...comment, content } : comment
                );

                return {
                  comments: updatedComments,
                  isLoading: false,
                };
              });
            } else {
              throw new Error('댓글 수정에 실패했습니다.');
            }
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '댓글 수정 실패',
            });
          }
        },

        deleteComment: async commentId => {
          try {
            set({ isLoading: true, error: null });

            const success = await CommentApi.deleteComment(commentId);

            if (success) {
              // 성공 시 댓글 목록 및 관련 정보 업데이트
              set(state => {
                // 해당 댓글을 찾아 댓글 수 업데이트에 사용
                const commentToDelete = state.comments.find(c => c.id === commentId);

                // 현재 토론에 댓글 수 업데이트
                const updatedCurrentDebate =
                  state.currentDebate && commentToDelete
                    ? {
                        ...state.currentDebate,
                        commentCount: Math.max(0, state.currentDebate.commentCount - 1),
                      }
                    : state.currentDebate;

                return {
                  comments: state.comments.filter(comment => comment.id !== commentId),
                  totalComments: Math.max(0, state.totalComments - 1),
                  currentDebate: updatedCurrentDebate,
                  isLoading: false,
                };
              });
            } else {
              throw new Error('댓글 삭제에 실패했습니다.');
            }
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '댓글 삭제 실패',
            });
          }
        },

        createReply: async (commentId, content) => {
          try {
            set({ isLoading: true, error: null });

            // 즉시 UI에 대댓글 추가 (사용자가 작성한 원문)
            const tempReply: DebateReply = {
              id: -Date.now(), // 임시 ID (음수로 설정하여 실제 ID와 충돌 방지)
              commentId,
              userId: 0, // 실제 userId는 백엔드에서 설정됨
              userName: localStorage.getItem('userName') || '사용자',
              content, // 사용자가 작성한 원문 그대로 표시
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              reactions: {
                like: 0,
                dislike: 0,
                happy: 0,
                angry: 0,
                sad: 0,
                unsure: 0,
              },
            };

            // 기존 replies 상태 가져오기
            const currentReplies = get().replies;

            // 해당 댓글의 대댓글 목록 업데이트
            const existingReplies = currentReplies[commentId] || [];

            // 댓글 목록에서 해당 댓글의 대댓글 수 업데이트
            const updatedComments = get().comments.map(comment =>
              comment.id === commentId
                ? { ...comment, replyCount: comment.replyCount + 1 }
                : comment
            );

            // 즉시 UI에 임시 대댓글 추가
            set({
              replies: {
                ...currentReplies,
                [commentId]: [tempReply, ...existingReplies],
              },
              comments: updatedComments,
              isLoading: false,
            });

            try {
              // 백엔드 API 호출
              const reply = await CommentApi.createReply(commentId, content);

              if (reply) {
                // 임시 대댓글을 실제 대댓글로 교체
                const updatedReplies = { ...get().replies };

                if (updatedReplies[commentId]) {
                  updatedReplies[commentId] = updatedReplies[commentId].map(r =>
                    r.id === tempReply.id ? reply : r
                  );

                  // 임시 대댓글이 목록에 없으면 추가
                  if (!updatedReplies[commentId].some(r => r.id === reply.id)) {
                    updatedReplies[commentId].unshift(reply);
                  }
                }

                set({
                  replies: updatedReplies,
                  isLoading: false,
                });

                return reply; // 성공 시 응답 반환
              }

              return null; // API 호출은 성공했지만 응답이 없는 경우
            } catch (apiError) {
              console.error('대댓글 API 호출 실패:', apiError);

              // API 호출 실패 시에도 낙관적 UI 업데이트는 유지
              // 에러 상태 설정
              set({
                error: apiError instanceof Error ? apiError.message : '대댓글 작성 실패',
                isLoading: false,
              });

              throw apiError; // 에러를 다시 던져서 호출자가 처리할 수 있게 함
            }
          } catch (error) {
            console.error('대댓글 작성 실패:', error);
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '대댓글 작성 실패',
            });

            // 에러를 다시 던져서 호출자가 처리할 수 있게 함
            throw error;
          }
        },

        updateReply: async (replyId, content) => {
          try {
            // set({ isLoading: true, error: null }); - 불필요한 전역 상태 업데이트 제거

            const success = await CommentApi.updateReply(replyId, content);

            if (success) {
              // 기존 replies 상태 가져오기
              const currentReplies = get().replies;

              // 해당 replyId를 가진 대댓글이 어떤 commentId에 속하는지 찾기
              let targetCommentId: number | null = null;

              // 주의: 여기서 상태를 변경하지 않고 먼저 필요한 정보만 찾습니다
              for (const [commentId, replies] of Object.entries(currentReplies)) {
                const replyIndex = replies.findIndex(reply => reply.id === replyId);

                if (replyIndex !== -1) {
                  targetCommentId = Number(commentId);
                  break;
                }
              }

              // 이제 찾은 정보를 바탕으로 한 번만 상태 업데이트
              if (targetCommentId) {
                const updatedReplies = { ...currentReplies };
                const replies = [...updatedReplies[targetCommentId]];
                const replyIndex = replies.findIndex(reply => reply.id === replyId);

                if (replyIndex !== -1) {
                  replies[replyIndex] = {
                    ...replies[replyIndex],
                    content,
                    updatedAt: new Date().toISOString(), // 업데이트 시간 갱신
                  };

                  updatedReplies[targetCommentId] = replies;

                  // 상태 업데이트를 한 번만 수행
                  set({
                    replies: updatedReplies,
                    // isLoading: false - 불필요한 상태 업데이트 제거
                  });
                }
              }

              return true;
            } else {
              throw new Error('대댓글 수정에 실패했습니다.');
            }
          } catch (error) {
            // 최소한의 오류 상태만 업데이트
            console.error('대댓글 수정 실패:', error);
            // set({
            //   isLoading: false,
            //   error: error instanceof Error ? error.message : '대댓글 수정 실패'
            // });
            return false;
          }
        },

        deleteReply: async replyId => {
          try {
            // set({ isLoading: true, error: null }); - 불필요한 전역 상태 업데이트 제거

            const success = await CommentApi.deleteReply(replyId);

            if (success) {
              // 기존 replies 상태 가져오기
              const currentReplies = get().replies;

              // 해당 replyId를 가진 대댓글이 어떤 commentId에 속하는지 찾기
              let targetCommentId: number | null = null;

              // 먼저 필요한 정보만 찾음
              for (const [commentId, replies] of Object.entries(currentReplies)) {
                if (replies.some(reply => reply.id === replyId)) {
                  targetCommentId = Number(commentId);
                  break;
                }
              }

              // 상태 업데이트를 한 번만 수행
              if (targetCommentId) {
                const updatedReplies = { ...currentReplies };
                updatedReplies[targetCommentId] = currentReplies[targetCommentId].filter(
                  reply => reply.id !== replyId
                );

                // 댓글 목록에서 해당 댓글의 대댓글 수 업데이트
                const comments = [...get().comments];
                const commentIndex = comments.findIndex(c => c.id === targetCommentId);

                if (commentIndex !== -1) {
                  const updatedComment = {
                    ...comments[commentIndex],
                    replyCount: Math.max(0, comments[commentIndex].replyCount - 1),
                  };
                  comments[commentIndex] = updatedComment;

                  // 한 번에 모든 상태 업데이트
                  set({
                    replies: updatedReplies,
                    comments,
                    // isLoading: false - 불필요한 상태 업데이트 제거
                  });
                } else {
                  // 댓글을 찾지 못한 경우 답글만 업데이트
                  set({
                    replies: updatedReplies,
                    // isLoading: false - 불필요한 상태 업데이트 제거
                  });
                }
              }

              return true;
            } else {
              throw new Error('대댓글 삭제에 실패했습니다.');
            }
          } catch (error) {
            // 최소한의 오류 상태만 업데이트
            console.error('대댓글 삭제 실패:', error);
            // set({
            //   isLoading: false,
            //   error: error instanceof Error ? error.message : '대댓글 삭제 실패'
            // });
            return false;
          }
        },

        voteOnDebate: async (debateId, stance) => {
          try {
            set({ isLoading: true, error: null });

            const success = await DebateApi.voteOnDebate({ debateId, stance });

            if (success) {
              // 토론 상세 데이터를 다시 불러와서 투표 결과 반영
              const debate = await DebateApi.getDebateById(debateId);

              if (debate) {
                set({
                  currentDebate: debate,
                  isLoading: false,
                });
                return true;
              } else {
                throw new Error('투표 후 토론 데이터 갱신에 실패했습니다.');
              }
            } else {
              throw new Error('투표에 실패했습니다.');
            }
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '투표 실패',
            });
            return false;
          }
        },

        addReaction: async (targetId, targetType, reactionType) => {
          try {
            set({ isLoading: true, error: null });

            let success = false;

            // 타겟 타입에 따라 다른 API 호출
            if (targetType === 'debate') {
              success = await DebateApi.addReaction({ targetId, targetType, reactionType });

              if (success && get().currentDebate?.id === targetId) {
                // 토론 상세 데이터를 다시 불러와서 반응 결과 반영
                const debate = await DebateApi.getDebateById(targetId);

                if (debate) {
                  set({
                    currentDebate: debate,
                    isLoading: false,
                  });
                  return true;
                }
              }
            } else if (targetType === 'comment') {
              success = await CommentApi.reactToComment(targetId, reactionType);

              if (success) {
                // 댓글 목록을 다시 불러와서 반응 결과 반영
                const currentDebate = get().currentDebate;
                if (currentDebate) {
                  await get().getComments(currentDebate.id, get().currentCommentPage);
                  return true;
                }
              }
            } else if (targetType === 'reply') {
              success = await CommentApi.reactToReply(targetId, reactionType);

              // 대댓글 목록 갱신은 복잡하므로 여기서는 생략
              if (success) {
                return true;
              }
            }

            set({ isLoading: false });

            if (!success) {
              throw new Error('감정표현 추가에 실패했습니다.');
            }

            return false;
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '감정표현 추가 실패',
            });
            return false;
          }
        },

        createDebate: async data => {
          try {
            set({ isLoading: true, error: null });

            const newDebateId = await DebateApi.createDebate(data);

            set({ isLoading: false });

            return newDebateId;
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '토론 주제 작성 실패',
            });
            return null;
          }
        },

        setSortBy: sortBy => {
          set({ sortBy });
          // 정렬 방식이 변경되면 현재 페이지에서 데이터를 다시 불러옴
          get().getDebates(1);
        },

        setFilter: filter => {
          set({ filter });
          // 필터가 변경되면 첫 페이지부터 데이터를 다시 불러옴
          get().getDebates(1);
        },

        setCategory: category => {
          set({ category });
          // 카테고리가 변경되면 첫 페이지부터 데이터를 다시 불러옴
          get().getDebates(1);
        },

        resetSearchFilters: () => {
          set({
            searchKeyword: '',
            searchBy: 'title',
            sortBy: 'latest',
            filter: 'all',
            category: '',
          });
          // 첫 페이지부터 데이터를 다시 불러옴
          get().getDebates(1);
        },

        resetDebateState: () => {
          set({
            currentDebate: null,
            comments: [],
            totalComments: 0,
            commentPages: 0,
            currentCommentPage: 1,
            replies: {},
          });
        },

        // 특별 이슈 관련 액션 구현
        fetchSpecialIssues: async () => {
          try {
            set({
              loadingSpecialIssues: true,
              specialIssuesError: null,
              loadingTodayIssues: true,
              loadingHotIssue: true,
              loadingBalancedIssue: true,
            });

            const result = await getSpecialIssues();
            console.log('store에서 받은 특별 이슈 데이터:', result);

            set({
              todayIssues: result.todayIssues || [],
              hotIssue: result.hotIssue,
              balancedIssue: result.balancedIssue,
              loadingSpecialIssues: false,
              loadingTodayIssues: false,
              loadingHotIssue: false,
              loadingBalancedIssue: false,
            });

            console.log('store에 설정된 todayIssues:', get().todayIssues);
            console.log('store에 설정된 hotIssue:', get().hotIssue);
            console.log('store에 설정된 balancedIssue:', get().balancedIssue);
          } catch (error) {
            const errorMessage = handleApiError(error, '특별 이슈 조회에 실패했습니다.', true);
            set({
              loadingSpecialIssues: false,
              loadingTodayIssues: false,
              loadingHotIssue: false,
              loadingBalancedIssue: false,
              specialIssuesError: errorMessage,
              todayIssuesError: errorMessage,
              hotIssueError: errorMessage,
              balancedIssueError: errorMessage,
            });
          }
        },

        fetchTodayIssues: async () => {
          try {
            set({ loadingTodayIssues: true, todayIssuesError: null });

            const issues = await getTodayIssues();

            set({
              todayIssues: issues,
              loadingTodayIssues: false,
            });
          } catch (error) {
            const errorMessage = handleApiError(error, '오늘의 이슈 조회에 실패했습니다.', true);
            set({ loadingTodayIssues: false, todayIssuesError: errorMessage });
          }
        },

        fetchHotIssue: async () => {
          try {
            set({ loadingHotIssue: true, hotIssueError: null });

            const issue = await getHotIssue();

            set({
              hotIssue: issue,
              loadingHotIssue: false,
            });
          } catch (error) {
            const errorMessage = handleApiError(error, '인기 이슈 조회에 실패했습니다.', true);
            set({ loadingHotIssue: false, hotIssueError: errorMessage });
          }
        },

        fetchBalancedIssue: async () => {
          try {
            set({ loadingBalancedIssue: true, balancedIssueError: null });

            const issue = await getBalancedIssue();

            set({
              balancedIssue: issue,
              loadingBalancedIssue: false,
            });
          } catch (error) {
            const errorMessage = handleApiError(error, '균형 이슈 조회에 실패했습니다.', true);
            set({ loadingBalancedIssue: false, balancedIssueError: errorMessage });
          }
        },
      }),
      {
        name: 'debate-store',
        // 영구 저장하지 않을 상태 지정
        partialize: state => ({
          sortBy: state.sortBy,
          filter: state.filter,
          category: state.category,
        }),
      }
    )
  )
);
