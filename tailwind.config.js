/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Tweak in M6 (tag-style) and M8 (due-tint)
        feature: '#10B981', // emerald
        bug: '#DC2626',     // crimson

        brand_primary: '#4B2A6B', // royal plum
        brand_accent: '#4F7A5A', // deep sage
        surface_page: '#F7F3EE', // ivory
        surface_card: '#FFFDF9', // off-white
        text_primary: '#1A1620', // charcoal
        text_muted: '#686474', // taupe

        due_safe: '#7FA886', // light sage
        due_warning: '#C08A2E', // goldenrod
        due_overdue: '#B23A3A', // brick red
        due_neutral: '#9A94A3', // muted lavender
      },
    },
  },
  plugins: [],
};
