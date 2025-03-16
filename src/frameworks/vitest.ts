import vitestPlugin from '@vitest/eslint-plugin'
import { config } from 'typescript-eslint'

export const vitest = config({
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
