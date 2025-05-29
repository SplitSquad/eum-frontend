/**
 * 언어 감지 및 FormData 처리 유틸리티
 */

// 전역 window 객체에서 franc 라이브러리를 사용할 수 있도록 타입 정의
declare global {
  interface Window {
    franc: (text: string, options?: any) => string;
  }
}

/**
 * 텍스트의 언어를 감지하고 ISO 639-1 코드로 변환하는 유틸리티 함수
 * 백엔드에서 지원하는 8개 언어: KO, EN, JA, ZH, DE, FR, ES, RU
 * @param text 감지할 텍스트
 * @returns 감지된 언어 코드 (ko, en, ja, zh, de, fr, es, ru)
 */
export const detectLanguage = (text: string): string => {
  try {
    // 텍스트가 비어있는 경우 기본값으로 한국어 반환
    if (!text || text.trim().length === 0) {
      console.log('[언어감지] 빈 텍스트 - 기본값 ko 반환');
      return 'ko';
    }

    // 텍스트가 너무 짧은 경우 (3글자 미만) 기본값 반환
    if (text.trim().length < 3) {
      console.log('[언어감지] 짧은 텍스트 - 기본값 ko 반환');
      return 'ko';
    }

    console.log('[언어감지] 텍스트 분석 시작:', text.substring(0, 100) + '...');

    // CDN으로 추가된 franc 라이브러리 사용
    if (typeof window.franc === 'function') {
      // franc는 ISO 639-3 코드를 반환하므로 변환 필요
      const iso639_3 = window.franc(text, { minLength: 3 });
      console.log('[언어감지] franc 결과:', iso639_3);

      // ISO 639-3 -> ISO 639-1 변환 (백엔드 지원 언어만)
      switch (iso639_3) {
        case 'kor':
          console.log('[언어감지] 한국어 감지됨');
          return 'ko'; // 한국어
        case 'eng':
          console.log('[언어감지] 영어 감지됨');
          return 'en'; // 영어
        case 'jpn':
          console.log('[언어감지] 일본어 감지됨');
          return 'ja'; // 일본어
        case 'cmn':
        case 'zho':
          console.log('[언어감지] 중국어 감지됨');
          return 'zh'; // 중국어 (표준 중국어, 일반 중국어)
        case 'deu':
          console.log('[언어감지] 독일어 감지됨');
          return 'de'; // 독일어
        case 'fra':
          console.log('[언어감지] 프랑스어 감지됨');
          return 'fr'; // 프랑스어
        case 'spa':
          console.log('[언어감지] 스페인어 감지됨');
          return 'es'; // 스페인어
        case 'rus':
          console.log('[언어감지] 러시아어 감지됨');
          return 'ru'; // 러시아어
        default:
          console.log('[언어감지] franc에서 지원하지 않는 언어, fallback 사용');
          // 지원하지 않는 언어인 경우 간단한 패턴 매칭으로 재시도
          return fallbackLanguageDetection(text);
      }
    }

    console.log('[언어감지] franc 라이브러리 없음, fallback 사용');
    // franc 라이브러리가 없는 경우 fallback 감지 사용
    return fallbackLanguageDetection(text);
  } catch (error) {
    console.error('[언어감지] 오류 발생:', error);
    return fallbackLanguageDetection(text);
  }
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
  if (/[äöüß]/.test(cleanText) || 
      /\b(der|die|das|und|ist|ein|eine|mit|von|zu|auf|für|nicht|sich|werden|haben|sein)\b/.test(cleanText)) {
    console.log('[언어감지] 독일어 패턴 감지 - de 반환');
    return 'de';
  }

  // 프랑스어 패턴 (프랑스어 특수 문자 및 일반적인 단어)
  if (/[àâäéèêëïîôöùûüÿç]/.test(cleanText) || 
      /\b(le|la|les|de|du|des|et|est|un|une|avec|pour|dans|sur|par|ne|pas|être|avoir|faire)\b/.test(cleanText)) {
    console.log('[언어감지] 프랑스어 패턴 감지 - fr 반환');
    return 'fr';
  }

  // 스페인어 패턴 (스페인어 특수 문자 및 일반적인 단어)
  if (/[ñáéíóúü¿¡]/.test(cleanText) || 
      /\b(el|la|los|las|de|del|y|es|un|una|con|para|en|por|no|ser|estar|tener|hacer)\b/.test(cleanText)) {
    console.log('[언어감지] 스페인어 패턴 감지 - es 반환');
    return 'es';
  }

  // 영어 패턴 (영어 일반적인 단어들)
  if (/\b(the|and|is|in|to|of|a|that|it|with|for|as|was|on|are|you|this|be|have|from|or|one|had|by|word|but|not|what|all|were|they|we|when|your|can|said|there|each|which|she|do|how|their|if|will|up|other|about|out|many|then|them|these|so|some|her|would|make|like|into|him|has|two|more|go|no|way|could|my|than|first|been)\b/.test(cleanText)) {
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
export const enhanceFormDataWithLanguage = (
  formData: FormData,
  title: string,
  content: string
): FormData => {
  // 제목과 내용을 결합하여 언어 감지 (내용의 비중을 높게)
  const combinedText = title + ' ' + content;
  const detectedLanguage = detectLanguage(combinedText);

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

