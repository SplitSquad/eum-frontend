import { RegisterLog } from './UseWebLogService';

/**
 * sendLog
 * 비동기로 로그를 전송하고, 실패 시 콘솔에 에러만 출력
 *
 * @param data 보낼 로그 데이터 객체
 */
export const SendLog = async (data: object): Promise<void> => {
  try {
    await RegisterLog(data);
  } catch (error) {
    console.error('sendLog error:', error);
  }
};
