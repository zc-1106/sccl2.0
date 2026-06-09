/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        jp: ['var(--font-jp)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        bg: 'var(--color-bg)',
        'bg-card': 'var(--color-bg-card)',
        'bg-input': 'var(--color-bg-input)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        btn: 'var(--radius-btn)',
        tag: 'var(--radius-tag)',
        input: 'var(--radius-input)',
        sm: 'var(--radius-sm)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        btn: 'var(--shadow-btn)',
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'voice-wave': 'voiceWave 0.6s ease-in-out infinite',
        'wiggle': 'wiggle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pop-in': 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'sticker': 'stickerPeel 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'ripple': 'ripple 1s ease-out infinite',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.08)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        voiceWave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '80%': { transform: 'scale(1.15) rotate(3deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        stickerPeel: {
          '0%': { transform: 'rotate(-2deg) scale(0.9)', opacity: '0' },
          '60%': { transform: 'rotate(1deg) scale(1.05)' },
          '100%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
        },
        ripple: {
          '0%': { boxShadow: '0 0 0 0 rgba(255,143,171,0.5)' },
          '100%': { boxShadow: '0 0 0 20px rgba(255,143,171,0)' },
        },
      },
    },
  },
  plugins: [],
}
