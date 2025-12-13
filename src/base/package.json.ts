import { defineConfig } from 'eslint/config'
import packageJsonPlugin from 'eslint-plugin-package-json'

export const packageJson = defineConfig({
  name: 'eslint-plugin-package-json',
  files: ['**/package.json'],
  extends: [packageJsonPlugin.configs.recommended],
  rules: {
    'package-json/require-description': 'off',
    'package-json/order-properties': [
      'error',
      {
        order: 'sort-package-json',
      },
    ],
  },
})
