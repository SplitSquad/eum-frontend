# 🚀 프로젝트 업무분장

이번 프로젝트의 원활한 진행을 위해 **개발자 3명**이 각자의 역할에 따라 업무를 분담합니다.

---

## 👨‍💻 개발자 1 – UI/프론트엔드 구현 및 시각 요소 관리 (장은상)

**주요 역할:**  
앱 초기화, 화면 구성, 시각적 디자인 및 UI/UX 구현

### ✨ 앱 초기화 및 구조 설정

- **폴더:** `src/app/`
  - **파일:** `App.tsx`, `main.tsx`
    - 전체 애플리케이션 부트스트랩 및 전역 라우팅 구현

### 🎨 페이지 및 컴포넌트 구축

- **폴더:** `pages/`
  - 구성할 화면: `Home`, `Login`, `Community`, `Debate`, `Info`, `MyPage`, `Onboarding`, `NotFound`
- **폴더:** `components/`
  - **서브폴더:**
    - `base/`, `forms/`, `feedback/`, `layout/`, `cards/`, `calendar/`, `map/`, `dashboard/`, `ai/`, `animations/`, `onboarding/`
  - 단위 UI 요소(버튼, 입력창, 아이콘 등)부터 복합 컴포넌트(카드, 캘린더, 지도 등)까지 시각 및 인터랙션 로직 구현

### 👗 스타일 및 테마 작업

- **폴더:** `styles/`, `animations/`
  - 전역 CSS, 애니메이션 효과, 테마 및 Tailwind 설정 파일 관리
- **폴더:** `assets/`
  - 이미지, 아이콘, 애니메이션, 폰트 파일을 UI와 레이아웃에 반영하여 디자인 일관성 확보

### 🔍 검색 관련 인터페이스 구현

- **폴더:** `search/components/`
  - 검색 입력창, 결과 목록, 필터링 UI 제작

### 📝 문서 관리 및 디자인 가이드

- 디자인 시스템 가이드 작성 및 컴포넌트 가이드라인 관리
- 웹 디자인 컨셉 통일과 UI/UX 개선 관리

---

## 👨‍💻 개발자 2 – 기능 모듈 및 API 연동, 비즈니스 로직 처리 (엄준현현)

**주요 역할:**  
외부 API 연동, 기능 모듈 로직 구현, 보안 및 오류 처리

### ⚙️ 환경 및 외부 API 설정

- **폴더:** `config/`
  - `axios` 인스턴스, 환경변수 정리
  - 카카오맵, 구글 캘린더, 기상청, 투어, 사람인 등 외부 API 초기화 및 인터셉터 설정
- **파일:** `.env`
  - 환경 변수 파일 관리 및 각종 키/설정 점검

### 💻 기능별 모듈 로직 구현

- **폴더:** `features/`
  - **서브폴더:**
    - `auth/`, `community/`, `debate/`, `info/`, `aiassistant/`, `mypage/`, `home/`
  - API 호출, 스토어 및 페이지 단에서의 비즈니스 로직 처리
  - 인증, 커뮤니티 게시, 토론, 정보 표시, AI 비서 기능 등 모듈별 담당
- **폴더:** `routes/`
  - 라우팅 정의 및 인증/권한 가드(`AuthGuard`, `GuestGuard`, `RoleGuard`) 설정

### 🔐 보안 및 오류 처리

- CSRF, XSS 예방 및 입력값 검증 등 보안 로직 적용
- 인터셉터 내 에러 처리 및 오류 메시지 구현

### 📚 문서 및 테스트 기획 (일부 참여)

- API 명세, 외부 연동 방법 등을 `docs/` 폴더에 문서화하여 팀 내 공유
- 프론트엔드와의 협업을 위한 커뮤니케이션 유지

---

## 👨‍💻 개발자 3 – 공통 모듈, 상태 관리, 서비스 통합 및 최적화 (장은상)

**주요 역할:**  
공통 모듈 구현, 전역 상태 관리, 서비스 연동, 성능 최적화

### 🔄 재사용 모듈 및 상태 관리

- **폴더:** `shared/`
  - **서브폴더:**
    - **store/**: 사용자, 모달, 테마, 알림, 언어 설정 등 전역 상태 관리
    - **hooks/**: 커스텀 훅(`useModal`, `useTranslation`, `useOutsideClick` 등) 제작 및 유지
    - **utils/**, **types/**, **validators/**: 날짜, 텍스트, 배열 등 유틸리티 함수, 타입 정의, 유효성 검사

### 🔧 비즈니스 지원 및 통합 서비스

- **폴더:** `constants/`
  - 라우트, 태그, 검색 카테고리, AI 추천 주제, 로딩 메시지 등 상수 정의
- **폴더:** `services/`
  - **서브폴더:**
    - `tracking/`: 웹로그, 클릭 이벤트 추적
    - `gpt/`: AI 응답 처리, 프롬프트 생성, 응답 파싱
    - `notification/`: 알림 서비스 및 SSE 관련 모듈
    - `calendar/`, `map/`, `weather/`, `tour/`, `saramin/`, `translation/`: 외부 API 데이터 매핑, 유틸리티 함수, 캐싱
    - `performance/`: 이미지 최적화, 성능 지표 수집
    - `security/`: 보안 관련 모듈(예: CSRF, 입력값 정제) 적용

### 🧪 테스트 및 문서 정비

- **폴더:** `tests/`
  - 단위 및 통합 테스트 코드, 목 데이터(`mocks/`) 관리
- **폴더:** `docs/`
  - 전체 폴더 구조 및 전반적 개발 문서 보완
- **파일:** `.env`
  - 환경 변수 파일 관리 및 키/설정 점검

---

> **Note:**  
> 각 개발자는 정기적인 협업 미팅과 코드 리뷰를 통해 업무 진행 상황을 공유하며, 필요에 따라 역할을 유동적으로 조정합니다.  
> 이 업무분장은 프로젝트 진행 및 협업 효율 극대화를 위한 기본 가이드이며, 상황에 맞게 업데이트될 수 있습니다.

---

이 문서는 팀 내 업무 역할 및 책임을 명확하게 하여 협업과 개발 효율을 높이기 위한 기반 자료입니다.  
적절한 코드 리뷰와 문서 업데이트를 통해 지속적인 개선과 발전을 도모해 주세요.

## 디펜던시 정리

- formatting

* npm install -D eslint prettier eslint-config-prettier eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser
* npx eslint --init
* lint 추가 목록: javascript, json /- space로 선택 가능
* lint 범위: syntax check with problem solve
* lint 모듈: esm
* project: react
* typescript: yes
* code run: browser
* package manager: npm

## 협업 & 코드 스타일 규칙

```
frontend_main — frontend_dev — es_dev

                             |— jh_dev

                             — sh_dev

main: 최종 브랜치

dev: 개발 브랜치 → pr할 때 전체 코드리뷰 진행

indi_dev: 개인 브랜치 → 알아서 관리,dev에 pr시 꼭 자기 이름으로 된 dev에서 pr



후순위 개발  - 개발자 3

- **i18n/**, **error/**: 다국어 지원, 글로벌 에러 처리 및 에러 유형 정의
```
