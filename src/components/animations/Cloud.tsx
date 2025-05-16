import { useEffect, useRef } from 'react';
import LottieCloud from '@/assets/animations/lottie/Cloud.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

type Props = {
  isPlaying?: boolean;
  className?: string;
};

const Cloud = ({ isPlaying = true, className = '' }: Props) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (isPlaying) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [isPlaying]);

  return (
    <div className={`w-16 h-16 hover:scale-110 transition-transform duration-200 ${className}`}>
      <Lottie
        lottieRef={lottieRef}
        animationData={LottieCloud}
        loop
        autoplay={false}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Cloud;
