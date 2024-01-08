import type { Linter } from 'eslint'

module.exports = {
  plugins: ['@graphql-eslint'],
  // XXX: 上手く動いていないので一時的に無効化
  // extends: [
  //   'plugin:@graphql-eslint/schema-recommended',
  //   'plugin:@graphql-eslint/operations-all',
  //   'plugin:@graphql-eslint/relay',
  // ],
  parser: '@graphql-eslint/eslint-plugin',
  parserOptions: {
    schema: '**/schema.graphql',
  },
} satisfies Linter.Config
