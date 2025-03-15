import { resolve } from 'path'

// https://github.com/microsoft/rushstack/tree/main/eslint/eslint-patch
import '@rushstack/eslint-patch/modern-module-resolution.js'
import { readGitignoreFiles } from 'eslint-gitignore'

import type { Linter } from 'eslint'

module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  ignorePatterns: [
    '**/node_modules/**',
    '**/.yarn/**',
    '**/dist/**',
    ...readGitignoreFiles(),
  ],
  overrides: [
    /*
     * 言語固有ルール
     */
    // JavaScript / TypeScript
    {
      files: '**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
      extends: resolve(__dirname, 'base/javascript.js'),
      processor: '@graphql-eslint/graphql',
    },
    // TypeScript
    {
      files: '**/*.{ts,mts,cts,tsx}',
      extends: [resolve(__dirname, 'base/typescript.js')],
    },
    // GraphQL
    {
      files: '**/*.{graphql,graphqls,gql}',
      extends: [resolve(__dirname, 'base/graphql.js')],
    },
    // YAML
    {
      files: '**/*.{yml,yaml}',
      extends: resolve(__dirname, 'base/yaml.js'),
    },

    /*
     * フレームワーク固有ルール
     */
    // React
    {
      files: '**/*.{jsx,tsx}',
      extends: resolve(__dirname, 'framework/react.js'),
    },
    // Relay
    {
      files: '**/*.{js,jsx,ts,tsx}',
      extends: resolve(__dirname, 'framework/relay.js'),
    },
    // Vite
    {
      files: '**/src/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
      extends: resolve(__dirname, 'framework/vite.js'),
    },
    // Next.js
    {
      files: [
        // Pages Router
        '**/pages/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
        // App Router
        '**/app/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
      ],
      extends: resolve(__dirname, 'framework/next.js.js'),
    },
    // jest / vitest
    {
      files: [
        '**/*.test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
        '**/test/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
      ],
      extends: [
        resolve(__dirname, 'framework/jest.js'),
        resolve(__dirname, 'framework/vitest.js'),
      ],
    },

    /*
     * 個別のプリセットルール
     */
    // React向け a11y
    {
      files: '**/*.{jsx,tsx}',
      extends: resolve(__dirname, 'presets/a11y.js'),
    },
    // Node.js
    {
      files: '**/bin/**/*.{js,mjs,cjs,ts,mts,cts}',
      extends: resolve(__dirname, 'presets/node.js'),
    },
    // Cloudflare Worker
    {
      files: ['**/src/worker.{js,ts}', '**/functions/**/*.{js,ts}'],
      extends: resolve(__dirname, 'presets/allow-default-export.js'),
    },
    // ビルドツールの構成ファイル
    {
      files: [
        '**/{webpack,rollup,vite,postcss,next}.config.{js,mjs,cjs,ts,mts,cts}',
        '**/codegen.{js,mjs,cjs,ts,mts,cts}',
      ],
      extends: [
        resolve(__dirname, 'presets/allow-default-export.js'),
        resolve(__dirname, 'presets/build-configuration.js'),
        resolve(__dirname, 'presets/node.js'),
      ],
    },
    // package.json
    {
      files: '**/package.json',
      extends: resolve(__dirname, 'presets/package.json.js'),
    },
    // UserScript
    {
      files: '**/*.user.js',
      extends: resolve(__dirname, 'presets/userscript.js'),
    },
    // コーディングスタイル
    {
      files: '**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
      extends: resolve(__dirname, 'presets/style.js'),
    },
  ],
} satisfies Linter.Config
