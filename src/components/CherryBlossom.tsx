import React, { useEffect, useState } from 'react';

interface CherryBlossomProps {
  intensity?: number; // 꽃잎 강도 (기본값: 1)
}

const CherryBlossom: React.FC<CherryBlossomProps> = ({ intensity = 1 }) => {
  const [petals, setPetals] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // intensity에 따라 초기 꽃잎 개수 조절
    const initialCount = Math.floor(10 * intensity);
    const initialPetals = Array.from({ length: initialCount }).map((_, index) => (
      <div key={`initial-petal-${index}`} className="petal" style={{
        left: `${Math.random() * 100}%`,
        animationDuration: `${8 + Math.random() * 7}s`,
        animationDelay: `${Math.random() * 10}s`,
        width: `${10 + Math.random() * 10}px`,
        height: `${10 + Math.random() * 10}px`
      }} />
    ));

    setPetals(initialPetals);

    // 주기적으로 새로운 꽃잎 추가
    if (intensity > 0.2) {
      const interval = setInterval(() => {
        setPetals(prev => {
          // 최대 개수 제한 (intensity에 비례)
          const maxPetals = Math.floor(30 * intensity);
          const newPetal = (
            <div key={`petal-${Date.now()}`} className="petal" style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${8 + Math.random() * 7}s`,
              animationDelay: '0s',
              width: `${10 + Math.random() * 10}px`,
              height: `${10 + Math.random() * 10}px`
            }} />
          );
          
          return [...prev.slice(-maxPetals + 1), newPetal];
        });
      }, 1000 / Math.max(0.5, intensity)); // intensity가 높을수록 더 자주 추가

      return () => clearInterval(interval);
    }
    
    return undefined;
  }, [intensity]);

  return (
    <div className="cherry-blossom">
      {petals}
    </div>
  );
};

export default CherryBlossom; 