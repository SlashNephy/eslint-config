import { defineConfig } from 'eslint/config'
import { configs as storybookConfigs } from 'eslint-plugin-storybook'

export const storybook = defineConfig(
  // @ts-expect-error -- 型定義が不一致
  storybookConfigs['flat/recommended'],
)
