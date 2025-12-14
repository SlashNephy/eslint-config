import { defineConfig, globalIgnores } from 'eslint/config'

import { common } from './base/common.js'
import { graphql } from './base/graphql.js'
import { javaScript } from './base/javascript.js'
import { packageJson } from './base/package.json.js'
import { typeScript } from './base/typescript.js'
import { yaml } from './base/yaml.js'
import { cloudflareWorkers } from './environments/cloudflareWorkers.js'
import { node } from './environments/node.js'
import { userScript } from './environments/userscript.js'
import { jest } from './frameworks/jest.js'
import { nextJs } from './frameworks/next.js.js'
import { react } from './frameworks/react.js'
import { relay } from './frameworks/relay.js'
import { storybook } from './frameworks/storybook.js'
import { vite } from './frameworks/vite.js'
import { vitest } from './frameworks/vitest.js'

import type { ConfigArray, ConfigWithExtends } from 'typescript-eslint'

type Options = {
  ignores?: string[]
}

export function config(options?: Options, ...overrides: ConfigWithExtends[]): ConfigArray {
  return defineConfig(
    globalIgnores(options?.ignores ?? []),

    // ベース
    [
      common,
      // JavaScript
      javaScript,
      // TypeScript
      typeScript,
      // GraphQL
      graphql,
      // YAML
      yaml,
      // package.json
      packageJson,
    ],

    // フレームワーク
    [
      // React
      react,
      // Vite
      vite,
      // Next.js
      nextJs,
      // Relay
      relay,
      // Storybook
      storybook,
      // Jest
      jest,
      // Vitest
      vitest,
    ],

    // 環境
    [
      // Node.js
      node,
      // Cloudflare Worker
      cloudflareWorkers,
      // UserScript
      userScript,
    ],

    // @ts-expect-error -- 型定義が不完全
    ...overrides,
  )
}
