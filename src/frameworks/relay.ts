import { defineConfig } from 'eslint/config'
// @ts-expect-error -- 型定義がない
import relayPlugin from 'eslint-plugin-relay'

export const relay = defineConfig({
  name: 'eslint-plugin-relay',
  files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
  extends: [
    relayPlugin.configs['ts-recommended'],
  ],
  plugins: { relay: relayPlugin },
  rules: {
    // 未使用の GraphQL フィールドを禁止
    'relay/unused-fields': 'error',
  },
})
