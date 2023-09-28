import type { Linter } from 'eslint'

module.exports = {
  rules: {
    'import/no-default-export': 'off',
    // anonymous な export default を許可
    'import/no-anonymous-default-export': 'off',
  },
} satisfies Linter.Config
