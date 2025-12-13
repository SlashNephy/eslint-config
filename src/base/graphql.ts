import graphqlPlugin from '@graphql-eslint/eslint-plugin'
import { defineConfig } from 'eslint/config'

export const graphql = defineConfig(
  // GraphQL を解釈できるようにする
  {
    name: '@graphql-eslint/eslint-plugin (parser)',
    files: ['**/*.{graphql,graphqls,gql}'],
    languageOptions: {
      parser: graphqlPlugin.parser,
    },
    plugins: {
      '@graphql-eslint': graphqlPlugin.parser,
    },
  },

  // コード中に含まれる GraphQL を解釈して lint できるようにする
  {
    name: '@graphql-eslint/eslint-plugin (code)',
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    processor: graphqlPlugin.processor,
  },

  // GraphQL schema
  {
    name: '@graphql-eslint/eslint-plugin (GraphQL schema)',
    files: [
      '**/schema.{graphql,graphqls,gql}',

      // gqlgen
      '**/graph/*.{graphql,graphqls,gql}',
    ],
    extends: [
      graphqlPlugin.configs['flat/schema-recommended'],
      graphqlPlugin.configs['flat/schema-relay'],
    ],
  },

  // GraphQL operations
  {
    name: '@graphql-eslint/eslint-plugin (GraphQL operations)',
    files: [
      '**/documents/*.{graphql,graphqls,gql}',
      '**/frontend/**/*.{graphql,graphqls,gql}',
    ],
    extends: [graphqlPlugin.configs['flat/operations-recommended']],
  },
)
