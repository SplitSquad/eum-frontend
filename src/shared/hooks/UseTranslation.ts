import { useState } from 'react';

type TranslationKey = string;
type TranslationValues = Record<string, string | number>;

// 간단한 번역 구현
const translations: Record<string, Record<TranslationKey, string>> = {
  ko: {
    'common.save': '저장',
    'common.cancel': '취소',
    'common.delete': '삭제',
    'common.edit': '수정',
    'common.loading': '로딩 중...',
    'common.success': '성공',
    'common.error': '오류',
    'common.yes': '예',
    'common.no': '아니오',
  },
  en: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.yes': 'Yes',
    'common.no': 'No',
  },
};

// 문자열 내의 변수를 치환하는 함수
const interpolate = (text: string, values?: TranslationValues): string => {
  if (!values) return text;
  return Object.entries(values).reduce((result, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    return result.replace(regex, String(value));
  }, text);
};

export const useTranslation = (namespace = 'common') => {
  // 기본 언어 설정 (나중에 컨텍스트나 로컬 스토리지에서 가져올 수 있음)
  const [language, setLanguage] = useState('ko');

  // 번역 함수
  const t = (key: TranslationKey, values?: TranslationValues): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const translation = translations[language]?.[fullKey] || fullKey;
    return interpolate(translation, values);
  };

  // 언어 변경 함수
  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return { t, i18n: { language, changeLanguage } };
};

export default useTranslation;
