import { useState, useEffect } from 'react';
export function UseDeviceDetect() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || '';
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        setIsMobile(mobileRegex.test(userAgent));
    }, []);
    return { isMobile, isDesktop: !isMobile };
}
