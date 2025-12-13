import { defineConfig } from 'eslint/config'
import storybookPlugin from 'eslint-plugin-storybook'

export const storybook = defineConfig(
  // eslint-plugin-storybook
  // @ts-expect-error -- 型定義が不一致
  storybookPlugin.configs['flat/recommended'],
)
