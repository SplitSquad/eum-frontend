// src/hooks/useDelayedLoading.ts
import { useState, useEffect } from 'react';

export function UseDelayedLoading(isLoading: boolean, delay = 300) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      // delay 이후에만 true
      timer = setTimeout(() => setShow(true), delay);
    } else {
      // 로딩 끝나면 즉시 false
      setShow(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return show;
}
