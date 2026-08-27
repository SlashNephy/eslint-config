import eslintReact from '@eslint-react/eslint-plugin'
import stylisticPlugin from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import jsxA11yX from 'eslint-plugin-jsx-a11y-x'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

export const react = defineConfig(
  // eslint-react（型チェック付きルール）
  // eslint-plugin-react は ESLint v10 で削除された context.getFilename() を呼ぶため
  // ロード時にクラッシュする (jsx-eslint/eslint-plugin-react#3977 が open のまま)。
  // correctness 系のルールは eslint-react が、JSX の書式系は @stylistic が肩代わりする。
  {
    name: '@eslint-react/eslint-plugin',
    files: ['**/*.{jsx,tsx}'],
    extends: [eslintReact.configs['recommended-type-checked']],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        lib: ['dom'],
      },
      globals: globals.browser,
    },
    rules: {
      // クラスコンポーネントを禁止（react/prefer-stateless-function と同じ意図）
      '@eslint-react/no-class-component': 'error',
    },
  },
  // JSX の書式ルール（eslint-plugin-react から移行）
  // @stylistic は base/javascript.ts でも登録しているが、この設定単体でも解決できるように
  // ここでも明示する。同じモジュールを import しているためインスタンスは共有される。
  {
    name: '@stylistic/eslint-plugin (jsx)',
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      '@stylistic': stylisticPlugin,
    },
    rules: {
      // <div></div> 👉 <div />
      '@stylistic/jsx-self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      // コンポーネント名を PascalCase に強制
      '@stylistic/jsx-pascal-case': 'error',
      // props を並び替える
      '@stylistic/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          multiline: 'last',
          reservedFirst: true,
        },
      ],
    },
  },
  {
    name: 'eslint-plugin-react-hooks',
    // JSX を含むファイルに限定しない。カスタムフックは JSX を返さないので `.ts` / `.js` に
    // 置かれることが多く、`{jsx,tsx}` だけだとそれらが一切検査されない。
    // eslint-plugin-react-hooks v7 のルールは React Compiler の診断そのもの
    // (refs / immutability / preserve-manual-memoization など) であり、
    // 適用漏れは「Compiler がコンパイルを諦めているのに lint は緑」という状態を生む。
    // JSX 前提の jsx-a11y-x と違い、このプラグインは JSX の有無と無関係に効くべきなので、
    // スクリプト全体を対象にする。
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
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
