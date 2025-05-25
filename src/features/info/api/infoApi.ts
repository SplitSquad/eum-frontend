import apiClient from '../../../config/axios';

interface InformationDetail {
  informationId: number;
  title: string;
  content: string;
  userName: string;
  createdAt: string;
  views: number;
  category: string;
  isState: number;
}

interface RecommendationResponse {
  analysis: {
    '교통': number;
    '비자/법률': number;
    '금융/세금': number;
    '교육': number;
    '주거/부동산': number;
    '의료/건강': number;
    '쇼핑': number;
    '취업/직장': number;
    [key: string]: number;
  };
  informationList: InformationDetail[][];
}

class InfoApi {
  /**
   * 웹로그 기반 정보글 조회 API
   * 사용자의 활동 분석을 기반으로 정보글을 추천받음
   */
  async getRecommendations(): Promise<RecommendationResponse> {
    return apiClient.get<RecommendationResponse>('/information/recommendation');
  }

  /**
   * 정보글 상세 조회
   * @param informationId 정보글 ID
   */
  async getInfoDetail(informationId: number): Promise<InformationDetail> {
    return apiClient.get<InformationDetail>(`/information/${informationId}`);
  }

  /**
   * 정보글 목록 조회
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @param category 카테고리 (선택)
   * @param sort 정렬 기준 (선택)
   */
  async getInfoList(page: number, size: number, category?: string, sort?: string): Promise<{
    informationList: InformationDetail[];
    total: number;
  }> {
    return apiClient.get<{
      informationList: InformationDetail[];
      total: number;
    }>('/information', {
      params: {
        page,
        size,
        category: category || '전체',
        sort: sort || 'createdAt'
      }
    });
  }
}

export const infoApi = new InfoApi();
export default infoApi; 