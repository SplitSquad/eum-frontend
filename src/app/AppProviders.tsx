import { SnackbarProvider } from 'notistack';
import React, { ReactNode } from 'react';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={1500}
    >
      {children}
    </SnackbarProvider>
  );
}
