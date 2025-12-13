import nextPlugin from '@next/eslint-plugin-next'
import { defineConfig } from 'eslint/config'

export const nextJs = defineConfig({
  name: '@next/eslint-plugin-next',
  files: [
    // Pages Router
    '**/pages/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
    // App Router
    '**/app/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
  ],
  plugins: {
    '@next/next': nextPlugin,
  },
  extends: [
    nextPlugin.configs.recommended,
    nextPlugin.configs['core-web-vitals'],
  ],
  rules: {
    'import-x/no-default-export': 'off',
    'react-refresh/only-export-components': 'off',
  },
  ignores: ['**/.next/**'],
})
