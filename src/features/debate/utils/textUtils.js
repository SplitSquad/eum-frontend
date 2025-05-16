/**
 * 긴 텍스트 축약하기
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) {
        return text;
    }
    return `${text.substring(0, maxLength).trim()}...`;
};
/**
 * 평문에서 URL 링크 찾아 HTML 링크로 변환
 */
export const linkifyText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
};
/**
 * 텍스트에서 HTML 태그 제거
 */
export const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};
/**
 * 마크다운 텍스트의 간단한 변환 (볼드, 이탤릭, 링크)
 */
export const simpleMarkdownToHtml = (text) => {
    // 볼드 처리 **텍스트** -> <strong>텍스트</strong>
    let result = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // 이탤릭 처리 *텍스트* -> <em>텍스트</em>
    result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // 링크 처리 [텍스트](링크) -> <a href="링크">텍스트</a>
    result = result.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return result;
};
