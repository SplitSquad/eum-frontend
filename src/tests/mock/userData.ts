import { User } from '../../features/auth/store/authStore';

export const mockUser: User = {
  userId: 1,
  email: 'test@example.com',
  role: 'ROLE_USER',
  isNewUser: false,
  isOnBoardDone: true,
  name: '테스트 사용자',
  picture: 'https://picsum.photos/100/100',
  googleId: '123456789',
};

export const mockAdminUser: User = {
  userId: 2,
  email: 'admin@example.com',
  role: 'ROLE_ADMIN',
  isNewUser: false,
  isOnBoardDone: true,
  name: '관리자',
  picture: 'https://picsum.photos/100/100',
  googleId: '987654321',
};

export const mockNewUser: User = {
  userId: 3,
  email: 'new@example.com',
  role: 'ROLE_USER',
  isNewUser: true,
  isOnBoardDone: false,
  name: '신규 사용자',
  picture: 'https://picsum.photos/100/100',
  googleId: '456789123',
};
