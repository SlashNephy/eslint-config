import packageJsonConfig from 'eslint-plugin-package-json/configs/recommended'
import { config } from 'typescript-eslint'

export const packageJson = config({
  name: 'eslint-plugin-package-json',
  files: ['**/package.json'],
  extends: [packageJsonConfig],
  rules: {
    'package-json/order-properties': [
      'error',
      {
        order: 'sort-package-json',
      },
    ],
  },
})
