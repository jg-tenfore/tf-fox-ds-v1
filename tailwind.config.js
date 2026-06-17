/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind scans these for className usage across the app, the design
  // system, and Storybook stories.
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './.storybook/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /**
         * Sagamore Golf Club — monochromatic, minimal palette.
         * A single neutral grey ramp does all the work; there is no accent
         * hue. "ink" is the near-black used for text and primary actions,
         * "paper" is the white canvas.
         */
        mono: {
          0: '#ffffff',
          50: '#f7f7f7',
          100: '#ededed',
          200: '#dcdcdc',
          300: '#bdbdbd',
          400: '#989898',
          500: '#7c7c7c',
          600: '#656565',
          700: '#525252',
          800: '#3d3d3d',
          900: '#2b2b2b',
          950: '#161616',
          1000: '#000000',
        },
        // Semantic aliases — use these in components, not raw mono steps.
        paper: '#ffffff',
        canvas: '#fafafa',
        ink: '#161616',
        'ink-muted': '#7c7c7c',
        'ink-subtle': '#989898',
        line: '#ededed',
        'line-strong': '#dcdcdc',
        primary: '#161616',
        'primary-foreground': '#ffffff',
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      fontFamily: {
        sans: ['System'],
        mono: ['SpaceMono'],
      },
      fontSize: {
        // type scale — minimal, restrained
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '26px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
    },
  },
  plugins: [],
};
