import { useEffect, useState } from 'react';

const UseIntroSlider = (isLoading: boolean, totalSlides: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const interval = 2000;

  useEffect(() => {
    if (!isLoading && cycleCount >= 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % totalSlides);

      if ((currentIndex + 1) % totalSlides === 0) {
        setCycleCount(c => c + 1);
      }
    }, interval);

    return () => clearTimeout(timer);
  }, [currentIndex, isLoading, totalSlides]);

  const hasCompletedAll = !isLoading && cycleCount >= 1;

  return { currentIndex, isLoading, hasCompletedAll };
};

export default UseIntroSlider;
