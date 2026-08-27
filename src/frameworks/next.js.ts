import nextPlugin from '@next/eslint-plugin-next'
import { defineConfig } from 'eslint/config'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'

export const nextJs = defineConfig(
  {
    name: '@next/eslint-plugin-next',
    files: [
    // Pages Router
      '**/pages/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
      // App Router
      '**/app/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
    ],
    extends: [
      // import-x/no-named-as-default-member は named import を勧めてくるが、
      // このパッケージは CJS で configs を named export として公開していない。
      // 型定義は esModuleInterop により named import を通してしまうため、
      // 従うと tsc は通るのに実行時に SyntaxError で落ちる。
      // eslint-disable-next-line import-x/no-named-as-default-member -- 上記のとおり従うと壊れる
      nextPlugin.configs.recommended,
      // eslint-disable-next-line import-x/no-named-as-default-member -- 同上
      nextPlugin.configs['core-web-vitals'],
    ],
    rules: {
      'import-x/no-default-export': 'off',
    },
    ignores: ['**/.next/**'],
  },
  {
    name: 'eslint-plugin-react-refresh',
    files: [
    // Pages Router
      '**/pages/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
      // App Router
      '**/app/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
    ],
    extends: [reactRefreshPlugin.configs.next],
  },
)
