import type { Linter } from 'eslint'

module.exports = {
  extends: ['plugin:package-json/recommended'],
  plugins: ['package-json'],
  env: {
    node: true,
  },
  rules: {
    'package-json/order-properties': [
      'error',
      {
        order: 'sort-package-json',
      },
    ],
  },
} satisfies Linter.Config
