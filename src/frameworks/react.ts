import eslintReact from '@eslint-react/eslint-plugin'
import { defineConfig } from 'eslint/config'
import jsxA11yX from 'eslint-plugin-jsx-a11y-x'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

export const react = defineConfig(
  // eslint-react（型チェック付きルール + 既存プラグインとの競合回避）
  {
    name: '@eslint-react/eslint-plugin',
    files: ['**/*.{jsx,tsx}'],
    extends: [
      eslintReact.configs['recommended-type-checked'],
      eslintReact.configs['disable-conflict-eslint-plugin-react'],
    ],
    rules: {
      // クラスコンポーネントを禁止（react/prefer-stateless-function と同じ意図）
      '@eslint-react/no-class-component': 'error',
    },
  },
  // eslint-plugin-react（スタイル/フォーマット系ルール）
  [
    {
      name: 'eslint-plugin-react',
      files: ['**/*.{jsx,tsx}'],
      extends: [
        reactPlugin.configs.flat.recommended,
        reactPlugin.configs.flat['jsx-runtime'],
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          lib: ['dom'],
        },
        globals: globals.browser,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        // <div flag={true} /> 👉 <div flag />
        'react/jsx-boolean-value': 'error',
        // <div value={'test'} /> 👉 <div value='test' />
        'react/jsx-curly-brace-presence': 'error',
        // <div></div> 👉 <div />
        'react/self-closing-comp': [
          'error',
          {
            component: true,
            html: true,
          },
        ],
        // コンポーネント名を PascalCase に強制
        'react/jsx-pascal-case': 'error',
        // ハンドラーの名前規則
        'react/jsx-handler-names': 'error',
        // useState の分解宣言 & setXXX という名前を強制
        'react/hook-use-state': 'error',
        // <React.Fragment /> 👉 </>
        'react/jsx-fragments': 'error',
        // ステートレス関数を優先
        'react/prefer-stateless-function': 'error',
        // props を並び替える
        'react/jsx-sort-props': [
          'error',
          {
            callbacksLast: true,
            shorthandFirst: true,
            multiline: 'last',
            reservedFirst: true,
          },
        ],
        // JSX を .tsx でも使えるように
        'react/jsx-filename-extension': [
          'error',
          {
            extensions: ['.jsx', '.tsx'],
          },
        ],
        // props に対してスプレッド演算子を使えるように
        'react/jsx-props-no-spreading': 'off',
        // <></> を使えるように
        'react/jsx-no-useless-fragment': 'off',
        // defaultProps を使わない
        'react/require-default-props': 'off',
        // useCallback でコールバックを宣言させる
        'react/jsx-no-bind': 'warn',
        // コンポーネントの宣言を function Component() {} に強制
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'function-declaration',
            unnamedComponents: 'arrow-function',
          },
        ],
      },
    },
    {
      name: 'eslint-plugin-react',
      files: ['**/*.jsx'],
      rules: {
        'react/prop-types': 'error',
      },
    },
  ],
  {
    name: 'eslint-plugin-react-hooks',
    files: ['**/*.{jsx,tsx}'],
    extends: [reactHooksPlugin.configs.flat['recommended-latest']],
    rules: {
      // https://recoiljs.org/docs/introduction/installation/#eslint
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
        },
      ],
    },
  },
  // eslint-plugin-jsx-a11y-x（本家 eslint-plugin-jsx-a11y のフォーク）
  // 本家は 2024-10 の 6.10.2 を最後にリリースが止まっており、ESLint v10 で削除された
  // context.getFilename() を内部で使っているため v10 ではロード時にクラッシュする。
  // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/1075
  // フォーク側は当該 API を排除済みで recommended のルール構成は本家と一致する。
  // 本家が v10 対応をリリースしたら戻せるよう、ルール名の変更以外は同じ設定を保つ。
  {
    name: 'eslint-plugin-jsx-a11y-x',
    files: ['**/*.{jsx,tsx}'],
    extends: [jsxA11yX.configs.recommended],
    rules: {
      'jsx-a11y-x/alt-text': [
        'warn',
        {
          elements: ['img', 'object', 'area'],
          img: ['Image'],
          object: [],
          area: [],
        },
      ],
    },
  },
)
