import { create } from 'zustand';
import {
  User,
  Post,
  PostDetail,
  Comment,
  CommentDetail,
  Reply,
  ReplyDetail,
  Report,
} from '../types';
import mypageApi from '../api/adminpageApi';
import { useAuthStore } from '../../auth/store/authStore';

// 프로필 섹션 로딩 상태를 나타내는 타입
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 마이페이지 스토어 상태 인터페이스
interface AdminpageState {}

// 마이페이지 스토어 생성
export const useAdminpageStore = create<AdminpageState>((set, get) => ({}));

export default useAdminpageStore;
