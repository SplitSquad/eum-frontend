import { useLanguageStore } from '../../features/theme/store/languageStore';
import { useLanguageContext } from '../../features/theme/components/LanguageProvider';
import ko from './translations/ko';
import en from './translations/en';
import ja from './translations/ja';
import zh from './translations/zh';
import de from './translations/de';
import fr from './translations/fr';
import es from './translations/es';
import ru from './translations/ru';

// 모든 번역 정보 맵
const translations: Record<string, any> = {
  ko,
  en,
  ja,
  zh,
  // 다른 언어가 추가될 경우 여기에 추가
  de,
  fr,
  es,
  ru,
};

/**
 * 현재 언어 설정에 따라 번역된 문자열을 반환하는 훅
 * @returns useTranslation 훅
 */
export const useTranslation = () => {
  // Zustand 스토어 대신 Context에서 언어 설정을 가져옴
  // Context가 없는 경우를 대비해 Zustand 스토어도 폴백으로 사용
  let language;
  try {
    const context = useLanguageContext();
    language = context.currentLanguage;
  } catch (e) {
    // Context가 없는 경우 Zustand 스토어 사용
    language = useLanguageStore.getState().language;
  }

  /**
   * 번역 키에 해당하는 문자열을 반환
   * @param key 번역 키 (dot notation으로 접근 가능)
   * @param params 치환할 변수 객체
   * @returns 번역된 문자열
   */
  const t = (key: string, params?: Record<string, string>) => {
    // 현재 언어에 해당하는 번역 맵 가져오기
    const languageMap = translations[language] || translations.en;

    // 키 경로를 따라 번역 텍스트 찾기
    const keys = key.split('.');
    let translation: any = languageMap;

    // 번역 키를 따라 객체 탐색
    for (const k of keys) {
      translation = translation?.[k];
      if (!translation) break;
    }

    // 번역을 찾지 못한 경우
    if (!translation) {
      // 영어 번역 시도
      if (language !== 'en') {
        translation = translations.en;
        for (const k of keys) {
          translation = translation?.[k];
          if (!translation) break;
        }
      }

      // 그래도 못 찾으면 키 그대로 반환
      if (!translation) {
        return key;
      }
    }

    // 파라미터 치환
    if (params && typeof translation === 'string') {
      return Object.entries(params).reduce(
        (acc, [paramKey, paramValue]) =>
          acc.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue),
        translation
      );
    }

    return translation;
  };

  return { t, language };
};
