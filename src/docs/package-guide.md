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
  - npn install lucide-react
  - npm install ckeditor5 @ckeditor/ckeditor5-react
    설치 라이브러리

  - npm install zustand

  상태 관리를 위해 사용

  설치 라이브러리

  - npm install axios

  추후에 api 관련 호출을 위해 사용
