import { useState, useEffect } from 'react';
export function UseLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const stored = window.localStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialValue;
        }
        catch {
            return initialValue;
        }
    });
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
        catch {
            // 쓰기 실패 시 무시
        }
    }, [key, value]);
    return [value, setValue];
}
