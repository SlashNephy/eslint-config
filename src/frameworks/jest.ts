import jestPlugin from 'eslint-plugin-jest'
import { config } from 'typescript-eslint'

export const jest = config({
  name: 'eslint-plugin-jest',
  files: [
    '**/*.test.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
    '**/test/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
  ],
  extends: [jestPlugin.configs['flat/all']],
})
