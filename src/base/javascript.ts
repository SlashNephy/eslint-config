import eslint from '@eslint/js'
import eslintCommentsConfig from '@eslint-community/eslint-plugin-eslint-comments/configs'
import stylisticPlugin from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import { importX } from 'eslint-plugin-import-x'
// @ts-expect-error 型定義ファイルがない
import promisePlugin from 'eslint-plugin-promise'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export const javaScript = defineConfig(
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    files: ['**/*.{js,mjs,jsx}'],
    languageOptions: {
      sourceType: 'module',
    },
  },

  {
    name: '@eslint/js',
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    extends: [eslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      parser: tseslint.parser,
    },
    rules: {
      // アロー関数を優先
      'prefer-arrow-callback': 'error',
      // 関数宣言は function xxx() {} にする
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      // 中括弧の省略を禁止
      curly: 'error',
      // テンプレート文字列を優先
      'prefer-template': 'error',
      // == 比較 👉 === 比較
      eqeqeq: 'error',
      // *.js で 'use strict'; を強制
      strict: ['error', 'global'],
      // 特定の構文を禁止
      'no-restricted-syntax': [
        'error',
        // 数値リテラル以外での Array#at() の使用を禁止
        // https://qiita.com/printf_moriken/items/da03f55cb626617c1958
        {
          selector:
            // eslint-disable-next-line @stylistic/quotes -- prettier と競合している
            "CallExpression[callee.property.name='at']:not([arguments.0.type='Literal'],[arguments.0.type='UnaryExpression'][arguments.0.argument.type='Literal'])",
          message: 'at method accepts only a literal argument',
        },
      ],
      // foo["bar"] 👉 foo.bar
      'dot-notation': 'error',
      // {foo: foo} 👉 {foo}
      'object-shorthand': ['error', 'always'],
      // Array 系メソッドで return を強制
      'array-callback-return': ['error'],
      // ループ内では await を禁止
      'no-await-in-loop': 'error',
      // 操作が値に影響しない式を禁止
      'no-constant-binary-expression': 'error',
      // コンストラクター内で return を禁止
      'no-constructor-return': 'error',
      // 関数の返り値としての Promise executor を禁止
      'no-promise-executor-return': 'error',
      // 自身との比較 (e.g. foo === foo) を禁止
      'no-self-compare': 'error',
      // 非テンプレート文字列で ${foo} を禁止
      // "Hello, ${name}" 👉 `Hello, ${name}`
      'no-template-curly-in-string': 'error',
      // 更新されないループ条件を禁止
      'no-unmodified-loop-condition': 'error',
      // 到達できないループを禁止
      'no-unreachable-loop': 'error',
      // 未使用の private メンバーを禁止
      'no-unused-private-class-members': 'error',
      // スレッドセーフで安全に更新されないコードを禁止
      'require-atomic-updates': 'error',
      // ペアになっていない setter を禁止
      'accessor-pairs': 'error',
      // キャメルケースに強制しない
      camelcase: 'off',
      // switch 文で default を強制しない
      'default-case': 'off',
      // continue 文を許可
      'no-continue': 'off',
      // _ で始まるメンバー名を許可
      'no-underscore-dangle': 'off',
      // 自身より後に宣言されたメンバーの使用を許可
      'no-use-before-define': 'off',
      // console.* の使用を許可
      'no-console': 'off',
      // 深い三項演算子を許可
      'no-nested-ternary': 'off',
      // i++ インクリメントを許可
      'no-plusplus': 'off',
      // return の省略などを許可
      'consistent-return': 'off',
      // void Promise を許可
      'no-void': 'off',
      // 1 <= x < 10 を許可
      yoda: [
        'error',
        'never',
        {
          exceptRange: true,
        },
      ],
      // UTF-8 BOM を禁止
      'unicode-bom': ['error', 'never'],
    },
  },
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
        quoteProps: 'as-needed',
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
      }),
    ],
    rules: {
      // 最終行に改行を挿入
      '@stylistic/eol-last': ['error', 'always'],
      // 行末のスペースを禁止
      '@stylistic/no-trailing-spaces': ['error'],
      // 型名の前後のスペースを揃える
      // e.g. const foo: string = 'bar'
      '@stylistic/type-annotation-spacing': 'error',
      // func () 👉 func()
      '@stylistic/function-call-spacing': ['error', 'never'],
      // 空行を挟む
      '@stylistic/padding-line-between-statements': [
        'warn',
        // return 前に空行
        { blankLine: 'always', prev: '*', next: 'return' },
        // ディレクティブ後に空行
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
      ],
    },
  },
  {
    name: '@eslint-community/eslint-plugin-eslint-comments',
    extends: [eslintCommentsConfig.recommended],
  },
  {
    name: 'eslint-plugin-import-x',
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    extends: [
      importX.flatConfigs.recommended,
    ],
    settings: {
      'import-x/resolver': {
        node: {
          extensions: ['.js', '.cjs', '.mjs', '.jsx', '.ts', '.cts', '.mts', '.tsx', '.json'],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      'import-x/no-import-module-exports': 'off',
      'import-x/no-extraneous-dependencies': 'off',
      // 循環 import を禁止
      'import-x/no-cycle': 'error',
      // default export を優先しない
      'import-x/prefer-default-export': 'off',
      // default export を禁止
      'import-x/no-default-export': 'error',
      // import 順を並び替える
      'import-x/order': [
        'warn',
        {
          // 組み込み → 外部依存 → 内部依存 → object → type の順にする
          groups: [
            'builtin',
            'external',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
            'unknown',
          ],
          // カテゴリー間に改行を入れる
          'newlines-between': 'always',
          // 大文字小文字区別なしで ABC 順にする
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            // **.css は最後に配置する
            {
              pattern: '**.css',
              group: 'type',
              position: 'after',
            },
          ],
          // **.css が import 順最後ではないときに警告
          warnOnUnassignedImports: true,
        },
      ],
    },
  },
  {
    name: 'eslint-plugin-unused-imports',
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    plugins: {
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      // 不要 import 文を禁止
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
    },
  },
  {
    name: 'eslint-plugin-promise',
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    extends: [promisePlugin.configs['flat/recommended']],
    rules: {
      'promise/always-return': ['error', { ignoreLastCallback: true }],
    },
  },
  {
    name: 'eslint-plugin-xss',
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    // TODO: eslint-plugin-xss が Flat Configs に対応したら移行する
    // https://github.com/Rantanen/eslint-plugin-xss/issues/15
    // extends: ['plugin:xss/recommended'],
    extends: [],
  },
)
