import apiClient from '@/config/axios';

export interface InfoDetail {
  informationId: number;
  title: string;
  content: string;
  userName: string;
  createdAt: string;
  views: number;
  category: string;
}

export interface InfoListResponse {
  posts: InfoDetail[];
  total: number;
  totalPages: number;
}

// 게시글 목록/검색
export const getInfoList = async ({
  page = 1,
  size = 4,
  sort = 'latest',
  category = '전체',
  keyword = '',
}: {
  page?: number;
  size?: number;
  sort?: 'latest' | 'views';
  category?: string;
  keyword?: string;
}): Promise<InfoListResponse> => {
  try {
    // 정렬 매핑
    let sortParam = sort === 'views' ? 'views' : 'latest';
    const params: any = {
      page: page - 1,
      size,
      sort: sortParam,
      category: category || '전체',
    };
    if (keyword) params.keyword = keyword;

    // 검색/일반 분기
    const url = keyword ? '/information/search' : '/information';
    const response = await apiClient.get<any>(url, { params });
    const data = response.data || response;
    console.log('info: response data', data);
    // 다양한 응답 포맷 대응
    let posts: InfoDetail[] = [];
    let total = 0;
    let totalPages = 0;
    if (Array.isArray(data.informationList)) {
      posts = data.informationList;
      total = data.total || posts.length;
      totalPages = Math.ceil(total / size);
    } else if (Array.isArray(data.content)) {
      posts = data.content;
      total = data.totalElements || posts.length;
      totalPages = data.totalPages || Math.ceil(total / size);
    } else if (Array.isArray(data)) {
      posts = data;
      total = posts.length;
      totalPages = Math.ceil(total / size);
    }

    return { posts, total, totalPages };
  } catch (error) {
    console.error('정보 목록 조회 실패:', error);
    return { posts: [], total: 0, totalPages: 0 };
  }
};

export const getInfoDetail = async (id: string | number): Promise<InfoDetail> => {
  try {
    const res = await apiClient.get(`/information/${id}`);
    return res as InfoDetail;
  } catch (error) {
    console.error('정보 상세 조회 실패:', error);
    throw new Error('정보 상세 조회에 실패했습니다.');
  }
};

export const deleteInfo = async (id: string | number): Promise<void> => {
  try {
    await apiClient.delete(`/information/${id}`);
  } catch (error) {
    console.error('정보 삭제 실패:', error);
    throw new Error('정보 삭제에 실패했습니다.');
  }
};

export const toggleBookmark = async (id: number): Promise<boolean> => {
  try {
    await apiClient.post(`/information/${id}`);
    return true;
  } catch (error) {
    console.error('북마크 토글 실패:', error);
    return false;
  }
};

// 정보글 생성
export const createInfo = async ({
  title,
  content,
  category,
  files,
}: {
  title: string;
  content: string;
  category: string;
  files: string[];
}) => {
  try {
    return await apiClient.post('/information', { title, content, category, files });
  } catch (error) {
    console.error('정보글 등록 실패:', error);
    throw new Error('정보글 등록에 실패했습니다.');
  }
};

// 정보글 수정
export const updateInfo = async ({
  id,
  title,
  content,
  files,
}: {
  id: string | number;
  title: string;
  content: string;
  files: string[];
}) => {
  try {
    return await apiClient.patch(`/information/${id}`, { title, content, files });
  } catch (error) {
    console.error('정보글 수정 실패:', error);
    throw new Error('정보글 수정에 실패했습니다.');
  }
};

// 정보글 이미지 업로드 (FormData)
export const uploadInfoImage = async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const url = '/information/file';
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', import.meta.env.VITE_API_BASE_URL + url);
    const token = localStorage.getItem('auth_token');
    if (token) xhr.setRequestHeader('Authorization', token);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        // 응답 상태와 본문을 항상 출력
        console.log('이미지 업로드 응답:', xhr.status, xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            // 응답이 JSON이면 파싱, 아니면 그대로 url로 사용
            let url = '';
            try {
              const res = JSON.parse(xhr.responseText);
              url = res.url || res.data?.url || '';
            } catch {
              // JSON 파싱 실패 시 순수 문자열로 처리
              url = xhr.responseText;
            }
            console.log('이미지 업로드 최종 url:', url);
            resolve(url);
          } catch (e) {
            reject(e);
          }
        } else {
          if (xhr.status === 413) {
            alert('이미지 용량이 너무 큽니다.');
          }
          reject(new Error('이미지 업로드 실패: ' + xhr.status));
        }
      }
    };
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress({ progress });
      }
    };
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error('Upload cancelled'));
      });
    }
    xhr.send(formData);
  });
};

export const getRecommendations = async (): Promise<any> => {
  const res = await apiClient.get('/information/recommendation');
  return res;
};

// Default export 객체 생성
const infoApi = {
  getInfoDetail,
  deleteInfo,
  getRecommendations,
};

export default infoApi;
