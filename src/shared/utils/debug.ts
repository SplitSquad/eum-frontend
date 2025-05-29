const isDev = process.env.NODE_ENV === 'development';

export const debugLog = (message: string, data?: any) => {
  if (isDev) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

export const debugWarn = (message: string, data?: any) => {
  if (isDev) {
    console.warn(`[WARN] ${message}`, data);
  }
};

export const debugError = (message: string, error?: any) => {
  if (isDev) {
    console.error(`[ERROR] ${message}`, error);
  }
}; 