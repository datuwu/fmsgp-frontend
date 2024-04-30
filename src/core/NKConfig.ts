export const NKConfig = {
    API_URL: import.meta.env.VITE_API_URL || '',
    SERVER_URL: import.meta.env.VITE_SERVER_URL || '',
    GOOGLE_ANALYTICS_URL: import.meta.env.VITE_GOOGLE_ANALYTICS_URL || '',
    NODE_ENV: import.meta.env.VITE_NODE_ENV || '',
};

console.log('Config', NKConfig);
