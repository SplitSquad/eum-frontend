/**
 * 날짜 문자열을 YYYY-MM-DD HH:MM 형식으로 변환합니다.
 * @param dateString - 날짜 문자열
 * @returns 포맷된 날짜 문자열
 */
export const formatDateTime = (dateString) => {
    if (!dateString)
        return '';
    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    catch (e) {
        console.error('날짜 형식화 오류:', e);
        return '';
    }
};
/**
 * 날짜가 수정되었는지 확인하고 적절한 표시를 반환합니다.
 * @param createdAt - 생성 날짜
 * @param updatedAt - 수정 날짜
 * @returns 수정 표시 문자열
 */
export const getEditedMark = (createdAt, updatedAt) => {
    if (!updatedAt || !createdAt || updatedAt === createdAt)
        return '';
    return ' (수정됨)';
};
