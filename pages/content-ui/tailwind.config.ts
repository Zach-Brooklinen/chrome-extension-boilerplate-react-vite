import baseConfig from '@extension/tailwindcss-config';
import { withUI } from '@extension/ui';

export default withUI({
  ...baseConfig,
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      animation: {
        fade: 'fadeIn .25s ease-in-out',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
});
