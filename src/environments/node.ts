import { defineConfig } from 'eslint/config'
import nPlugin from 'eslint-plugin-n'

export const node = defineConfig(
  {
    name: 'eslint-plugin-n',
    files: [
      '**/bin/**/*.{js,cjs,mjs,ts,cts,mts}',
      '**/*.config.{js,cjs,mjs,ts,cts,mts}',
      '**/codegen.{js,cjs,mjs,ts,cts,mts}',
    ],
    extends: [nPlugin.configs['flat/recommended']],
    rules: {
      // default export を許可
      'import-x/no-default-export': 'off',
      'import-x/no-anonymous-default-export': 'off',
      // import で devDependencies を許可
      'n/no-unpublished-import': 'off',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
      // 非同期メソッドを優先
      'n/prefer-promises/dns': 'error',
      'n/prefer-promises/fs': 'error',
      // 構文のバージョンチェックを無効化
      'n/no-unsupported-features/es-syntax': 'off',
      // 不正確な import チェックを無効化
      'n/no-missing-import': 'off',
      'n/no-extraneous-import': 'off',
    },
  },
  {
    // CommonJS
    name: 'eslint-plugin-n',
    files: [
      '**/bin/**/*.{cjs,cts}',
      '**/*.config.{cjs,cts}',
      '**/codegen.{cjs,cts}',
    ],
    extends: [nPlugin.configs['flat/recommended-script']],
  },
  {
    // ESM
    name: 'eslint-plugin-n',
    files: [
      '**/bin/**/*.{mjs,mts}',
      '**/*.config.{mjs,mts}',
      '**/codegen.{mjs,mts}',
    ],
    extends: [nPlugin.configs['flat/recommended-module']],
  },
)
