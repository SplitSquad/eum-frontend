import apiClient from './apiClient';
import { AxiosError } from 'axios';
import axios from 'axios';
import {
  Debate,
  DebateListResponse,
  DebateSortOption,
  ReactionRequest,
  VoteRequest,
  DebateReqDto,
  VoteReqDto,
  mapDebateResToFrontend,
  DebateResDto,
  ReactionType,
} from '../types';

/**
 * 토론 관련 API
 */
const DebateApi = {
  /**
   * 토론 주제 목록 조회 (페이징, 필터링, 정렬)
   */
  getDebates: async (params: {
    page?: number;
    size?: number;
    sortBy?: DebateSortOption;
    filter?: string;
    category?: string;
    keyword?: string;
    searchBy?: string;
  }): Promise<DebateListResponse> => {
    try {
      // 실제 API 연동
      const {
        page = 1,
        size = 5,
        sortBy = 'latest',
        category = '',
        keyword = '',
        searchBy = '',
      } = params;

      // 정렬 방식 매핑
      let sort = '';
      switch (sortBy) {
        case 'latest':
          sort = 'newest';
          break;
        case 'popular':
          sort = 'popular';
          break;
        case 'controversial':
          sort = 'controversial';
          break;
        default:
          sort = 'newest';
      }

      // 디버깅을 위한 상세 로깅
      console.log('API 요청 파라미터:', {
        page,
        size,
        sort,
        category: category || '전체',
        keyword,
        searchBy,
      });

      // 검색 조건이 있으면 search API 사용, 아니면 일반 목록 API 사용
      let response;
      if (keyword && keyword.trim() !== '') {
        response = await apiClient.get<any>(`/debate/search`, {
          params: {
            page: page - 1, // Spring Boot는 0부터 시작하는 페이지 인덱스 사용
            size,
            sort,
            category: category || '전체',
            keyword,
            searchBy,
          },
        });
      } else {
        response = await apiClient.get<any>(`/debate`, {
          params: {
            page: page - 1, // Spring Boot는 0부터 시작하는 페이지 인덱스 사용
            size,
            sort,
            category: category || '전체',
          },
        });
      }

      console.log('원본 응답 데이터:', response); // 디버깅용 로그

      // 응답이 없거나 유효하지 않은 경우 빈 결과 반환
      if (!response) {
        console.warn('API 응답이 없습니다.');
        return { debates: [], total: 0, totalPages: 0 };
      }

      // 응답 데이터 변환 - response.data가 없는 경우 response 자체를 사용
      const responseData = response.data !== undefined ? response.data : response;

      // responseData가 없는 경우 빈 결과 반환
      if (!responseData) {
        console.warn('API 응답 데이터가 없습니다.');
        return { debates: [], total: 0, totalPages: 0 };
      }

      console.log('처리할 응답 데이터:', responseData);

      // Spring Data JPA Page 형식의 응답 (content 배열 포함)
      if (responseData.content && Array.isArray(responseData.content)) {
        const debates = responseData.content.map((item: DebateResDto) => {
          const debate = mapDebateResToFrontend(item);

          // 카테고리 정보 유지 (중요: 항상 카테고리 정보를 유지해야 필터링 가능)
          if (item.category) {
            debate.category = item.category;
          }

          // nationPercent 필드가 있는 경우 countryStats로 변환
          if (item.nationPercent && typeof item.nationPercent === 'object') {
            const countryStats = Object.entries(item.nationPercent).map(
              ([countryCode, percentage]) => {
                // 국가 코드에서 국가명 추출 (간단한 매핑)
                let countryName = countryCode;
                if (countryCode === 'KR') countryName = '대한민국';
                else if (countryCode === 'US') countryName = '미국';
                else if (countryCode === 'JP') countryName = '일본';
                else if (countryCode === 'CN') countryName = '중국';

                return {
                  countryCode,
                  countryName,
                  count: Math.round(((percentage as number) / 100) * (item.voteCnt || 0)),
                  percentage: percentage as number,
                };
              }
            );

            debate.countryStats = countryStats;
          }

          return debate;
        });

        console.log(
          '변환된 debates 목록:',
          debates.map((d: Debate) => ({ id: d.id, title: d.title, category: d.category }))
        );

        return {
          debates,
          total: responseData.totalElements || 0,
          totalPages: responseData.totalPages || 0,
        };
      }
      // {total: number, debateList: Array} 형식의 응답 (빈 배열 포함)
      else if ('total' in responseData && 'debateList' in responseData) {
        // debateList가 있고 배열인 경우
        if (Array.isArray(responseData.debateList)) {
          const debates = responseData.debateList.map((item: DebateResDto) => {
            const debate = mapDebateResToFrontend(item);

            // 카테고리 정보 유지 (중요: 항상 카테고리 정보를 유지해야 필터링 가능)
            if (item.category) {
              debate.category = item.category;
            }

            // nationPercent 필드가 있는 경우 countryStats로 변환
            if (item.nationPercent && typeof item.nationPercent === 'object') {
              const countryStats = Object.entries(item.nationPercent).map(
                ([countryCode, percentage]) => {
                  // 국가 코드에서 국가명 추출 (간단한 매핑)
                  let countryName = countryCode;
                  if (countryCode === 'KR') countryName = '대한민국';
                  else if (countryCode === 'US') countryName = '미국';
                  else if (countryCode === 'JP') countryName = '일본';
                  else if (countryCode === 'CN') countryName = '중국';

                  return {
                    countryCode,
                    countryName,
                    count: Math.round(((percentage as number) / 100) * (item.voteCnt || 0)),
                    percentage: percentage as number,
                  };
                }
              );

              debate.countryStats = countryStats;
            }

            return debate;
          });

          console.log(
            '변환된 debates 목록:',
            debates.map((d: Debate) => ({ id: d.id, title: d.title, category: d.category }))
          );

          const totalPages = Math.ceil(responseData.total / size);

          return {
            debates,
            total: responseData.total || 0,
            totalPages,
          };
        }
        // debateList가 없거나 빈 배열인 경우
        else {
          return {
            debates: [],
            total: responseData.total || 0,
            totalPages: Math.ceil((responseData.total || 0) / size),
          };
        }
      }
      // 직접 배열이 반환된 경우
      else if (Array.isArray(responseData)) {
        const debates = responseData.map((item: DebateResDto) => {
          const debate = mapDebateResToFrontend(item);
          // 카테고리 정보 유지
          if (item.category) {
            debate.category = item.category;
          }
          return debate;
        });

        return {
          debates,
          total: debates.length,
          totalPages: Math.ceil(debates.length / size),
        };
      }
      // 기타 예상치 못한 응답 형식
      else {
        console.warn('처리할 수 없는 응답 형식:', responseData);
        return {
          debates: [],
          total: 0,
          totalPages: 0,
        };
      }
    } catch (error) {
      console.error('토론 목록 조회 실패:', error);
      // 에러 발생 시 빈 결과 반환
      return {
        debates: [],
        total: 0,
        totalPages: 0,
      };
    }
  },

  /**
   * 토론 주제 상세 조회 (댓글 및 답글 포함)
   */
  getDebateById: async (
    debateId: number,
    includeComments: boolean = true
  ): Promise<Debate | null> => {
    try {
      // 실제 API 연동
      const response = await apiClient.get<any>(`/debate/${debateId}`);
      console.log(`토론 주제 상세 조회 응답 (ID: ${debateId}):`, response);

      if (response) {
        const data = response.data || response;
        console.log(`토론 주제 상세 원본 데이터:`, data);

        if (data) {
          // 기본 데이터를 프론트엔드 형식으로 변환
          const debate = mapDebateResToFrontend(data);

          // nationPercent 필드가 있는 경우 countryStats로 변환
          if (data.nationPercent && typeof data.nationPercent === 'object') {
            console.log('nationPercent 발견:', data.nationPercent);

            const countryStats = Object.entries(data.nationPercent).map(
              ([countryCode, percentage]) => {
                // 국가 코드에서 국가명 추출 (간단한 매핑)
                let countryName = countryCode;
                if (countryCode === 'KR') countryName = '대한민국';
                else if (countryCode === 'US') countryName = '미국';
                else if (countryCode === 'JP') countryName = '일본';
                else if (countryCode === 'CN') countryName = '중국';

                return {
                  countryCode,
                  countryName,
                  count: Math.round(((percentage as number) / 100) * (data.voteCnt || 0)),
                  percentage: percentage as number,
                };
              }
            );

            debate.countryStats = countryStats;
            console.log('countryStats로 변환됨:', countryStats);
          }

          // 댓글과 답글을 함께 가져오기 (includeComments 옵션이 true인 경우)
          if (includeComments) {
            try {
              console.log(`토론 ID ${debateId}의 댓글 및 답글 함께 가져오기 시작`);

              // 댓글 목록 가져오기 (첫 페이지, 최신순)
              const commentsResponse = await apiClient.get<any>(`/debate/comment`, {
                params: {
                  debateId: debateId,
                  sort: 'newest',
                  page: 0,
                  size: 10,
                },
              });

              if (commentsResponse && commentsResponse.commentList) {
                console.log(`댓글 ${commentsResponse.commentList.length}개 로드됨`);

                // 댓글 데이터 처리
                const comments = commentsResponse.commentList.map((comment: any) => {
                  // 서버에서 제공하는 isState 값을 myReaction으로 변환
                  const myReaction = convertIsStateToMyReaction(comment.isState);
                  
                  // API 응답에서 userID 추출 시도
                  const userId = comment.userId || 0;
                  
                  // 디버그 로그 추가
                  console.log(`[DEBUG] 댓글 원본 ID: ${comment.commentId}, API에서 받은 userId: ${userId}, userName: ${comment.userName}`);

                  return {
                    id: comment.commentId,
                    debateId: debateId,
                    userId: userId,
                    userName: comment.userName || '익명',
                    userProfileImage: comment.userProfileImage,
                    content: comment.content || '',
                    createdAt: comment.createdAt || new Date().toISOString(),
                    reactions: {
                      like: comment.like || 0,
                      dislike: comment.dislike || 0,
                      happy: 0, // 백엔드에 없음
                      angry: 0, // 백엔드에 없음
                      sad: 0, // 백엔드에 없음
                      unsure: 0, // 백엔드에 없음
                    },
                    // 사용자의 반응 상태 저장
                    myReaction: myReaction,
                    replyCount: comment.reply || 0,
                    stance: 'pro', // 기본값
                  };
                });

                // 댓글 ID 목록 추출
                const commentIds = comments.map((c: any) => c.id);

                // 답글이 있는 댓글에 대해 답글 미리 로드
                const repliesMap: Record<number, any[]> = {};

                // 답글이 있는 댓글만 필터링
                const commentsWithReplies = comments.filter((c: any) => c.replyCount > 0);

                // 각 댓글에 대한 답글 가져오기
                if (commentsWithReplies.length > 0) {
                  console.log(`${commentsWithReplies.length}개 댓글에 대한 답글 로드 시작`);

                  // 병렬로 모든 댓글의 답글 가져오기
                  await Promise.all(
                    commentsWithReplies.map(async (comment: any) => {
                      try {
                        const replyResponse = await apiClient.get<any>(`/debate/reply`, {
                          params: { commentId: comment.id },
                        });

                        if (
                          replyResponse &&
                          replyResponse.replyList &&
                          Array.isArray(replyResponse.replyList)
                        ) {
                          // 답글 데이터 변환 및 저장
                          repliesMap[comment.id] = replyResponse.replyList.map((reply: any) => {
                            // 서버에서 제공하는 isState 값을 myReaction으로 변환
                            const myReaction = convertIsStateToMyReaction(reply.isState);
                            
                            // API 응답에서 userID 추출 시도
                            const userId = reply.userId || 0;
                            
                            // 디버그 로그 추가
                            console.log(`[DEBUG] 답글 원본 ID: ${reply.replyId}, API에서 받은 userId: ${userId}, userName: ${reply.userName}`);

                            return {
                              id: reply.replyId,
                              commentId: comment.id,
                              userId: userId,
                              userName: reply.userName || '익명',
                              userProfileImage: reply.userProfileImage,
                              content: reply.content || '',
                              createdAt: reply.createdAt || new Date().toISOString(),
                              reactions: {
                                like: reply.like || 0,
                                dislike: reply.dislike || 0,
                                happy: 0, // 백엔드에 없음
                                angry: 0, // 백엔드에 없음
                                sad: 0, // 백엔드에 없음
                                unsure: 0, // 백엔드에 없음
                              },
                              // 사용자의 반응 상태 저장
                              myReaction: myReaction,
                            };
                          });
                        }
                      } catch (replyError) {
                        console.error(`댓글 ID ${comment.id}의 답글 로드 실패:`, replyError);
                      }
                    })
                  );

                  console.log(`모든 답글 로드 완료:`, Object.keys(repliesMap).length);
                }

                // 토론에 댓글 및 답글 데이터 추가
                debate.comments = comments;
                debate.replies = repliesMap;
                debate.commentOptions = {
                  total: commentsResponse.total || comments.length,
                  page: 0,
                  totalPages: Math.ceil((commentsResponse.total || comments.length) / 10),
                };

                console.log(`토론에 댓글 ${comments.length}개와 답글이 추가됨`);
              }
            } catch (commentError) {
              console.error(`댓글 로드 중 오류 발생:`, commentError);
              // 댓글 로드 실패해도 토론 데이터는 반환
            }
          }

          return debate;
        }
      }

      console.warn('토론 주제를 찾을 수 없습니다.');
      return null;
    } catch (error) {
      console.error(`토론 주제 조회 실패 (ID: ${debateId}):`, error);
      return null;
    }
  },

  /**
   * 조회수 증가 (백엔드에서 자동 처리됨)
   */
  increaseViewCount: async (debateId: number): Promise<void> => {
    // 백엔드에서 자동으로 조회수 증가 처리하므로 별도 API 호출 불필요
    console.log(`토론 ID:${debateId} 조회수 증가 - 백엔드에서 자동 처리됨`);
  },

  /**
   * 찬반 투표하기
   */
  voteOnDebate: async (voteRequest: VoteRequest): Promise<any> => {
    try {
      // 백엔드 API 요청 형식으로 변환
      const requestData: VoteReqDto = {
        debateId: voteRequest.debateId,
        option: voteRequest.stance === 'pro' ? '찬성' : '반대', // 백엔드에서는 '찬성' 또는 '반대'로 전달됨
      };

      // 실제 API 호출
      const response = await apiClient.post('/debate/vote', requestData);

      // 백엔드 응답 전체 반환 (nationPercent 포함)
      return response;
    } catch (error) {
      // 400 에러 검사
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number; data: any } };
        if (
          axiosError.response?.status === 400 &&
          axiosError.response?.data === '찬성과 반대 중 택 1'
        ) {
          console.warn('이미 다른 옵션에 투표했습니다. 먼저 기존 투표를 취소해야 합니다.');
          return { success: false, error: '이미 다른 옵션에 투표했습니다.' };
        }
      }

      console.error(`투표 실패 (ID: ${voteRequest.debateId}):`, error);
      return { success: false, error: '투표 처리 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 감정표현 추가/수정
   */
  addReaction: async (reactionRequest: ReactionRequest): Promise<boolean> => {
    try {
      // debate에만 감정 표현 가능 (comment, reply는 like/dislike만 가능)
      if (reactionRequest.targetType !== 'debate') {
        throw new Error('토론 주제에만 감정표현이 가능합니다.');
      }

      // 백엔드 API 요청 형식으로 변환
      let emotionValue = '';

      // ReactionType에서 백엔드 형식으로 변환
      switch (reactionRequest.reactionType) {
        case ReactionType.LIKE:
          emotionValue = '좋아요';
          break;
        case ReactionType.DISLIKE:
          emotionValue = '싫어요';
          break;
        case ReactionType.HAPPY:
          emotionValue = '좋아요'; // 백엔드에 '행복해요'가 없으므로 '좋아요'로 매핑 (UI에는 구분되어 표시됨)
          break;
        case ReactionType.SAD:
          emotionValue = '슬퍼요';
          break;
        case ReactionType.ANGRY:
          emotionValue = '화나요';
          break;
        case ReactionType.UNSURE:
          emotionValue = '글쎄요';
          break;
        default:
          emotionValue = '좋아요';
      }

      const requestData: DebateReqDto = {
        emotion: emotionValue,
      };

      // 실제 API 호출
      await apiClient.post(`/debate/emotion/${reactionRequest.targetId}`, requestData);

      return true;
    } catch (error) {
      console.error(`감정표현 추가 실패:`, error);
      return false;
    }
  },

  /**
   * 오늘의 토론 가져오기
   */
  getTodayDebate: async (): Promise<Debate | null> => {
    try {
      const response = await apiClient.get<any>('/debate/today');

      if (response && response.data) {
        return mapDebateResToFrontend(response.data);
      }

      return null;
    } catch (error) {
      console.error('오늘의 토론 조회 실패:', error);
      return null;
    }
  },

  /**
   * 내가 투표한 토론 목록 조회
   */
  getVotedDebates: async (userId: number, page = 0, size = 5): Promise<DebateListResponse> => {
    try {
      console.log(
        `[DEBUG] 투표한 토론 목록 조회 시작: userId=${userId}, page=${page}, size=${size}`
      );

      // 유효성 검사
      if (!userId || userId <= 0) {
        console.error(`[ERROR] 유효하지 않은 userId: ${userId}`);
        return { debates: [], total: 0, totalPages: 0 };
      }

      // API 호출을 위한 헤더 확인 (디버깅용)
      const token = localStorage.getItem('auth_token');
      console.log(`[DEBUG] API 호출 전 토큰 확인: ${token ? '존재함' : '없음'}`);

      // API 호출
      const response = await apiClient.get<any>('/debate/voted', {
        params: { userId, page, size },
      });

      console.log(`[DEBUG] 투표한 토론 응답 데이터:`, response);

      // 응답 데이터 구조 확인
      if (!response) {
        console.error('[ERROR] API 응답이 없습니다.');
        return { debates: [], total: 0, totalPages: 0 };
      }

      let debates: Debate[] = [];
      let total = 0;
      let totalPages = 0;

      // Spring Data의 Page 응답 구조인 경우
      if (response.content && Array.isArray(response.content)) {
        console.log('[DEBUG] Page 형식의 응답을 처리합니다.');
        debates = response.content.map((item: DebateResDto) => mapDebateResToFrontend(item));
        total = response.totalElements || 0;
        totalPages = response.totalPages || 0;
      }
      // debates 배열이 직접 있는 경우
      else if (response.debates && Array.isArray(response.debates)) {
        console.log('[DEBUG] debates 배열 형식의 응답을 처리합니다.');
        debates = response.debates.map((item: DebateResDto) => mapDebateResToFrontend(item));
        total = response.total || 0;
        totalPages = Math.ceil(total / size);
      }
      // 직접 배열이 반환된 경우
      else if (Array.isArray(response)) {
        console.log('[DEBUG] 배열 형식의 응답을 처리합니다.');
        debates = response.map((item: DebateResDto) => mapDebateResToFrontend(item));
        total = debates.length;
        totalPages = 1;
      }
      // 기타 응답 형식
      else {
        console.warn('[WARN] 알 수 없는 응답 형식입니다:', response);
        if (typeof response === 'object') {
          console.log('[DEBUG] 응답의 키:', Object.keys(response));
        }
      }

      console.log(`[DEBUG] 변환된 토론 데이터:`, {
        count: debates.length,
        total,
        totalPages,
        sample: debates.length > 0 ? debates[0] : null,
      });

      return {
        debates,
        total,
        totalPages,
      };
    } catch (error) {
      console.error('투표한 토론 목록 조회 실패:', error);

      // 오류 세부 정보 기록
      if (error instanceof Error) {
        console.error('[ERROR] 메시지:', error.message);
        console.error('[ERROR] 스택:', error.stack);
      }

      // AxiosError인 경우 응답 세부 정보 기록
      if (axios.isAxiosError(error)) {
        console.error('[ERROR] 요청 URL:', error.config?.url);
        console.error('[ERROR] 요청 파라미터:', error.config?.params);
        console.error('[ERROR] 상태 코드:', error.response?.status);
        console.error('[ERROR] 응답 데이터:', error.response?.data);
      }

      return {
        debates: [],
        total: 0,
        totalPages: 0,
      };
    }
  },

  /**
   * 토론 주제 작성하기
   */
  createDebate: async (data: DebateReqDto): Promise<number | null> => {
    try {
      const response = await apiClient.post<any>('/debate', data);

      if (response && response.data && response.data.debateId) {
        return response.data.debateId;
      }

      return null;
    } catch (error) {
      console.error('토론 주제 작성 실패:', error);
      return null;
    }
  },

  /**
   * 사용자 취향 기반 추천 토론 조회
   * @returns 추천 토론 및 분석 데이터
   */
  getRecommendedDebates: async (): Promise<{
    debates: Debate[];
    analysis?: Record<string, number>;
    total?: number;
  }> => {
    try {
      // 사용자 맞춤 추천 API 호출
      const response = await apiClient.get<any>('/debate/recommendation');
      
      // 응답 로깅
      console.log('토론 추천 응답 데이터:', response);
      
      const responseData = response.data || response;
      
      // 추천 토론 정보
      let debates: Debate[] = [];
      
      // 분석 데이터 (카테고리별 선호도 등)
      let analysis: Record<string, number> = {};
      
      // 응답 형식에 따른 처리
      if (responseData) {
        // 데이터가 debateList 필드를 가지는 경우
        if (responseData.debateList) {
          // 2차원 배열인 경우 ([카테고리별 토론 그룹])
          if (Array.isArray(responseData.debateList) && responseData.debateList.length > 0) {
            const allDebates: Debate[] = [];
            
            // 각 카테고리 그룹마다 토론을 변환하고 합침
            responseData.debateList.forEach((debateGroup: any[]) => {
              if (Array.isArray(debateGroup)) {
                const groupDebates = debateGroup.map((item: any) => {
                  const debate = mapDebateResToFrontend(item);
                  
                  // 매칭 점수 추가
                  if (typeof item.matchScore === 'number') {
                    debate.matchScore = item.matchScore;
                  }
                  
                  return debate;
                });
                
                allDebates.push(...groupDebates);
              }
            });
            
            debates = allDebates;
          } 
          // 일반 배열인 경우
          else if (Array.isArray(responseData.debateList)) {
            debates = responseData.debateList.map((item: any) => {
              const debate = mapDebateResToFrontend(item);
              
              // 매칭 점수 추가
              if (typeof item.matchScore === 'number') {
                debate.matchScore = item.matchScore;
              }
              
              return debate;
            });
          }
        }
        
        // analysis 데이터가 있는 경우
        if (responseData.analysis && typeof responseData.analysis === 'object') {
          analysis = responseData.analysis;
        }
        
        // 선호도 분석 데이터가 없는 경우 기본 데이터 생성
        if (Object.keys(analysis).length === 0) {
          // 토론 카테고리별로 임시 선호도 분석 생성
          const categories = ['정치/사회', '경제', '과학/기술', '생활/문화', '스포츠/레저'];
          const existingCategories = debates.map(d => d.category).filter(Boolean);
          
          // 기존 토론의 카테고리와 기본 카테고리를 합쳐서 분석 데이터 생성
          const allCategories = Array.from(new Set([...categories, ...existingCategories]));
          
          allCategories.forEach(category => {
            if (category) {
              // 0.1 ~ 0.9 사이의 랜덤 선호도
              analysis[category] = Math.round(Math.random() * 80 + 10) / 100;
            }
          });
        }
      }
      
      return {
        debates,
        analysis,
        total: debates.length
      };
    } catch (error) {
      console.error('추천 토론 조회 실패:', error);
      return {
        debates: [],
        analysis: {},
        total: 0
      };
    }
  },
};

/**
 * 오늘의 이슈, 인기 이슈, 균형 이슈를 모두 한 번에 가져오는 함수
 * 백엔드 API는 {todayDebateList: Array, balancedDebate: Object, topDebate: Object} 형태로 응답함
 */
export const getSpecialIssues = async () => {
  try {
    const response = await apiClient.get<any>('/debate/today');

    console.log('특별 이슈 원본 응답:', response);

    // 결과 객체 초기화
    const result = {
      todayIssues: [] as Debate[],
      hotIssue: null as Debate | null,
      balancedIssue: null as Debate | null,
    };

    if (response) {
      const data = response.data || response;

      // 오늘의 이슈 배열 처리
      if (data.todayDebateList && Array.isArray(data.todayDebateList)) {
        result.todayIssues = data.todayDebateList.map((item: DebateResDto) =>
          mapDebateResToFrontend(item)
        );
      }

      // 인기 이슈 처리
      if (data.topDebate) {
        result.hotIssue = mapDebateResToFrontend(data.topDebate);
      }

      // 균형 이슈 처리
      if (data.balancedDebate) {
        result.balancedIssue = mapDebateResToFrontend(data.balancedDebate);
      }
    }

    console.log('변환된 특별 이슈 데이터:', result);
    return result; // 응답 데이터가 없거나 형식이 다르더라도 기본 객체 반환
  } catch (error) {
    console.error('특별 이슈 조회 실패:', error);

    // 에러 발생 시 기본값 반환
    return {
      todayIssues: [],
      hotIssue: null,
      balancedIssue: null,
    };
  }
};

// 오늘의 이슈 가져오기
export const getTodayIssues = async () => {
  try {
    const response = await apiClient.get<any>('/debate/today');
    console.log('getTodayIssues 응답:', response);

    if (response) {
      const data = response.data || response;

      // 백엔드 응답 형식: {todayDebateList: Array, balancedDebate: Object, topDebate: Object}
      if (data.todayDebateList && Array.isArray(data.todayDebateList)) {
        return data.todayDebateList.map((item: DebateResDto) => mapDebateResToFrontend(item));
      }

      // 이전 형식과의 호환성 유지
      if (Array.isArray(data)) {
        return data.map((item: DebateResDto) => mapDebateResToFrontend(item));
      }

      // 단일 항목인 경우
      if (data.debateId) {
        return [mapDebateResToFrontend(data)];
      }
    }

    return [];
  } catch (error) {
    console.error('오늘의 이슈 조회 실패:', error);
    return [];
  }
};

// 인기 이슈 가져오기
export const getHotIssue = async () => {
  try {
    const response = await apiClient.get<any>('/debate/today');
    console.log('getHotIssue 응답:', response);

    if (response) {
      const data = response.data || response;

      // 백엔드 응답에서 topDebate 추출
      if (data.topDebate) {
        return mapDebateResToFrontend(data.topDebate);
      }

      // 이전 방식으로 시도 (인기 기준으로 정렬된 첫 번째 항목)
      const popularResponse = await apiClient.get<any>('/debate', {
        params: { page: 1, size: 1, sort: 'popular' },
      });

      if (popularResponse) {
        const popularData = popularResponse.data || popularResponse;
        if (popularData.content && popularData.content.length > 0) {
          return mapDebateResToFrontend(popularData.content[0]);
        }
      }
    }

    return null;
  } catch (error) {
    console.error('인기 이슈 조회 실패:', error);
    return null;
  }
};

// 균형 이슈 가져오기
export const getBalancedIssue = async () => {
  try {
    const response = await apiClient.get<any>('/debate/today');
    console.log('getBalancedIssue 응답:', response);

    if (response) {
      const data = response.data || response;

      // 백엔드 응답에서 balancedDebate 추출
      if (data.balancedDebate) {
        return mapDebateResToFrontend(data.balancedDebate);
      }

      // 이전 방식으로 시도 (찬반 비율이 가장 50:50에 가까운 토론 찾기)
      const debatesResponse = await apiClient.get<any>('/debate', {
        params: { page: 1, size: 10, sort: 'newest' },
      });

      if (debatesResponse) {
        const debatesData = debatesResponse.data || debatesResponse;
        if (debatesData.content && debatesData.content.length > 0) {
          const debates = debatesData.content.map((item: DebateResDto) => ({
            debate: mapDebateResToFrontend(item),
            balance: Math.abs(item.agreePercent - 50), // 50%에서 얼마나 떨어져 있는지
          }));

          // 가장 균형 잡힌 토론 반환
          debates.sort(
            (a: { debate: Debate; balance: number }, b: { debate: Debate; balance: number }) =>
              a.balance - b.balance
          );
          return debates[0].debate;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('균형 이슈 조회 실패:', error);
    return null;
  }
};

// isState 문자열을 myReaction 타입으로 변환하는 헬퍼 함수
export function convertIsStateToMyReaction(
  isState: string | null | undefined
): ReactionType | undefined {
  if (isState === '좋아요') return ReactionType.LIKE;
  if (isState === '싫어요') return ReactionType.DISLIKE;
  return undefined;
}

// myReaction을 서버에서 사용하는 isState 문자열로 변환하는 함수
export function convertReactionTypeToIsState(
  reactionType: ReactionType | undefined
): string | undefined {
  if (reactionType === ReactionType.LIKE) return '좋아요';
  if (reactionType === ReactionType.DISLIKE) return '싫어요';
  return undefined;
}

/**
 * 댓글 리액션 추가/취소하기
 */
export const reactToComment = async (
  commentId: number,
  reactionType: ReactionType
): Promise<any> => {
  try {
    console.log(`[DEBUG] 댓글 반응 처리 시작 - 댓글ID: ${commentId}, 타입: ${reactionType}`);

    // 백엔드 API 요청 형식 - 한글 문자열로 변환
    const emotionValue = convertReactionTypeToIsState(reactionType) || '좋아요';

    // API 요청
    const response = await apiClient.post<any>(`/debate/comment/${commentId}`, {
      emotion: emotionValue,
    });

    console.log(`[DEBUG] 댓글 반응 API 응답:`, response);

    // 응답이 유효하지 않은 경우
    if (!response || typeof response !== 'object') {
      console.warn('[WARN] 서버 응답이 유효하지 않습니다');
      throw new Error('Invalid server response');
    }

    // 서버 응답 그대로 반환
    return response;
  } catch (error) {
    console.error(`[ERROR] 댓글 반응 처리 실패:`, error);
    throw error;
  }
};

/**
 * 답글 리액션 추가/취소하기
 */
export const reactToReply = async (replyId: number, reactionType: ReactionType): Promise<any> => {
  try {
    console.log(`[DEBUG] 답글 반응 처리 시작 - 답글ID: ${replyId}, 타입: ${reactionType}`);

    // 백엔드 API 요청 형식 - 한글 문자열로 변환
    const emotionValue = convertReactionTypeToIsState(reactionType) || '좋아요';

    // API 요청
    const response = await apiClient.post<any>(`/debate/reply/${replyId}`, {
      emotion: emotionValue,
    });

    console.log(`[DEBUG] 답글 반응 API 응답:`, response);

    // 응답이 유효하지 않은 경우
    if (!response || typeof response !== 'object') {
      console.warn('[WARN] 서버 응답이 유효하지 않습니다');
      throw new Error('Invalid server response');
    }

    // 서버 응답 그대로 반환
    return response;
  } catch (error) {
    console.error(`[ERROR] 답글 반응 처리 실패:`, error);
    throw error;
  }
};

/**
 * 토론의 투표 상세 정보(국가별 통계 포함) 가져오기
 */
export const getVotesByDebateId = async (debateId: number): Promise<any> => {
  try {
    // 새로 추가한 RESTful 엔드포인트 사용
    const response = await apiClient.get<any>(`/debate/vote/${debateId}`);

    console.log(`토론 ID ${debateId}의 투표 통계 조회 응답:`, response);

    if (response) {
      const data = response.data || response;
      if (data) {
        return data;
      }
    }

    return null;
  } catch (error) {
    console.error(`투표 통계 조회 실패 (ID: ${debateId}):`, error);
    return null;
  }
};

export default DebateApi;
