import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useUserStore } from '@/shared/store/UserStore';
import GuestHeader from './GuestHeader';
type Props = {
  children: React.ReactNode;
};

function AppLayout({ children }: Props) {
  const { isAuthenticated } = useUserStore();
  return (
    <div className="lex flex-col min-h-screen h-screen flex flex-col overflow-hidden">
      {isAuthenticated ? <Header /> : <GuestHeader />}
      <div className="flex-1 overflow-y-auto">{children}</div>
      <Footer />
    </div>
  );
}

export default AppLayout;
