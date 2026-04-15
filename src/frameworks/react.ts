import eslintReact from '@eslint-react/eslint-plugin'
import { defineConfig } from 'eslint/config'
// @ts-expect-error 型定義ファイルがない
import jsxA11y from 'eslint-plugin-jsx-a11y'
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
  {
    name: 'eslint-plugin-jsx-a11y',
    files: ['**/*.{jsx,tsx}'],
    extends: [jsxA11y.flatConfigs.recommended],
    rules: {
      'jsx-a11y/alt-text': [
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
