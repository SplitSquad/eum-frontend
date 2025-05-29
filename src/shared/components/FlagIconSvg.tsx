import React from 'react';

const countryCodeMap: Record<string, string> = {
  en: 'gb', // 영국(영어)
  ko: 'kr',
  fr: 'fr',
  ja: 'jp',
  zh: 'cn',
  de: 'de',
  ru: 'ru',
  vi: 'vn',
  es: 'es',
};

interface FlagIconProps {
  countryCode: string;
  size?: number;
  style?: React.CSSProperties;
}

const FlagIconSvg: React.FC<FlagIconProps> = ({ countryCode, size = 18, style }) => {
  const flagCode = countryCodeMap[countryCode];
  if (!flagCode) return null;

  return (
    <span
      className={`fi fi-${flagCode}`}
      style={{
        marginLeft: 4,
        fontSize: size,
        verticalAlign: 'middle',
        ...style,
      }}
    />
  );
};

export default FlagIconSvg;
