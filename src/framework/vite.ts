import type { Linter } from 'eslint'
import reactRefresh from 'eslint-plugin-react-refresh'

export const viteConfig: Linter.Config = {
  ...reactRefresh.configs.vite,
}
