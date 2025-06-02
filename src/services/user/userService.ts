import apiClient from '../../config/axios';

/**
 * 사용자 정보 인터페이스
 */
export interface UserProfile {
  userId: number;
  email: string;
  name: string;
  phoneNumber?: string;
  birthday?: string;
  profileImagePath?: string;
  address?: string;
  signedAt?: string;
  isDeactivate?: boolean;
  role: string;
}

/**
 * 사용자 선호도 정보 인터페이스
 */
export interface UserPreference {
  userId: number;
  language: string;
  nation: string;
  interests?: string[];
  isOnBoardDone?: boolean;
}

/**
 * 사용자 활동 정보 인터페이스
 */
export interface UserActivity {
  id: string;
  type: string;
  date: string;
  streak: number;
}

/**
 * 사용자 활동 통계 인터페이스
 */
export interface UserActivityStats {
  postsCount: number;
  commentsCount: number;
  debatesCount: number;
  bookmarksCount: number;
  totalActivities: number;
}

/**
 * 사용자 뱃지 인터페이스
 */
export interface UserBadge {
  id: number;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

/**
 * 사용자 서비스
 */
const UserService = {
  /**
   * 사용자 프로필 정보 조회
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get<UserProfile>('/users/profile');
      return response;
    } catch (error) {
      console.error('사용자 프로필 정보 조회 실패:', error);
      throw error;
    }
  },
  
  /**
   * 사용자 선호도 정보 조회
   */
  getPreference: async (): Promise<UserPreference> => {
    try {
      const response = await apiClient.get<UserPreference>('/users/preference');
      return response;
    } catch (error) {
      console.error('사용자 선호도 정보 조회 실패:', error);
      throw error;
    }
  },
  
  /**
   * 사용자 최근 활동 조회
   */
  getRecentActivities: async (): Promise<UserActivity[]> => {
    try {
      const response = await apiClient.get<UserActivity[]>('/users/activities');
      return response;
    } catch (error) {
      console.error('사용자 활동 조회 실패:', error);
      // 에러 발생 시 빈 배열 반환 (UI에서 예외 처리 용이하게)
      return [];
    }
  },

  /**
   * 사용자 활동 통계 조회
   */
  getActivityStats: async (): Promise<UserActivityStats> => {
    try {
      const response = await apiClient.get<UserActivityStats>('/users/activity-stats');
      return response;
    } catch (error) {
      console.error('사용자 활동 통계 조회 실패:', error);
      // 에러 발생 시 기본값 반환
      return {
        postsCount: 0,
        commentsCount: 0,
        debatesCount: 0,
        bookmarksCount: 0,
        totalActivities: 0,
      };
    }
  },

  /**
   * 사용자 뱃지 목록 조회
   */
  getUserBadges: async (): Promise<UserBadge[]> => {
    try {
      const response = await apiClient.get<UserBadge[]>('/users/badges');
      return response;
    } catch (error) {
      console.error('사용자 뱃지 조회 실패:', error);
      // 에러 발생 시 빈 배열 반환
      return [];
    }
  },
  
  /**
   * 사용자 프로필 정보 수정
   */
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await apiClient.put<UserProfile>('/users/profile', profile);
      return response;
    } catch (error) {
      console.error('사용자 프로필 정보 수정 실패:', error);
      throw error;
    }
  },
  
  /**
   * 사용자 선호도 정보 수정
   */
  updatePreference: async (preference: Partial<UserPreference>): Promise<UserPreference> => {
    try {
      const response = await apiClient.put<UserPreference>('/users/preference', preference);
      return response;
    } catch (error) {
      console.error('사용자 선호도 정보 수정 실패:', error);
      throw error;
    }
  }
};

export default UserService; 