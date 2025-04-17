import { useEffect, useRef } from 'react';
import LottieBell from '@/assets/animations/lottie/Bell.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

type Props = {
  isPlaying?: boolean;
};

const Bell = ({ isPlaying = true }: Props) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (isPlaying) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [isPlaying]);

  return (
    <div className="w-24 h-24 hover:scale-110 transition-transform duration-200">
      <Lottie
        lottieRef={lottieRef}
        animationData={LottieBell}
        loop
        autoplay={false}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Bell;
