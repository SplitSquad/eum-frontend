/**
 * 조회수 중복 증가 방지 및 웹 로그 전송 최적화 유틸리티 (성능 최적화 버전)
 */

interface ViewRecord {
  postId: number;
  timestamp: number;
  sessionId: string;
}

interface WebLogData {
  userId: number;
  content: string;
}

interface WebLogPayload {
  UID: number;
  ClickPath: string;
  TAG: string | null;
  CurrentPath: string;
  Event: 'view' | 'click';
  Content: any;
  Timestamp: string;
}

// 환경별 로깅 설정
const IS_DEVELOPMENT = import.meta.env.DEV;
const DEBUG_LOG = IS_DEVELOPMENT; // 개발 환경에서만 로깅

// 세션 ID 생성 (브라우저 탭별로 고유)
const generateSessionId = (): string => {
  if (!sessionStorage.getItem('eum_session_id')) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('eum_session_id', sessionId);
    if (DEBUG_LOG) console.log(`[ViewTracker] 새 세션 ID 생성: ${sessionId}`);
  }
  return sessionStorage.getItem('eum_session_id')!;
};

// 현재 세션 ID (캐싱)
const SESSION_ID = generateSessionId();

// 설정값들
const VIEW_RECORDS_KEY = 'eum_view_records';
const VIEW_RECORD_EXPIRY = 30 * 60 * 1000; // 30분
const WEB_LOG_BATCH_SIZE = 10; // 배치 크기 증가 (네트워크 최적화)
const WEB_LOG_DELAY = 3000; // 3초로 증가 (불필요한 요청 감소)

// 웹 로그 큐 및 타이머 관리
let webLogQueue: WebLogData[] = [];
let webLogTimer: NodeJS.Timeout | null = null;

// localStorage 캐싱 (메모리 최적화)
let cachedViewRecords: ViewRecord[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

/**
 * 로컬 스토리지에서 조회 기록을 가져오고 만료된 기록 제거 (캐싱 적용)
 */
const getViewRecords = (): ViewRecord[] => {
  const now = Date.now();
  
  // 캐시가 유효한 경우 캐시 사용
  if (cachedViewRecords && (now - lastCacheTime) < CACHE_DURATION) {
    return cachedViewRecords;
  }

  try {
    const stored = localStorage.getItem(VIEW_RECORDS_KEY);
    if (!stored) {
      cachedViewRecords = [];
      lastCacheTime = now;
      return [];
    }
    
    const records: ViewRecord[] = JSON.parse(stored);
    
    // 만료된 기록 제거
    const validRecords = records.filter(record => 
      now - record.timestamp < VIEW_RECORD_EXPIRY
    );
    
    // 정리가 필요한 경우에만 localStorage 업데이트
    if (validRecords.length !== records.length) {
      localStorage.setItem(VIEW_RECORDS_KEY, JSON.stringify(validRecords));
      if (DEBUG_LOG) {
        console.log(`[ViewTracker] 만료된 조회 기록 ${records.length - validRecords.length}개 제거`);
      }
    }
    
    // 캐시 업데이트
    cachedViewRecords = validRecords;
    lastCacheTime = now;
    
    return validRecords;
  } catch (error) {
    if (DEBUG_LOG) console.error('[ViewTracker] 조회 기록 로드 실패:', error);
    cachedViewRecords = [];
    lastCacheTime = now;
    return [];
  }
};

/**
 * 조회 기록 저장 (캐시 무효화)
 */
const saveViewRecord = (postId: number): void => {
  try {
    const records = getViewRecords();
    const newRecord: ViewRecord = {
      postId,
      timestamp: Date.now(),
      sessionId: SESSION_ID,
    };
    
    records.push(newRecord);
    localStorage.setItem(VIEW_RECORDS_KEY, JSON.stringify(records));
    
    // 캐시 업데이트
    cachedViewRecords = records;
    lastCacheTime = Date.now();
    
    if (DEBUG_LOG) {
      console.log(`[ViewTracker] 조회 기록 저장: 게시글 ${postId} (총 ${records.length}개 기록)`);
    }
  } catch (error) {
    if (DEBUG_LOG) console.error('[ViewTracker] 조회 기록 저장 실패:', error);
  }
};

/**
 * 게시글 조회 여부 확인 (성능 최적화)
 */
const hasViewedPost = (postId: number): boolean => {
  const records = getViewRecords();
  const hasViewed = records.some(record => 
    record.postId === postId && record.sessionId === SESSION_ID
  );
  
  if (DEBUG_LOG) {
    console.log(`[ViewTracker] Post ${postId} view record check: ${hasViewed ? 'Already viewed' : 'New view'}`);
  }
  return hasViewed;
};

/**
 * 웹 로그 배치 전송 (진짜 배치 처리)
 */
const sendWebLogBatch = async (): Promise<void> => {
  if (webLogQueue.length === 0) return;
  
  const batch = [...webLogQueue];
  webLogQueue = [];
  
  const BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    if (DEBUG_LOG) console.warn('[ViewTracker] 인증 토큰이 없어 웹 로그를 전송하지 않습니다.');
    return;
  }

  try {
    // 진짜 배치 전송 - 하나의 요청으로 여러 로그 전송
    const batchPayload = {
      logs: batch,
      timestamp: new Date().toISOString(),
      batchSize: batch.length
    };

    await fetch(`${BASE}/logs/batch`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: token 
      },
      body: JSON.stringify(batchPayload),
    });
    
    if (DEBUG_LOG) {
      console.log(`[ViewTracker] 웹 로그 배치 전송 완료: ${batch.length}개`);
    }
  } catch (error) {
    if (DEBUG_LOG) console.error('[ViewTracker] 웹 로그 배치 전송 실패:', error);
    
    // 배치 API가 없는 경우 개별 전송으로 폴백
    for (const logData of batch) {
      try {
        await fetch(`${BASE}/logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token },
          body: JSON.stringify(logData),
        });
      } catch (individualError) {
        if (DEBUG_LOG) console.error('[ViewTracker] 개별 웹 로그 전송 실패:', individualError);
      }
    }
  }
};

/**
 * 웹 로그 큐에 추가 및 배치 전송 스케줄링 (성능 최적화)
 */
const queueWebLog = (webLogData: WebLogData): void => {
  webLogQueue.push(webLogData);
  
  if (DEBUG_LOG) {
    console.log(`[ViewTracker] 웹 로그 큐에 추가: ${webLogQueue.length}/${WEB_LOG_BATCH_SIZE}`);
  }
  
  // 배치 크기에 도달하면 즉시 전송
  if (webLogQueue.length >= WEB_LOG_BATCH_SIZE) {
    if (webLogTimer) {
      clearTimeout(webLogTimer);
      webLogTimer = null;
    }
    sendWebLogBatch();
    return;
  }
  
  // 타이머가 없으면 지연 전송 스케줄링
  if (!webLogTimer) {
    webLogTimer = setTimeout(() => {
      webLogTimer = null;
      sendWebLogBatch();
    }, WEB_LOG_DELAY);
  }
};

/**
 * 사용자 ID 추출 헬퍼 (캐싱 적용)
 */
let cachedUserId: number | null = null;
let lastUserIdCheck = 0;
const USER_ID_CACHE_DURATION = 60 * 1000; // 1분 캐시

const getUserId = (): number => {
  const now = Date.now();
  
  // 캐시가 유효한 경우 캐시 사용
  if (cachedUserId !== null && (now - lastUserIdCheck) < USER_ID_CACHE_DURATION) {
    return cachedUserId;
  }

  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) {
      cachedUserId = 0;
      lastUserIdCheck = now;
      return 0;
    }
    const parsed = JSON.parse(raw);
    const userId = parsed?.state?.user?.userId ?? 0;
    
    cachedUserId = userId;
    lastUserIdCheck = now;
    return userId;
  } catch {
    cachedUserId = 0;
    lastUserIdCheck = now;
    return 0;
  }
};

/**
 * 웹 로그 페이로드 생성 헬퍼
 */
const createWebLogPayload = (
  event: 'view' | 'click',
  postId: number,
  title: string,
  content?: any,
  tags?: string[],
  currentPath?: string
): WebLogData => {
  const userId = getUserId();
  const payload: WebLogPayload = {
    UID: userId,
    ClickPath: currentPath || window.location.pathname,
    TAG: tags ? tags.join(',') : null,
    CurrentPath: window.location.pathname,
    Event: event,
    Content: content || { title, postId },
    Timestamp: new Date().toISOString(),
  };
  
  return {
    userId,
    content: JSON.stringify(payload),
  };
};

/**
 * 리소스 정리 함수
 */
const cleanup = (): void => {
  if (webLogTimer) {
    clearTimeout(webLogTimer);
    webLogTimer = null;
  }
  
  // 남은 로그 전송
  if (webLogQueue.length > 0) {
    sendWebLogBatch();
  }
  
  // 캐시 초기화
  cachedViewRecords = null;
  cachedUserId = null;
};

/**
 * 메인 ViewTracker 클래스 (성능 최적화 버전)
 */
export class ViewTracker {
  /**
   * 게시글 조회 여부만 확인 (조회 기록에 추가하지 않음)
   */
  static hasViewedPost(postId: number): boolean {
    return hasViewedPost(postId);
  }
  
  /**
   * 게시글 조회 기록 추가 (웹 로그 전송 없이)
   */
  static markAsViewed(postId: number): void {
    saveViewRecord(postId);
  }
  
  /**
   * 웹 로그만 전송 (조회 기록 추가 없이)
   */
  static sendViewLog(
    postId: number,
    title: string,
    content?: string,
    tags?: string[],
    currentPath?: string
  ): void {
    const webLogData = createWebLogPayload(
      'view',
      postId,
      title,
      { title, content: content || '' },
      tags,
      currentPath
    );
    queueWebLog(webLogData);
  }

  /**
   * 게시글 조회 추적 (조회수 증가 및 웹 로그 전송)
   */
  static async trackPostView(
    postId: number,
    title: string,
    content?: string,
    tags?: string[],
    currentPath?: string
  ): Promise<boolean> {
    // 이미 조회한 게시글인지 확인
    if (hasViewedPost(postId)) {
      return false;
    }
    
    // 조회 기록 저장
    saveViewRecord(postId);
    
    // 웹 로그 큐에 추가
    const webLogData = createWebLogPayload(
      'view',
      postId,
      title,
      { title, content: content || '' },
      tags,
      currentPath
    );
    queueWebLog(webLogData);
    
    return true;
  }
  
  /**
   * 게시글 클릭 추적 (조회수 증가 없이 클릭 로그만)
   */
  static trackPostClick(
    postId: number,
    title: string,
    tags?: string[],
    currentPath?: string
  ): void {
    const webLogData = createWebLogPayload(
      'click',
      postId,
      title,
      { title, postId },
      tags,
      currentPath
    );
    queueWebLog(webLogData);
  }
  
  /**
   * 조회 기록 수동 초기화 (디버깅용)
   */
  static clearViewRecords(): void {
    localStorage.removeItem(VIEW_RECORDS_KEY);
    cachedViewRecords = null;
    if (DEBUG_LOG) console.log('[ViewTracker] 조회 기록 초기화 완료');
  }
  
  /**
   * 현재 조회 기록 조회 (디버깅용)
   */
  static getViewRecords(): ViewRecord[] {
    const records = getViewRecords();
    if (DEBUG_LOG) console.log(`[ViewTracker] 현재 조회 기록: ${records.length}개`, records);
    return records;
  }
  
  /**
   * 남은 웹 로그 강제 전송
   */
  static async flushWebLogs(): Promise<void> {
    if (webLogTimer) {
      clearTimeout(webLogTimer);
      webLogTimer = null;
    }
    await sendWebLogBatch();
  }
  
  /**
   * 리소스 정리
   */
  static cleanup(): void {
    cleanup();
  }
  
  /**
   * 캐시 강제 새로고침
   */
  static refreshCache(): void {
    cachedViewRecords = null;
    cachedUserId = null;
    lastCacheTime = 0;
    lastUserIdCheck = 0;
  }
}

// 페이지 언로드 시 리소스 정리
window.addEventListener('beforeunload', cleanup);

// 페이지 숨김 시 리소스 정리 (모바일 최적화)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cleanup();
  }
});

export default ViewTracker; 