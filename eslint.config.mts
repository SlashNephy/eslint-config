import { config } from './src/index.ts'

export default config(
  {},
  {
    languageOptions: {
      parserOptions: {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'import-x/no-default-export': 'off',
      'import-x/no-named-as-default-member': 'off',
    },
  },
)
