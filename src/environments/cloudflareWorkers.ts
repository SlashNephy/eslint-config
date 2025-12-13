import { defineConfig } from 'eslint/config'

export const cloudflareWorkers = defineConfig({
  files: ['**/src/worker.{js,ts}', '**/functions/**/*.{js,ts}'],
  rules: {
    // default export を許可
    'import-x/no-default-export': 'off',
    'import-x/no-anonymous-default-export': 'off',
  },
})
