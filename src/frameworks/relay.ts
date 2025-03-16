import { config } from 'typescript-eslint'

export const relay = config({
  name: 'eslint-plugin-relay',
  files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
  // TODO: eslint-plugin-relay が Flat Configs に対応したら移行する
  // https://github.com/relayjs/eslint-plugin-relay/issues/156
  // extends: ['plugin:relay/recommended'],
  // plugins: ['relay'],
  // rules: {
  //   // 未使用の GraphQL フィールドを禁止
  //   'relay/unused-fields': 'error',
  // },
})
