import type { Linter } from 'eslint'
import jest from 'eslint-plugin-jest'

/**
 * jest 関連の eslint プリセット
 */
export const jestConfig: Linter.Config = {
  files: [
    '**/*.test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
    '**/test/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
  ],
  ...jest.configs['flat/all'],
}
