import apiClient from '../../../config/axios';
import { getPreferredLanguage, isValidLanguage } from '../utils/languageUtils';
/**
 * 사용자 선호도 데이터 가져오기
 */
export const getUserPreference = async () => {
    try {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
        }
        // Authorization 헤더에 토큰 추가
        const config = {
            headers: {
                'Authorization': token
            }
        };
        return await apiClient.get('/users/preference', config);
    }
    catch (error) {
        console.error('사용자 선호도 데이터 가져오기 실패:', error);
        throw error;
    }
};
/**
 * 사용자 선호도 데이터 저장하기
 * @param data 저장할 선호도 데이터
 */
export const saveUserPreference = async (data) => {
    try {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('토큰이 없습니다. 로그인이 필요합니다.');
            throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
        }
        console.log('토큰을 사용하여 사용자 선호도 저장 요청:', token.substring(0, 20) + '...');
        // Authorization 헤더에 토큰 추가
        const config = {
            headers: {
                'Authorization': token
            }
        };
        return await apiClient.post('/users/preference', data, config);
    }
    catch (error) {
        console.error('사용자 선호도 데이터 저장 실패:', error);
        throw error;
    }
};
/**
 * 온보딩 데이터 저장하기 (일반 객체를 UserPreferenceData로 변환)
 * @param purpose 방문 목적 ('travel', 'living', 'study', 'job')
 * @param detailData 온보딩에서 수집한 상세 데이터
 */
export const saveOnboardingData = async (purpose, detailData) => {
    // 백엔드 필수 필드 검증 및 기본값 설정
    // 1. 국가 (nation) - country 또는 nationality 필드 사용
    const nation = detailData.country || detailData.nationality || '대한민국';
    // 2. 성별 (gender) - 비어있으면 'not_specified' 사용
    const gender = detailData.gender || 'not_specified';
    // 3. 언어 (language) - uiLanguage 또는 기본 언어 설정 사용
    let userLanguage = 'ko'; // 기본값
    if (detailData.uiLanguage && isValidLanguage(detailData.uiLanguage)) {
        userLanguage = detailData.uiLanguage.toLowerCase();
    }
    else {
        userLanguage = getPreferredLanguage(); // 이미 유효성 검사 포함된 함수
    }
    // 4. 방문 목적 (visitPurpose) - 매개변수로 받은 purpose 사용
    // 백엔드 형식에 맞게 변환 (첫 글자만 대문자로)
    const visitPurpose = purpose.charAt(0).toUpperCase() + purpose.slice(1);
    // 5. 기간 (period) - 목적에 따라 기간 설정
    let period = '단기'; // 기본값
    if (purpose === 'living') {
        period = '장기';
    }
    else if (purpose === 'job' || purpose === 'study') {
        period = '중기';
    }
    else if (purpose === 'travel') {
        period = '단기';
    }
    // 백엔드 필수 필드를 제외한 모든 상세 정보는 onBoardingPreference JSON에 저장
    const extraData = {
        // 기본 정보
        name: detailData.name,
        age: detailData.age,
        // 여행 관련 상세 정보
        travelData: purpose === 'travel' ? {
            travelType: detailData.travelType,
            travelDuration: detailData.travelDuration,
            travelCompanions: detailData.travelCompanions,
            startDate: detailData.startDate,
            endDate: detailData.endDate,
            interestedCities: detailData.interestedCities,
            travelPurposes: detailData.travelPurposes,
            visaType: detailData.visaType
        } : undefined,
        // 취업 관련 상세 정보
        jobData: purpose === 'job' ? {
            jobField: detailData.jobField,
            workExperience: detailData.workExperience,
            desiredPosition: detailData.desiredPosition,
            visaType: detailData.visaType
        } : undefined,
        // 유학 관련 상세 정보
        studyData: purpose === 'study' ? {
            educationLevel: detailData.educationLevel,
            fieldOfStudy: detailData.fieldOfStudy,
            desiredSchool: detailData.desiredSchool,
            visaType: detailData.visaType
        } : undefined,
        // 거주 관련 상세 정보
        livingData: purpose === 'living' ? {
            housingType: detailData.housingType,
            residenceStatus: detailData.residenceStatus,
            visaType: detailData.visaType
        } : undefined,
        // 언어 능력
        language: detailData.language,
        // 긴급 연락처
        emergencyInfo: detailData.emergencyInfo,
        // 관심사
        interests: detailData.interests
    };
    // JSON 문자열로 변환
    const onBoardingPreference = JSON.stringify(extraData);
    // UserPreferenceData 객체 생성 - 백엔드 필수 필드만 포함
    const preferenceData = {
        nation, // 검증된 국가 값
        language: userLanguage, // 검증된 언어 값
        gender, // 검증된 성별 값
        visitPurpose, // 방문 목적
        period, // 방문 기간
        onBoardingPreference, // 나머지 상세 데이터
        isOnBoardDone: true, // 온보딩 완료 상태
    };
    console.log('백엔드로 전송될 데이터:', JSON.stringify(preferenceData, null, 2));
    // API 호출하여 데이터 저장
    return await saveUserPreference(preferenceData);
};
