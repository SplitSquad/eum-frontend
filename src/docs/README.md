# EUM Front 프로젝트 가이드



## 의존성 설치

기본적으로 package.json에 업데이트가 다 되어서 아마 잘 실행될 겁니다.

프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 모든 필요한 의존성을 설치합니다:

```bash
# npm 사용
npm install

# 또는 yarn 사용
yarn install
```

<br>

## 실행 방법

### 개발 모드 실행

로컬 개발 서버를 시작하려면:

```bash
npm run dev
```

이 명령어는 `http://localhost:3000`에서 개발 서버를 실행합니다.

### 빌드

배포용 빌드를 생성하려면:

```bash
npm run build
```

### 코드 린팅 및 포맷팅

코드 품질 검사:

```bash
npm run lint
```

코드 자동 포맷팅:

```bash
npm run format
```

<br>

## 주요 의존성 정보

프로젝트에 사용된 주요 라이브러리와 프레임워크입니다:

### 핵심 의존성

| 패키지 | 버전 | 설명 |
|--------|------|------|
| React | ^18.2.0 | UI 컴포넌트 라이브러리 |
| TypeScript | ~5.7.2 | 타입 시스템 |
| Vite | ^6.2.0 | 개발 서버 및 빌드 도구 |

### UI 관련 의존성

| 패키지 | 버전 | 설명 |
|--------|------|------|
| @mui/material | ^7.0.2 | 머티리얼 디자인 UI 컴포넌트 |
| @mui/icons-material | ^7.0.2 | 머티리얼 디자인 아이콘 |
| @emotion/react | ^11.14.0 | CSS-in-JS 스타일링 |
| @emotion/styled | ^11.14.0 | 스타일드 컴포넌트 |
| react-quill | ^2.0.0 | 리치 텍스트 에디터 |

### 상태 관리 및 라우팅

| 패키지 | 버전 | 설명 |
|--------|------|------|
| zustand | ^5.0.3 | 상태 관리 라이브러리 |
| react-router-dom | ^7.5.0 | 라우팅 관리 |

### API 통신

| 패키지 | 버전 | 설명 |
|--------|------|------|
| axios | ^1.8.4 | HTTP 클라이언트 |

### 유틸리티

| 패키지 | 버전 | 설명 |
|--------|------|------|
| date-fns | ^4.1.0 | 날짜 포맷팅 및 조작 |
| notistack | ^3.0.2 | 알림 메시지 관리 |

<br>

## 프로젝트 구조

```
eum-front/
├── public/              # 정적 파일
├── src/                 # 소스 코드
│   ├── app/             # 앱 설정 및 초기화
│   ├── assets/          # 이미지, 폰트 등 에셋
│   ├── components/      # 공통 컴포넌트
│   ├── config/          # 구성 파일
│   ├── constants/       # 상수 정의
│   ├── docs/            # 문서
│   ├── features/        # 기능별 모듈
│   │   └── community/   # 커뮤니티 관련 기능
│   │       ├── api/     # API 통신 로직
│   │       ├── components/ # 커뮤니티 컴포넌트
│   │       ├── store/   # 상태 관리 (Zustand)
│   │       └── types/   # 타입 정의
│   ├── pages/           # 페이지 컴포넌트
│   ├── routes/          # 라우팅 설정
│   ├── services/        # 서비스 로직
│   ├── shared/          # 공유 유틸리티
│   ├── styles/          # 글로벌 스타일
│   └── types/           # 전역 타입 정의
└── package.json         # 프로젝트 메타데이터 및 의존성
```

<br>

## 개발 가이드

### 코드 스타일

- 컴포넌트는 함수형 컴포넌트와 훅을 사용합니다.
- 타입 정의는 명시적으로 작성합니다.
- 상태 관리는 Zustand를 사용합니다.

### 상태 관리

페이지네이션, 필터링 등의 상태는 다음과 같이 관리합니다:

```typescript
// 예: 게시글 목록 불러오기
const { posts, postLoading, fetchPosts } = usePostStore();

// 페이지 변경 처리
const handleChangePage = (event: unknown, newPage: number) => {
  fetchPosts({ ...postFilter, page: newPage });
};
```

### API 호출

백엔드 API는 일반적으로 다음 형식으로 호출합니다:

```typescript
// 예: 게시글 목록 API
const getPosts = async (params) => {
  try {
    const response = await apiClient.get('/community/post', { params });
    return response;
  } catch (error) {
    console.error('API 호출 실패:', error);
    return { postList: [], total: 0 };
  }
};
```

### 컴포넌트 패턴

재사용 가능한 컴포넌트는 다음 패턴을 따릅니다:

```typescript
interface Props {
  // props 정의
}

const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // 컴포넌트 로직
  return (
    // JSX
  );
};

export default MyComponent;
```

---
