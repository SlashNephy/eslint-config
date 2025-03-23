import { defineConfig } from 'eslint/config'

import config from './src/index.js'

export default defineConfig([
  ...config,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'import/no-default-export': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },
])
