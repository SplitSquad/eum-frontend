/**
 * 언어 감지 및 FormData 처리 유틸리티 (fallback 방식 사용)
 */

// import { loadModule, LanguageIdentifier } from 'cld3-asm'; // 모듈 문제로 주석 처리

// CLD3 언어감지기 인스턴스
// let detector: LanguageIdentifier | null = null;
// let isInitializing = false;

/**
 * 텍스트에서 각 언어별 문자 비중을 계산하여 가장 많은 언어를 감지하는 함수
 * @param text 감지할 텍스트
 * @returns 감지된 언어 코드
 */
const fallbackLanguageDetection = (text: string): string => {
  const cleanText = text.trim();
  console.log('[언어감지] 비중 기반 분석 시작 - 텍스트:', text.substring(0, 100));

  if (!cleanText) {
    console.log('[언어감지] 빈 텍스트 - 기본값 ko 반환');
    return 'ko';
  }

  // 각 언어별 문자 개수 계산
  const charCounts: Record<string, number> = {
    ko: 0,    // 한국어 (한글 + 한글 자모음)
    ja: 0,    // 일본어 (히라가나, 가타카나)
    zh: 0,    // 중국어 (한자)
    ru: 0,    // 러시아어 (키릴 문자)
    en: 0,    // 영어 (라틴 문자)
    de: 0,    // 독일어 (라틴 문자 + 독일어 특수문자)
    fr: 0,    // 프랑스어 (라틴 문자 + 프랑스어 특수문자)
    es: 0,    // 스페인어 (라틴 문자 + 스페인어 특수문자)
  };

  // 한국어: 한글 + 한글 자모음
  const koreanChars = text.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g);
  if (koreanChars) {
    charCounts.ko = koreanChars.length;
  }

  // 일본어: 히라가나, 가타카나
  const japaneseChars = text.match(/[ひらがなカタカナ]|[ぁ-ゔ]|[ァ-ヴー]/g);
  if (japaneseChars) {
    charCounts.ja = japaneseChars.length;
  }

  // 중국어: 한자 (단, 한국어가 있으면 중국어 가능성 낮춤)
  const chineseChars = text.match(/[\u4e00-\u9fff]/g);
  if (chineseChars) {
    // 한국어가 있으면 중국어는 한자만 계산하되 가중치 낮춤
    charCounts.zh = koreanChars ? chineseChars.length * 0.3 : chineseChars.length;
  }

  // 러시아어: 키릴 문자
  const russianChars = text.match(/[а-яё]/gi);
  if (russianChars) {
    charCounts.ru = russianChars.length;
  }

  // 특수문자가 있는 언어들 (독일어, 프랑스어, 스페인어)
  const germanSpecialChars = text.match(/[äöüß]/gi);
  const frenchSpecialChars = text.match(/[àâäèéêëîïôùûüÿç]/gi);
  const spanishSpecialChars = text.match(/[ñáéíóúü¿¡]/gi);

  if (germanSpecialChars) charCounts.de += germanSpecialChars.length * 3;
  if (frenchSpecialChars) charCounts.fr += frenchSpecialChars.length * 3;
  if (spanishSpecialChars) charCounts.es += spanishSpecialChars.length * 3;

  // 일반 라틴 문자 (영어, 독일어, 프랑스어, 스페인어가 공유)
  const latinChars = text.match(/[a-zA-Z]/g);
  if (latinChars) {
    const latinCount = latinChars.length;
    
    // 특수문자가 있는 언어에 우선권 부여
    if (germanSpecialChars && germanSpecialChars.length > 0) {
      charCounts.de += latinCount;
    } else if (frenchSpecialChars && frenchSpecialChars.length > 0) {
      charCounts.fr += latinCount;
    } else if (spanishSpecialChars && spanishSpecialChars.length > 0) {
      charCounts.es += latinCount;
    } else {
      // 특수문자가 없으면 영어로 처리
      charCounts.en = latinCount;
    }
  }

  // 전체 유의미한 문자 수 계산 (공백, 숫자, 특수기호 제외)
  const totalChars = Object.values(charCounts).reduce((sum, count) => sum + count, 0);

  if (totalChars === 0) {
    console.log('[언어감지] 유의미한 문자 없음 - 기본값 ko 반환');
    return 'ko';
  }

  // 각 언어별 비중 계산
  const percentages: Record<string, number> = {};
  Object.keys(charCounts).forEach(lang => {
    percentages[lang] = (charCounts[lang] / totalChars) * 100;
  });

  // 가장 높은 비중을 가진 언어 찾기
  const maxPercentage = Math.max(...Object.values(percentages));
  const detectedLanguage = Object.keys(percentages).find(lang => percentages[lang] === maxPercentage) || 'ko';

  console.log('[언어감지] 문자 개수:', charCounts);
  console.log('[언어감지] 언어별 비중:', 
    Object.keys(percentages)
      .filter(lang => percentages[lang] > 0)
      .map(lang => `${lang}: ${percentages[lang].toFixed(1)}%`)
      .join(', ')
  );
  console.log('[언어감지] 최종 감지된 언어:', detectedLanguage, `(${maxPercentage.toFixed(1)}%)`);

  return detectedLanguage;
};

/**
 * CLD3 언어감지기를 초기화합니다 (현재 사용하지 않음)
 */
/*
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
*/

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

    // 텍스트가 너무 짧은 경우 (3글자 미만)에도 개선된 함수 사용
    console.log('[언어감지] 개선된 방식으로 텍스트 분석 시작:', {
      textPreview: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      textLength: text.length,
      timestamp: new Date().toISOString()
    });

    // 개선된 언어감지 함수 사용
    return fallbackLanguageDetection(text);

    /*
    // CLD3 사용 코드 (모듈 문제로 주석 처리)
    try {
      // CLD3 언어감지기 초기화
      const cld3Detector = await initializeDetector();
      
      // 언어 감지 실행
      const result = cld3Detector.findLanguage(text);
      
      console.log('[언어감지] CLD3 결과:', {
        result,
        language: result?.language,
        probability: result?.probability,
        isReliable: result?.is_reliable
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
              console.log('[언어감지] CLD3에서 지원하지 않는 언어, fallback 사용. 감지된 언어:', detectedLang);
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
        errorMessage: cld3Error instanceof Error ? cld3Error.message : 'Unknown error'
      });
      return fallbackLanguageDetection(text);
    }

    console.log('[언어감지] CLD3 결과 없음, fallback 사용');
    return fallbackLanguageDetection(text);
    */
  } catch (error) {
    console.error('[언어감지] 전체 언어감지 프로세스 오류:', error);
    return 'ko'; // 오류 발생 시 기본값
  }
};

/**
 * 동기적 언어감지 함수 (기존 코드와의 호환성을 위해 유지)
 * 내부적으로 비동기 함수를 호출하되, Promise를 반환하지 않고 일단 fallback을 사용
 */
export const detectLanguageSync = (text: string): string => {
  // 비동기 감지를 백그라운드에서 실행하지만 즉시 fallback 결과를 반환
  detectLanguage(text).then(result => {
    console.log('[언어감지] 비동기 결과:', result);
  }).catch(error => {
    console.error('[언어감지] 비동기 오류:', error);
  });
  
  // 즉시 fallback 결과 반환
  return fallbackLanguageDetection(text);
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

/**
 * 제목과 본문을 따로 분석하여 각각의 언어를 감지하는 함수
 * @param title 제목 텍스트
 * @param content 본문 텍스트
 * @returns 제목과 본문의 언어 정보
 */
export const detectTitleAndContentLanguages = async (
  title: string,
  content: string
): Promise<{
  titleLanguage: string;
  contentLanguage: string;
  primaryLanguage: string;
  needsSeparateTranslation: boolean;
}> => {
  try {
    console.log('[언어감지] 제목과 본문 분리 분석 시작');
    console.log('[언어감지] 제목:', title.substring(0, 50));
    console.log('[언어감지] 본문:', content.substring(0, 50));

    // 제목 언어 감지 (개선된 함수 사용)
    const titleLanguage = title && title.trim() 
      ? fallbackLanguageDetection(title) 
      : 'ko';

    // 본문 언어 감지 (개선된 함수 사용)
    const contentLanguage = content && content.trim() 
      ? fallbackLanguageDetection(content) 
      : 'ko';

    // 전체 텍스트로 주요 언어 감지 (더 정확한 결과를 위해)
    const combinedText = `${title} ${content}`.trim();
    const primaryLanguage = combinedText 
      ? fallbackLanguageDetection(combinedText)
      : 'ko';

    // 제목과 본문의 언어가 다른지 확인
    const needsSeparateTranslation = titleLanguage !== contentLanguage;

    const result = {
      titleLanguage,
      contentLanguage,
      primaryLanguage,
      needsSeparateTranslation,
    };

    console.log('[언어감지] 분석 결과:', result);

    return result;
  } catch (error) {
    console.error('[언어감지] 제목과 본문 분석 중 오류:', error);
    return {
      titleLanguage: 'ko',
      contentLanguage: 'ko',
      primaryLanguage: 'ko',
      needsSeparateTranslation: false,
    };
  }
};

/**
 * 혼합 언어 텍스트에서 각 언어의 비율을 계산하는 함수
 * @param text 분석할 텍스트
 * @returns 각 언어의 비율 정보
 */
export const analyzeLanguageComposition = (text: string): Record<string, number> => {
  const cleanText = text.toLowerCase().trim();
  
  if (!cleanText) {
    return { ko: 1.0 };
  }

  const totalChars = cleanText.length;
  const scores: Record<string, number> = {
    ko: 0,
    ja: 0,
    zh: 0,
    ru: 0,
    de: 0,
    fr: 0,
    es: 0,
    en: 0,
  };

  // 각 언어별 문자 수 계산
  scores.ko = (text.match(/[가-힣]/g) || []).length;
  scores.ja = (text.match(/[ひらがなカタカナ]|[ぁ-ゔ]|[ァ-ヴー]/g) || []).length;
  scores.zh = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  scores.ru = (text.match(/[а-яё]/gi) || []).length;

  // 라틴 문자 기반 언어들은 단어 기반으로 계산
  const germanWords = cleanText.match(/\b(der|die|das|und|ist|ein|eine|mit|von|zu|auf|für|nicht|sich|werden|haben|sein)\b/g) || [];
  const frenchWords = cleanText.match(/\b(le|la|les|de|des|du|un|une|et|est|ce|qui|que|avec|pour|dans|sur|par|il|elle|vous|nous|je|tu)\b/g) || [];
  const spanishWords = cleanText.match(/\b(el|la|los|las|de|del|y|es|en|con|por|para|que|no|se|te|me|le|un|una|este|esta|estos|estas)\b/g) || [];
  const englishWords = cleanText.match(/\b(the|and|is|in|to|of|a|that|it|with|for|as|was|on|are|he|his|they|at|be|this|have|from|or|one|had|by|word|but|not|what|all|were|we|when|your|can|said|there|each|which|she|do|how|their|if|will|up|other|about|out|many|then|them|these|so|some|her|would|make|like|into|him|has|two|more|very|after|first|been|than|its|who|now|people|my|made|over|did|down|only|way|find|use|may|water|long|little|work|know|place|year|live|me|back|give|most|good|man|think|say|great|where|much|through|get|should|our|old|see|could|go|might|come|well|such|take|look|high|every|last|call|came|just|also|around|another|put|end|why|ask|try|hand|life|move|too|any|off|tell|against|being|new|while|point|still|time|group|large|own|still)\b/gi);

  scores.de = germanWords.length * 3; // 독일어 단어에 가중치
  scores.fr = frenchWords.length * 3; // 프랑스어 단어에 가중치
  scores.es = spanishWords.length * 3; // 스페인어 단어에 가중치
  scores.en = (englishWords?.length || 0) * 2; // 영어 단어에 가중치 (다른 언어와 겹칠 수 있어서 낮게)

  // 비율로 변환
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  if (totalScore === 0) {
    return { ko: 1.0 };
  }

  const percentages: Record<string, number> = {};
  Object.keys(scores).forEach(lang => {
    percentages[lang] = scores[lang] / totalScore;
  });

  console.log('[언어분석] 언어 구성 비율:', percentages);
  
  return percentages;
};

/**
 * 언어 감지 테스트를 위한 함수 (개발용)
 */
export const testLanguageDetection = (text: string): void => {
  console.log('\n=== 언어 감지 테스트 ===');
  console.log('Test text:', text);
  console.log('---');
  
  const result = fallbackLanguageDetection(text);
  
  console.log('Final result:', result);
  console.log('===================\n');
};

// 테스트 실행 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  console.log('\n🧪 ===== 언어 감지 테스트 시작 =====');
  
  // 사용자 예시 테스트
  testLanguageDetection('AI+음식? 요즘 진짜 별게 다 나오네요...ㅋㅋ');
  
  // 추가 혼합 언어 테스트
  testLanguageDetection('Hello! 안녕하세요!');
  testLanguageDetection('React와 TypeScript 사용해서 개발 중입니다');
  testLanguageDetection('API integration is 완료되었습니다');
  
  // 순수 언어 테스트
  testLanguageDetection('This is pure English text for testing purposes.');
  testLanguageDetection('이것은 순수한 한국어 텍스트입니다. 가나다라마바사아자차카타파하.');
  testLanguageDetection('Bonjour, comment allez-vous? C\'est un texte français.');
  testLanguageDetection('Hallo, wie geht es Ihnen? Das ist ein deutscher Text.');
  testLanguageDetection('¡Hola! ¿Cómo está usted? Este es un texto en español.');
  testLanguageDetection('Привет! Как дела? Это текст на русском языке.');
  testLanguageDetection('こんにちは。元気ですか？これは日本語のテキストです。');
  testLanguageDetection('你好！你好吗？这是中文文本。');
  
  console.log('🎉 ===== 언어 감지 테스트 완료 =====\n');
}

/**
 * 게시글 작성/수정을 위한 개선된 언어 감지 함수
 * 백엔드에서 제목과 내용을 분리 번역하므로, 각각 언어를 감지하고 더 적절한 주 언어를 선택
 * @param title 제목 텍스트
 * @param content 본문 텍스트
 * @returns 감지된 주요 언어 코드와 상세 분석 정보
 */
export const detectPostLanguage = async (title: string, content: string): Promise<string> => {
  try {
    console.log('[언어감지] 게시글 개선된 언어 감지 시작');
    console.log('[언어감지] 제목:', title.substring(0, 50));
    console.log('[언어감지] 본문:', content.substring(0, 50));

    // 제목과 본문이 모두 비어있으면 기본값
    if ((!title || title.trim().length === 0) && (!content || content.trim().length === 0)) {
      console.log('[언어감지] 제목과 본문 모두 비어있음 - 기본값 ko 반환');
      return 'ko';
    }

    // 제목 언어 감지
    const titleLanguage = title && title.trim() 
      ? fallbackLanguageDetection(title.trim()) 
      : null;

    // 본문 언어 감지  
    const contentLanguage = content && content.trim() 
      ? fallbackLanguageDetection(content.trim()) 
      : null;

    console.log('[언어감지] 분리 분석 결과:', {
      titleLanguage,
      contentLanguage,
      titleLength: title.length,
      contentLength: content.length
    });

    // 주 언어 결정 로직
    let primaryLanguage: string;

    if (!titleLanguage && !contentLanguage) {
      primaryLanguage = 'ko';
    } else if (!titleLanguage) {
      primaryLanguage = contentLanguage!;
    } else if (!contentLanguage) {
      primaryLanguage = titleLanguage;
    } else if (titleLanguage === contentLanguage) {
      // 제목과 본문이 같은 언어
      primaryLanguage = titleLanguage;
    } else {
      // 제목과 본문이 다른 언어인 경우
      console.log('[언어감지] ⚠️ 제목과 본문의 언어가 다름:', {
        title: `${titleLanguage} (${title.substring(0, 30)}...)`,
        content: `${contentLanguage} (${content.substring(0, 30)}...)`
      });

      // 본문의 길이가 제목보다 3배 이상 길면 본문 언어 우선
      if (content.length >= title.length * 3) {
        primaryLanguage = contentLanguage;
        console.log('[언어감지] 본문이 충분히 길어서 본문 언어 선택:', contentLanguage);
      } 
      // 제목이 한국어가 아니고 본문이 한국어면 본문 우선 (한국 사이트 특성)
      else if (titleLanguage !== 'ko' && contentLanguage === 'ko') {
        primaryLanguage = contentLanguage;
        console.log('[언어감지] 본문이 한국어여서 본문 언어 선택:', contentLanguage);
      }
      // 그 외에는 제목 언어 우선 (제목이 더 중요)
      else {
        primaryLanguage = titleLanguage;
        console.log('[언어감지] 기본적으로 제목 언어 선택:', titleLanguage);
      }
    }

    console.log('[언어감지] 게시글 최종 분석 결과:', {
      titleLanguage: titleLanguage || 'N/A',
      contentLanguage: contentLanguage || 'N/A', 
      primaryLanguage,
      primaryLanguageUpperCase: primaryLanguage.toUpperCase(),
      mixedLanguage: titleLanguage !== contentLanguage && titleLanguage && contentLanguage,
      titleLength: title.length,
      contentLength: content.length
    });

    return primaryLanguage;
  } catch (error) {
    console.error('[언어감지] 게시글 언어 감지 중 오류:', error);
    return 'ko'; // 오류 발생 시 기본값
  }
};

/**
 * 동기적 게시글 언어 감지 함수
 * @param title 제목 텍스트
 * @param content 본문 텍스트
 * @returns 감지된 주요 언어 코드
 */
export const detectPostLanguageSync = (title: string, content: string): string => {
  try {
    console.log('[언어감지] 게시글 동기 언어 감지 시작');
    
    // 제목과 본문을 합쳐서 전체 언어 감지
    const combinedText = title.trim() + ' ' + content.trim();
    
    if (!combinedText || combinedText.trim().length === 0) {
      console.log('[언어감지] 빈 텍스트 - 기본값 ko 반환');
      return 'ko';
    }

    // 개선된 언어감지 함수 사용
    const detectedLanguage = fallbackLanguageDetection(combinedText);

    console.log('[언어감지] 게시글 동기 분석 결과:', {
      titleLength: title.length,
      contentLength: content.length,
      combinedLength: combinedText.length,
      detectedLanguage
    });

    return detectedLanguage;
  } catch (error) {
    console.error('[언어감지] 게시글 동기 언어 감지 중 오류:', error);
    return 'ko'; // 오류 발생 시 기본값
  }
};

