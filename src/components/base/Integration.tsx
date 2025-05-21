/*레이아웃 관련 컴포넌트 정리를 위해서 우선 여기에 전부 어떤 파일에서 쓰이는지와 같이 저장
 * 공통으로 사용할 수 있는 디자인 찾아서 정리
 * 삭제 후 파일 구조에 맞게 분리
 */

import styled from '@emotion/styled';

/*LoadingOverlay 컴포넌트에서 사용하는 레이아웃 - 영상 animation 때문에 사용*/
export const SquareContainer = styled.div`
  width: min(50vw, 50vh);
  height: min(45vw, 45vh);
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    90deg,
    #fff 0%,
    rgba(255, 216, 139, 0.33) 30%,
    rgba(255, 216, 139, 0.33) 70%,
    #fff 100%
  );
`;
