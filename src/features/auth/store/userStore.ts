import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { checkAuthStatus, logout } from '../api/authApi'; // 실제 구글 인증 API
import { getToken, setToken, removeToken } from '../tokenUtils';

/**
 * 신규 회원가입 사용자 타입 정의
 */
export interface NewUser {
  id: string;
  password: string;
  name: string;
  birthday: string;
  phone: string;
  address: string;
}

interface NewUserState {
  newUser: NewUser | null;
  setNewUser: (newUser: NewUser | null) => void;
}

/**
 * 회원가입 시 유저 정보 전송 관리를 위한 스토어
 * 간단하게 구현
 *
 */
export const useUserStore = create<NewUserState>()(
  persist(
    (set, get) => ({
      newUser: null,
      setNewUser: newUser => set({ newUser }),
    }),
    {
      name: 'newUser',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
