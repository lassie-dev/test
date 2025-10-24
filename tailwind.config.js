import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
    	extend: {
    		fontFamily: {
    			sans: [
    				'Inter',
    				'Figtree',
                    ...defaultTheme.fontFamily.sans
                ],
    			display: [
    				'Crimson Pro',
    				'Georgia',
    				...defaultTheme.fontFamily.serif
    			]
    		},
    		colors: {
    			background: '#FFFFFF',
    			primary: {
    				'50': '#f0f7f0',
    				'100': '#dceede',
    				'200': '#b9debb',
    				'300': '#8fc994',
    				'400': '#66b26e',
    				'500': '#4a9452',
    				'600': '#3a7640',
    				'700': '#2f5e35',
    				'800': '#27492c',
    				'900': '#1f3a24'
    			},
    			secondary: {
    				'50': '#f7f8f0',
    				'100': '#eef1dc',
    				'200': '#dde3b9',
    				'300': '#c5d089',
    				'400': '#aaba5e',
    				'500': '#8fa03f',
    				'600': '#6f7f30',
    				'700': '#586329',
    				'800': '#484f24',
    				'900': '#3c4222'
    			},
    			text: {
    				primary: '#2d2d2d',
    				secondary: '#3a4a3d',
    				muted: '#5a6b5d',
    				subtle: '#7a8a7d',
    				accent: '#2f5e35',
    				inverse: '#f8faf8'
    			},
    			success: '#4a9452',
    			warning: '#f59e0b',
    			error: '#ef4444',
    			info: '#3a7640',
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		}
    	}
    },

    plugins: [forms],
};
