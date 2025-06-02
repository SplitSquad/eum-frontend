// 서버로부터 받을 챗봇 응답 형식 정의
export interface ChatResponse {
  response: string; // 실질적으로 채팅에 뿌려질 메시지
  metadata?: {
    // 추가 정보 (선택 사항 추가해도 무방)
    query: string; // 원본 질문 내용
    state?: string; // 세션 상태 값
    uid?: string; // 사용자 식별자
    error?: string; // 에러 메시지
    rag_type?: string; // 분류 정보 (RAG 매핑용)
  };
}

// Category 타입 정의: key는 내부 식별자, label은 화면 표시명
export interface Category {
  key: string; // 내부 식별자 (예: 'all', 'visa', ...)
  label: string; // 사용자에게 보여줄 이름 (예: '전체', '체류자격/비자', ...)
}

// 사이드바 컴포넌트에 전달할 props 타입 정의
export interface CategorySidebarProps {
  categories: Category[];
  selectedKey: string; // 현재 선택된 카테고리의 key
  // onSelect 제거: 외부에서 props로만 바꾸도록
}
// 채팅 메시지 객체 형태 정의
export interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  displayText?: string;
  isTyping?: boolean;
}

// ChatContent 컴포넌트 props 타입 정의
export interface ChatContentProps {
  categoryLabel?: string;
  onCategoryChange?: (newKey: string) => void;
}
