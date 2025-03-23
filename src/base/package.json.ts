import packageJsonPlugin from 'eslint-plugin-package-json'
import { config } from 'typescript-eslint'

export const packageJson = config({
  name: 'eslint-plugin-package-json',
  files: ['**/package.json'],
  extends: [packageJsonPlugin.configs.recommended],
  rules: {
    'package-json/order-properties': [
      'error',
      {
        order: 'sort-package-json',
      },
    ],
  },
})
