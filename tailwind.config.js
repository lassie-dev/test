import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Fondo principal: blanco limpio
                background: '#FFFFFF',

                // Acentos primarios (funerario - sobrio y profesional)
                primary: {
                    50: '#f5f7fa',
                    100: '#eaeef4',
                    200: '#d1dbe6',
                    300: '#a8bcd1',
                    400: '#7998b8',
                    500: '#567a9e',  // Principal
                    600: '#446184',
                    700: '#38506c',
                    800: '#31445b',
                    900: '#2d3c4d',
                },

                // Secundario (dorado elegante - para detalles importantes)
                secondary: {
                    50: '#faf9f5',
                    100: '#f4f1e6',
                    200: '#e6dfc7',
                    300: '#d4c79f',
                    400: '#c0aa75',
                    500: '#b09355',  // Principal
                    600: '#a37d49',
                    700: '#88653e',
                    800: '#6f5337',
                    900: '#5c442f',
                },

                // Estados
                success: '#10b981',  // Verde
                warning: '#f59e0b',  // Ámbar
                error: '#ef4444',    // Rojo
                info: '#3b82f6',     // Azul
            },
        },
    },

    plugins: [forms],
};
