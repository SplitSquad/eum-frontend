/**
 * 마이페이지 API 모듈
 */
import mypageApi from './mypageApi';

// 모든 API 함수 재노출
export const getProfileInfo = mypageApi.getProfileInfo;
export const updateProfile = mypageApi.updateProfile;
export const changePassword = mypageApi.changePassword;
export const getMyPosts = mypageApi.getMyPosts;
export const getMyComments = mypageApi.getMyComments;
export const getMyDebates = mypageApi.getMyDebates;
export const getMyBookmarks = mypageApi.getMyBookmarks;
export const uploadProfileImage = mypageApi.uploadProfileImage;
export const deleteProfileImage = mypageApi.deleteProfileImage;

// 기본 내보내기
export default mypageApi; 