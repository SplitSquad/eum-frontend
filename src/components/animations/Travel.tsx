import { useRef } from 'react';
import LottieTravel from '@/assets/animations/lottie/travel.json';
import Lottie from 'lottie-react';

const Travel = () => {
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
        animationData={LottieTravel}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Travel;
