import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { subscribeToToasts, ToastEvent } from '../../utils/errorHandler';

/**
 * 토스트 메시지 컴포넌트
 * errorHandler.ts의 토스트 이벤트를 구독하여 표시
 */
const Toast: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [duration, setDuration] = useState(3000);

  useEffect(() => {
    // 토스트 이벤트 구독
    const unsubscribe = subscribeToToasts((event: ToastEvent) => {
      setMessage(event.message);
      setSeverity(event.type as AlertColor);
      setDuration(event.duration || 3000);
      setOpen(true);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribe();
    };
  }, []);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast; 