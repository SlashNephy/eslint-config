import stylisticPlugin from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import gitignore from 'eslint-config-flat-gitignore'

export const common = defineConfig(
  globalIgnores([
    '**/.git/**',
    '**/node_modules/**',
    '**/.yarn/**',
    '**/dist/**',
    '**/.idea/**',
    '**/pnpm-lock.yaml',
  ]),
  gitignore({ name: 'eslint-config-flat-gitignore', strict: false }),
  {
    name: '@stylistic/eslint-plugin',
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    extends: [
      stylisticPlugin.configs.customize({
        indent: 2,
        quotes: 'single',
        semi: false,
        jsx: true,
        arrowParens: true,
        blockSpacing: true,
        quoteProps: 'consistent-as-needed',
        commaDangle: 'always-multiline',
      }),
    ],
    rules: {
      // UTF-8 BOM を禁止
      'unicode-bom': ['error', 'never'],
      // 最終行に改行を挿入
      '@stylistic/eol-last': ['error', 'always'],
      // 行末のスペースを禁止
      '@stylistic/no-trailing-spaces': ['error'],
      // 型名の前後のスペースを揃える
      // e.g. const foo: string = 'bar'
      '@stylistic/type-annotation-spacing': 'error',
    },
  },
)
