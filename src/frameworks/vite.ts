import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import { config } from 'typescript-eslint'

export const vite = config({
  name: 'eslint-plugin-react-refresh',
  files: ['**/src/**/*.{jsx,tsx}'],
  extends: [reactRefreshPlugin.configs.vite],
})
