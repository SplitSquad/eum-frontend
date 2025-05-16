/**
 * 언어 감지 및 FormData 처리 유틸리티
 */
/**
 * 텍스트의 언어를 감지하고 ISO 639-1 코드로 변환하는 유틸리티 함수
 * @param text 감지할 텍스트
 * @returns 감지된 언어 코드 (ko, en, ja, zh 등)
 */
export const detectLanguage = (text) => {
    try {
        // 텍스트가 비어있는 경우 기본값으로 한국어 반환
        if (!text || text.trim().length === 0) {
            return 'ko';
        }
        // CDN으로 추가된 franc 라이브러리 사용
        if (typeof window.franc === 'function') {
            // franc는 ISO 639-3 코드를 반환하므로 변환 필요
            const iso639_3 = window.franc(text, { minLength: 3 });
            // ISO 639-3 -> ISO 639-1 변환
            switch (iso639_3) {
                case 'kor':
                    return 'ko'; // 한국어
                case 'eng':
                    return 'en'; // 영어
                case 'jpn':
                    return 'ja'; // 일본어
                case 'cmn':
                    return 'zh'; // 중국어 (표준 중국어)
                case 'zho':
                    return 'zh'; // 중국어 (일반)
                default:
                    return 'ko'; // 기본값은 한국어
            }
        }
        // franc 라이브러리가 없는 경우 기본값
        return 'ko';
    }
    catch (error) {
        console.error('언어 감지 중 오류 발생:', error);
        return 'ko'; // 오류 발생 시 기본값은 한국어
    }
};
/**
 * FormData에 언어 감지 결과와 기본 필드를 추가하는 유틸리티 함수
 * @param formData 수정할 FormData 객체
 * @param title 제목 텍스트
 * @param content 내용 텍스트
 * @returns 언어 필드가 추가된 FormData 객체
 */
export const enhanceFormDataWithLanguage = (formData, title, content) => {
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
