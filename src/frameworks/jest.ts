import { defineConfig } from 'eslint/config'
import jestPlugin from 'eslint-plugin-jest'

export const jest = defineConfig({
  name: 'eslint-plugin-jest',
  files: [
    '**/*.test.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
    '**/test/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
  ],
  extends: [jestPlugin.configs['flat/all']],
})
