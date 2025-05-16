import { useRef } from 'react';
import LottieSettle from '@/assets/animations/lottie/settle.json';
import Lottie from 'lottie-react';

const Settle = () => {
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
        animationData={LottieSettle}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Settle;
