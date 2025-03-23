import stylisticPlugin from '@stylistic/eslint-plugin'
import { globalIgnores } from 'eslint/config'
import gitignore from 'eslint-config-flat-gitignore'
import { config } from 'typescript-eslint'

export const common = config(
  globalIgnores([
    '**/.git/**',
    '**/node_modules/**',
    '**/.yarn/**',
    '**/dist/**',
    '**/.idea/**',
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
