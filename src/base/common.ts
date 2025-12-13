import { defineConfig, globalIgnores } from 'eslint/config'
import gitignore from 'eslint-config-flat-gitignore'

export const common = defineConfig(
  globalIgnores([
    '**/.git/**',
    '**/node_modules/**',
    '**/.yarn/**',
    '**/dist/**',
    '**/.idea/**',
    '**/pnpm-lock.yaml',
  ]),
  gitignore({ name: 'eslint-config-flat-gitignore', strict: false }),
)
