import storybookPlugin from 'eslint-plugin-storybook'
import { config } from 'typescript-eslint'

export const storybook = config({
  name: 'eslint-plugin-storybook',
  files: ['**/*.stories.{jsx,tsx}'],
  extends: [storybookPlugin.configs['flat/recommended']],
})
