import type { Linter } from 'eslint'
import vitest from '@vitest/eslint-plugin'

/**
 * vitest 関連の eslint プリセット
 */
export const vitestConfig: Linter.Config = {
  files: [
    '**/*.test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
    '**/test/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
  ],
  plugins: { vitest },
  rules: {
    ...vitest.configs.recommended.rules,
  },
  settings: {
    vitest: {
      typecheck: true,
    },
  },
  languageOptions: {
    globals: {
      ...vitest.environments.env.globals,
    },
  },
}
