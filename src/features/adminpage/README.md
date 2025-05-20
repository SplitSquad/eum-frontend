# 관리자페이지 모듈

**사용자의 피신고내역의 확인, 사용자제재, 게시글/댓글의 삭제를 할 수 있습니다.**

## 주요 기능

1. **사용자관리**
   - 피신고내역 조회
   - 피신고항목의 게시글/댓글 조회
2. **커뮤니티관리**(커뮤니티 서비스의 게시글, 댓글을 관리합니다.)
   - 게시글/댓글조회
   - 게시글 삭제
   - 댓글 삭제
3. **토론관리**(토론 서비스의 게시글, 댓글을 관리합니다.)
   - 게시글/댓글조회
   - 게시글 삭제
   - 댓글 삭제

## 폴더 구조

```
src/
└── features/
    └── mypage/
        ├── api/              # API 호출 관련 코드
        │   ├── apiClient.ts  # API 클라이언트 설정
        │   └── adminpageApi.ts  # 마이페이지 API 함수
        │
        ├── components/               # 공통 컴포넌트
        │
        ├── pages/                        # 페이지 컴포넌트
        │   ├── CommunityManagePage.tsx   # 커뮤니티관리 페이지
        │   ├── DebateManagePage.tsx      # 토론관리 페이지
        │   └── UserManagePage.tsx        # 유저관리 페이지
        │
        ├── store/             # 상태 관리 (Zustand)
        │   └── mypageStore.ts # 마이페이지 상태 관리
        │
        ├── types.ts           # 타입 정의
        ├── mypageRoutes.tsx   # 마이페이지 라우트 정의
        └── index.ts           # 모듈 진입점
```

## 사용 방법

```tsx
// 메인 라우터에서 마이페이지 라우트 추가
import { MypageRoutes } from '@/features/mypage';

function AppRoutes() {
  return (
    <Routes>
      {/* 다른 라우트들 */}
      <Route path="/mypage/*" element={<MypageRoutes />} />
    </Routes>
  );
}
```

## ---------------------------------- 아래부터 수정필요 -----------------------------------

## 디자인 테마

마이페이지는 벚꽃(Cherry Blossom) 테마를 적용하여 디자인되었습니다:

1. **벚꽃 배경 효과**

   - SpringBackground 컴포넌트를 통한 애니메이션 벚꽃잎 효과
   - 부드러운 그라데이션 배경

2. **한지 질감**

   - 전통적인 느낌과 현대적 디자인의 조화
   - 봄 테마에 맞는 산뜻한 색상과 질감

3. **반응형 레이아웃**
   - 모바일과 데스크톱 모두 대응
   - 모바일에서는 사이드 메뉴가 토글 방식으로 전환

## 상태 관리

마이페이지 모듈은 Zustand를 사용하여 상태를 관리합니다. 주요 상태는 다음과 같습니다:

- 프로필 정보 및 로딩 상태
- 활동 데이터 (게시글, 댓글, 토론, 북마크) 및 로딩 상태
- 설정 관련 상태 (비밀번호 변경 등)

상태 관리 코드는 `store/mypageStore.ts` 파일에 정의되어 있습니다.

## API 연동 방법

현재는 목업 데이터를 사용하여 구현되어 있으며, 실제 API 연동을 위한 주석 처리된 코드도 함께 제공됩니다.
API 구현이 완료되면 다음 단계를 통해 실제 API와 연동할 수 있습니다:

1. `api/mypageApi.ts` 파일에서 TODO 주석이 있는 부분의 주석을 해제
2. 목업 데이터 반환 코드를 실제 API 호출 코드로 대체
3. API 경로 및 요청/응답 형식을 백엔드와 맞춰 조정

예시:

```typescript
// 변경 전 (목업 데이터 사용)
async getProfileInfo(): Promise<ProfileInfo> {
  // 목업 데이터 반환
  return MOCK_PROFILE;
}

// 변경 후 (실제 API 호출)
async getProfileInfo(): Promise<ProfileInfo> {
  const response = await apiClient.get<ApiResponse<ProfileInfo>>('/api/mypage/profile');
  return response.data.data;
}
```

## 애니메이션 및 전환 효과

마이페이지는 SPA(Single Page Application)로 구현되어 있어 페이지 간 전환 시 전체 페이지 새로고침 없이 콘텐츠만 부드럽게 전환됩니다:

1. 페이지 전환 시:

   - 배경은 유지되고 내용만 페이드 인/아웃
   - 사용자 경험 최적화를 위한 애니메이션 타이밍 조정

2. 상호작용 애니메이션:
   - 버튼, 입력 필드 등의 상호작용 요소에 호버/클릭 애니메이션
   - 사이드바 토글 애니메이션

## 주의 사항

- `@emotion/styled` 및 `@emotion/react`를 사용하여 스타일링이 구현되어 있습니다.
- SSR(Server-Side Rendering) 호환성을 위해 CSS 선택자는 `:nth-of-type`를 사용합니다.
- SpringBackground 컴포넌트는 성능을 고려하여 애니메이션 렌더링을 최적화했습니다.
