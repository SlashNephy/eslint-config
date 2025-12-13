import { defineConfig } from 'eslint/config'
import ymlPlugin from 'eslint-plugin-yml'

export const yaml = defineConfig(
  {
    name: 'eslint-plugin-yml',
    files: ['**/*.{yml,yaml}'],
    extends: [
      ymlPlugin.configs['flat/standard'],
    ],
    rules: {
      'yml/quotes': ['error', { prefer: 'double' }],
    },
  },
  {
    name: 'eslint-plugin-yml (GitHub Workflow)',
    files: ['.github/workflows/*.{yml,yaml}'],
    rules: {
      // ダブルクォートが使えない場合があるのでシングルに統一
      // https://github.com/actions/runner/issues/866
      'yml/quotes': ['error', { prefer: 'single' }],
      // workflow_dispatch: のような空のマップを許可する
      'yml/no-empty-mapping-value': 'off',
    },
  },
)
