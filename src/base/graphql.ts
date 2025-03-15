import type { Linter } from 'eslint'

import graphql from '@graphql-eslint/eslint-plugin'

export const graphqlConfigs: Linter.Config[] = [
  {
    files: ['**/*.{graphql,graphqls,gql}'],
    languageOptions: {
      parser: graphql.parser,
    },
    plugins: {
      '@graphql-eslint': graphql,
    },
  },
  {
    files: ['**/schema.{graphql,graphqls,gql}'],
    ...graphql.configs['flat/schema-recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    ...graphql.configs['flat/operations-recommended'],
  },
]
