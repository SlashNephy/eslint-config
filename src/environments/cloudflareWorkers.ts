import { config } from 'typescript-eslint'

export const cloudflareWorkers = config({
  files: ['**/src/worker.{js,ts}', '**/functions/**/*.{js,ts}'],
  rules: {
    // default export を許可
    'import/no-default-export': 'off',
    'import/no-anonymous-default-export': 'off',
  },
})
