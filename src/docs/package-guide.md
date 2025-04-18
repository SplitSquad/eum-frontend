## 디펜던시 정리

- formatting  
  eslint와 prettier 사용 -> 스크립트 코드와 json 양식에 적용

  설치 라이브러리

  - npm install -D eslint prettier eslint-config-prettier eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser
  - npx eslint --init
  - lint 추가 목록: javascript, json /- space로 선택 가능
  - lint 범위: syntax check with problem solve
  - lint 모듈: esm
  - project: react
  - typescript: yes
  - code run: browser
  - package manager: npm

- alias  
  import경로 설정 시 간편화 하기 위해 절대 경로 적용

  '@' -> 절대 경로기준 "./src"와 동일

  사용 예시  
  import Home from '@/pages/Home';

  설치 라이브러리

  - npm install --save-dev @types/node

- 리엑트 라우팅 설정  
  페이지 라우팅을 위해 사용

  설치 라이브러리

  - npm install react-router-dom

- 디자인 설정  
  디자인 구현을 위해 사용

  설치 라이브러리

  - npm install tailwindcss @tailwindcss/vite
  - npm install @mui/material
  - npm install @mui/system
  - npm install @emotion/react
  - npm install @emotion/styled
  - npm install @mui/icons-material
  - npm install framer-motion
  - npm install lottie-react

  설치 라이브러리

  - npm install zustand

  상태 관리를 위해 사용

  설치 라이브러리

  - npm install axios

  추후에 api 관련 호출을 위해 사용

  커스텀 훅 테스트 라이브러리 설치 (이 부분은 테스트 진행하고 다 파일 삭제할거라 라이브러리 설치 안 해주셔도 무방합니다.)
  설치 라이브러리

  - npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom

  설치 라이브러리

  - npm install --save-dev jest-environment-jsdom

    Jset 28 이상부터는 패키지를 별도 설치해야 함

  설치 라이브러리

  - npm install --save-dev jest ts-jest @testing-library/react-hooks @testing-library/jest-dom --legacy-peer-deps

  딜레이 로딩 테스팅을 위함

  설치 라이브러리

  - npm install --save-dev @testing-library/dom --legacy-peer-deps

  React 19와의 호환성을 위해 @testing-library/react-hooks 대신 @testing-library/react와 @testing-library/dom을 사용
