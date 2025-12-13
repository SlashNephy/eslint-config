# eslint-config

[![Check](https://github.com/SlashNephy/eslint-config/actions/workflows/check.yml/badge.svg)](https://github.com/SlashNephy/eslint-config/actions/workflows/check.yml?query=branch%3Amaster)
[![npm](https://img.shields.io/npm/v/%40slashnephy%2Feslint-config)](https://www.npmjs.com/package/@slashnephy/eslint-config)

## Install

```console
pnpm add @slashnephy/eslint-config
```

## Usage (for Flat Configs)

`eslint.config.js` or `eslint.config.mjs`

```javascript
import { defineConfig } from 'eslint/config'
import config from '@slashnephy/eslint-config'

export default defineConfig([
  ...config,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // your custom config
  },
])

```
