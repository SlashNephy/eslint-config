import { defineConfig } from 'eslint/config'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'

export const vite = defineConfig({
  name: 'eslint-plugin-react-refresh',
  files: ['**/src/**/*.{jsx,tsx}'],
  extends: [reactRefreshPlugin.configs.vite],
})
