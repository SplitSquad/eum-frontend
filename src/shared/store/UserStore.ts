import { create } from 'zustand';

interface UserProfile {
  userId: number;
  email: string;
  name: string;
  profileImagePath?: string;
  address?: string;
  signedAt: string;
  isDeactivated: boolean;
  nation: string;
  language: string;
  gender: string;
  visitPurpose: string;
  onBoardingPreference: { notifications: boolean; darkMode: boolean };
  isOnBoardDone: boolean;
}

interface UserStore {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  setAuthStatus: (status: boolean) => void;
  setUserProfile: (profile: UserProfile) => void;
}

export const useUserStore = create<UserStore>(set => ({
  isAuthenticated: false,
  userProfile: null,
  setAuthStatus: status => set({ isAuthenticated: status }),
  setUserProfile: profile => set({ userProfile: profile }),
}));
