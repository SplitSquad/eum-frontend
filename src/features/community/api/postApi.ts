import apiClient from './apiClient';
import {
  Post,
  PostSummary,
  ReactionType,
  User,
  CommentType as Comment,
} from '../types-folder/index';
import axios, { AxiosResponse } from 'axios';

// 로컬에서 필요한 타입 정의
type PostType = '자유' | '모임';

// API 요청 타입 정의
export interface ApiCreatePostRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  language?: string;
  emotion?: string;
  postType?: PostType;
  address?: string;
}

export interface ApiUpdatePostRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  language?: string;
  emotion?: string;
  removeFileIds?: number[];
  postType?: PostType;
  address?: string;
}

// PostListResponse 타입 정의
export interface PostListResponse {
  postList: PostSummary[];
  total: number;
  totalPages: number;
}

// PageResponse 타입 정의
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// 검색을 위한 파라미터 타입 정의
export interface PostSearchParams {
  keyword: string;
  searchType: string; // 'title' | 'content' | 'writer'
  page?: number;
  size?: number;
  category?: string;
  location?: string;
  postType?: PostType | string; // postType 파라미터 추가
  tag?: string;
}

// 게시글 검색 파라미터 인터페이스
interface SearchPostsParams {
  keyword?: string;
  tag?: string;
  page?: number;
  size?: number;
  sort?: string;
  category?: string; // 카테고리 속성 추가
  location?: string; // 지역 속성 추가
  postType?: PostType | string; // 게시글 타입 속성 추가
}

// 백엔드의 검색 응답 형식을 위한 인터페이스 (Spring Data 페이징 응답 형식)
interface SearchResponseData {
  content: Post[];
  totalElements: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  first: boolean;
  last: boolean;
}

/**
 * 게시글 API 관련 상수 및 유틸리티
 */
const BASE_URL = '/community/post';

// PostType 변환 유틸리티
function toPostType(value: any): '모임' | '자유' | '전체' {
  if (value === '모임' || value === '자유' || value === '전체') return value;
  return '자유';
}

/**
 * 게시글 관련 API
 */
export const PostApi = {
  /**
   * 게시글 목록 조회 (페이징, 필터링, 정렬)
   */
  getPosts: async (params: {
    page?: number;
    size?: number;
    category?: string;
    sortBy?: string;
    location?: string;
    tag?: string;
    postType?: PostType;
  }): Promise<PostListResponse> => {
    try {
      console.log('[DEBUG] getPosts 요청 시작, 원본 파라미터:', params);

      // 카테고리 번역 매핑 (다국어 → 한국어)
      const categoryMapping: Record<string, string> = {
        // 영어
        'All': '전체',
        'Free': '자유',
        'Meeting': '모임',
        'Tourism': '관광/체험',
        'Food': '식도락/맛집',
        'Culture': '문화/예술',
        'Sports': '스포츠/레저',
        'Study': '스터디/교육',
        'Business': '비즈니스/네트워킹',
        'Other': '기타',
        // 스페인어
        'Todos': '전체',
        'Libre_es': '자유',
        'Reunión': '모임',
        'Turismo': '관광/체험',
        'Comida': '식도락/맛집',
        'Cultura_es': '문화/예술',
        'Deportes': '스포츠/레저',
        'Estudio': '스터디/교육',
        'Negocios': '비즈니스/네트워킹',
        'Otro': '기타',
        // 프랑스어
        'Tout': '전체',
        'Libre_fr': '자유',
        'Réunion': '모임',
        'Tourisme': '관광/체험',
        'Nourriture': '식도락/맛집',
        'Culture_fr': '문화/예술',
        'Sports_fr': '스포츠/레저',
        'Étude': '스터디/교육',
        'Affaires': '비즈니스/네트워킹',
        'Autre': '기타',
        // 독일어
        'Alle': '전체',
        'Frei': '자유',
        'Treffen': '모임',
        'Tourismus': '관광/체험',
        'Essen': '식도락/맛집',
        'Kultur': '문화/예술',
        'Sport': '스포츠/레저',
        'Studium': '스터디/교육',
        'Geschäft': '비즈니스/네트워킹',
        'Andere': '기타',
        // 일본어
        'すべて': '전체',
        '自由_ja': '자유',
        'ミーティング': '모임',
        '観光': '관광/체험',
        'グルメ': '식도락/맛집',
        '文化_ja': '문화/예술',
        'スポーツ': '스포츠/레저',
        '勉強': '스터디/교육',
        'ビジネス': '비즈니스/네트워킹',
        'その他': '기타',
        // 중국어
        '全部': '전체',
        '自由_zh': '자유',
        '聚会': '모임',
        '旅游': '관광/체험',
        '美食': '식도락/맛집',
        '文化_zh': '문화/예술',
        '运动': '스포츠/레저',
        '学习': '스터디/교육',
        '商务': '비즈니스/네트워킹',
        '其他': '기타',
        // 러시아어
        'Все': '전체',
        'Свободный': '자유',
        'Встреча': '모임',
        'Туризм': '관광/체험',
        'Еда': '식도락/맛집',
        'Культура': '문화/예술',
        'Спорт': '스포츠/레저',
        'Учеба': '스터디/교육',
        'Бизнес': '비즈니스/네트워킹',
        'Другое': '기타',
      };

      // 지역 번역 매핑 (다국어 → 한국어)
      const locationMapping: Record<string, string> = {
        // 영어
        'All': '전체',
        'Seoul': '서울',
        'Busan': '부산',
        'Daegu': '대구',
        'Incheon': '인천',
        'Gwangju': '광주',
        'Daejeon': '대전',
        'Ulsan': '울산',
        'Sejong': '세종',
        'Gyeonggi': '경기',
        'Gangwon': '강원',
        'Chungbuk': '충북',
        'Chungnam': '충남',
        'Jeonbuk': '전북',
        'Jeonnam': '전남',
        'Gyeongbuk': '경북',
        'Gyeongnam': '경남',
        'Jeju': '제주',
        // 스페인어
        'Todos_es': '전체',
        'Seúl': '서울',
        'Busán': '부산',
        'Daegu_es': '대구',
        'Incheon_es': '인천',
        'Gwangju_es': '광주',
        'Daejeon_es': '대전',
        'Ulsan_es': '울산',
        'Sejong_es': '세종',
        'Gyeonggi_es': '경기',
        'Gangwon_es': '강원',
        'Chungbuk_es': '충북',
        'Chungnam_es': '충남',
        'Jeonbuk_es': '전북',
        'Jeonnam_es': '전남',
        'Gyeongbuk_es': '경북',
        'Gyeongnam_es': '경남',
        'Jeju_es': '제주',
        // 프랑스어
        'Tous_fr': '전체',
        'Séoul': '서울',
        'Busan_fr': '부산',
        'Daegu_fr': '대구',
        'Incheon_fr': '인천',
        'Gwangju_fr': '광주',
        'Daejeon_fr': '대전',
        'Ulsan_fr': '울산',
        'Sejong_fr': '세종',
        'Gyeonggi_fr': '경기',
        'Gangwon_fr': '강원',
        'Chungbuk_fr': '충북',
        'Chungnam_fr': '충남',
        'Jeonbuk_fr': '전북',
        'Jeonnam_fr': '전남',
        'Gyeongbuk_fr': '경북',
        'Gyeongnam_fr': '경남',
        'Jeju_fr': '제주',
        // 독일어
        'Alle_de': '전체',
        'Seoul_de': '서울',
        'Busan_de': '부산',
        'Daegu_de': '대구',
        'Incheon_de': '인천',
        'Gwangju_de': '광주',
        'Daejeon_de': '대전',
        'Ulsan_de': '울산',
        'Sejong_de': '세종',
        'Gyeonggi_de': '경기',
        'Gangwon_de': '강원',
        'Chungbuk_de': '충북',
        'Chungnam_de': '충남',
        'Jeonbuk_de': '전북',
        'Jeonnam_de': '전남',
        'Gyeongbuk_de': '경북',
        'Gyeongnam_de': '경남',
        'Jeju_de': '제주',
        // 일본어
        'すべて_ja': '전체',
        'ソウル': '서울',
        '釜山': '부산',
        'テグ': '대구',
        '仁川': '인천',
        '光州': '광주',
        '大田': '대전',
        '蔚山': '울산',
        '世宗': '세종',
        '京畿': '경기',
        '江原': '강원',
        '忠北': '충북',
        '忠南': '충남',
        '全北': '전북',
        '全南': '전남',
        '慶北': '경북',
        '慶南': '경남',
        '済州': '제주',
        // 중국어
        '全部_zh': '전체',
        '首尔': '서울',
        '釜山_zh': '부산',
        '大邱': '대구',
        '仁川_zh': '인천',
        '光州_zh': '광주',
        '大田_zh': '대전',
        '蔚山_zh': '울산',
        '世宗_zh': '세종',
        '京畿_zh': '경기',
        '江原_zh': '강원',
        '忠北_zh': '충북',
        '忠南_zh': '충남',
        '全北_zh': '전북',
        '全南_zh': '전남',
        '庆北': '경북',
        '庆南': '경남',
        '济州': '제주',
        // 러시아어
        'Все_ru': '전체',
        'Сеул': '서울',
        'Пусан': '부산',
        'Тэгу': '대구',
        'Инчхон': '인천',
        'Кванджу': '광주',
        'Тэджон': '대전',
        'Ульсан': '울산',
        'Седжон': '세종',
        'Кёнгги': '경기',
        'Канвон': '강원',
        'Чунбук': '충북',
        'Чуннам': '충남',
        'Чонбук': '전북',
        'Чоннам': '전남',
        'Кёнбук': '경북',
        'Кённам': '경남',
        'Чеджу': '제주',
      };

      // API 파라미터 변환 (백엔드 파라미터명에 맞게 변환)
      const apiParams: Record<string, any> = {
        page: params.page !== undefined ? params.page : 0,
        size: params.size || 6,
        category: categoryMapping[params.category || ''] || params.category || '전체',
        sort:
          params.sortBy === 'popular' ? 'views' : params.sortBy === 'oldest' ? 'oldest' : 'latest',
      };

      // postType 번역 매핑 (다국어 → 한국어)
      const postTypeMapping: Record<string, string> = {
        // 영어
        'Free': '자유',
        'Meeting': '모임',
        'All': '전체',
        // 스페인어
        'Libre_es': '자유',
        'Reunión_es': '모임',
        'Todos_postType': '전체',
        // 프랑스어
        'Libre_fr': '자유',
        'Réunion_fr': '모임',
        'Tout_postType': '전체',
        // 독일어
        'Frei_de': '자유',
        'Treffen_de': '모임',
        'Alle_postType': '전체',
        // 일본어
        '自由_postType': '자유',
        'ミーティング_postType': '모임',
        'すべて_postType': '전체',
        // 중국어
        '自由_postType_zh': '자유',
        '聚会_postType': '모임',
        '全部_postType': '전체',
        // 러시아어
        'Свободный_ru': '자유',
        'Встреча_ru': '모임',
        'Все_postType': '전체',
      };

      // postType 처리 - 백엔드는 빈 문자열을 허용하지 않음, 항상 값이 있어야 함
      const translatedPostType = postTypeMapping[params.postType || ''] || params.postType || '자유';
      apiParams.postType = translatedPostType;

      // region(지역) 처리 - 자유 게시글이면 무조건 '자유'로, 그렇지 않으면 location 값 사용
      if (apiParams.postType === '자유') {
        apiParams.region = '자유';
      } else {
        const translatedLocation = locationMapping[params.location || ''] || params.location || '전체';
        apiParams.region = translatedLocation === '전체' ? '전체' : translatedLocation;
      }

      // 태그 번역 매핑 (다국어 → 한국어)
      const tagMapping: Record<string, string> = {
        // 영어
        'Tourism': '관광/체험',
        'Food': '식도락/맛집',
        'Transport': '교통/이동',
        'Accommodation': '숙소/지역정보',
        'Embassy': '대사관/응급',
        'Real Estate': '부동산/계약',
        'Living Environment': '생활환경/편의',
        'Culture': '문화/생활',
        'Housing': '주거지 관리/유지',
        'Academic': '학사/캠퍼스',
        'Study Support': '학업지원/시설',
        'Visa': '행정/비자/서류',
        'Dormitory': '기숙사/주거',
        'Career': '이력/채용준비',
        'Labor': '비자/법률/노동',
        'Job Fair': '잡페어/네트워킹',
        'Part Time': '알바/파트타임',
        // 스페인어
        'Turismo_es': '관광/체험',
        'Comida_es': '식도락/맛집',
        'Transporte': '교통/이동',
        'Alojamiento': '숙소/지역정보',
        'Embajada': '대사관/응급',
        'Bienes Raíces': '부동산/계약',
        'Ambiente de Vida': '생활환경/편의',
        'Cultura_es': '문화/생활',
        'Vivienda': '주거지 관리/유지',
        'Académico': '학사/캠퍼스',
        'Apoyo de Estudio': '학업지원/시설',
        'Visa_es': '행정/비자/서류',
        'Dormitorio': '기숙사/주거',
        'Carrera': '이력/채용준비',
        'Trabajo': '비자/법률/노동',
        'Feria de Trabajo': '잡페어/네트워킹',
        'Tiempo Parcial': '알바/파트타임',
        // 프랑스어
        'Tourisme_fr': '관광/체험',
        'Nourriture_fr': '식도락/맛집',
        'Transport_fr': '교통/이동',
        'Hébergement': '숙소/지역정보',
        'Ambassade': '대사관/응급',
        'Immobilier': '부동산/계약',
        'Environnement de Vie': '생활환경/편의',
        'Culture_fr': '문화/생활',
        'Logement': '주거지 관리/유지',
        'Académique_fr': '학사/캠퍼스',
        'Soutien aux Études': '학업지원/시설',
        'Visa_fr': '행정/비자/서류',
        'Dortoir': '기숙사/주거',
        'Carrière': '이력/채용준비',
        'Travail_fr': '비자/법률/노동',
        'Salon de l\'Emploi': '잡페어/네트워킹',
        'Temps Partiel': '알바/파트타임',
        // 독일어
        'Tourismus_de': '관광/체험',
        'Essen_de': '식도락/맛집',
        'Transport_de': '교통/이동',
        'Unterkunft': '숙소/지역정보',
        'Botschaft': '대사관/응급',
        'Immobilien': '부동산/계약',
        'Lebensumgebung': '생활환경/편의',
        'Kultur_de': '문화/생활',
        'Wohnen': '주거지 관리/유지',
        'Akademisch': '학사/캠퍼스',
        'Studienunterstützung': '학업지원/시설',
        'Visa_de': '행정/비자/서류',
        'Wohnheim': '기숙사/주거',
        'Karriere_de': '이력/채용준비',
        'Arbeit': '비자/법률/노동',
        'Jobmesse': '잡페어/네트워킹',
        'Teilzeit': '알바/파트타임',
        // 일본어
        '観光_ja': '관광/체험',
        'グルメ_ja': '식도락/맛집',
        '交通': '교통/이동',
        '宿泊': '숙소/지역정보',
        '大使館': '대사관/응급',
        '不動産': '부동산/계약',
        '生活環境': '생활환경/편의',
        '文化_ja': '문화/생활',
        '住居': '주거지 관리/유지',
        '学術': '학사/캠퍼스',
        '学習支援': '학업지원/시설',
        'ビザ': '행정/비자/서류',
        '寮': '기숙사/주거',
        'キャリア': '이력/채용준비',
        '労働': '비자/법률/노동',
        'ジョブフェア': '잡페어/네트워킹',
        'パートタイム': '알바/파트타임',
        // 중국어
        '旅游_zh': '관광/체험',
        '美食_zh': '식도락/맛집',
        '交通_zh': '교통/이동',
        '住宿': '숙소/지역정보',
        '大使馆': '대사관/응급',
        '房地产': '부동산/계약',
        '生活环境': '생활환경/편의',
        '文化_zh': '문화/생활',
        '住房': '주거지 관리/유지',
        '学术': '학사/캠퍼스',
        '学习支持': '학업지원/시설',
        '签证': '행정/비자/서류',
        '宿舍': '기숙사/주거',
        '职业': '이력/채용준비',
        '劳动': '비자/법률/노동',
        '招聘会': '잡페어/네트워킹',
        '兼职': '알바/파트타임',
        // 러시아어
        'Туризм_ru': '관광/체험',
        'Еда_ru': '식도락/맛집',
        'Транспорт': '교통/이동',
        'Жилье': '숙소/지역정보',
        'Посольство': '대사관/응급',
        'Недвижимость': '부동산/계약',
        'Жизненная Среда': '생활환경/편의',
        'Культура_ru': '문화/생활',
        'Жилищное Управление': '주거지 관리/유지',
        'Академический': '학사/캠퍼스',
        'Поддержка Учебы': '학업지원/시설',
        'Виза_ru': '행정/비자/서류',
        'Общежитие': '기숙사/주거',
        'Карьера': '이력/채용준비',
        'Труд': '비자/법률/노동',
        'Ярмарка Вакансий': '잡페어/네트워킹',
        'Частичная Занятость': '알바/파트타임',
      };

      // 태그 처리
      if (params.tag && params.tag !== '전체') {
        // 콤마로 분리된 태그 문자열을 배열로 변환
        const tagsArray = params.tag.split(',').map(tag => {
          const trimmedTag = tag.trim();
          // 태그 번역 적용
          return tagMapping[trimmedTag] || trimmedTag;
        });
        // 태그 배열을 직접 할당
        apiParams.tags = tagsArray;

        // 로그에 태그 정보 명확하게 표시
        console.log('[DEBUG] 태그 필터링 적용:', { 
          원본태그: params.tag, 
          번역태그배열: tagsArray 
        });
      }

      // 번역 결과 로그
      console.log('[DEBUG] 파라미터 번역 결과:', {
        원본카테고리: params.category,
        번역카테고리: apiParams.category,
        원본지역: params.location,
        번역지역: apiParams.region,
        원본타입: params.postType,
        번역타입: apiParams.postType,
      });

      // 실제 API 요청 로그
      console.log('[DEBUG] 서버로 전송되는 최종 파라미터:', apiParams);

      // 실제 API 호출
      const response = await apiClient.get<any>(BASE_URL, {
        params: apiParams,
        paramsSerializer: params => {
          // URLSearchParams를 사용하여 직접 쿼리 문자열 생성
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              // 배열인 경우 key[]=value1&key[]=value2 형식으로 직렬화
              value.forEach(v => searchParams.append(`${key}[]`, v));
            } else {
              searchParams.append(key, String(value));
            }
          });
          return searchParams.toString();
        },
      });

      console.log('[DEBUG] 게시글 목록 원본 응답 데이터:', response);

      // 안전하게 데이터 추출 및 변환
      let posts: PostSummary[] = [];
      let total = 0;

      // 백엔드 응답 구조에 따라 적절히 처리
      if (response && typeof response === 'object') {
        // 응답에 postList가 있는 경우 (기존 API 형식)
        if (Array.isArray(response.postList)) {
          posts = response.postList;
          total = typeof response.total === 'number' ? response.total : posts.length;
          console.log('[DEBUG] 백엔드 응답에서 postList 배열 추출:', {
            postsLength: posts.length,
            totalCount: total,
          });
        }
        // Spring Data 표준 페이징 응답 형식인 경우
        else if (Array.isArray(response.content)) {
          posts = response.content as PostSummary[];
          total =
            typeof response.totalElements === 'number' ? response.totalElements : posts.length;
          console.log('[DEBUG] 백엔드 응답에서 content 배열 추출:', {
            postsLength: posts.length,
            totalCount: total,
          });
        }
        // 응답 자체가 배열인 경우
        else if (Array.isArray(response)) {
          posts = response as PostSummary[];
          total = response.length;
          console.log('[DEBUG] 백엔드 응답이 직접 배열 형태:', {
            postsLength: posts.length,
          });
        }
      }

      // 각 게시물에 대해 필드 확인 및 결측치 처리
      posts = posts.map((post: any) => {
        if (!post)
          return {
            postId: 0,
            title: '[데이터 오류]',
            content: '',
            writer: { userId: 0, nickname: '알 수 없음', profileImage: '', role: 'USER' },
            createdAt: new Date().toISOString(),
            viewCount: 0,
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 0,
            category: '전체',
            tags: [],
            status: 'ACTIVE' as const,
            postType: '자유' as const,
            address: '자유',
          };
        return {
          ...post,
          title: post.title || '[제목 없음]',
          content: post.content || '',
          dislikeCount: post.dislikeCount || 0,
          postId: post.postId,
          writer: {
            userId: post.userId || 0,
            nickname: post.userName || '알 수 없음',
            profileImage: '',
            role: 'USER',
          },
          viewCount: post.views || 0,
          likeCount: post.like || 0,
          commentCount: post.commentCnt || 0,
          category: post.category || '전체',
          createdAt: post.createdAt || new Date().toISOString(),
          postType: typeof post.postType === 'string' ? toPostType(post.postType) : post.postType,
          address: post.address || '자유',
          thumbnail: post.files && post.files.length > 0 ? post.files[0] : null,
          status: (post.status as 'ACTIVE' | 'INACTIVE' | 'DELETED') || 'ACTIVE',
        };
      }) as PostSummary[];

      // 페이징 계산 - 페이지당 6개 기준으로 총 페이지 수 계산
      const totalPages = Math.ceil(total / 6);

      console.log(
        `[DEBUG] 게시글 목록 처리 완료: ${posts.length}개 게시글, 총 ${total}개, 총 페이지: ${totalPages}`
      );

      const result: PostListResponse = {
        postList: posts,
        total: total,
        totalPages: totalPages,
      };

      return result;
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);

      // 서버 에러가 발생한 경우 클라이언트에서 기본값 제공
      return {
        postList: [],
        total: 0,
        totalPages: 0,
      };
    }
  },

  /**
   * 인기 게시글 조회
   */
  getTopPosts: async (count: number = 5): Promise<Post[]> => {
    try {
      // 추천 게시글 API 사용
      const response = await apiClient.get<any>(`${BASE_URL}/recommendation`, {
        params: { tag: '전체', cnt: count },
      });

      // 백엔드 응답 구조에 맞게 처리
      const posts = response.postList || [];

      return posts.map((post: any) => ({
        ...post,
        content: post.content || '',
        writer: {
          userId: post.userId || 0,
          nickname: post.userName || '알 수 없음',
          profileImage: '',
          role: 'USER',
        },
        viewCount: post.views || 0,
        likeCount: post.like || 0,
        dislikeCount: post.dislike || 0,
        commentCount: post.commentCnt || 0,
        postType: post.postType || '자유',
        address: post.address || '자유',
        thumbnail: post.files && post.files.length > 0 ? post.files[0] : null,
      })) as Post[];
    } catch (error) {
      console.error('인기 게시글 조회 실패:', error);
      return [];
    }
  },

  /**
   * 최신 게시글 조회
   */
  getRecentPosts: async (count: number = 5): Promise<Post[]> => {
    try {
      // getPosts 함수를 재사용하여 최신 게시글 조회
      const response = await PostApi.getPosts({
        page: 0,
        size: count,
        sortBy: 'latest',
        category: '전체',
      });

      return (response.postList as Post[]) || [];
    } catch (error) {
      console.error('최신 게시글 조회 실패:', error);
      return [];
    }
  },

  /**
   * 게시글 검색 - 검색어, 태그 등으로 게시글 검색
   */
  searchPosts: async (
    keyword: string,
    searchBy: string = 'title_content',
    options: {
      page?: number;
      size?: number;
      sort?: string;
      postType?: string;
      region?: string;
      category?: string;
    } = {}
  ): Promise<PostListResponse> => {
    try {
      console.log('[API 요청] searchPosts:', { keyword, searchBy, ...options });

      // 검색 요청을 위한 기본 URL 경로 설정
      const endpoint = `${BASE_URL}/search`;

      // 검색 요청 파라미터 설정 - URLSearchParams 사용하여 파라미터 직접 구성
      const searchParams = new URLSearchParams();

      // 영어로 된 searchBy를 백엔드에서 기대하는 한글로 변환
      let searchByValue: string;
      switch (searchBy) {
        case 'title':
          searchByValue = '제목';
          break;
        case 'content':
          searchByValue = '내용';
          break;
        case 'writer':
          searchByValue = '작성자';
          break;
        case 'title_content':
          searchByValue = '제목_내용';
          break;
        default:
          // 이미 한글로 전달된 경우를 처리
          if (['제목', '내용', '작성자', '제목_내용'].includes(searchBy)) {
            searchByValue = searchBy;
          } else {
            searchByValue = '제목_내용'; // 기본값
          }
      }

      console.log('[DEBUG] 변환된 searchBy 값:', { 원래값: searchBy, 변환값: searchByValue });

      // 페이지네이션 파라미터
      searchParams.append('page', String(options.page || 0));
      searchParams.append('size', String(options.size || 10));

      // 검색 필수 파라미터 - keyword와 searchBy 필드
      searchParams.append('keyword', keyword);
      searchParams.append('searchBy', searchByValue);

      // 정렬 파라미터 (backend format: "latest", "oldest", "views")
      const sortValue = options.sort || 'createdAt,desc';
      // SpringBoot 형식의 sort를 backend 형식으로 변환
      let backendSort;
      if (sortValue.includes('createdAt,desc')) {
        backendSort = 'latest';
      } else if (sortValue.includes('createdAt,asc')) {
        backendSort = 'oldest';
      } else if (sortValue.includes('views')) {
        backendSort = 'views';
      } else {
        backendSort = 'latest'; // 기본값
      }
      searchParams.append('sort', backendSort);

      // 카테고리 (전체인 경우 '전체' 값으로 명시적 전달)
      searchParams.append('category', options.category || '전체');

      // 지역 파라미터 (빈 값이면 '전체'로 설정)
      searchParams.append('region', options.region || '전체');

      // 게시글 타입 (없으면 '자유'로 설정)
      searchParams.append('postType', options.postType || '자유');

      // URL 생성 (파라미터가 직접 포함된 URL)
      const requestUrl = `${endpoint}?${searchParams.toString()}`;

      console.log('[DEBUG] 최종 요청 URL:', requestUrl);

      // API 요청 (직접 URL 사용)
      const response = await apiClient.get<any>(requestUrl);

      console.log('[API 응답] searchPosts 원본 응답:', response);

      // 게시글 목록과 페이징 정보 추출
      let posts: any[] = [];
      let total = 0;
      let totalPages = 0;

      // Spring Data Page 객체 처리를 위한 응답 데이터 정규화
      // 백엔드 응답이 "Page X of Y containing Z instances" 형식으로 출력되는 경우를 처리
      const data = response;

      console.log(
        '[API 응답 파싱] 데이터 타입:',
        typeof data,
        '자바스크립트 객체 여부:',
        data !== null && typeof data === 'object'
      );

      // 응답 형식에 따른 처리 (더 상세한 로깅 추가)
      if (data) {
        // Spring Data Page 객체인 경우 (toString() 메서드로 인해 출력은 "Page X of Y" 형식)
        console.log('[DEBUG] 데이터 구조 검사:', {
          hasPostList: !!data.postList,
          hasContent: !!data.content,
          hasTotal: !!data.total,
          hasTotalElements: !!data.totalElements,
        });

        // 백엔드 맵핑 응답 구조: { postList: [...], total: n } 형식
        if (data.postList) {
          console.log(
            '[DEBUG] postList 배열 발견:',
            Array.isArray(data.postList) ? data.postList.length : 'not array'
          );
          posts = Array.isArray(data.postList) ? data.postList : [];
          total = data.total || 0;
          totalPages = data.totalPages || Math.ceil(total / (options.size || 10));
        }
        // Spring Data JPA Page 객체 형식: { content: [...], totalElements: n, totalPages: n } 형식
        else if (data.content) {
          console.log(
            '[DEBUG] content 배열 발견:',
            Array.isArray(data.content) ? data.content.length : 'not array'
          );
          posts = Array.isArray(data.content) ? data.content : [];
          total = data.totalElements || 0;
          totalPages = data.totalPages || Math.ceil(total / (options.size || 10));
        }
        // 직접 배열인 경우
        else if (Array.isArray(data)) {
          console.log('[DEBUG] 응답이 직접 배열:', data.length);
          posts = data;
          total = posts.length;
          totalPages = Math.ceil(total / (options.size || 10));
        }
        // 형식을 파악할 수 없는 경우 (객체이지만 예상 필드가 없음)
        else if (typeof data === 'object') {
          console.warn('[WARN] 예상하지 못한 응답 형식. 각 필드를 검사합니다:', Object.keys(data));

          // 객체의 각 최상위 속성을 검사하여 배열 찾기
          let arrayFound = false;
          for (const key in data) {
            if (Array.isArray(data[key])) {
              console.log(`[DEBUG] 배열 필드 발견: ${key}, 길이: ${data[key].length}`);
              posts = data[key];
              arrayFound = true;

              // total 값도 같이 찾기
              if (typeof data['total'] === 'number') {
                total = data['total'];
              } else if (typeof data['totalElements'] === 'number') {
                total = data['totalElements'];
              } else {
                total = posts.length;
              }

              break;
            }
          }

          // 배열을 찾지 못한 경우, 객체 자체가 단일 게시글일 수 있음
          if (!arrayFound) {
            console.warn('[WARN] 응답에서 배열을 찾을 수 없습니다. 단일 객체 응답으로 처리합니다.');

            // 객체에 postId 같은 핵심 필드가 있는지 확인
            if (data.postId || data.id) {
              posts = [data];
              total = 1;
            } else {
              posts = [];
              total = 0;
            }
          }

          totalPages = Math.ceil(total / (options.size || 10));
        }
      }

      console.log('[DEBUG] 파싱된 데이터:', {
        postsLength: posts.length,
        total,
        totalPages,
        firstItem: posts.length > 0 ? { ...posts[0] } : 'no items',
      });

      // 게시글 데이터 정규화
      const normalizedPosts = posts.map((post: any) => {
        if (!post) {
          return {
            postId: 0,
            writerId: 0,
            title: '[데이터 오류]',
            content: '',
            writer: { userId: 0, nickname: '알 수 없음', profileImage: '', role: 'USER' },
            createdAt: new Date().toISOString(),
            viewCount: 0,
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 0,
            category: '전체',
            tags: [],
            status: 'ACTIVE' as const,
            postType: '자유' as const,
            address: '자유',
          };
        }

        return {
          postId: post.postId || post.id || 0,
          writerId: post.userId || post.writerId || post.writer?.userId || 0,
          title: post.title || '[제목 없음]',
          content: post.content || '',
          writer: {
            userId: post.userId || post.writer?.userId || 0,
            nickname: post.userName || post.writer?.nickname || '알 수 없음',
            profileImage: post.writer?.profileImage || '',
            role: post.writer?.role || 'USER',
          },
          createdAt: post.createdAt || new Date().toISOString(),
          viewCount: post.views || post.viewCount || 0,
          likeCount: post.like || post.likeCount || 0,
          dislikeCount: post.dislike || post.dislikeCount || 0,
          commentCount: post.commentCnt || post.commentCount || 0,
          category: post.category || '전체',
          tags: post.tags || [],
          status: (post.status as 'ACTIVE' | 'INACTIVE' | 'DELETED') || 'ACTIVE',
          postType: typeof post.postType === 'string' ? toPostType(post.postType) : post.postType,
          address: post.address || post.location || '자유',
          thumbnail: post.files && post.files.length > 0 ? post.files[0] : null,
        };
      });

      const result = {
        postList: normalizedPosts,
        total,
        totalPages,
      };

      console.log('[DEBUG] 최종 결과:', {
        postsCount: normalizedPosts.length,
        total,
        totalPages,
      });

      return result;
    } catch (error) {
      console.error('게시글 검색 실패:', error);
      return {
        postList: [],
        total: 0,
        totalPages: 0,
      };
    }
  },

  /**
   * 게시글 상세 조회
   */
  getPostById: async (postId: number, signal?: AbortSignal, noViewCount: boolean = false): Promise<Post> => {
    try {
      // 조회수를 증가시키지 않는 옵션 추가 (언어 변경 시 사용)
      const url = noViewCount 
        ? `${BASE_URL}/${postId}?noViewCount=true` 
        : `${BASE_URL}/${postId}`;
        
      const response = await apiClient.get<any>(url, { signal });

      // 백엔드 응답 구조와 일치하도록 데이터 변환
      return {
        ...response,
        // 백엔드 응답 필드와 프론트엔드 필드 맵핑
        writer: {
          userId: response.userId || 0,
          nickname: response.userName || '알 수 없음',
          profileImage: '',
          role: 'USER',
        },
        viewCount: response.views || 0,
        likeCount: response.like || 0,
        dislikeCount: response.dislike || 0,
        commentCount: response.commentCnt || 0,
        myReaction: response.isState || null, // isState를 myReaction으로 변환
        // 추가된 필드
        postType:
          typeof response.postType === 'string' ? toPostType(response.postType) : response.postType,
        address: response.address || '자유',
        // 썸네일 처리
        thumbnail: response.files && response.files.length > 0 ? response.files[0] : null,
      };
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 게시글 조회수 증가
   * 참고: 현재 getPostById API 호출 시 백엔드에서 자동으로 조회수가 증가하므로 
   * 이 메서드는 실제로 호출하지 않아야 합니다. noViewCount=true 파라미터를 사용하여
   * 필요한 경우 조회수 증가를 방지할 수 있습니다.
   */
  increaseViewCount: async (postId: number): Promise<void> => {
    // 사용하지 않는 함수이지만 호환성을 위해 유지
    console.log('게시글 조회수는 백엔드에서 자동 증가됩니다. (ID:', postId, ')');
    return;
  },

  /**
   * 게시글 작성
   */
  createPost: async (postDto: ApiCreatePostRequest, files: File[] = []): Promise<Post> => {
    try {
      // DTO 기본값 채우기
      const dto = {
        ...postDto,
        language: postDto.language || 'ko',
        emotion: postDto.emotion || 'NONE',
        // 대분류 카테고리가 없으면 '전체'로 설정
        category: postDto.category || '전체',
        // postType이 없으면 '자유'로 설정
        postType: postDto.postType || '자유',
        // 자유 게시글은 '자유'로, 모임 게시글은 선택된 지역 사용
        address: postDto.postType === '자유' ? '자유' : postDto.address || '',
      };

      console.log('[DEBUG] 게시글 작성 요청 DTO:', dto);

      // FormData 구성
      const formData = new FormData();

      // 1) "post" 파트에 DTO 전체를 JSON 블롭으로 append
      const jsonBlob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
      formData.append('post', jsonBlob);

      // 2) "files" 파트에 파일들 append
      if (files && files.length > 0) {
        files.forEach(file => formData.append('files', file));
      }

      // 3) API 요청
      return await apiClient.post<Post>(BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      throw error;
    }
  },

  /**
   * 게시글 수정
   */
  updatePost: async (
    postId: number,
    postDto: ApiUpdatePostRequest,
    files: File[] = []
  ): Promise<Post> => {
    try {
      // DTO 기본값 채우기
      const dto = {
        ...postDto,
        language: postDto.language || 'ko',
        emotion: postDto.emotion || 'NONE',
        // 대분류 카테고리가 없으면 '전체'로 설정
        category: postDto.category || '전체',
        // postType이 없으면 '자유'로 설정
        postType: postDto.postType || '자유',
        // 자유 게시글은 '자유'로, 모임 게시글은 선택된 지역 사용
        address: postDto.postType === '자유' ? '자유' : postDto.address || '',
      };

      console.log('[DEBUG] 게시글 수정 요청 DTO:', dto);

      // FormData 구성
      const formData = new FormData();

      // 1) "post" 파트에 DTO 전체를 JSON 블롭으로 append
      const jsonBlob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
      formData.append('post', jsonBlob);

      // 2) "files" 파트에 파일들 append
      if (files && files.length > 0) {
        files.forEach(file => formData.append('files', file));
      }

      // 3) API 요청
      return await apiClient.patch<Post>(`${BASE_URL}/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      throw error;
    }
  },

  /**
   * 게시글 삭제
   */
  deletePost: async (postId: number): Promise<void> => {
    try {
      await apiClient.delete(`${BASE_URL}/${postId}`);
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      throw error;
    }
  },

  /**
   * 게시글 좋아요/싫어요 반응
   */
  reactToPost: async (
    postId: number,
    option: 'LIKE' | 'DISLIKE'
  ): Promise<{ like: number; dislike: number }> => {
    try {
      const emotionMapping: Record<string, string> = {
        LIKE: '좋아요',
        DISLIKE: '싫어요',
      };

      const response = await apiClient.post<{ like: number; dislike: number }>(
        `${BASE_URL}/emotion/${postId}`,
        { emotion: emotionMapping[option] }
      );

      return response;
    } catch (error) {
      console.error('게시글 반응 추가 실패:', error);
      throw error;
    }
  },

  /**
   * 내가 작성한 게시글 조회
   */
  getMyPosts: async (
    userId: number,
    page: number = 0,
    size: number = 6
  ): Promise<PostListResponse> => {
    try {
      const response = await apiClient.get<any>(`${BASE_URL}/written`, {
        params: { userId, page, size },
      });

      // 응답 데이터 처리 - 게시글 목록과 동일한 구조로 변환
      let posts = response.postList || [];
      const total = response.total || 0;

      // 각 게시물 필드 변환 (getPosts와 동일한 로직)
      posts = posts.map((post: any) => {
        return {
          ...post,
          title: post.title || '[제목 없음]',
          content: post.content || '',
          // 백엔드 응답 필드와 프론트엔드 필드 맵핑
          postId: post.postId,
          writer: {
            userId: post.userId || 0,
            nickname: post.userName || '알 수 없음',
            profileImage: '',
            role: 'USER',
          },
          viewCount: post.views || 0,
          likeCount: post.like || 0,
          dislikeCount: post.dislike || 0,
          commentCount: post.commentCnt || 0,
          category: post.category || '전체',
          tags: post.tags,
          createdAt: post.createdAt || new Date().toISOString(),
          // 추가된 필드
          postType: typeof post.postType === 'string' ? toPostType(post.postType) : post.postType,
          address: post.address || '자유',
          // 썸네일 처리
          thumbnail: post.files && post.files.length > 0 ? post.files[0] : null,
        };
      });

      return {
        postList: posts,
        total,
        totalPages: Math.ceil(total / size),
      };
    } catch (error) {
      console.error('내 게시글 조회 실패:', error);
      return { postList: [], total: 0, totalPages: 0 };
    }
  },
};

// 기존 코드와의 호환성을 위한 default export
export default PostApi;
