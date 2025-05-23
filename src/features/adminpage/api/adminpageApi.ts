import apiClient from './apiClient';
import { User, Report, ReportDetail, ServiceType, TargetType, ReportedContent } from '../types';
import { ContentType } from 'recharts/types/component/DefaultLegendContent';
import { Target } from 'lucide-react';

/**
 * 관리자페이지 API 클래스
 */

// 유저리스트정보 응답형식
interface UserListResponse {
  userId: number;
  email: string;
  name: string;
  phoneNumber: string;
  birthday: string;
  profileImagePath: string;
  address: string;
  signedAt: string;
  isDeactivate: boolean;
  role: string;
  nation: string;
  language: string;
  gender: string;
  visitPurpose: string;
  period: string;
  onBoardingPreference: string;
  createdAt: string;
  updatedAt: string;
  nreported: number;
  deactivateCount: number;
}

interface UserDetail {
  userId: number;
  email: string;
  name: string;
  role: string;
  deactivateCount: number;
  phoneNumber: string;
  birthday: string;
  profileImagePath: string;
  address: string;
  signedAt: string;
  isDeactivate: boolean;
  userPreference: UserPreference;
}

interface UserPreference {
  preferenceId: number;
  nation: string;
  language: string;
  gender: string;
  visitPurpose: string;
  period: string;
  onBoardingPreference: string;
  isOnBoardDone: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReportListResponse {
  reportId: number;
  reportContent: 'personal_attack: gd';
  reporter: UserDetail;
  nreported: number;
}

interface ReportDetailResponse {
  reportId: number;
  reporter: UserDetail;
  reported: UserDetail;
  reportContent: string;
  serviceType: ServiceType;
  targetType: TargetType;
  contentId: number;
}

// localstorage에 있는 토큰조회
function getToken(): any {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
  }
  return token;
}

class AdminpageApi {
  // 특정 유저의 피신고정보 조회
  async getReportList(userId: number) {
    console.log('[API] 신고내역 조회 시작');
    try {
      const temp = {
        userId: userId,
      };
      const reportListResponse = await apiClient.post('/admin/reports/search', temp, {
        headers: {
          Authorization: getToken(),
        },
      });
      console.log('[API] 신고내역 응답: ', reportListResponse);

      // 응답에서 필요한 데이터 추출
      const reportList = reportListResponse as ReportListResponse[];
      const reports: Report[] = [];
      reportList.map(report => {
        reports.push({
          reportId: report.reportId,
          reportContent: report.reportContent,
          reporterName: report.reporter.name,
          nreported: report.nreported,
        });
      });
      console.info('[API] 신고리스트 반환: ', reports);
      return reports;
    } catch (error) {
      console.error('신고리스트 조회 실패:', error);
    }
  }

  // 신고 상세내역 조회
  async getReportDetail(reportId: number) {
    console.log('[API] 신고내역 조회 시작');
    try {
      const reportDetail = await apiClient.get('/admin/reports/' + reportId, {
        headers: {
          Authorization: getToken(),
        },
      });
      // 응답에서 필요한 데이터 추출
      console.info('[API] 신고상세내역 응답: ', reportDetail);
      return reportDetail as ReportDetail;
    } catch (error) {
      console.error('신고상세내역 조회 실패:', error);
    }
  }
  /**
   *
   */

  // 전체 유저리스트 조회
  async getUserList(): Promise<User[]> {
    try {
      console.log('[API] 유저리스트 요청 시작');

      // 사용자 프로필 정보 가져오기
      const userResponse = await apiClient.get('/admin/userlist', {
        headers: {
          Authorization: getToken(),
        },
      });

      console.log('[API] 프로필 응답:', userResponse);

      // 프로필 정보에서 필요한 데이터 추출
      const userList = userResponse as UserListResponse[];

      const users: User[] = [];
      // 백엔드 응답을 User 형식으로 변환
      userList.map(user => {
        users.push({
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          nreported: user.nreported,
          isDeactivate: user.isDeactivate,
          deactivateCount: user.deactivateCount,
          profileImagePath: user.profileImagePath,
        });
      });
      console.log('[API] 사용자 리스트 반환: ', users);
      return users;
    } catch (error) {
      console.error('사용자 조회 실패:', error);

      // 모의 데이터로 폴백 처리
      console.warn('실제 API 연동 실패로 모의 데이터 반환');
      return [];
    }
  }

  // 관리자 등록
  async registerManager(email: string): Promise<void> {
    console.log('[API] 관리자등록 요청 시작');
    const temp = {
      email: email,
    };
    const userResponse = await apiClient.post('/admin/promote', temp, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log('[API]응답 반환: ', userResponse);
  }

  // export interface ReportedContent {
  //   title: string | null; // 제목(게시글의 경우 필요함)
  //   content: string; // (게시글, 댓글, 대댓글)
  //   writerName: string; // 작성자 이름
  //   createdAt: string;
  // }

  // 커뮤니티서비스의 게시글 조회
  // /community/post/{postId}
  async getCommunityPost(contentId: number): Promise<ReportedContent> {
    console.log('[API] 커뮤니티 서비스 게시글 선택');
    const postResponse = await apiClient.get<{
      title: string;
      content: string;
      userName: string;
      createdAt: string;
    }>('/community/post/' + contentId, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log('[API] 커뮤니티 서비스 게시글 API 응답: ', postResponse);
    const reportedContent: ReportedContent = {
      title: postResponse.title ?? null,
      content: postResponse.content,
      writerName: postResponse.userName,
      createdAt: postResponse.createdAt,
    };
    console.log('[Response] 신고 상세보기 모달에 필요한 정보만 추출: ', reportedContent);
    return reportedContent;
  }

  // 커뮤니티 서버스의 댓글 조회
  // /community/comment/{replyId}
  async getCommunityComment(contentId: number): Promise<ReportedContent> {
    console.log('[API] 커뮤니티 서비스 댓글 선택');
    const commentResponse = await apiClient.get<{
      content: string;
      userName: string;
      createdAt: string;
    }>('/community/comment/' + contentId, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log('[API] 커뮤니티 서비스 단일댓글조회 API 응답: ', commentResponse);
    const reportedContent: ReportedContent = {
      title: null,
      content: commentResponse.content,
      writerName: commentResponse.userName,
      createdAt: commentResponse.createdAt,
    };
    console.log('[Response] 신고 상세보기 모달에 필요한 정보만 추출: ', reportedContent);
    return reportedContent;
  }

  // 커뮤니티 서버스의 대댓글 조회
  // /community/reply/{commentId}
  async getCommunityReply(contentId: number): Promise<ReportedContent> {
    console.log('[API] 커뮤니티 서비스 대댓글선택');
    const replyResponse = await apiClient.get<{
      content: string;
      userName: string;
      createdAt: string;
    }>('/community/reply/' + contentId, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log('[API] 커뮤니티 서비스 단일대댓글조회 API 응답: ', replyResponse);
    const reportedContent: ReportedContent = {
      title: null,
      content: replyResponse.content,
      writerName: replyResponse.userName,
      createdAt: replyResponse.createdAt,
    };
    console.log('[Response] 신고 상세보기 모달에 필요한 정보만 추출: ', reportedContent);
    return reportedContent;
  }

  // 토론 서비스의 댓글 조회
  // /debate/comment/{commentId}
  async getDebateComment(contentId: number): Promise<ReportedContent> {
    console.log('[API] 토론 서비스 댓글 선택');
    const commentResponse = await apiClient.get<{
      content: string;
      userName: string;
      createdAt: string;
    }>('/debate/comment/' + contentId, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log('[API] 토론 서비스 단일댓글조회 API 응답: ', commentResponse);
    const reportedContent: ReportedContent = {
      title: null,
      content: commentResponse.content,
      writerName: commentResponse.userName,
      createdAt: commentResponse.createdAt,
    };
    console.log('[Response] 신고 상세보기 모달에 필요한 정보만 추출: ', reportedContent);
    return reportedContent;
  }

  // 토론 서비스의 대댓글 조회
  // /debate/reply/{replyId}
  async getDebateReply(contentId: number): Promise<ReportedContent> {
    console.log('[API] 토론 서비스 대댓글 선택');
    const replyResponse = await apiClient.get<{
      content: string;
      userName: string;
      createdAt: string;
    }>('/debate/reply/' + contentId, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log('[API] 토론 서비스 단일대댓글조회 API 응답: ', replyResponse);
    const reportedContent: ReportedContent = {
      title: null,
      content: replyResponse.content,
      writerName: replyResponse.userName,
      createdAt: replyResponse.createdAt,
    };
    console.log('[Response] 신고 상세보기 모달에 필요한 정보만 추출: ', reportedContent);
    return reportedContent;
  }

  // 신고컨텐츠 조회
  async getReportedContent(
    serviceType: ServiceType,
    targetType: TargetType,
    contentId: number
  ): Promise<ReportedContent> {
    console.log('[API] 신고된컨텐츠 조회 시작');
    console.log('[API] 선택된 컨텐츠 선별');
    if (serviceType === ServiceType.COMMUNITY) {
      switch (targetType) {
        case TargetType.POST:
          return this.getCommunityPost(contentId);
        case TargetType.COMMENT:
          return this.getCommunityComment(contentId);
        case TargetType.REPLY:
          return this.getCommunityReply(contentId);
      }
    } else {
      if (targetType === TargetType.COMMENT) {
        return this.getDebateComment(contentId);
      } else {
        return this.getDebateReply(contentId);
      }
    }
  }

  // 커뮤니티서비스의 게시글 삭제
  // /community/post/{postId}
  async deleteCommunityPost(postId: number | undefined): Promise<void> {
    console.log('[API] 커뮤니티 서비스 게시글 선택');
    const deleteResponse = await apiClient.delete('/community/post/' + postId, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log('[API] 게시글삭제 API 응답: ', deleteResponse);
  }

  // 커뮤니티서비스의 댓글 삭제
  // /community/comment/{commentId}
  async deleteCommunityComment(commentId: number | undefined): Promise<void> {
    console.log('[API] 커뮤니티 서비스 댓글 선택');
    const deleteResponse = await apiClient.delete('/community/comment/' + commentId, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log('[API] 댓글삭제 API 응답: ', deleteResponse);
  }

  // 커뮤니티서비스의 대댓글 삭제
  // /community/reply/{replyId}
  async deleteCommunityReply(replyId: number | undefined): Promise<void> {
    console.log('[API] 커뮤니티 서비스 대댓글 선택');
    const deleteResponse = await apiClient.delete('/community/reply/' + replyId, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log('[API] 대댓글삭제 API 응답: ', deleteResponse);
  }

  // 토론서비스의 댓글 삭제
  // /debate/comment/{commentId}
  async deleteDebateComment(commentId: number | undefined): Promise<void> {
    console.log('[API] 커뮤니티 서비스 댓글 선택');
    const deleteResponse = await apiClient.delete('/debate/comment/' + commentId, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log('[API] 댓글삭제 API 응답: ', deleteResponse);
  }

  // 토론서비스의 대댓글 삭제
  // /debate/reply/{replyId}
  async deleteDebateReply(replyId: number | undefined): Promise<void> {
    console.log('[API] 커뮤니티 서비스 댓글 선택');
    const deleteResponse = await apiClient.delete('/debate/reply/' + replyId, {
      headers: {
        Authorization: getToken(),
      },
    });
    console.log('[API] 댓글삭제 API 응답: ', deleteResponse);
  }

  // 특정 컨텐츠
  async deleteContent(
    serviceType: ServiceType | undefined,
    targetType: TargetType | undefined,
    contentId: number | undefined
  ): Promise<void> {
    console.log('[API] 신고된 컨텐츠 삭제 시작');
    if (serviceType === ServiceType.COMMUNITY) {
      switch (targetType) {
        case TargetType.POST:
          return this.deleteCommunityPost(contentId);
        case TargetType.COMMENT:
          return this.deleteCommunityComment(contentId);
        case TargetType.REPLY:
          return this.deleteCommunityReply(contentId);
      }
    } else {
      if (targetType === TargetType.COMMENT) {
        return this.deleteDebateComment(contentId);
      } else {
        return this.deleteDebateReply(contentId);
      }
    }
  }

  // 유저 비활성화
  // /admin/reports/deactivate
  async deactivateUser(userId: number, period: number): Promise<void> {
    console.log('[API] 유저비활성화 시작');

    const temp = {
      userId: userId,
      minutes: period,
    };

    apiClient.post('/admin/reports/deactivate', temp, {
      headers: {
        Authorization: getToken(),
      },
    });
  }

  // TODO
  async readReport(reportId: number): Promise<void> {
    console.log('[API] 신고내역 읽기 시작');
  }
}

// 단일 인스턴스 생성하여 내보내기
const adminpageApi = new AdminpageApi();
export default adminpageApi;
