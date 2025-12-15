import { defineConfig } from 'eslint/config'
import { configs as packageJsonConfigs } from 'eslint-plugin-package-json'

export const packageJson = defineConfig({
  name: 'eslint-plugin-package-json',
  files: ['**/package.json'],
  extends: [packageJsonConfigs.recommended],
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
