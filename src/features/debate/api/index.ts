/**
 * 토론 관련 API 모듈 내보내기
 */
import DebateApi, { getTodayIssues, getHotIssue, getBalancedIssue } from './debateApi';
import CommentApi from './commentApi';

// 모든 API 재노출
export {
  DebateApi,
  CommentApi,
  getTodayIssues,
  getHotIssue,
  getBalancedIssue
};

// 기본 내보내기 - DebateApi
export default {
  ...DebateApi,
  comments: CommentApi,
  getTodayIssues,
  getHotIssue,
  getBalancedIssue
}; 