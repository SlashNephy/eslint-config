import nextPlugin from '@next/eslint-plugin-next'
import { defineConfig } from 'eslint/config'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'

export const nextJs = defineConfig(
  {
    name: '@next/eslint-plugin-next',
    files: [
    // Pages Router
      '**/pages/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
      // App Router
      '**/app/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
    ],
    extends: [
      nextPlugin.configs.recommended,
      nextPlugin.configs['core-web-vitals'],
    ],
    rules: {
      'import-x/no-default-export': 'off',
    },
    ignores: ['**/.next/**'],
  },
  {
    name: 'eslint-plugin-react-refresh',
    files: [
    // Pages Router
      '**/pages/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
      // App Router
      '**/app/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
    ],
    extends: [reactRefreshPlugin.configs.next],
  },
)
