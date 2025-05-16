/**
 * isEmailValid 함수는 주어진 이메일 문자열이 유효한지 정규 표현식을 통해 검사
 *
 * @param email - 검사할 이메일 문자열
 * @returns 이메일 형식이 유효하면 true, 아니면 false
 */
/**
 * isEmailValid 함수는 이메일 문자열이 일반적인 이메일 형식을 따르는지 정규식을 통해 검사
 */
export const IsEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
/**
 * isNotEmpty 함수는 문자열이 공백이 아닌지 검사
 *
 * @param str - 검사할 문자열
 * @returns 문자열에 내용이 있으면 true, 아니면 false
 */
/**
 * isNotEmpty 함수는 문자열에서 공백을 제거한 뒤 길이가 0보다 큰지를 검사
 */
export const IsNotEmpty = (str) => {
    return str.trim().length > 0;
};
/**
 * isPasswordStrong 함수는 비밀번호가 최소 8자리, 대문자, 소문자, 숫자, 특수문자를 포함하는지 확인
 *
 * @param password - 검사할 비밀번호 문자열
 * @returns 조건을 만족하면 true, 아니면 false
 */
/**
 * isPasswordStrong 함수는 최소 8자리이며, 대/소문자, 숫자, 특수문자가 포함되어 있는지를 검사
 */
export const IsPasswordStrong = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return strongRegex.test(password);
};
