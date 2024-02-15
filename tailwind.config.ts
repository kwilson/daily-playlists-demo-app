import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'app-bg': '#18181b',
        'electric-violet': {
          '50': 'hsl(245, 100%, 97%)',
          '100': 'hsl(250, 100%, 95%)',
          '200': 'hsl(247, 100%, 91%)',
          '300': 'hsl(250, 100%, 84%)',
          '400': 'hsl(252, 100%, 75%)',
          '500': 'hsl(255, 100%, 65%)',
          '600': 'hsl(258, 100%, 58%)',
          '700': 'hsl(260, 84%, 50%)',
          '800': 'hsl(260, 83%, 42%)',
          '900': 'hsl(260, 81%, 35%)',
          '950': 'hsl(257, 88%, 23%)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
