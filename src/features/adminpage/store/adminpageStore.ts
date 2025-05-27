import { create } from 'zustand';
import { User, Report, ReportDetail, ReportedContent, ServiceType, TargetType } from '../types';
import adminpageApi from '../api/adminpageApi';

// 프로필 섹션 로딩 상태를 나타내는 타입
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 마이페이지 스토어 상태 인터페이스
export interface AdminpageState {
  // 프로필 정보

  // 전체 유저 리스트
  userList: User[] | null;
  userLoading: LoadingState;
  userError: string | null;

  // 관리자 등록
  roleChangeLoading: LoadingState;
  roleChangeError: string | null;
  roleChanged: boolean;

  // 전체 신고리스트
  reportList: Report[] | null;
  reportListLoading: LoadingState;
  reportListError: string | null;

  // 신고상세정보
  reportDetail: ReportDetail | null;
  reportDetailLoading: LoadingState;
  reportDetailError: string | null;

  // 신고컨텐츠(게시글, 댓글, 대댓글)
  reportedContent: ReportedContent | null;
  reportedContentLoading: LoadingState;
  reportedContentError: string | null;

  // 신고
  contentDeleteLoading: LoadingState;
  contentDeleteError: string | null;
  contentDeleted: boolean;

  // 유저 비활성화
  deactivateUserLoading: LoadingState;
  deactivateUserError: string | null;

  // 신고내역 조회확인
  readReportLoading: LoadingState;
  readReportError: string | null;

  // 액션
  fetchUser: () => Promise<void>;
  registerManager: (email: string) => Promise<void>;
  fetchReports: (userId: number) => Promise<void>;
  fetchReportDetail: (reportId: number) => Promise<void>;
  fetchReportedContent: (
    serviceType: ServiceType,
    targetType: TargetType,
    postId: number
  ) => Promise<void>;
  contentDelete: (
    serviceType: ServiceType | undefined,
    targetType: TargetType | undefined,
    postId: number | undefined
  ) => Promise<void>;
  deactivateUser: (userId: number, period: number) => Promise<string>;
  readReport: (reportId: number) => Promise<void>;
  removeReport: (reportId: number) => Promise<void>;
  unRegisterManager: (userId: number) => Promise<void>;

  // 상태 리셋
  resetAllState: () => void;
}

// 마이페이지 스토어 생성
export const useAdminpageStore = create<AdminpageState>((set, get) => ({
  // 초기 상태
  // 전체 유저 리스트
  userList: null,
  userLoading: 'idle',
  userError: null,

  // 관리자 등록
  roleChangeLoading: 'idle',
  roleChangeError: null,
  roleChanged: false,

  // 전체 신고리스트
  reportList: null,
  reportListLoading: 'idle',
  reportListError: null,

  // 신고상세정보
  reportDetail: null,
  reportDetailLoading: 'idle',
  reportDetailError: null,

  // 신고컨텐츠(게시글, 댓글, 대댓글)
  reportedContent: null,
  reportedContentLoading: 'idle',
  reportedContentError: null,

  // 신고
  contentDeleteLoading: 'idle',
  contentDeleteError: null,
  contentDeleted: false,

  // 유저 비활성화
  deactivateUserLoading: 'idle',
  deactivateUserError: null,

  // 신고내역 조회확인
  readReportLoading: 'idle',
  readReportError: null,

  // 액션
  fetchUser: async () => {
    set({ userLoading: 'loading' });
    try {
      const userList = await adminpageApi.getUserList();
      set({ userList, userLoading: 'success' });
    } catch (error) {
      console.error('유저리스트 로딩 실패: ', error);
      set({
        userLoading: 'error',
        userError: error instanceof Error ? error.message : '유저정보를 불러오는데 실패했습니다.',
      });
    }
  },

  // 액션 예시
  // fetchProfile: async () => {
  //   set({ profileLoading: 'loading', profileError: null });
  //   try {
  //     // 현재 사용자 ID 가져오기
  //     const userId = useAuthStore.getState().user?.userId ? Number(useAuthStore.getState().user?.userId) : undefined;

  //     const profile = await mypageApi.getProfileInfo(userId);
  //     set({ profile, profileLoading: 'success' });
  //   } catch (error) {
  //     console.error('프로필 정보 로딩 실패:', error);
  //     set({
  //       profileLoading: 'error',
  //       profileError: error instanceof Error ? error.message : '프로필 정보를 불러오는데 실패했습니다.'
  //     });
  //   }
  // },
  fetchReports: async userId => {
    set({ reportListLoading: 'loading' });
    try {
      const reportList = await adminpageApi.getReportList(userId);
      set({ reportList, reportListLoading: 'success' });
    } catch (error) {
      console.error('피신고 정보 로딩 실패: ', error);
      set({
        reportListLoading: 'success',
        reportListError:
          error instanceof Error ? error.message : '피신고정보를 불러오는데 실패했습니다.',
      });
    }
  },

  registerManager: async email => {
    set({ roleChangeLoading: 'loading' });
    try {
      await adminpageApi.registerManager(email);
      set({ roleChanged: true, roleChangeLoading: 'success' });
      const { userList } = get();
      if (userList) {
        const updatedList = userList.map(user =>
          user.email === email ? { ...user, role: 'ROLE_USER' } : user
        );
        set({ userList: updatedList });
      }
      console.log('관리자 등록 성공!');
    } catch (error) {
      console.error('관리자등록 실패: ', error);
      set({
        roleChangeLoading: 'error',
        roleChangeError:
          error instanceof Error ? error.message : '유저정보를 불러오는데 실패했습니다.',
      });
    }
  },

  fetchReportDetail: async reportId => {
    set({ reportDetailLoading: 'loading' });
    try {
      const reportDetail = await adminpageApi.getReportDetail(reportId);
      set({ reportDetail, reportDetailLoading: 'success' });
    } catch (error) {
      console.error('신고상세내역 조회 실패: ', error);
      set({
        reportDetailLoading: 'error',
        reportDetailError:
          error instanceof Error ? error.message : '신고상세내역을 조회하는데 실패했습니다.',
      });
    }
  },

  fetchReportedContent: async (serviceType, targetType, postId) => {
    set({ reportedContentLoading: 'loading' });
    try {
      const reportedContent = await adminpageApi.getReportedContent(
        serviceType,
        targetType,
        postId
      );
      set({ reportedContent, reportedContentLoading: 'success' });
    } catch (error) {
      console.error('신고된 컨텐츠 조회 실패: ', error);
      set({
        reportedContentLoading: 'error',
        reportedContentError:
          error instanceof Error ? error.message : '신고된 컨텐츠를 조회하는데 실패했습니다.',
      });
    }
  },

  contentDelete: async (serviceType, targetType, contentId) => {
    set({ contentDeleteLoading: 'loading' });
    try {
      await adminpageApi.deleteContent(serviceType, targetType, contentId);
      set({ contentDeleteLoading: 'success' });
      console.log('컨텐츠 삭제 성공!');
    } catch (error) {
      console.error('컨텐츠 삭제 실패: ', error);
      set({
        contentDeleteLoading: 'error',
        contentDeleteError:
          error instanceof Error ? error.message : '신고된 컨텐츠를 조회하는데 실패했습니다.',
      });
    }
  },

  deactivateUser: async (userId, period) => {
    set({ deactivateUserLoading: 'loading' });
    try {
      await adminpageApi.deactivateUser(userId, period);
      set({ deactivateUserLoading: 'success' });
      console.log('컨텐츠 삭제 성공!');
    } catch (error) {
      console.error('컨텐츠 삭제 실패: ', error);
      set({
        deactivateUserLoading: 'error',
        deactivateUserError:
          error instanceof Error ? error.message : '신고된 컨텐츠를 조회하는데 실패했습니다.',
      });
    }
    return 'hello';
  },

  readReport: async reportId => {
    set({ readReportLoading: 'loading' });
    try {
      await adminpageApi.readReport(reportId);
      set({ readReportLoading: 'success' });
      console.log('컨텐츠 삭제 성공!');
    } catch (error) {
      console.error('컨텐츠 삭제 실패: ', error);
      set({
        readReportLoading: 'error',
        readReportError:
          error instanceof Error ? error.message : '신고된 컨텐츠를 조회하는데 실패했습니다.',
      });
    }
  },

  removeReport: async (reportId: number) => {
    const { reportList } = get();
    if (reportList) {
      const updatedList = reportList.filter(report => report.reportId !== reportId);
      set({ reportList: updatedList });
    }
  },

  unRegisterManager: async (userId: number) => {
    set({ roleChangeLoading: 'loading' });
    try {
    } catch (error) {
      console.error('컨텐츠 삭제 실패: ', error);
      set({
        roleChangeLoading: 'error',
        roleChangeError:
          error instanceof Error ? error.message : '신고된 컨텐츠를 조회하는데 실패했습니다.',
      });
    }
    const { userList } = get();
    if (userList) {
      const updatedList = userList.map(user =>
        user.userId === userId ? { ...user, role: 'ROLE_USER' } : user
      );
      set({ userList: updatedList });
    }
  },

  // 전체 상태 리셋
  resetAllState: () => {
    set({
      // 전체 유저 리스트
      userList: null,
      userLoading: 'idle',
      userError: null,

      // 관리자 등록
      roleChangeLoading: 'idle',
      roleChangeError: null,
      roleChanged: false,

      // 전체 신고리스트
      reportList: null,
      reportListLoading: 'idle',
      reportListError: null,

      // 신고상세정보
      reportDetail: null,
      reportDetailLoading: 'idle',
      reportDetailError: null,

      // 신고컨텐츠(게시글, 댓글, 대댓글)
      reportedContent: null,
      reportedContentLoading: 'idle',
      reportedContentError: null,

      // 신고
      contentDeleteLoading: 'idle',
      contentDeleteError: null,
      contentDeleted: false,

      // 유저 비활성화
      deactivateUserLoading: 'idle',
      deactivateUserError: null,
    });
  },
}));

export default useAdminpageStore;
