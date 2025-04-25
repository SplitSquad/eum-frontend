import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Debate, DebateComment, DebateReply, DebateSortOption, ReactionType } from '../types';
import DebateApi, { getTodayIssues, getHotIssue, getBalancedIssue } from '../api/debateApi';
import CommentApi from '../api/commentApi';

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
  loadingTodayIssues: boolean;
  loadingHotIssue: boolean;
  loadingBalancedIssue: boolean;
  todayIssuesError: string | null;
  hotIssueError: string | null;
  balancedIssueError: string | null;
  
  // 액션
  getDebates: (page?: number, size?: number) => Promise<void>;
  getDebateById: (id: number) => Promise<void>;
  getComments: (debateId: number, page?: number, size?: number) => Promise<void>;
  getReplies: (commentId: number, page?: number, size?: number) => Promise<void>;
  createComment: (debateId: number, content: string, stance: 'pro' | 'con') => Promise<void>;
  updateComment: (commentId: number, content: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  createReply: (commentId: number, content: string) => Promise<void>;
  updateReply: (replyId: number, content: string) => Promise<void>;
  deleteReply: (replyId: number) => Promise<void>;
  voteOnDebate: (debateId: number, stance: 'pro' | 'con') => Promise<void>;
  addReaction: (
    targetId: number,
    targetType: 'debate' | 'comment' | 'reply',
    reactionType: ReactionType
  ) => Promise<void>;
  setSortBy: (sortBy: DebateSortOption) => void;
  setFilter: (filter: string) => void;
  resetDebateState: () => void;
  
  // 특별 이슈 관련 액션
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
        loadingTodayIssues: false,
        loadingHotIssue: false,
        loadingBalancedIssue: false,
        todayIssuesError: null,
        hotIssueError: null,
        balancedIssueError: null,
        
        // 액션 구현
        getDebates: async (page = 1, size = 5) => {
          try {
            set({ isLoading: true, error: null });
            
            const response = await DebateApi.getDebates({
              page,
              size,
              sortBy: get().sortBy,
              filter: get().filter
            });
            
            set({
              debates: response.debates,
              totalDebates: response.total,
              totalPages: response.totalPages,
              currentPage: page,
              isLoading: false
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '토론 목록 조회 실패'
            });
          }
        },
        
        getDebateById: async (id) => {
          try {
            set({ isLoading: true, error: null });
            
            const debate = await DebateApi.getDebateById(id);
            
            if (debate) {
              set({
                currentDebate: debate,
                isLoading: false
              });
              
              // 조회수 증가 API 호출 (백엔드에서 동시에 처리될 수도 있음)
              DebateApi.increaseViewCount(id);
            } else {
              throw new Error('토론 주제를 찾을 수 없습니다.');
            }
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '토론 상세 조회 실패'
            });
          }
        },
        
        getComments: async (debateId, page = 1, size = 10) => {
          try {
            set({ isLoading: true, error: null });
            
            const response = await CommentApi.getComments({
              debateId,
              page,
              size,
              sortBy: 'latest'
            });
            
            set({
              comments: response.comments,
              totalComments: response.total,
              commentPages: response.totalPages,
              currentCommentPage: page,
              isLoading: false
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '댓글 목록 조회 실패'
            });
          }
        },
        
        getReplies: async (commentId, page = 1, size = 5) => {
          try {
            const responses = await CommentApi.getReplies({
              commentId,
              page,
              size
            });
            
            // 기존 replies 상태 가져오기
            const currentReplies = get().replies;
            
            // commentId에 해당하는 대댓글 목록 업데이트
            set({
              replies: {
                ...currentReplies,
                [commentId]: responses
              }
            });
          } catch (error) {
            console.error('대댓글 목록 조회 실패:', error);
          }
        },
        
        createComment: async (debateId, content, stance) => {
          try {
            const comment = await CommentApi.createComment({
              debateId,
              content,
              stance
            });
            
            if (comment) {
              // 새 댓글을 목록에 추가
              set(state => ({
                comments: [comment, ...state.comments],
                totalComments: state.totalComments + 1
              }));
              
              // 토론 주제의 댓글 수 업데이트
              const currentDebate = get().currentDebate;
              if (currentDebate && currentDebate.id === debateId) {
                set(state => ({
                  currentDebate: state.currentDebate
                    ? {
                        ...state.currentDebate,
                        commentCount: state.currentDebate.commentCount + 1
                      }
                    : null
                }));
              }
            }
          } catch (error) {
            console.error('댓글 작성 실패:', error);
          }
        },
        
        updateComment: async (commentId, content) => {
          try {
            const success = await CommentApi.updateComment({
              commentId,
              content
            });
            
            if (success) {
              // 댓글 목록에서 해당 댓글 업데이트
              set(state => ({
                comments: state.comments.map(comment =>
                  comment.id === commentId
                    ? { ...comment, content, updatedAt: new Date().toISOString() }
                    : comment
                )
              }));
            }
          } catch (error) {
            console.error('댓글 수정 실패:', error);
          }
        },
        
        deleteComment: async (commentId) => {
          try {
            const success = await CommentApi.deleteComment(commentId);
            
            if (success) {
              // 찾아서 삭제할 댓글 정보
              const commentToDelete = get().comments.find(c => c.id === commentId);
              
              // 댓글 목록에서 해당 댓글 제거
              set(state => ({
                comments: state.comments.filter(comment => comment.id !== commentId),
                totalComments: state.totalComments - 1
              }));
              
              // 토론 주제의 댓글 수 업데이트
              if (get().currentDebate && commentToDelete) {
                set(state => ({
                  currentDebate: state.currentDebate
                    ? {
                        ...state.currentDebate,
                        commentCount: state.currentDebate.commentCount - 1
                      }
                    : null
                }));
              }
              
              // 대댓글 정보도 삭제
              const updatedReplies = { ...get().replies };
              delete updatedReplies[commentId];
              set({ replies: updatedReplies });
            }
          } catch (error) {
            console.error('댓글 삭제 실패:', error);
          }
        },
        
        createReply: async (commentId, content) => {
          try {
            const reply = await CommentApi.createReply({
              commentId,
              content
            });
            
            if (reply) {
              // 기존 replies 상태 가져오기
              const currentReplies = get().replies;
              const commentReplies = currentReplies[commentId] || [];
              
              // 새 대댓글 추가
              set({
                replies: {
                  ...currentReplies,
                  [commentId]: [reply, ...commentReplies]
                }
              });
              
              // 댓글의 대댓글 수 업데이트
              set(state => ({
                comments: state.comments.map(comment =>
                  comment.id === commentId
                    ? { ...comment, replyCount: comment.replyCount + 1 }
                    : comment
                )
              }));
            }
          } catch (error) {
            console.error('대댓글 작성 실패:', error);
          }
        },
        
        updateReply: async (replyId, content) => {
          try {
            const success = await CommentApi.updateReply({
              replyId,
              content
            });
            
            if (success) {
              // 모든 댓글의 대댓글을 확인하며 해당 replyId를 가진 대댓글 업데이트
              const updatedReplies = { ...get().replies };
              
              Object.keys(updatedReplies).forEach(commentId => {
                updatedReplies[parseInt(commentId)] = updatedReplies[parseInt(commentId)].map(
                  reply =>
                    reply.id === replyId
                      ? { ...reply, content, updatedAt: new Date().toISOString() }
                      : reply
                );
              });
              
              set({ replies: updatedReplies });
            }
          } catch (error) {
            console.error('대댓글 수정 실패:', error);
          }
        },
        
        deleteReply: async (replyId) => {
          try {
            const success = await CommentApi.deleteReply(replyId);
            
            if (success) {
              // 어떤 댓글의 대댓글인지 찾기
              let targetCommentId: number | null = null;
              const updatedReplies = { ...get().replies };
              
              Object.keys(updatedReplies).forEach(commentId => {
                const commentIdNum = parseInt(commentId);
                const repliesForComment = updatedReplies[commentIdNum];
                
                if (repliesForComment.some(reply => reply.id === replyId)) {
                  targetCommentId = commentIdNum;
                  updatedReplies[commentIdNum] = repliesForComment.filter(
                    reply => reply.id !== replyId
                  );
                }
              });
              
              if (targetCommentId) {
                set({ replies: updatedReplies });
                
                // 댓글의 대댓글 수 업데이트
                set(state => ({
                  comments: state.comments.map(comment =>
                    comment.id === targetCommentId
                      ? { ...comment, replyCount: Math.max(0, comment.replyCount - 1) }
                      : comment
                  )
                }));
              }
            }
          } catch (error) {
            console.error('대댓글 삭제 실패:', error);
          }
        },
        
        voteOnDebate: async (debateId, stance) => {
          try {
            const success = await DebateApi.voteOnDebate({
              debateId,
              stance
            });
            
            if (success && get().currentDebate) {
              // 투표 결과 반영
              set(state => {
                if (!state.currentDebate) return state;
                
                const updatedDebate = { ...state.currentDebate };
                
                if (stance === 'pro') {
                  updatedDebate.proCount += 1;
                } else {
                  updatedDebate.conCount += 1;
                }
                
                return {
                  currentDebate: updatedDebate
                };
              });
            }
          } catch (error) {
            console.error('투표 실패:', error);
          }
        },
        
        addReaction: async (targetId, targetType, reactionType) => {
          try {
            const success = await DebateApi.addReaction({
              targetId,
              targetType,
              reactionType
            });
            
            if (success) {
              // 타겟 타입에 따라 다른 상태 업데이트
              if (targetType === 'debate' && get().currentDebate?.id === targetId) {
                set(state => {
                  if (!state.currentDebate) return state;
                  
                  const updatedReactions = { ...state.currentDebate.reactions };
                  updatedReactions[reactionType] += 1;
                  
                  return {
                    currentDebate: {
                      ...state.currentDebate,
                      reactions: updatedReactions
                    }
                  };
                });
              } else if (targetType === 'comment') {
                set(state => ({
                  comments: state.comments.map(comment => {
                    if (comment.id === targetId) {
                      const updatedReactions = { ...comment.reactions };
                      updatedReactions[reactionType] += 1;
                      
                      return {
                        ...comment,
                        reactions: updatedReactions
                      };
                    }
                    return comment;
                  })
                }));
              } else if (targetType === 'reply') {
                const updatedReplies = { ...get().replies };
                
                // 모든 댓글의 대댓글을 확인
                Object.keys(updatedReplies).forEach(commentId => {
                  updatedReplies[parseInt(commentId)] = updatedReplies[parseInt(commentId)].map(
                    reply => {
                      if (reply.id === targetId) {
                        const updatedReactions = { ...reply.reactions };
                        updatedReactions[reactionType] += 1;
                        
                        return {
                          ...reply,
                          reactions: updatedReactions
                        };
                      }
                      return reply;
                    }
                  );
                });
                
                set({ replies: updatedReplies });
              }
            }
          } catch (error) {
            console.error('감정표현 추가 실패:', error);
          }
        },
        
        setSortBy: (sortBy) => set({ sortBy }),
        
        setFilter: (filter) => set({ filter }),
        
        resetDebateState: () => set({
          debates: [],
          totalDebates: 0,
          totalPages: 0,
          currentPage: 1,
          currentDebate: null,
          comments: [],
          totalComments: 0,
          commentPages: 0,
          currentCommentPage: 1,
          replies: {},
          error: null
        }),
        
        // 특별 이슈 액션 구현
        fetchTodayIssues: async () => {
          try {
            set({ loadingTodayIssues: true, todayIssuesError: null });
            const issues = await getTodayIssues() as Debate[];
            set({
              todayIssues: issues,
              loadingTodayIssues: false
            });
          } catch (error) {
            set({
              loadingTodayIssues: false,
              todayIssuesError: error instanceof Error ? error.message : '오늘의 이슈를 불러오는데 실패했습니다'
            });
          }
        },
        
        fetchHotIssue: async () => {
          try {
            set({ loadingHotIssue: true, hotIssueError: null });
            const issue = await getHotIssue() as Debate;
            set({
              hotIssue: issue,
              loadingHotIssue: false
            });
          } catch (error) {
            set({
              loadingHotIssue: false,
              hotIssueError: error instanceof Error ? error.message : '핫 이슈를 불러오는데 실패했습니다'
            });
          }
        },
        
        fetchBalancedIssue: async () => {
          try {
            set({ loadingBalancedIssue: true, balancedIssueError: null });
            const issue = await getBalancedIssue() as Debate;
            set({
              balancedIssue: issue,
              loadingBalancedIssue: false
            });
          } catch (error) {
            set({
              loadingBalancedIssue: false,
              balancedIssueError: error instanceof Error ? error.message : '반반 이슈를 불러오는데 실패했습니다'
            });
          }
        },
      }),
      {
        name: 'debate-storage',
        partialize: (state) => ({
          sortBy: state.sortBy,
          filter: state.filter
        })
      }
    )
  )
); 