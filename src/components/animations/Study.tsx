import { useRef } from 'react';
import LottieStudy from '@/assets/animations/lottie/study.json';
import Lottie from 'lottie-react';

const Study = () => {
  const lottieRef = useRef<any>(null);

  const handleMouseEnter = () => {
    lottieRef.current?.stop();
  };

  const handleMouseLeave = () => {
    lottieRef.current?.play();
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Lottie
        lottieRef={lottieRef}
        animationData={LottieStudy}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Study;
