import {
  Floor,
  VideoBar,
  Video,
  CenterContent,
  InnerDoorPanel,
  RightDoor,
  LeftDoor,
  DoorWrapper,
} from '@/components/animations/OverLayAnimation';
import { SquareContainer } from '@/components/base/Integration';
import EumAnimation from '@/assets/animations/loading/Hello_Eum.mp4';
import React from 'react';

type Props = {
  doorsOpen: boolean;
};

const LoadingAnimation: React.FC<Props> = ({ doorsOpen = false }: Props) => (
  <>
    <Floor />
    <SquareContainer>
      <DoorWrapper>
        <LeftDoor
          initial={{ x: 0 }}
          animate={{ x: '-100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <InnerDoorPanel />
        </LeftDoor>
        <RightDoor
          initial={{ x: 0 }}
          animate={{ x: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <InnerDoorPanel mirrored />
        </RightDoor>
        <CenterContent doorsOpen={doorsOpen}>
          <Video src={EumAnimation} autoPlay muted loop />
          <VideoBar />
        </CenterContent>
      </DoorWrapper>
    </SquareContainer>
    <Floor />
  </>
);

export default LoadingAnimation;
