/**
 * 토론 관련 API 모듈 내보내기
 */
import DebateApi, { getTodayIssues, getHotIssue, getBalancedIssue } from './debateApi';
import CommentApi from './commentApi';
import apiClient from './apiClient';
// API 클라이언트
export { apiClient };
// 토론 관련 API
export { DebateApi, getTodayIssues, getHotIssue, getBalancedIssue };
// 댓글 관련 API
export { CommentApi };
// 통합 API 객체
export const api = {
    debate: DebateApi,
    comment: CommentApi,
    special: {
        getTodayIssues,
        getHotIssue,
        getBalancedIssue,
    },
};
export default api;
