import vitestPlugin from '@vitest/eslint-plugin'
import { defineConfig } from 'eslint/config'

export const vitest = defineConfig({
  name: '@vitest/eslint-plugin',
  files: [
    '**/*.test.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
    '**/test/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
  ],
  extends: [vitestPlugin.configs.recommended],
  settings: {
    vitest: {
      typecheck: true,
    },
  },
  languageOptions: {
    globals: {
      ...vitestPlugin.environments.env.globals,
    },
  },
})
