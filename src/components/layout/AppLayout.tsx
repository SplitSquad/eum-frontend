import React from 'react';
import Header from './Header';
import Footer from './Footer';

type Props = {
  children: React.ReactNode;
};

function AppLayout({ children }: Props) {
  return (
    <div className="lex flex-col min-h-screen h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto">{children}</div>
      <Footer />
    </div>
  );
}

export default AppLayout;
