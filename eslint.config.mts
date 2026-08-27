import { config } from './src/index.ts'

export default config(
  {},
  {
    files: ['**/*.{ts,cts,mts}'],
    rules: {
      // このパッケージは tsc で .ts を .js へコンパイルし、main も ./src/index.js を指す。
      // NodeNext では出力側の import 指定子が .js である必要があるため、ソース上の
      // `./base/common.js` という書き方が正しく、.ts に直すと TS5097 でビルドが落ちる。
      // 一方このルールは解決先ファイルの実拡張子 (.ts) を要求し、この構成では
      // 正しいコードが必ず報告される。共有 config 側の設定は利用者の構成次第で
      // 妥当なため変えず、このリポジトリの自己 lint でのみ無効化する。
      'import-x/extensions': 'off',
    },
  },
)
