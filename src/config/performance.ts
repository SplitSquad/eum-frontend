import { env, isDevelopment } from './env';

/**
 * 이미지 지연 로딩 옵저버
 */
let lazyLoadObserver: IntersectionObserver | null = null;

/**
 * 이미지 지연 로딩 설정 함수
 * 이미지가 뷰포트에 들어올 때만 로드되도록 IntersectionObserver를 설정
 */
export const setupLazyLoading = (): void => {
  // IntersectionObserver가 지원되는지 확인
  if ('IntersectionObserver' in window) {
    lazyLoadObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target as HTMLImageElement;

            if (lazyImage.dataset.src) {
              lazyImage.src = lazyImage.dataset.src;
              delete lazyImage.dataset.src;
            }

            // 블러 처리된 이미지 로드 완료 후 처리
            if (lazyImage.classList.contains('blur-load')) {
              lazyImage.onload = () => {
                lazyImage.classList.remove('blur-load');
                lazyImage.classList.add('loaded');
              };
            }

            observer.unobserve(lazyImage);
          }
        });
      },
      {
        rootMargin: '200px 0px', // 뷰포트 200px 전에 로드 시작
        threshold: 0.01, // 1% 이상 보이면 로드
      }
    );
  }
};

/**
 * 이미지 요소를 지연 로딩 대상으로 등록
 * @param imageElement 지연 로딩할 이미지 요소
 */
export const observeLazyImage = (imageElement: HTMLImageElement): void => {
  if (lazyLoadObserver && imageElement) {
    lazyLoadObserver.observe(imageElement);
  }
};

/**
 * 성능 측정 시작
 * @param markName 성능 측정 이름
 */
export const startPerformanceMeasure = (markName: string): void => {
  if (isDevelopment && window.performance) {
    window.performance.mark(`${markName}-start`);
  }
};

/**
 * 성능 측정 종료 및 결과 기록
 * @param markName 성능 측정 이름
 */
export const endPerformanceMeasure = (markName: string): number | null => {
  if (isDevelopment && window.performance) {
    window.performance.mark(`${markName}-end`);
    window.performance.measure(markName, `${markName}-start`, `${markName}-end`);

    const measures = window.performance.getEntriesByName(markName, 'measure');
    if (measures.length > 0) {
      const duration = measures[0].duration;
      console.log(`성능 측정 [${markName}]: ${duration.toFixed(2)}ms`);
      return duration;
    }
  }

  return null;
};

/**
 * 웹 바이탈 측정 및 보고
 * FCP, LCP, CLS 등의 핵심 웹 바이탈 측정
 */
export const measureWebVitals = (): void => {
  if ('performance' in window && 'getEntriesByType' in window.performance) {
    // FCP (First Contentful Paint) 측정
    const fcpObserver = new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const fcp = entries[0];
        console.log(`FCP: ${fcp.startTime}ms`);
        // 여기서 Analytics로 전송 가능
      }
    });

    // LCP (Largest Contentful Paint) 측정
    const lcpObserver = new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        console.log(`LCP: ${entry.startTime}ms`, entry);
      });
    });

    // CLS (Cumulative Layout Shift) 측정
    const clsObserver = new PerformanceObserver(entryList => {
      let cls = 0;
      entryList.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      console.log(`CLS: ${cls}`);
    });

    try {
      fcpObserver.observe({ type: 'paint', buffered: true });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('웹 바이탈 측정 중 오류 발생:', e);
    }
  }
};

/**
 * 성능 데이터 수집 초기화
 */
export const initPerformanceMonitoring = (): void => {
  setupLazyLoading();

  if (isDevelopment) {
    measureWebVitals();
  }

  // 페이지 로드 시간 측정
  window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
      const { timing } = window.performance;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      console.log(`페이지 로드 시간: ${pageLoadTime}ms`);

      // DOM 로드 시간
      const domLoadTime = timing.domComplete - timing.domLoading;
      console.log(`DOM 로드 시간: ${domLoadTime}ms`);
    }
  });
};
