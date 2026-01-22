import { defineConfig } from 'eslint/config'
import { configs as ymlConfig } from 'eslint-plugin-yml'

export const yaml = defineConfig(
  {
    name: 'eslint-plugin-yml',
    files: ['**/*.{yml,yaml}'],
    extends: [
      ymlConfig.recommended,
    ],
  },
  {
    name: 'eslint-plugin-yml (GitHub Workflow)',
    files: ['.github/workflows/*.{yml,yaml}'],
    rules: {
      // workflow_dispatch: のような空のマップを許可する
      'yml/no-empty-mapping-value': 'off',
    },
  },
)
