# 인증 시스템 (Authentication System)

본 문서는 구글 소셜 로그인 인증 시스템의 구조와 사용 방법을 설명합니다.

## 주요 기능

- 구글 소셜 로그인
- 로그인 상태 관리
- 인증 가드 (보호된 라우트)
- 역할 기반 접근 제어 (RBAC)

## 디렉토리 구조

```
src/features/auth/
├── api/                # API 관련 함수
│   └── authApi.ts      # 인증 API 요청 함수
├── components/         # 인증 관련 컴포넌트
│   ├── GoogleLoginButton.tsx  # 구글 로그인 버튼
│   ├── AuthGuard.tsx          # 인증 가드 컴포넌트
│   └── AccessDeniedPage.tsx   # 접근 거부 페이지
├── pages/              # 인증 관련 페이지
│   ├── LoginPage.tsx          # 로그인 페이지
│   └── OAuthCallbackPage.tsx  # OAuth 콜백 처리 페이지
├── store/              # 상태 관리
│   └── authStore.ts    # 인증 상태 관리 스토어
└── index.ts            # 모듈 진입점
```

## 사용 방법

### 1. 로그인 기능 사용하기

```tsx
import { LoginPage } from '../features/auth';

// 로그인 페이지 컴포넌트 사용
const App = () => {
  return (
    <Router>
      <Route path="/login" element={<LoginPage />} />
      {/* 다른 라우트들 */}
    </Router>
  );
};
```

### 2. 인증 가드 사용하기

```tsx
import { AuthGuard } from '../features/auth';

// 보호된 라우트 생성
const ProtectedRoute = () => {
  return (
    <Route
      path="/protected"
      element={
        <AuthGuard>
          <ProtectedPage />
        </AuthGuard>
      }
    />
  );
};
```

### 3. 인증 상태 사용하기

```tsx
import { useAuthStore } from '../features/auth';

const ProfileComponent = () => {
  const { user, isAuthenticated, handleLogout } = useAuthStore();

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다</div>;
  }

  return (
    <div>
      <h1>프로필</h1>
      <p>사용자: {user?.name}</p>
      <p>이메일: {user?.email}</p>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};
```

### 4. 역할 기반 접근 제어

```tsx
import { RoleGuard } from '../routes/guards';

// 관리자만 접근 가능한 라우트
const AdminRoute = () => {
  return (
    <Route
      path="/admin"
      element={
        <RoleGuard requiredRole="admin">
          <AdminPage />
        </RoleGuard>
      }
    />
  );
};
```

## TODO 목록

현재 인증 시스템에는 다음과 같은 TODO 항목이 있습니다:

1. **백엔드 API 연동**

   - `authApi.ts`의 API 엔드포인트를 실제 백엔드 엔드포인트로 교체해야 합니다.
   - 응답 형식에 맞게 코드를 수정해야 합니다.

2. **전역 상태 관리 통합**

   - 현재 `authStore.ts`는 독립적인 상태 관리 모듈이지만, 개발자3의 전역 상태 관리 시스템과 통합해야 합니다.

3. **디자인 개선**
   - 현재는 임시 디자인 (한국적 봄 테마)이 적용되어 있지만, 개발자1의 최종 디자인으로 교체되어야 합니다.

## 주의사항

1. 토큰 관리는 `localStorage`를 사용하지만, 보안이 중요한 환경에서는 `HttpOnly` 쿠키나 다른 안전한 방법으로 대체를 고려해야 합니다.

2. 현재 구현은 주로 클라이언트 측에서 이루어지기 때문에, 보안에 민감한 작업은 항상 백엔드에서 검증해야 합니다.

3. 프로덕션 환경에서는 추가적인 보안 조치가 필요합니다:
   - CSRF 방지
   - XSS 방지
   - 토큰 갱신 메커니즘
   - 인증 상태 검증
4. 리팩토리 하면서 진행하는게 좋습니다... 나중에 하려다가 큰일 날 수도 있습니다.
