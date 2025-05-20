/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'verde-cia': 'rgb(var(--verde-cia) / <alpha-value>)',
        'verde-cia-escuro': 'rgb(22 163 74)',
        'verde-cia-claro': '#e8f5e8',
        'verde-cia-pale': '#f0f7f0',
        'verde-cia-medio': '#5baa5b',
        'verde-cia-suave': '#69b269',
        'azul-medico': '#2c7aa1',
        'azul-medico-claro': '#e8f4f8',
        'turquesa': '#20B2AA',
        'verde-agua': '#43c6ac',
        'verde-profundo': '#164c2f',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(120deg, white, #e8f5e8, #f0f7f0, white)',
        'gradient-diagonal-1': 'linear-gradient(45deg, rgba(64, 128, 64, 0.3), rgba(64, 128, 64, 0.1), rgba(44, 122, 161, 0.2))',
        'gradient-diagonal-2': 'linear-gradient(135deg, rgba(44, 122, 161, 0.2), rgba(64, 128, 64, 0.1), rgba(44, 122, 161, 0.05))',
        'gradient-radial': 'radial-gradient(circle, rgba(64, 128, 64, 0.4) 0%, rgba(255, 255, 255, 0) 70%)',
        'grid': 'linear-gradient(to right, rgba(64, 128, 64, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(64, 128, 64, 0.05) 1px, transparent 1px)',
        'gradient-alternating': 'linear-gradient(var(--direction, to right), rgba(105, 178, 105, 0.3), rgba(105, 178, 105, 0.85))',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float-delay 8s ease-in-out infinite',
        'float-slow': 'float-slow 10s ease-in-out infinite',
        'shine': 'shine 3s linear infinite',
        'pulse-ring': 'pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'pulse-dot': 'pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'gradient-slow': 'gradient-shift 15s ease infinite alternate',
        'gradient-alternating': 'gradient-alternate 35s cubic-bezier(0.4, 0.0, 0.2, 1) infinite',
        'ripple': 'ripple 3s ease-out infinite',
        'glow': 'glow 4s ease-in-out infinite',
        'liquid-float': 'liquid-float 15s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-delay': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          to: { backgroundPosition: '200% center' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '80%, 100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'pulse-dot': {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.8)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        },
        'gradient-alternate': {
          '0%, 100%': { '--direction': 'to right' },
          '25%': { '--direction': 'to bottom' },
          '50%': { '--direction': 'to left' },
          '75%': { '--direction': 'to top' },
        },
        'ripple': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(3)', opacity: '0' },
        },
        'glow': {
          '0%, 100%': { filter: 'brightness(1) saturate(1)' },
          '50%': { filter: 'brightness(1.2) saturate(1.3)' },
        },
        'liquid-float': {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-10px) translateX(5px)' },
          '50%': { transform: 'translateY(0) translateX(10px)' },
          '75%': { transform: 'translateY(10px) translateX(5px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
        },
      },
      rotate: {
        '15': '15deg',
        '-15': '-15deg',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#408040',
              '&:hover': {
                color: '#1a3d1a',
              },
            },
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
            },
            h5: {
              color: 'inherit',
            },
            h6: {
              color: 'inherit',
            },
            strong: {
              color: 'inherit',
            },
            code: {
              color: 'inherit',
            },
            figcaption: {
              color: 'inherit',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}