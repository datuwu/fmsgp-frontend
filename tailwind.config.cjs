import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    corePlugins: {
        preflight: false,
    },
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '1.5rem',
            screens: {
                '2xl': '1360px',
            },
        },
        extend: {
            colors: {
                tango: {
                    DEFAULT: '#EA6D22',
                    50: '#FADCCA',
                    100: '#F8CFB7',
                    200: '#F5B792',
                    300: '#F19E6D',
                    400: '#EE8647',
                    500: '#EA6D22',
                    600: '#C25412',
                    700: '#8E3E0E',
                    800: '#5B2809',
                    900: '#281104',
                    950: '#0E0601',
                },
            },
            fontFamily: {
                sans: ['var(--font-sans)', ...fontFamily.sans],
            },
        },
    },
    plugins: [],
};
