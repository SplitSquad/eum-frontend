import { useRef } from 'react';
import LottieEmploy from '@/assets/animations/lottie/employ.json';
import Lottie from 'lottie-react';

const Employ = () => {
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
        animationData={LottieEmploy}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Employ;
