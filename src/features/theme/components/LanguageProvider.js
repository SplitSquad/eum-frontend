import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, createContext, useContext } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { SUPPORTED_LANGUAGE_CODES } from '../../onboarding/utils/languageUtils';
import useAuthStore from '../../auth/store/authStore';
// 기본값으로 언어 컨텍스트 생성
const LanguageContext = createContext({
    currentLanguage: 'ko',
    changeLanguage: () => { },
});
// 편의를 위한 훅 생성
export const useLanguageContext = () => useContext(LanguageContext);
/**
 * 전역 언어 설정을 관리하는 Provider 컴포넌트
 */
const LanguageProvider = ({ children }) => {
    const { language, setLanguage, syncWithBackend } = useLanguageStore();
    const { isAuthenticated } = useAuthStore();
    // 언어 변경 핸들러 - Context를 통해 노출됨
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
    };
    // 언어 변경 시 HTML lang 속성 업데이트
    useEffect(() => {
        if (language && SUPPORTED_LANGUAGE_CODES.includes(language)) {
            document.documentElement.lang = language;
            // RTL 언어인 경우 dir 속성 설정 (추후 RTL 지원 시 활성화)
            // document.documentElement.dir = isRTLLanguage(language) ? 'rtl' : 'ltr';
        }
    }, [language]);
    // 앱 초기화 시 로그인 상태인 경우 백엔드와 언어 설정 동기화
    useEffect(() => {
        // 사용자가 로그인 상태이고, 언어가 설정되어 있는 경우에만 동기화
        if (isAuthenticated && language) {
            syncWithBackend(language)
                .catch(err => console.error('Initial language sync failed:', err));
        }
    }, [isAuthenticated, language, syncWithBackend]);
    // Context 값 정의
    const contextValue = {
        currentLanguage: language,
        changeLanguage: handleLanguageChange
    };
    return (_jsx(LanguageContext.Provider, { value: contextValue, children: children }));
};
export default LanguageProvider;
