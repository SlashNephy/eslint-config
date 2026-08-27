import { defineConfig } from 'eslint/config'
import relayPlugin from 'eslint-plugin-relay'

export const relay = defineConfig({
  name: 'eslint-plugin-relay',
  files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
  extends: [
    // v2.1.0 で同梱された型定義は configs を Linter.LegacyConfig と宣言しているが、
    // ts-recommended の実体は rules だけを持つオブジェクトで、eslintrc 形式の
    // plugins: string[] や extends は含まない。flat config へ渡せるように rules だけを取り出す。
    { rules: relayPlugin.configs['ts-recommended'].rules ?? {} },
  ],
  plugins: { relay: relayPlugin },
  rules: {
    // 未使用の GraphQL フィールドを禁止
    'relay/unused-fields': 'error',
  },
})
