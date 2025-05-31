/**
 * 언어 감지 및 FormData 처리 유틸리티 (cld3-asm 사용)
 */

import { loadModule, LanguageIdentifier } from 'cld3-asm';

// CLD3 언어감지기 인스턴스
let detector: LanguageIdentifier | null = null;
let isInitializing = false;

/**
 * CLD3 언어감지기를 초기화합니다
 */
const initializeDetector = async (): Promise<LanguageIdentifier> => {
  if (detector) {
    return detector;
  }

  if (isInitializing) {
    // 초기화 중이면 잠시 대기 후 재시도
    await new Promise(resolve => setTimeout(resolve, 100));
    return initializeDetector();
  }

  try {
    isInitializing = true;
    console.log('[언어감지] CLD3 언어감지기 초기화 시작');

    // loadModule을 통해 CldFactory를 얻습니다
    const cldFactory = await loadModule();

    // LanguageIdentifier 생성 (minBytes: 0, maxBytes: 1000)
    detector = cldFactory.create(0, 1000);

    console.log('[언어감지] CLD3 언어감지기 초기화 완료');
    return detector;
  } catch (error) {
    console.error('[언어감지] CLD3 초기화 실패:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
};

/**
 * 텍스트의 언어를 감지하고 ISO 639-1 코드로 변환하는 유틸리티 함수
 * 백엔드에서 지원하는 8개 언어: KO, EN, JA, ZH, DE, FR, ES, RU
 * @param text 감지할 텍스트
 * @returns 감지된 언어 코드 (ko, en, ja, zh, de, fr, es, ru)
 */
export const detectLanguage = async (text: string): Promise<string> => {
  try {
    // 텍스트가 비어있는 경우 기본값으로 한국어 반환
    if (!text || text.trim().length === 0) {
      console.log('[언어감지] 빈 텍스트 - 기본값 ko 반환');
      return 'ko';
    }

    // 텍스트가 너무 짧은 경우 (3글자 미만) fallback 사용
    if (text.trim().length < 3) {
      console.log('[언어감지] 짧은 텍스트 - fallback 사용');
      return fallbackLanguageDetection(text);
    }

    console.log('[언어감지] CLD3으로 텍스트 분석 시작:', {
      textPreview: text.substring(0, 100) + '...',
      textLength: text.length,
      timestamp: new Date().toISOString(),
    });

    try {
      // CLD3 언어감지기 초기화
      const cld3Detector = await initializeDetector();

      // 언어 감지 실행
      const result = cld3Detector.findLanguage(text);

      console.log('[언어감지] CLD3 결과:', {
        result,
        language: result?.language,
        probability: result?.probability,
        isReliable: result?.is_reliable,
      });

      if (result && result.language) {
        // CLD3는 ISO 639-1 코드를 반환하므로 직접 사용 가능
        const detectedLang = result.language.toLowerCase();

        // 신뢰도 확인 (0.7 이상일 때만 사용)
        if (result.probability >= 0.7) {
          // 백엔드 지원 언어만 허용
          switch (detectedLang) {
            case 'ko':
              console.log('[언어감지] 한국어 감지됨 (신뢰도:', result.probability, ')');
              return 'ko';
            case 'en':
              console.log('[언어감지] 영어 감지됨 (신뢰도:', result.probability, ')');
              return 'en';
            case 'ja':
              console.log('[언어감지] 일본어 감지됨 (신뢰도:', result.probability, ')');
              return 'ja';
            case 'zh':
            case 'zh-cn':
            case 'zh-tw':
              console.log('[언어감지] 중국어 감지됨 (신뢰도:', result.probability, ')');
              return 'zh';
            case 'de':
              console.log('[언어감지] 독일어 감지됨 (신뢰도:', result.probability, ')');
              return 'de';
            case 'fr':
              console.log('[언어감지] 프랑스어 감지됨 (신뢰도:', result.probability, ')');
              return 'fr';
            case 'es':
              console.log('[언어감지] 스페인어 감지됨 (신뢰도:', result.probability, ')');
              return 'es';
            case 'ru':
              console.log('[언어감지] 러시아어 감지됨 (신뢰도:', result.probability, ')');
              return 'ru';
            default:
              console.log(
                '[언어감지] CLD3에서 지원하지 않는 언어, fallback 사용. 감지된 언어:',
                detectedLang
              );
              return fallbackLanguageDetection(text);
          }
        } else {
          console.log('[언어감지] CLD3 신뢰도 낮음 (', result.probability, '), fallback 사용');
          return fallbackLanguageDetection(text);
        }
      }
    } catch (cld3Error) {
      console.warn('[언어감지] CLD3 오류, fallback 사용:', {
        error: cld3Error,
        errorMessage: cld3Error instanceof Error ? cld3Error.message : '알 수 없는 오류',
      });
      return fallbackLanguageDetection(text);
    }

    console.log('[언어감지] CLD3 결과 없음, fallback 사용');
    return fallbackLanguageDetection(text);
  } catch (error) {
    console.error('[언어감지] 전체 오류 발생:', {
      error: error,
      errorMessage: error instanceof Error ? error.message : '알 수 없는 오류',
      textPreview: text ? text.substring(0, 50) + '...' : '(텍스트 없음)',
    });
    return fallbackLanguageDetection(text);
  }
};

/**
 * 동기적 언어감지 함수 (기존 코드와의 호환성을 위해 유지)
 * 내부적으로 비동기 함수를 호출하되, Promise를 반환하지 않고 일단 fallback을 사용
 */
export const detectLanguageSync = (text: string): string => {
  // 비동기 감지를 백그라운드에서 실행하지만 즉시 fallback 결과를 반환
  detectLanguage(text)
    .then(result => {
      console.log('[언어감지] 비동기 결과:', result);
    })
    .catch(error => {
      console.error('[언어감지] 비동기 오류:', error);
    });

  // 즉시 fallback 결과 반환
  return fallbackLanguageDetection(text);
};

/**
 * 간단한 패턴 매칭을 통한 fallback 언어 감지
 * @param text 감지할 텍스트
 * @returns 감지된 언어 코드
 */
const fallbackLanguageDetection = (text: string): string => {
  const cleanText = text.toLowerCase().trim();
  console.log('[언어감지] fallback 패턴 매칭 시작');

  // 한국어 패턴 (한글 문자 포함)
  if (/[가-힣]/.test(text)) {
    console.log('[언어감지] 한글 문자 감지 - ko 반환');
    return 'ko';
  }

  // 일본어 패턴 (히라가나, 가타카나 포함)
  if (/[ひらがなカタカナ]|[ぁ-ゔ]|[ァ-ヴー]/.test(text)) {
    console.log('[언어감지] 일본어 문자 감지 - ja 반환');
    return 'ja';
  }

  // 중국어 패턴 (중국어 간체/번체 문자 포함)
  if (/[\u4e00-\u9fff]/.test(text)) {
    console.log('[언어감지] 중국어 문자 감지 - zh 반환');
    return 'zh';
  }

  // 러시아어 패턴 (키릴 문자 포함)
  if (/[а-яё]/i.test(text)) {
    console.log('[언어감지] 러시아어 문자 감지 - ru 반환');
    return 'ru';
  }

  // 독일어 패턴 (독일어 특수 문자 및 일반적인 단어)
  if (
    /[äöüß]/.test(cleanText) ||
    /\b(der|die|das|und|ist|ein|eine|mit|von|zu|auf|für|nicht|sich|werden|haben|sein)\b/.test(
      cleanText
    )
  ) {
    console.log('[언어감지] 독일어 패턴 감지 - de 반환');
    return 'de';
  }

  // 프랑스어 패턴 (프랑스어 특수 문자 및 일반적인 단어)
  if (
    /[àâäéèêëïîôöùûüÿç]/.test(cleanText) ||
    /\b(le|la|les|de|du|des|et|est|un|une|avec|pour|dans|sur|par|ne|pas|être|avoir|faire)\b/.test(
      cleanText
    )
  ) {
    console.log('[언어감지] 프랑스어 패턴 감지 - fr 반환');
    return 'fr';
  }

  // 스페인어 패턴 (스페인어 특수 문자 및 일반적인 단어)
  if (
    /[ñáéíóúü¿¡]/.test(cleanText) ||
    /\b(el|la|los|las|de|del|y|es|un|una|con|para|en|por|no|ser|estar|tener|hacer)\b/.test(
      cleanText
    )
  ) {
    console.log('[언어감지] 스페인어 패턴 감지 - es 반환');
    return 'es';
  }

  // 영어 패턴 (영어 일반적인 단어들)
  if (
    /\b(the|and|is|in|to|of|a|that|it|with|for|as|was|on|are|you|this|be|have|from|or|one|had|by|word|but|not|what|all|were|they|we|when|your|can|said|there|each|which|she|do|how|their|if|will|up|other|about|out|many|then|them|these|so|some|her|would|make|like|into|him|has|two|more|go|no|way|could|my|than|first|been)\b/.test(
      cleanText
    )
  ) {
    console.log('[언어감지] 영어 패턴 감지 - en 반환');
    return 'en';
  }

  // 기본값은 한국어
  console.log('[언어감지] 패턴 매칭 실패 - 기본값 ko 반환');
  return 'ko';
};

/**
 * FormData에 언어 감지 결과와 기본 필드를 추가하는 유틸리티 함수
 * @param formData 수정할 FormData 객체
 * @param title 제목 텍스트
 * @param content 내용 텍스트
 * @returns 언어 필드가 추가된 FormData 객체
 */
export const enhanceFormDataWithLanguage = async (
  formData: FormData,
  title: string,
  content: string
): Promise<FormData> => {
  // 제목과 내용을 결합하여 언어 감지 (내용의 비중을 높게)
  const combinedText = title + ' ' + content;
  const detectedLanguage = await detectLanguage(combinedText);

  // language 필드 추가 (대문자로 변환)
  if (!formData.has('language')) {
    formData.append('language', detectedLanguage.toUpperCase());
  }

  // emotion 필드 추가 (기본값)
  if (!formData.has('emotion')) {
    formData.append('emotion', 'NONE');
  }

  return formData;
};

/**
 * 동기적 FormData 처리 함수 (기존 코드와의 호환성을 위해 유지)
 */
export const enhanceFormDataWithLanguageSync = (
  formData: FormData,
  title: string,
  content: string
): FormData => {
  // 제목과 내용을 결합하여 언어 감지 (내용의 비중을 높게)
  const combinedText = title + ' ' + content;
  const detectedLanguage = detectLanguageSync(combinedText);

  // language 필드 추가 (대문자로 변환)
  if (!formData.has('language')) {
    formData.append('language', detectedLanguage.toUpperCase());
  }

  // emotion 필드 추가 (기본값)
  if (!formData.has('emotion')) {
    formData.append('emotion', 'NONE');
  }

  return formData;
};
