import gitignore from 'eslint-config-flat-gitignore'

import { config } from 'typescript-eslint'
import stylisticPlugin from '@stylistic/eslint-plugin'
import { globalIgnores } from 'eslint/config'

export const common = config(
  globalIgnores([
    '**/.git/**',
    '**/node_modules/**',
    '**/.yarn/**',
    '**/dist/**',
    '**/.idea/**',
  ]),
  {
    name: 'eslint-config-flat-gitignore',
    extends: [gitignore()],
  },
  {
    name: '@stylistic/eslint-plugin',
    extends: [
      stylisticPlugin.configs.customize({
        indent: 2,
        quotes: 'single',
        semi: false,
        jsx: true,
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
  }
)
