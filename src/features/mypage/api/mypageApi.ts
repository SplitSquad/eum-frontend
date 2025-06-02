import apiClient from './apiClient';
import {
  ProfileInfo,
  ApiResponse,
  PaginatedResponse,
  MyPost,
  MyComment,
  MyDebate,
  MyBookmark,
} from '../types';
import { get } from 'http';

// API 응답 타입 정의
interface UserProfileResponse {
  userId: number;
  email: string;
  name: string;
  phoneNumber?: string;
  birthday?: string;
  profileImagePath?: string;
  address?: string;
  signedAt?: string;
  role?: string;
}

interface UserPreferenceResponse {
  preferenceId?: number;
  userId?: number;
  nation?: string;
  language?: string;
  gender?: string;
  visitPurpose?: string;
  period?: string;
  onBoardingPreference?: string | Record<string, any>;
  isOnBoardDone?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 프로필 업데이트 요청 타입 확장
interface ProfileUpdateData extends Partial<ProfileInfo> {
  phoneNumber?: string;
  birthday?: string;
  address?: string;
}

/**
 * 마이페이지 API 클래스
 */
class MypageApi {
  /**
   * 사용자 프로필 정보 조회
   */
  async getProfileInfo(userId?: number): Promise<ProfileInfo> {
    // 토큰 가져오기
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    console.log('[API] 사용자 프로필 요청 시작');

    // 사용자 프로필 정보 가져오기
    const profileResponse = await apiClient.get<UserProfileResponse>('/users/profile', {
      headers: {
        Authorization: token,
      },
    });

    // 사용자 선호도 정보 가져오기
    const preferenceResponse = await apiClient.get<UserPreferenceResponse>('/users/preference', {
      headers: {
        Authorization: token,
      },
    });

    console.log('[API] 프로필 응답:', profileResponse);
    console.log('[API] 선호도 응답:', preferenceResponse);

    // 프로필 정보에서 필요한 데이터 추출
    const profileData = profileResponse as UserProfileResponse;
    const preferenceData = preferenceResponse as UserPreferenceResponse;

    let onBoardingData: Record<string, any> = {};
    if (preferenceData.onBoardingPreference) {
      try {
        // JSON 문자열이면 파싱
        if (typeof preferenceData.onBoardingPreference === 'string') {
          onBoardingData = JSON.parse(preferenceData.onBoardingPreference);
        } else {
          // 이미 객체면 그대로 사용
          onBoardingData = preferenceData.onBoardingPreference as Record<string, any>;
        }
      } catch (e) {
        console.error('온보딩 데이터 파싱 실패:', e);
      }
    }

    // 백엔드 응답을 ProfileInfo 형식으로 변환
    const userProfile: ProfileInfo = {
      userId: profileData.userId,
      name: profileData.name || '사용자',
      email: profileData.email || '',
      profileImage: profileData.profileImagePath || '', // 더미 이미지 제거
      introduction: (onBoardingData.introduction as string) || '', // 온보딩 데이터에서 소개 가져오기
      country: preferenceData.nation || '',
      language: preferenceData.language || '',
      joinDate: profileData.signedAt
        ? new Date(profileData.signedAt).toISOString().split('T')[0]
        : '',
      role: preferenceData.visitPurpose || '',
    };

    console.log('[API] 처리된 사용자 프로필:', userProfile);
    return userProfile;
  }

  /**
   * 프로필 정보 업데이트
   */
  async updateProfile(profileData: ProfileUpdateData): Promise<ProfileInfo> {
    try {
      // 토큰 가져오기
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
      }

      console.log('[API] 프로필 업데이트 요청 시작:', profileData);

      // 현재 선호도 데이터 가져오기
      const preferenceResponse = await apiClient.get<UserPreferenceResponse>('/users/preference', {
        headers: {
          Authorization: token,
        },
      });

      // 프로필 정보 업데이트 API 호출 (기본 정보만)
      const profileUpdateData = {
        name: profileData.name,
        phoneNumber: profileData.phoneNumber || '',
        birthday: profileData.birthday || '',
        address: profileData.address || '',
      };

      const profileResponse = await apiClient.put('/users/profile', profileUpdateData, {
        headers: {
          Authorization: token,
        },
      });

      console.log('[API] 프로필 업데이트 응답:', profileResponse);

      // 선호도 데이터 업데이트 (자기소개, 국가, 언어 포함)
      const preferenceData = preferenceResponse as UserPreferenceResponse;

      // 현재 온보딩 데이터 파싱
      let currentOnBoarding: Record<string, any> = {};
      if (preferenceData.onBoardingPreference) {
        try {
          if (typeof preferenceData.onBoardingPreference === 'string') {
            currentOnBoarding = JSON.parse(preferenceData.onBoardingPreference);
          } else {
            currentOnBoarding = preferenceData.onBoardingPreference as Record<string, any>;
          }
        } catch (e) {
          console.error('온보딩 데이터 파싱 실패:', e);
        }
      }

      // 자기소개 업데이트
      if (profileData.introduction !== undefined) {
        currentOnBoarding.introduction = profileData.introduction;
      }

      const preferenceUpdateData = {
        nation: profileData.country || preferenceData.nation,
        language: profileData.language || preferenceData.language,
        gender: preferenceData.gender,
        visitPurpose: profileData.role || preferenceData.visitPurpose,
        period: preferenceData.period,
        onBoardingPreference: JSON.stringify(currentOnBoarding), // 자기소개 포함
        isOnBoardDone: preferenceData.isOnBoardDone,
      };

      const updatedPreference = await apiClient.post('/users/preference', preferenceUpdateData, {
        headers: {
          Authorization: token,
        },
      });

      console.log('[API] 선호도 업데이트 응답 (자기소개 포함):', updatedPreference);

      // 업데이트된 프로필 정보 반환
      return this.getProfileInfo(profileData.userId);
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 비밀번호 변경
   * TODO: 실제 API 연동 시 수정 필요
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    // 비밀번호 변경 성공 시뮬레이션
    console.log('비밀번호 변경 요청', { currentPassword, newPassword });
    return true;
  }

  /**
   * 내가 작성한 게시글 목록 조회
   */
  async getMyPosts(
    userId: number,
    page: number = 0,
    size: number = 5
  ): Promise<PaginatedResponse<MyPost>> {
    try {
      if (!userId) {
        console.error('사용자 ID가 없습니다. 내 게시글을 불러올 수 없습니다.');
        return this.getEmptyPaginatedResponse(page, size);
      }

      console.log(`[API] 내가 작성한 게시글 조회: userId=${userId}, page=${page}, size=${size}`);

      const response = await apiClient.get<any>('/community/post/written', {
        params: { userId, page, size },
      });

      console.log('[API] 내가 작성한 게시글 응답:', response);

      // 백엔드 응답 구조에 맞게 변환
      const posts = response.postList || [];
      const total = response.total || 0;

      // 각 게시물 정보를 프론트엔드 타입으로 변환
      const mappedPosts: MyPost[] = posts.map((post: any) => ({
        id: post.postId || 0,
        title: post.title || '[제목 없음]',
        content: post.content || '',
        category: post.category || '일반',
        createdAt: post.createdAt || new Date().toISOString(),
        viewCount: post.views || 0,
        likeCount: post.like || 0,
        commentCount: post.commentCnt || 0,
      }));

      return {
        content: mappedPosts,
        pageable: {
          pageNumber: page,
          pageSize: size,
        },
        last: (page + 1) * size >= total,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        size: mappedPosts.length,
        number: page,
      };
    } catch (error) {
      console.error('내가 작성한 게시글 조회 실패:', error);
      return this.getEmptyPaginatedResponse(page, size);
    }
  }

  /**
   * 내가 작성한 댓글 목록 조회
   */
  async getMyComments(
    userId: number,
    page: number = 0,
    size: number = 5
  ): Promise<PaginatedResponse<MyComment>> {
    try {
      if (!userId) {
        console.error('사용자 ID가 없습니다. 내 댓글을 불러올 수 없습니다.');
        return this.getEmptyPaginatedResponse(page, size);
      }

      console.log(`[API] 내가 작성한 댓글 조회: userId=${userId}, page=${page}, size=${size}`);

      const response = await apiClient.get<any>('/community/comment/written', {
        params: { userId, page, size },
      });

      console.log('[API] 내가 작성한 댓글 응답:', response);

      // 백엔드 응답 구조에 맞게 변환
      const comments = response.commentList || [];
      const total = response.total || 0;

      // 각 댓글 정보를 프론트엔드 타입으로 변환
      const mappedComments: MyComment[] = comments.map((comment: any) => ({
        id: comment.commentId || 0,
        content: comment.content || '',
        createdAt: comment.createdAt || new Date().toISOString(),
        postId: comment.postId || 0,
        postTitle: comment.postTitle || '[게시글 제목 없음]',
      }));

      return {
        content: mappedComments,
        pageable: {
          pageNumber: page,
          pageSize: size,
        },
        last: (page + 1) * size >= total,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        size: mappedComments.length,
        number: page,
      };
    } catch (error) {
      console.error('내가 작성한 댓글 조회 실패:', error);
      return this.getEmptyPaginatedResponse(page, size);
    }
  }

  /**
   * 내가 투표한 토론 목록 조회
   */
  async getMyDebates(
    userId: number,
    page: number = 0,
    size: number = 5
  ): Promise<PaginatedResponse<MyDebate>> {
    try {
      if (!userId) {
        console.error('사용자 ID가 없습니다. 내 토론을 불러올 수 없습니다.');
        return this.getEmptyPaginatedResponse(page, size);
      }

      console.log(`[API] 내가 투표한 토론 조회: userId=${userId}, page=${page}, size=${size}`);

      // DebateApi의 getVotedDebates 직접 호출 대신 API 요청
      const response = await apiClient.get<any>('/debate/voted', {
        params: { userId, page, size }, // 백엔드 페이지 번호는 0부터 시작
      });

      console.log('[API] 내가 투표한 토론 응답:', response);

      let debates: any[] = [];
      let total = 0;

      // 응답 형식에 따라 데이터 추출
      if (response.content && Array.isArray(response.content)) {
        debates = response.content;
        total = response.totalElements || 0;
      } else if (response.debates && Array.isArray(response.debates)) {
        debates = response.debates;
        total = response.total || 0;
      } else if (response.debateList && Array.isArray(response.debateList)) {
        // 백엔드에서 debateList 필드로 반환하는 경우 처리
        debates = response.debateList;
        total = response.total || 0;
      }

      console.log('[DEBUG] 추출된 토론 목록:', debates);

      // 각 토론 정보를 프론트엔드 타입으로 변환
      const mappedDebates: MyDebate[] = debates.map((debate: any) => ({
        id: debate.debateId || 0,
        title: debate.title || '[제목 없음]',
        createdAt: debate.createdAt || new Date().toISOString(),
        votedOption: debate.isVotedState || '투표 정보 없음',
        totalVotes: debate.voteCnt || 0,
      }));

      console.log('[DEBUG] 변환된 토론 목록:', mappedDebates);

      return {
        content: mappedDebates,
        pageable: {
          pageNumber: page,
          pageSize: size,
        },
        last: (page + 1) * size >= total,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        size: mappedDebates.length,
        number: page,
      };
    } catch (error) {
      console.error('내가 투표한 토론 조회 실패:', error);
      return this.getEmptyPaginatedResponse(page, size);
    }
  }

  /**
   * 내가 북마크한 정보글 목록 조회
   */
  async getMyBookmarks(
    userId: number,
    page: number = 0,
    size: number = 5
  ): Promise<PaginatedResponse<MyBookmark>> {
    try {
      console.log(`[API] 내가 북마크한 정보글 조회: userId=${userId}, page=${page}, size=${size}`);

      // 실제 API 호출
      const response = await apiClient.get<{
        total: number;
        informationList: Array<{
          informationId: number;
          title: string;
          category: string;
          createdAt: string;
          userName: string;
          // 기타 필드: views, content, isState 등
        }>;
      }>('/information/bookmark', {
        params: { userId, page, size },
      });

      console.log('[API] 북마크 응답:', response);

      const totalElements = response.total ?? 0;
      const list = response.informationList ?? [];

      // MyBookmark 타입에 맞춰 매핑
      const mapped: MyBookmark[] = list.map(item => ({
        id: item.informationId,
        title: item.title,
        category: item.category,
        createdAt: item.createdAt,
        // API의 userName을 'source' 필드로 사용
        source: item.userName,
      }));

      return {
        content: mapped,
        pageable: {
          pageNumber: page,
          pageSize: size,
        },
        last: (page + 1) * size >= totalElements,
        totalElements,
        totalPages: Math.ceil(totalElements / size),
        size: mapped.length,
        number: page,
      };
    } catch (error) {
      console.error('내가 북마크한 정보 조회 실패:', error);
      return this.getEmptyPaginatedResponse(page, size);
    }
  }

  /**
   * 빈 페이지네이션 응답 반환 (에러 시 사용)
   */
  private getEmptyPaginatedResponse<T>(page: number, size: number): PaginatedResponse<T> {
    return {
      content: [],
      pageable: {
        pageNumber: page,
        pageSize: size,
      },
      last: true,
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: page,
    };
  }

  /**
   * 프로필 이미지 업로드
   */
  async uploadProfileImage(file: File): Promise<string> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
      }

      console.log('[API] 프로필 이미지 업로드 시작');

      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<string>('/users/profile/image/upload', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('[API] 프로필 이미지 업로드 성공:', response);
      return response;
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      throw error;
    }
  }

  /**
   * 프로필 이미지 삭제
   */
  async deleteProfileImage(): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
      }

      console.log('[API] 프로필 이미지 삭제 시작');

      await apiClient.delete<void>('/users/profile/image/delete', {
        headers: {
          Authorization: token,
        },
      });

      console.log('[API] 프로필 이미지 삭제 성공');
    } catch (error) {
      console.error('프로필 이미지 삭제 실패:', error);
      throw error;
    }
  }
}

// 단일 인스턴스 생성하여 내보내기
const mypageApi = new MypageApi();
export default mypageApi;
