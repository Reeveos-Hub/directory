export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ReeveOS Consumer Brand: Rich Black + Gold
        primary: '#111111',
        'primary-hover': '#000000',
        accent: '#C9A84C',
        'accent-hover': '#D4B35A',
        'accent-light': 'rgba(201,168,76,0.08)',
        'accent-border': 'rgba(201,168,76,0.3)',
        background: '#FFFFFF',
        card: '#FFFFFF',
        surface: '#F5F5F3',
        border: '#E5E7EB',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        text: {
          main: '#111111',
          muted: '#6B7280',
          light: '#9CA3AF',
        },
        gold: '#C9A84C',
        black: '#111111',
      },
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        display: ['Figtree', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        input: '12px',
        pill: '99px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 16px 48px rgba(0,0,0,0.1)',
        'gold-glow': '0 0 20px 5px rgba(201,168,76,0.3), 0 0 6px rgba(201,168,76,0.15)',
        'gold-glow-lg': '0 0 28px 6px rgba(201,168,76,0.35), 0 0 8px rgba(201,168,76,0.2)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
      },
    },
  },
  plugins: [],
}
