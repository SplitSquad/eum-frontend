import { create } from 'zustand';
import { 
  ProfileInfo, 
  MyPost, 
  MyComment, 
  MyDebate, 
  MyBookmark, 
  PaginatedResponse 
} from '../types';
import mypageApi from '../api/mypageApi';
import { useAuthStore } from '../../auth/store/authStore';

// 프로필 섹션 로딩 상태를 나타내는 타입
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 마이페이지 스토어 상태 인터페이스
interface MypageState {
  // 프로필 정보
  profile: ProfileInfo | null;
  profileLoading: LoadingState;
  profileError: string | null;

  // 내 활동 데이터
  posts: PaginatedResponse<MyPost> | null;
  postsLoading: LoadingState;
  postsError: string | null;

  comments: PaginatedResponse<MyComment> | null;
  commentsLoading: LoadingState;
  commentsError: string | null;

  debates: PaginatedResponse<MyDebate> | null;
  debatesLoading: LoadingState;
  debatesError: string | null;

  bookmarks: PaginatedResponse<MyBookmark> | null;
  bookmarksLoading: LoadingState;
  bookmarksError: string | null;

  // 비밀번호 변경 상태
  passwordChangeLoading: LoadingState;
  passwordChangeError: string | null;
  passwordChanged: boolean;

  // 프로필 정보 업데이트 상태
  profileUpdateLoading: LoadingState;
  profileUpdateError: string | null;
  profileUpdated: boolean;

  // 액션
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<ProfileInfo>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  fetchMyPosts: (page?: number, size?: number) => Promise<void>;
  fetchMyComments: (page?: number, size?: number) => Promise<void>;
  fetchMyDebates: (page?: number, size?: number) => Promise<void>;
  fetchMyBookmarks: (page?: number, size?: number) => Promise<void>;
  
  // 상태 리셋
  resetPasswordChangeStatus: () => void;
  resetProfileUpdateStatus: () => void;
  resetAllState: () => void;
}

// 마이페이지 스토어 생성
export const useMypageStore = create<MypageState>((set, get) => ({
  // 초기 상태
  profile: null,
  profileLoading: 'idle',
  profileError: null,

  posts: null,
  postsLoading: 'idle',
  postsError: null,

  comments: null,
  commentsLoading: 'idle',
  commentsError: null,

  debates: null,
  debatesLoading: 'idle',
  debatesError: null,

  bookmarks: null,
  bookmarksLoading: 'idle',
  bookmarksError: null,

  passwordChangeLoading: 'idle',
  passwordChangeError: null,
  passwordChanged: false,

  profileUpdateLoading: 'idle',
  profileUpdateError: null,
  profileUpdated: false,

  // 액션
  fetchProfile: async () => {
    set({ profileLoading: 'loading', profileError: null });
    try {
      // 현재 사용자 ID 가져오기
      const userId = useAuthStore.getState().user?.userId ? Number(useAuthStore.getState().user?.userId) : undefined;
      
      const profile = await mypageApi.getProfileInfo(userId);
      set({ profile, profileLoading: 'success' });
    } catch (error) {
      console.error('프로필 정보 로딩 실패:', error);
      set({ 
        profileLoading: 'error', 
        profileError: error instanceof Error ? error.message : '프로필 정보를 불러오는데 실패했습니다.' 
      });
    }
  },

  updateProfile: async (profileData) => {
    set({ profileUpdateLoading: 'loading', profileUpdateError: null, profileUpdated: false });
    try {
      const updatedProfile = await mypageApi.updateProfile(profileData);
      set({ 
        profile: updatedProfile, 
        profileUpdateLoading: 'success',
        profileUpdated: true
      });
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      set({ 
        profileUpdateLoading: 'error', 
        profileUpdateError: error instanceof Error ? error.message : '프로필 정보 업데이트에 실패했습니다.',
        profileUpdated: false
      });
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ passwordChangeLoading: 'loading', passwordChangeError: null, passwordChanged: false });
    try {
      const success = await mypageApi.changePassword(currentPassword, newPassword);
      set({ 
        passwordChangeLoading: 'success',
        passwordChanged: success
      });
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      set({ 
        passwordChangeLoading: 'error', 
        passwordChangeError: error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.',
        passwordChanged: false
      });
    }
  },

  fetchMyPosts: async (page = 0, size = 10) => {
    set({ postsLoading: 'loading', postsError: null });
    try {
      // 현재 사용자 ID 가져오기
      const user = useAuthStore.getState().user;
      const userId = user?.userId ? Number(user.userId) : 0;
      
      if (!userId) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }
      
      const posts = await mypageApi.getMyPosts(userId, page, size);
      set({ posts, postsLoading: 'success' });
      
      console.log('[DEBUG] 내 게시글 로드 성공:', posts);
    } catch (error) {
      console.error('내 게시글 로딩 실패:', error);
      set({ 
        postsLoading: 'error', 
        postsError: error instanceof Error ? error.message : '게시글 목록을 불러오는데 실패했습니다.' 
      });
    }
  },

  fetchMyComments: async (page = 0, size = 10) => {
    set({ commentsLoading: 'loading', commentsError: null });
    try {
      // 현재 사용자 ID 가져오기
      const user = useAuthStore.getState().user;
      const userId = user?.userId ? Number(user.userId) : 0;
      
      if (!userId) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }
      
      const comments = await mypageApi.getMyComments(userId, page, size);
      set({ comments, commentsLoading: 'success' });
      
      console.log('[DEBUG] 내 댓글 로드 성공:', comments);
    } catch (error) {
      console.error('내 댓글 로딩 실패:', error);
      set({ 
        commentsLoading: 'error', 
        commentsError: error instanceof Error ? error.message : '댓글 목록을 불러오는데 실패했습니다.' 
      });
    }
  },

  fetchMyDebates: async (page = 0, size = 10) => {
    set({ debatesLoading: 'loading', debatesError: null });
    try {
      // 현재 사용자 ID 가져오기
      const user = useAuthStore.getState().user;
      const userId = user?.userId ? Number(user.userId) : 0;
      
      if (!userId) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }
      
      const debates = await mypageApi.getMyDebates(userId, page, size);
      set({ debates, debatesLoading: 'success' });
      
      console.log('[DEBUG] 내 토론 로드 성공:', debates);
    } catch (error) {
      console.error('내 토론 로딩 실패:', error);
      set({ 
        debatesLoading: 'error', 
        debatesError: error instanceof Error ? error.message : '토론 목록을 불러오는데 실패했습니다.' 
      });
    }
  },

  fetchMyBookmarks: async (page = 0, size = 10) => {
    set({ bookmarksLoading: 'loading', bookmarksError: null });
    try {
      const bookmarks = await mypageApi.getMyBookmarks(page, size);
      set({ bookmarks, bookmarksLoading: 'success' });
    } catch (error) {
      console.error('북마크 로딩 실패:', error);
      set({ 
        bookmarksLoading: 'error', 
        bookmarksError: error instanceof Error ? error.message : '북마크 목록을 불러오는데 실패했습니다.' 
      });
    }
  },

  // 비밀번호 변경 상태 리셋
  resetPasswordChangeStatus: () => {
    set({ 
      passwordChangeLoading: 'idle', 
      passwordChangeError: null, 
      passwordChanged: false 
    });
  },

  // 프로필 업데이트 상태 리셋
  resetProfileUpdateStatus: () => {
    set({ 
      profileUpdateLoading: 'idle', 
      profileUpdateError: null, 
      profileUpdated: false 
    });
  },

  // 전체 상태 리셋
  resetAllState: () => {
    set({
      profile: null,
      profileLoading: 'idle',
      profileError: null,

      posts: null,
      postsLoading: 'idle',
      postsError: null,

      comments: null,
      commentsLoading: 'idle',
      commentsError: null,

      debates: null,
      debatesLoading: 'idle',
      debatesError: null,

      bookmarks: null,
      bookmarksLoading: 'idle',
      bookmarksError: null,

      passwordChangeLoading: 'idle',
      passwordChangeError: null,
      passwordChanged: false,

      profileUpdateLoading: 'idle',
      profileUpdateError: null,
      profileUpdated: false
    });
  }
}));

export default useMypageStore; 