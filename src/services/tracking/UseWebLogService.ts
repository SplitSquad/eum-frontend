// src/services/tracking/webLogService.ts
import axios from 'axios';
import { useUserStore } from '../../shared/store/UserStore';

const API_BASE = '/analytics';

// Zustand에서 꺼낸 JWT 토큰으로 Authorization 헤더를 구성
function GetAuthHeader() {
  const token = useUserStore.getState().token;
  return { Authorization: `Bearer ${token}` };
}

/**
 * POST /analytics/register
 * @param data 로그로 전송할 객체
 */
export const RegisterLog = async (data: object) => {
  const rawData = JSON.stringify(data);
  const resp = await axios.post(`${API_BASE}/register`, { rawData }, { headers: GetAuthHeader() });
  return resp.data; // { success: true }
};

/**
 * GET /analytics
 */
export const FetchAllLogs = async () => {
  const resp = await axios.get(`${API_BASE}`, { headers: GetAuthHeader() });
  return resp.data.log as any[]; // { log: [...] }
};

/**
 * GET /analytics/{userId}
 */
export const FetchUserLogs = async (userId: string) => {
  const resp = await axios.get(`${API_BASE}/${userId}`, { headers: GetAuthHeader() });
  return resp.data.log as any[];
};
