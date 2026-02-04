/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#357ABD', // Lighter Blue
                    DEFAULT: '#0F4C81', // Classic Trustworthy Blue
                    dark: '#0A3355',
                },
                secondary: {
                    light: '#E5E0D0', // Even Darker Warm Beige (User request 2)
                    DEFAULT: '#EBE9E1', // Darker Beige for contrast
                    dark: '#D8D6CF',
                },
                accent: {
                    DEFAULT: '#4CAF50', // Calm Green
                    hover: '#388E3C',
                },
                text: {
                    main: '#1A202C', // Dark Slate
                    light: '#4A5568', // Medium Slate
                }
            },
            fontFamily: {
                sans: ['NanumSquareRound', 'Gowun Dodum', 'Pretendard', 'Inter', 'sans-serif'],
                serif: ['Noto Serif KR', 'serif'],
            },
            keyframes: {
                'fade-in-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                }
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
            }
        },
    },
    plugins: [],
}
