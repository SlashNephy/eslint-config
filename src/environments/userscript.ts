import userScriptsPlugin from 'eslint-plugin-userscripts'
import { config } from 'typescript-eslint'

export const userScript = config({
  name: 'eslint-plugin-userscripts',
  files: ['**/*.user.js'],
  plugins: {
    userScripts: userScriptsPlugin,
  },
  rules: {
    ...userScriptsPlugin.configs.recommended.rules,
    'no-undef': 'off',
    'xss/no-mixed-html': 'off',
    'xss/no-location-href-assign': 'off',
    'userscripts/compat-grant': [
      'error',
      {
        requireAllCompatible: true,
      },
    ],
    'userscripts/compat-headers': [
      'error',
      {
        requireAllCompatible: true,
      },
    ],
  },
})
