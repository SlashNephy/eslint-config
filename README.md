# eslint-config

[![Check](https://github.com/SlashNephy/eslint-config/actions/workflows/check.yml/badge.svg)](https://github.com/SlashNephy/eslint-config/actions/workflows/check.yml?query=branch%3Amaster)
[![npm](https://img.shields.io/npm/v/%40slashnephy%2Feslint-config)](https://www.npmjs.com/package/@slashnephy/eslint-config)

## Install

```console
pnpm add -D @slashnephy/eslint-config
```

## Usage (for Flat Configs)

`eslint.config.ts` or `eslint.config.mts`

```typescript
import { config } from '@slashnephy/eslint-config'

export default config(
  {
    ignores: [
      '__generated__/**',
    ],
  },
  {
    // If tsconfig.json is not recognized, try this:
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Your custom config...
  },
)
```
