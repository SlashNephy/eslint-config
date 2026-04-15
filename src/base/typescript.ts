import safeTypeScriptPlugin from '@susisu/eslint-plugin-safe-typescript'
import { defineConfig } from 'eslint/config'
import { importX } from 'eslint-plugin-import-x'
import tsdocPlugin from 'eslint-plugin-tsdoc'
import tseslint from 'typescript-eslint'

export const typeScript = defineConfig(
  {
    files: ['**/*.cts'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    files: ['**/*.{ts,mts,tsx}'],
    languageOptions: {
      sourceType: 'module',
    },
  },

  {
    name: 'typescript-eslint',
    files: ['**/*.{ts,cts,mts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            '*.config.{ts,cts,mts}',
          ],
        },
        // tsconfigRootDir は利用側で定義する必要がある
        // tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      /**
       * Automatically fixable は error にする
       */
      // interface 👉 type
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      // export type を優先
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      // import type を優先
      '@typescript-eslint/consistent-type-imports': 'error',
      // クラスのアクセス修飾子を強制
      '@typescript-eslint/explicit-member-accessibility': 'error',
      // export されているメンバーや public メンバーは型を明示させる
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/method-signature-style': ['warn', 'method'],
      // 命名規則を強制
      '@typescript-eslint/naming-convention': [
        'warn',
        // デフォルトは camelCase
        {
          selector: ['default'],
          format: ['strictCamelCase'],
        },
        // 型名 / 列挙型のメンバーは PascalCase
        {
          selector: ['typeLike', 'enumMember'],
          format: ['StrictPascalCase'],
        },
        // 変数名は camelCase
        {
          selector: ['variableLike'],
          format: ['strictCamelCase', 'StrictPascalCase'],
          leadingUnderscore: 'allow',
        },
        // インポート名は camelCase / PascalCase
        {
          selector: ['import'],
          format: ['camelCase', 'PascalCase'],
        },
        // export された定数は UPPER_CASE を許容
        {
          selector: ['variable'],
          modifiers: ['const', 'global', 'exported'],
          format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
        },
        // プロパティーに snake_case / UPPER_CASE を許容
        {
          selector: ['property'],
          format: [
            'strictCamelCase',
            'snake_case',
            'UPPER_CASE',
            'StrictPascalCase',
          ],
        },
        // Boolean は特定のプレフィックスを強制
        {
          selector: ['variable'],
          types: ['boolean'],
          format: ['StrictPascalCase'],
          prefix: [
            'is',
            'are',
            'was',
            'were',
            'should',
            'has',
            'can',
            'did',
            'will',
            'contains',
            'enable',
            'disable',
            'show',
            'hide',
          ],
        },
        // プライベートメンバーは _ で始める
        {
          selector: ['memberLike'],
          modifiers: ['private'],
          format: ['strictCamelCase'],
          leadingUnderscore: 'require',
        },
        // deconstruct で宣言された変数は許容
        {
          selector: ['variableLike'],
          modifiers: ['destructured'],
          format: null,
        },
        // オブジェクトのキーなど '' 付きの宣言は許容
        {
          selector: ['memberLike', 'property'],
          modifiers: ['requiresQuotes'],
          format: null,
        },
      ],
      // void を式の値として禁止
      '@typescript-eslint/no-confusing-void-expression': 'error',
      // 重複した型定義を禁止
      // boolean | false 👉 boolean
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      // require() を禁止
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-useless-empty-export': 'error',
      // パラメーターでのプロパティ宣言を強制
      '@typescript-eslint/parameter-properties': [
        'warn',
        {
          allow: [
            'readonly',
            'private',
            'protected',
            'public',
            'private readonly',
            'protected readonly',
            'public readonly',
          ],
          prefer: 'parameter-property',
        },
      ],
      '@typescript-eslint/prefer-enum-initializers': 'warn',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-regexp-exec': 'error',
      // Promise<T> を返す関数では async のマークを強制
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/unbound-method': 'off',
      // 過激なルールを無効化
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      // enum のメンバーでビット演算を許可する
      '@typescript-eslint/prefer-literal-enum-member': [
        'error',
        {
          allowBitwiseExpressions: true,
        },
      ],
      // '1' + 2 を禁止
      '@typescript-eslint/restrict-plus-operands': 'error',
      // 数値型の配列の sort() を禁止
      '@typescript-eslint/require-array-sort-compare': [
        'error',
        {
          ignoreStringArrays: true,
        },
      ],
      // Deprecated されたコードの使用を禁止
      '@typescript-eslint/no-deprecated': 'error',
      // 関数の返り値としての void 以外を禁止
      '@typescript-eslint/no-invalid-void-type': 'error',
      // 不要な変数を禁止
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn', {
        // '_' で始まる変数を許可
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    name: 'typescript-eslint (JavaScript)',
    files: ['**/*.{js,cjs,mjs,jsx}'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  {
    name: 'eslint-plugin-import-x',
    files: ['**/*.{ts,cts,mts,tsx}'],
    extends: [
      importX.flatConfigs.typescript,
    ],
    rules: {
      // import に拡張子を推奨
      'import-x/extensions': [
        'warn',
        'always',
        {
          ignorePackages: true,
        },
      ],
    },
  },
  {
    name: '@susisu/eslint-plugin-safe-typescript',
    files: ['**/*.{ts,cts,mts,tsx}'],
    plugins: {
      '@susisu/safe-typescript': safeTypeScriptPlugin,
    },
    rules: safeTypeScriptPlugin.configs.recommended.rules,
  },
  {
    name: 'eslint-plugin-tsdoc',
    files: ['**/*.{ts,cts,mts,tsx}'],
    plugins: {
      tsdoc: tsdocPlugin,
    },
    rules: {
      // TSDoc
      'tsdoc/syntax': 'warn',
    },
  },
)
