# eslint-plugin-react を削除して ESLint v10 へ移行する

## 背景

ESLint v10 への更新は `eslint-plugin-react` が v10 に未対応であることでブロックされている。
上流の互換対応 issue (jsx-eslint/eslint-plugin-react#3977) は 2026-08 時点で open のままで、
npm 上の最新も 7.37.5、peerDependencies は `eslint: ^3 || ... || ^9.7` に留まる。

非互換の実体は、`settings.react.version: 'detect'` によるバージョン検出処理と
`react/jsx-filename-extension` が削除済みの `context.getFilename()` を呼ぶことによる
ロード時クラッシュで、既定の設定では ESLint v10 で動作しない。

上流を待つ代わりに、`eslint-plugin-react` を依存から外し、既に依存に含まれている
`@eslint-react/eslint-plugin` と `@stylistic/eslint-plugin` へ役割を寄せてブロッカーを解消する。

## 方針

`eslint-plugin-react` を `dependencies` から削除する。移行先はすべて既存の依存であり、
新規に追加する依存は無い。移行できないルールは共有 config から落とし、必要な利用者が
各自の config で拾い直す方針とする。

## ルールの対応関係

`@eslint-react/eslint-plugin` の `disable-conflict-eslint-plugin-react` プリセットが
無効化する 40 件の `react/*` ルールは、eslint-react 側に等価な実装がある。
`eslint-plugin-react` の `flat.recommended` が有効化する correctness 系のルールは
この 40 件に含まれるため、recommended 相当のカバレッジは維持される。

`src/frameworks/react.ts` が明示的に有効化していたルールの移行先は次のとおり。

| 現行 | 移行先 |
| --- | --- |
| `react/jsx-curly-brace-presence` | `@stylistic/jsx-curly-brace-presence` (base の `customize({ jsx: true })` で有効化済み) |
| `react/self-closing-comp` | `@stylistic/jsx-self-closing-comp` |
| `react/jsx-pascal-case` | `@stylistic/jsx-pascal-case` |
| `react/jsx-sort-props` | `@stylistic/jsx-sort-props` (`callbacksLast` / `shorthandFirst` / `multiline` / `reservedFirst` を同名オプションで維持) |
| `react/hook-use-state` | `@eslint-react/use-state` (`recommended-type-checked` に warn で収録済み) |
| `react/prefer-stateless-function` | `@eslint-react/no-class-component` (設定済み) |

`off` を指定していた 3 件 (`react/jsx-props-no-spreading` / `react/jsx-no-useless-fragment` /
`react/require-default-props`) はプラグインごと消えるため指定を削除する。

## 落とすルール

次の 6 件は `@eslint-react/eslint-plugin` v5 にも `@stylistic/eslint-plugin` にも
代替が存在しないため、共有 config から落とす。

- `react/jsx-boolean-value` — eslint-react v5 で `prefer-shorthand-boolean` が削除された
- `react/jsx-fragments` — 同上 (`prefer-shorthand-fragment` が削除された)
- `react/jsx-filename-extension` — v5 で `naming-convention/filename-extension` が削除された
- `react/jsx-handler-names`
- `react/jsx-no-bind` (現行 warn)
- `react/function-component-definition`

加えて `.jsx` 向けに設定していた `react/prop-types` も落とす。eslint-react は TypeScript の
型情報を前提としており、素の `.jsx` に対する等価な代替を持たない。

落とすことの影響は、ルールそのものの性質から次のように整理できる。

- `jsx-handler-names` — 既定オプション (`checkLocalVariables: false`) ではハンドラの値が
  `MemberExpression` の場合しか検査せず、`onClick={handleFoo}` のような裸の識別子参照は
  判定の手前で早期 return される。共有 config はオプションを渡していないため、
  `this.foo` 形式のハンドラを持たない関数コンポーネント中心のコードでは元から発火しない
- `jsx-filename-extension` — 設定は `.jsx` と `.tsx` の両方を許可しており、
  この 2 つの拡張子以外で JSX を書いた場合にしか発火しない
- `.jsx` の `prop-types` — TypeScript を使う利用者には元から効かない
- `jsx-boolean-value`、`jsx-fragments`、`function-component-definition` — いずれも
  `--fix` で機械的に直せる書式ルールであり、失われるのは将来のドリフト防止のみ
- `jsx-no-bind` — React Compiler を導入した環境では参照の安定化が Compiler の責務になるため、
  このルールを `off` にする運用が一般的になっている

なお `eslint-plugin-react-doctor` が `jsx-boolean-value` / `jsx-fragments` /
`jsx-filename-extension` / `jsx-handler-names` の移植を持つ (同プラグインの recommended では
無効)。共有 config には取り込まないが、落とすルールを拾い直したい利用者の選択肢として記録する。

## 設定の変更

`src/frameworks/react.ts` を次の構成にする。

1. `@eslint-react/eslint-plugin` ブロック — `recommended-type-checked` を extends する。
   `disable-conflict-eslint-plugin-react` は `eslint-plugin-react` が無くなるため extends から外す。
   削除する `eslint-plugin-react` ブロックが持っていた `languageOptions`
   (`parserOptions.ecmaFeatures.jsx`、`lib: ['dom']`、`globals.browser`) をこのブロックへ移す。
   `@eslint-react/no-class-component` は維持する。
2. `@stylistic/eslint-plugin` の JSX ブロックを新設する (`files: ['**/*.{jsx,tsx}']`)。
   `jsx-self-closing-comp` / `jsx-pascal-case` / `jsx-sort-props` の 3 件を置く。
   JSX 書式ルールを base ではなく react 設定に置くのは、React 設定を読み込んだ利用者にだけ
   効かせるためで、現行の配置方針を踏襲する。
3. `eslint-plugin-react-hooks` ブロック — 変更しない。
4. `eslint-plugin-jsx-a11y-x` ブロック — 変更しない。

`settings.react.version: 'detect'` は削除する。`recommended-type-checked` が
`settings['react-x'].version: 'detect'` を自前で設定するため不要になる。

`.jsx` 向けの `react/prop-types` ブロックは丸ごと削除する。

## peerDependencies

`@eslint-react/eslint-plugin` v5 の peerDependencies は `eslint: ^10.3.0` であり、
この config は ESLint v10 専用になる。`peerDependencies.eslint` を `^10` に絞る。

バージョン採番は既存の運用 (`bin/bump-version.ts` による patch 採番) を維持し、
破壊的変更であることはコミットと PR で示す。

## 利用側に必要な追随

`eslint-plugin-react` が消えることで、利用側の config やインラインコメントが
`react/*` のルール名を参照している箇所は「ルール未定義」で失敗する。
`reportUnusedDisableDirectives` を有効にしている場合は特に確実に失敗する。
移行時にはこれらの参照を洗い出して除去する必要がある。

加えて `@eslint-react/eslint-plugin` を v2 から v5 へ上げたことで一部のルールが
リネームされている。旧ルール名を参照する `eslint-disable` コメントは対象のルールを
抑制しなくなり、それまで抑制されていた違反が表面化する。リネームの対応表を
PR に載せて利用者が追随できるようにする。

## 検証

### リポジトリ内

CI と同じ `pnpm build` と `pnpm lint` を通す。加えて、移行した 4 ルールと落とす 6 ルールの
違反を意図的に含む `.tsx` のフィクスチャを用意し、変更前後で lint して検出内容を比較する。
移行した 4 ルールが変更後も検出できること、落とす 6 ルールが検出されなくなることを実測で示す。

### 実コードベースへの適用

この config を実際に使っているコードベースを一時領域へ複製し、
その ESLint 設定ファイルには手を加えず、`package.json` のみを差し替えて 2 通り lint する。

| | eslint | @slashnephy/eslint-config |
| --- | --- | --- |
| 変更前 | 9 系 | 公開版 |
| 変更後 | 10.3.0 | 作業ブランチをローカル参照 |

`eslint --format json` の出力を ruleId 別に集計し、変更前後で差分を取る。
これにより次を確認する。

- 落とす 6 ルールが失う検出件数
- 移行した 3 ルールが変更後も動作すること
- `react/*` を参照している箇所が実際に失敗すること
- `@eslint-react/eslint-plugin` を v2 から v5 へ上げたことで新たに出る違反

公開リポジトリに残る成果物 (この spec、コミット、PR) には、検証に用いたコードベースに関する
情報を一切含めない。名前、ファイルパス、コード片に加え、ファイル数や構成の統計も書かない。
残してよいのは ruleId と、その ruleId の検出件数の集計だけとする。

`eslint-plugin-react-doctor` が ESLint v10 で動作するかは未検証であり、変更後の実行が
ロード時に失敗する可能性がある。その場合は当該ブロックのみ切り分けて計測し、
設定を変更しない原則の例外として証跡に明記する。

## 作業ブランチ

既存の作業ブランチ `feat/upgrade-eslint-v10-react-v5` を master へ rebase して継続する。
master との差分は 4 ファイルで、衝突するのは実質 `pnpm-lock.yaml` のみ。
master 側の lockfile を採ったうえで依存の変更を入れ直し、`pnpm install` で再生成する。
