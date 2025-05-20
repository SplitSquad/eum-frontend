import { useTranslation as useI18nextTranslation } from 'react-i18next';
// 단순히 react-i18next에서 제공하는 useTranslation 훅을 재노출
const UseTranslation = () => {
    return useI18nextTranslation();
};
export default UseTranslation;
