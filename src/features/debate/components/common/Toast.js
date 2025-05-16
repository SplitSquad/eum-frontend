import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { subscribeToToasts } from '../../utils/errorHandler';
/**
 * 토스트 메시지 컴포넌트
 * errorHandler.ts의 토스트 이벤트를 구독하여 표시
 */
const Toast = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('info');
    const [duration, setDuration] = useState(3000);
    useEffect(() => {
        // 토스트 이벤트 구독
        const unsubscribe = subscribeToToasts((event) => {
            setMessage(event.message);
            setSeverity(event.type);
            setDuration(event.duration || 3000);
            setOpen(true);
        });
        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            unsubscribe();
        };
    }, []);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    return (_jsx(Snackbar, { open: open, autoHideDuration: duration, onClose: handleClose, anchorOrigin: { vertical: 'bottom', horizontal: 'center' }, children: _jsx(Alert, { onClose: handleClose, severity: severity, sx: { width: '100%' }, children: message }) }));
};
export default Toast;
