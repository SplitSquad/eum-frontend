리팩토링 태그
*중복 파일 정리
*아키텍저 구조 변경 - 디테일 하단 설명
*코드 수정
*디자인 변경 \*레이아웃 변경
*라우팅 연결 변경
*레이아웃 수정

# 파일 변경점

- src/App.tsx | 삭제 \*중복 파일 정리
- src/main.tsx | 삭제 \*중복 파일 정리
- src/styles/glbal.css | 빈 파일 \*중복 파일 정리

- src/pages/Login.tsx | 삭제 \*아키텍저 구조 변경
- src/features/auth/pages/LoginPage.tsx -> src/pages/LoginPage.tsx \*아키텍저 구조 변경
  -> 프론트 아키텍처 구조상 메인 레이아웃에 해당하는 페이지므로 폴더 위치 변경

# 코드 변경점

- src/routes/routes.tsx | LoginPage import 경로 수정 \*코드 수정
- src/features/auth/index.ts | LoginPage 라우트 삭제 \*코드 수정
  -> 아키텍처 구조 변경으로 인해 import 경로 수정
- 헤더 로그인 클릭 시 바로 구글 로그인 실행 되게 변경
- src/features/auth/api/authApi.tsx
  -> userProfileResponse, UserPreferenceResponse 백엔드에서 나오는 데이터 타입 변경으로 인하여 타입 수정 기존 data로 json 랩핑 -> data 랩핑 제거 | \*코드 수정
- OauthCallbackPage에서 /test 호출 삭제 |\* 코드 수정
- userPreference backend api에서 inOnBoardDone 값 받아옴. OAuthCallbackPage에서 loadUser 활용하여 코드 간편화 | \* 코드 변경

# 라우팅 변경점

- src/routes/routes.tsx | 첫 화면 라우팅 '' Loading Overlay로 변경 - 처음 시작 시 슬라이딩 페이지 | \*라우팅 연결 변경
- loading overlay 후 홈 화면으로 이동 | \*라우팅 연결 변경

#AppLayout 및 디자인

- 기존 컴포넌트로 만들었던 Header와 NavBar 합쳐서 정리한 src/component/layout/header.tsx 를 메인으로 사용 | \*레이아웃 수정
- src/compoenent/layout/NavBar.tsx 실제 사용하지 않는 코드지만 유지 | \*레이아웃 수정
- src/shared/i18n/translations | 메뉴 상단바 이름 변경, 언어 적용| \*디자인 변경
- 프로필 이미지 조정 | \*디자인 변경
- 알림 모달 디자인 수정 | \*디자인 변경
- App.tsx에 적용되어 있는 header를 로딩 오버레이 시 에는 안보이게 변경 | \*디자인 변경
- 임시 Footer 추가 | \*다지안 변경
  -> 푸터 디자인은 변경 예정
- Footer 추가로 인한 app.css 디자인 수정
- 헤더 메뉴 연결 버튼 스타일 분리 하여 디자인 수정
- 로그인 버튼 스타일 분리하여 디자인 수정
- 헤더 배경색 적용
- 헤더 애니메이션 추가 | 추후 다시 고려
- App.tsx에서 매인 바디에 대한 디자인 종속성을 SeasonalBackground아래로 들어가도록 tnwjd 디자인 수정
- 전체 배경 색 기준을 SeansonalBackground에서 조절
- 가시성 떨어지는 wave effect 주석 처리
- app.tsx에서 모달 주석 처리

# 파일 구조 및 리팩토링

- integration.tsx : 레이아웃 관련 컴포넌트 모아 놓은 뒤 추후 정리

- LoadingOverLay.tsx: 페이지 구현
  - LoadingAnimation.tsx: 애니메이션 컴포넌트
    - OverLayAnimation.tsx: 애니메이션 구현을 위한 디자인 컴포넌트 모음
  - Slide1,2,3.tsx: 슬라이드 애니메이션 구현을 위한 슬라이드 구성 요소
  - IntroSlider.tsx: 애니메이션 디자인 구성 컴포넌트
  - UseIntroSlider.tsx: 애니메이션 동작 훅
