# eslint-plugin-react 削除による ESLint v10 移行 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `eslint-plugin-react` を依存から削除し、この共有 config を ESLint v10 で動作させる。

**Architecture:** correctness 系のルールは `@eslint-react/eslint-plugin` v5 の `recommended-type-checked` に、JSX の書式系は `@stylistic/eslint-plugin` に寄せる。どちらも既に依存に含まれるため新規依存は増えない。代替が無い 6 ルールは共有 config から落とす。

**Tech Stack:** ESLint 10.3.0 / `@eslint-react/eslint-plugin` 5.7.8 / `@stylistic/eslint-plugin` 5.10.0 / TypeScript 6.0.3 / pnpm 10.33.4

## Global Constraints

- 設計の根拠は `docs/superpowers/specs/20260827_eslint_v10_drop_eslint_plugin_react.md` にある。判断に迷ったら spec を正とする。
- このリポジトリは**公開**リポジトリである。コミット、PR、この計画、spec、および PR に添付する証跡に、検証に用いたコードベースに関する情報を一切含めてはならない。名前・ファイルパス・コード片に加え、ファイル数や構成の統計も書かない。残してよいのは ruleId と、その ruleId の検出件数の集計だけとする。
- コミットメッセージは Conventional Commits 形式、日本語で書く。`Co-Authored-By: Claude Fable 6 <noreply@anthropic.com>` を付ける。
- `git config commit.gpgsign` は `false` なので署名は不要。
- 検証で意図的な lint 違反を含むフィクスチャを作る場合、**リポジトリの作業ツリーに残したままコミットや `pnpm lint` をしてはならない**。flat config のプラグイン解決の都合でフィクスチャと検証用 config はリポジトリ直下に置く必要があるが、各タスクの終わりに必ず削除する。
- `bin/bump-version.ts` は patch のみ採番する。バージョンの手動編集はしない。

---

### Task 1: master への rebase と依存の更新

**Files:**
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml` (生成物)

**Interfaces:**
- Consumes: なし
- Produces: `eslint-plugin-react` を含まない依存グラフ。以降のタスクはこの状態を前提とする。

- [ ] **Step 1: 現ブランチを master へ rebase する**

現ブランチ `feat/upgrade-eslint-v10-react-v5` は `origin/master` に対し 122 commits behind / 1 ahead。差分は `package.json` / `pnpm-lock.yaml` / `pnpm-workspace.yaml` / `src/base/graphql.ts` の 4 ファイル。

```bash
git fetch origin
git rebase origin/master
```

`pnpm-lock.yaml` と `package.json` は衝突する見込み。衝突したら **master 側 (`--theirs` ではなく rebase 中は "ours" が master 側) を全面採用**し、依存の変更は Step 2 で入れ直す。

```bash
git checkout --ours package.json pnpm-lock.yaml
git add package.json pnpm-lock.yaml
git rebase --continue
```

`src/base/graphql.ts` の変更 (`@ts-expect-error` の削除) は残すこと。この行は ESLint v10 の型定義では不要になり、残すと `tsc` が TS2578 で落ちる。

- [ ] **Step 2: package.json の依存を書き換える**

`dependencies` を次のとおり変更する。

- `@eslint-react/eslint-plugin` を `2.13.0` から `5.7.8` へ
- `@eslint/js` を `9.39.5` から `10.0.1` へ
- `eslint-plugin-react` の行を**削除**
- `eslint-plugin-storybook` は master 側 (`10.5.10`) のままにする

`devDependencies` の `eslint` を `9.39.5` から `10.3.0` へ。

`peerDependencies` を次にする。`@eslint-react/eslint-plugin` v5 の peer が `eslint: ^10.3.0` であり、v9 では動作しないため。

```json
  "peerDependencies": {
    "eslint": "^10"
  },
```

- [ ] **Step 3: pnpm-workspace.yaml から peerDependencyRules を削除する**

`peerDependencyRules` は `eslint-plugin-react` の peer 警告を抑えるために追加されたもので、同プラグインを消せば不要になる。次のブロックを丸ごと削除する。

```yaml
# ESLint v10 アップグレードに伴う peer 警告の抑制
# eslint-plugin-react がまだ ESLint v10 に未対応
# (jsx-eslint/eslint-plugin-react#3977 が open のままなため)
# 上流対応までは install 時の警告のみ抑制する
# jsx-a11y は #1083 で v10 対応の fork (jsx-a11y-x) へ移行済みのため抑制不要
peerDependencyRules:
  allowedVersions:
    'eslint-plugin-react>eslint': '^10'
    eslint: '^10'
```

残る依存で eslint の peer 範囲が v10 を除外するものは無い (他はすべて `>=8.x` 形式の開放レンジ)。

- [ ] **Step 4: install して peer 警告が出ないことを確認する**

Run: `pnpm install`
Expected: 完了する。出力に `peer dependencies` の警告が出ないこと。もし警告が出た場合は、その依存名と要求レンジを記録し、`peerDependencyRules` を最小限で復活させる (削除したブロックをそのまま戻すのではなく、実際に警告が出た依存だけを書く)。

- [ ] **Step 5: この時点ではまだ lint / build は通らないことを確認する**

Run: `pnpm build`
Expected: FAIL。`src/frameworks/react.ts` が `eslint-plugin-react` を import しており、パッケージが解決できない。これは Task 2 で直す。

- [ ] **Step 6: コミット**

```bash
git add package.json pnpm-lock.yaml pnpm-workspace.yaml
git commit -m "feat(deps)!: eslint-plugin-react を削除し ESLint v10 へ更新

eslint-plugin-react は ESLint v10 で削除された context.getFilename() を
呼ぶためロード時にクラッシュする。上流の対応 issue
(jsx-eslint/eslint-plugin-react#3977) は open のままのため依存から外す。

@eslint-react/eslint-plugin v5 の peer が eslint ^10.3.0 であるため
peerDependencies.eslint を ^10 に絞る。ESLint v9 では動作しなくなる。

Co-Authored-By: Claude Fable 6 <noreply@anthropic.com>"
```

---

### Task 2: react 設定の書き換え

**Files:**
- Modify: `src/frameworks/react.ts`

**Interfaces:**
- Consumes: Task 1 の依存グラフ
- Produces: `export const react` — 名前・型 (`ConfigArray`) ともに変更しない。`src/index.ts` からの参照はそのまま動く。

- [ ] **Step 1: src/frameworks/react.ts を次の内容に置き換える**

```ts
import eslintReact from '@eslint-react/eslint-plugin'
import stylisticPlugin from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import jsxA11yX from 'eslint-plugin-jsx-a11y-x'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

export const react = defineConfig(
  // eslint-react（型チェック付きルール）
  // eslint-plugin-react は ESLint v10 で削除された context.getFilename() を呼ぶため
  // ロード時にクラッシュする (jsx-eslint/eslint-plugin-react#3977 が open のまま)。
  // correctness 系のルールは eslint-react が、JSX の書式系は @stylistic が肩代わりする。
  {
    name: '@eslint-react/eslint-plugin',
    files: ['**/*.{jsx,tsx}'],
    extends: [eslintReact.configs['recommended-type-checked']],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        lib: ['dom'],
      },
      globals: globals.browser,
    },
    rules: {
      // クラスコンポーネントを禁止（react/prefer-stateless-function と同じ意図）
      '@eslint-react/no-class-component': 'error',
    },
  },
  // JSX の書式ルール（eslint-plugin-react から移行）
  // @stylistic は base/javascript.ts でも登録しているが、この設定単体でも解決できるように
  // ここでも明示する。同じモジュールを import しているためインスタンスは共有される。
  {
    name: '@stylistic/eslint-plugin (jsx)',
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      '@stylistic': stylisticPlugin,
    },
    rules: {
      // <div></div> 👉 <div />
      '@stylistic/jsx-self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      // コンポーネント名を PascalCase に強制
      '@stylistic/jsx-pascal-case': 'error',
      // props を並び替える
      '@stylistic/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          multiline: 'last',
          reservedFirst: true,
        },
      ],
    },
  },
  {
    name: 'eslint-plugin-react-hooks',
    // JSX を含むファイルに限定しない。カスタムフックは JSX を返さないので `.ts` / `.js` に
    // 置かれることが多く、`{jsx,tsx}` だけだとそれらが一切検査されない。
    // eslint-plugin-react-hooks v7 のルールは React Compiler の診断そのもの
    // (refs / immutability / preserve-manual-memoization など) であり、
    // 適用漏れは「Compiler がコンパイルを諦めているのに lint は緑」という状態を生む。
    // JSX 前提の jsx-a11y-x と違い、このプラグインは JSX の有無と無関係に効くべきなので、
    // スクリプト全体を対象にする。
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    extends: [reactHooksPlugin.configs.flat['recommended-latest']],
    rules: {
      // https://recoiljs.org/docs/introduction/installation/#eslint
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
        },
      ],
    },
  },
  // eslint-plugin-jsx-a11y-x（本家 eslint-plugin-jsx-a11y のフォーク）
  // 本家は 2024-10 の 6.10.2 を最後にリリースが止まっており、ESLint v10 で削除された
  // context.getFilename() を内部で使っているため v10 ではロード時にクラッシュする。
  // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/1075
  // フォーク側は当該 API を排除済みで recommended のルール構成は本家と一致する。
  // 本家が v10 対応をリリースしたら戻せるよう、ルール名の変更以外は同じ設定を保つ。
  {
    name: 'eslint-plugin-jsx-a11y-x',
    files: ['**/*.{jsx,tsx}'],
    extends: [jsxA11yX.configs.recommended],
    rules: {
      'jsx-a11y-x/alt-text': [
        'warn',
        {
          elements: ['img', 'object', 'area'],
          img: ['Image'],
          object: [],
          area: [],
        },
      ],
    },
  },
)
```

変更点は次のとおり。

- `eslint-plugin-react` の import と 2 つの設定ブロック (`**/*.{jsx,tsx}` 用と `.jsx` 向け `react/prop-types` 用) を削除
- `eslintReact.configs['disable-conflict-eslint-plugin-react']` を extends から削除。競合相手が消えたため
- 削除したブロックが持っていた `languageOptions` (`parserOptions.ecmaFeatures.jsx` / `lib: ['dom']` / `globals.browser`) を eslint-react のブロックへ移設
- `settings: { react: { version: 'detect' } }` を削除。`recommended-type-checked` が `settings['react-x'].version: 'detect'` を自前で設定する
- `@stylistic` の JSX ブロックを新設。`jsx-curly-brace-presence` は `src/base/javascript.ts` の `customize({ jsx: true })` が既に有効化しているため、ここには書かない
- `eslint-plugin-react-hooks` ブロックの `files` とコメントは master 側の現行内容を維持する。ただしコメント中の「JSX 前提の eslint-plugin-react や jsx-a11y-x と違い」という記述は、eslint-plugin-react が消えるため「JSX 前提の jsx-a11y-x と違い」に直す

- [ ] **Step 2: 型チェックが通ることを確認する**

Run: `pnpm build`
Expected: PASS (出力なし)。

- [ ] **Step 3: 自己 lint が通ることを確認する**

Run: `pnpm lint`
Expected: PASS (問題 0 件)。

- [ ] **Step 4: 生成された .js が残っていないか確認する**

`pnpm build` は `src/**/*.js` を生成する。`.gitignore` の対象かどうかを確認し、対象外なら `pnpm clean` を実行してからコミットする。

Run: `git status --short`
Expected: `src/frameworks/react.ts` のみが変更として出ること。

- [ ] **Step 5: コミット**

```bash
git add src/frameworks/react.ts
git commit -m "feat(react)!: eslint-plugin-react のルールを eslint-react と @stylistic へ移行

correctness 系は @eslint-react/eslint-plugin の recommended-type-checked が
カバーする。書式系のうち self-closing-comp / jsx-pascal-case / jsx-sort-props は
@stylistic の同名ルールへ移し、jsx-curly-brace-presence は base の
customize({ jsx: true }) が既に有効化しているため個別指定を落とす。

代替が存在しない次の 6 ルールは共有 config から落とす。
jsx-boolean-value / jsx-fragments / jsx-filename-extension /
jsx-handler-names / jsx-no-bind / function-component-definition

.jsx 向けの prop-types も落とす。eslint-react は型情報を前提とするため。

Co-Authored-By: Claude Fable 6 <noreply@anthropic.com>"
```

---

### Task 3: 移行後のルール検出をフィクスチャで実測する

**Files:**
- Create (一時): `verify.config.mts`
- Create (一時): `.verify/sample.tsx`
- Create (一時): `.verify/tsconfig.json`

このタスクの成果物は証跡 (コマンドと出力) であり、ファイルはコミットしない。フィクスチャをリポジトリ直下に置くのは、flat config のプラグイン解決が config ファイルの位置を基準にするためで、scratchpad に置くと `@eslint-react` 等が解決できない。

**Interfaces:**
- Consumes: Task 2 の `src/frameworks/react.ts`
- Produces: PR 本文に貼る「移行した 3 ルールが鳴る / 落とした 6 ルールが鳴らない」の実測ログ

- [ ] **Step 1: フィクスチャを作る**

```bash
mkdir -p .verify
cat > .verify/tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "lib": ["ESNext", "DOM"],
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["*.tsx"]
}
EOF
cat > .verify/sample.tsx <<'EOF'
import { Fragment, useState } from 'react'

import type { ReactElement } from 'react'

// @stylistic/jsx-pascal-case 違反（コンポーネント名にアンダースコアが入っている）
// JSX タグとして使わないとこのルールは検査しないので、下の JSX 内で <Bad_Name /> と書く
function Bad_Name(): ReactElement {
  return <span />
}

// react/function-component-definition 違反（アロー関数での定義）
export const Arrow = (): ReactElement => {
  // react/hook-use-state 違反（setter 名が set + State 名になっていない）
  const [value, update] = useState(0)
  const clicked = (): void => { update(value + 1) }
  const actions = { doThing: clicked }

  return (
    // react/jsx-fragments 違反（<> ではなく Fragment）
    <Fragment>
      {/* react/jsx-boolean-value 違反、react/self-closing-comp 違反、
          @stylistic/jsx-sort-props 違反（コールバックが末尾でない） */}
      <div hidden={true} onClick={clicked} className={'x'}></div>
      {/* react/jsx-handler-names 違反。
          このルールは既定オプション (checkLocalVariables: false) では
          ハンドラの値が MemberExpression のときしか検査しないため、
          裸の識別子ではなく obj.method 形式で書く必要がある */}
      <div onClick={actions.doThing} />
      {/* @stylistic/jsx-pascal-case 違反 */}
      <Bad_Name />
      {/* react/jsx-no-bind 違反 */}
      <button type='button' onClick={() => { update(0) }}>reset</button>
    </Fragment>
  )
}
EOF
```

- [ ] **Step 2: 検証用 config を作る**

```bash
cat > verify.config.mts <<'EOF'
import tseslint from 'typescript-eslint'

import { react } from './src/frameworks/react.ts'

export default [
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  ...react,
]
EOF
```

`src/frameworks/react.ts` を直接 import しているため、`@stylistic` のルールが鳴るかどうかで Task 2 Step 1 の `plugins` 明示が効いているかも同時に検証できる。

- [ ] **Step 3: 移行後の構成で lint する**

Run: `pnpm exec eslint -c verify.config.mts .verify/sample.tsx`
Expected: クラッシュせずに実行が完了する。報告のうち次を確認する。

- `@stylistic/jsx-self-closing-comp`、`@stylistic/jsx-pascal-case`、`@stylistic/jsx-sort-props` が報告されること (移行が効いている)
- `@eslint-react/use-state` が報告されること (`react/hook-use-state` の代替が効いている)
- `react/` で始まる ruleId が 1 件も報告されないこと (`react-hooks/` は別プラグインなので対象外)

出力をそのまま証跡として控える。

- [ ] **Step 4: 落とした 6 ルールが検出されないことを ruleId 一覧で示す**

```bash
pnpm exec eslint -c verify.config.mts --format json .verify/sample.tsx \
  | python3 -c "import json,sys,collections; d=json.load(sys.stdin); c=collections.Counter(m['ruleId'] for r in d for m in r['messages']); [print(f'{n:3}  {k}') for k,n in sorted(c.items(), key=lambda x: -x[1])]"
```

Expected: `react/jsx-boolean-value` / `react/jsx-fragments` / `react/jsx-filename-extension` / `react/jsx-handler-names` / `react/jsx-no-bind` / `react/function-component-definition` がいずれも一覧に現れない。この出力を証跡として控える。

なお `react/jsx-filename-extension` は `.tsx` を許可する設定だったため、移行前でもこのフィクスチャでは鳴らない。このルールの喪失はフィクスチャでは示せないので、証跡では対象外として扱う。

「移行後に検出されない」ことを示すには、そのルールが**移行前には検出していた**ことが前提になる。フィクスチャの各違反が移行前の `eslint-plugin-react` で実際に発火するかを、同プラグインを一時的に導入して単体で確認し、実証済みのルールと対象外のルールを切り分けて記録すること。

- [ ] **Step 5: 一時ファイルを削除する**

```bash
rm -rf .verify verify.config.mts
git status --short
```

Expected: `git status --short` の出力が空であること。フィクスチャが残っていると `pnpm lint` が意図的な違反を拾って落ちる。

---

### Task 4: 実コードベースへ適用して before/after を取る

**Files:**
- 作業はすべてスクラッチ領域で行う。このリポジトリのファイルは変更しない。

**Interfaces:**
- Consumes: Task 2 完了時点の作業ブランチ
- Produces: ruleId 別の検出件数を変更前後で比較した集計。PR 本文に貼る証跡。

**この計画とコミット、PR には、検証に用いたコードベースに関する情報を一切書かないこと。** 対象は実行者が利用者から受け取る。

- [ ] **Step 1: 対象の作業ツリーをスクラッチ領域へ複製する**

`node_modules` を除いて複製する。対象は pnpm workspace であり、ルートの `package.json` / `pnpm-workspace.yaml` / `pnpm-lock.yaml` とワークスペースのパッケージ一式が必要。

```bash
SCRATCH="$CLAUDE_SCRATCHPAD"   # 実行時のスクラッチディレクトリ
rsync -a --exclude node_modules --exclude .git "<対象の作業ツリー>/" "$SCRATCH/before/"
cp -a "$SCRATCH/before" "$SCRATCH/after"
```

- [ ] **Step 2: before 側を現状のまま install して lint する**

`before` は一切変更しない。公開版の `@slashnephy/eslint-config` と ESLint v9 のまま。

```bash
cd "$SCRATCH/before" && pnpm install --frozen-lockfile
pnpm exec eslint --format json '<lint 対象>' > "$SCRATCH/before.json" || true
```

`--format json` は違反があっても JSON を出力するが終了コードが非 0 になるため `|| true` を付ける。

- [ ] **Step 3: after 側の package.json だけを差し替える**

**ESLint の設定ファイルには手を加えない。** これが検証の要点で、設定を触ると「利用側が何を直す必要があるか」が測れなくなる。

ワークスペース側の `package.json` で次を変更する。

- `@slashnephy/eslint-config` の値を `link:<この作業ブランチの絶対パス>` にする
- `eslint` を `10.3.0` にする

```bash
cd "$SCRATCH/after" && pnpm install --no-frozen-lockfile
```

- [ ] **Step 4: after 側を lint する**

```bash
cd "$SCRATCH/after"
pnpm exec eslint --format json '<lint 対象>' > "$SCRATCH/after.json" || true
```

ロード時にクラッシュして JSON が得られない場合は、そのスタックトレースを記録する。原因が `eslint-plugin-react-doctor` (ESLint v10 での動作は未検証) であれば、そのブロックだけを一時的に無効化して再実行し、「設定を変更しない原則の例外」として証跡に明記する。

- [ ] **Step 5: ruleId 別に集計して差分を取る**

```bash
cat > "$SCRATCH/diff.py" <<'EOF'
import collections, json, sys

def count(path):
    with open(path) as f:
        data = json.load(f)
    return collections.Counter(m['ruleId'] or '(パースエラー等)' for r in data for m in r['messages'])

before, after = count(sys.argv[1]), count(sys.argv[2])
keys = sorted(set(before) | set(after))
print(f"{'ruleId':60} {'before':>7} {'after':>7} {'差分':>7}")
for k in keys:
    b, a = before.get(k, 0), after.get(k, 0)
    if b != a:
        print(f'{k:60} {b:7} {a:7} {a - b:+7}')
print(f"\n合計 before={sum(before.values())} after={sum(after.values())}")
EOF
python3 "$SCRATCH/diff.py" "$SCRATCH/before.json" "$SCRATCH/after.json"
```

Expected: 次を読み取れること。

- 落とした 6 ルールの before 件数 (0 件であれば「今すぐ壊れるものは無い」の実証になる)
- 移行した `@stylistic` 3 ルールの after 件数
- `@eslint-react` を v2 から v5 へ上げたことで新たに出る違反 (未知数。件数が多い場合は利用側の追随作業として PR に記載する)
- `react/*` を参照している設定・`eslint-disable` コメントが「ルール未定義」で失敗する件数

- [ ] **Step 6: 証跡を整形する**

上の集計表から、検証に用いたコードベースに関する情報 (ファイルパス、コード片、名前、ファイル数などの統計) をすべて除く。ruleId と件数のみの表にする。この表を Task 5 で PR 本文に貼る。

---

### Task 5: PR を更新する

**Files:**
- 変更なし (GitHub 上の操作)

**Interfaces:**
- Consumes: Task 3 と Task 4 の証跡
- Produces: レビュー可能な状態の PR

- [ ] **Step 1: バージョンを上げる**

```bash
pnpm bump-version
git add package.json
git commit -m "🔨 Bump version

Co-Authored-By: Claude Fable 6 <noreply@anthropic.com>"
```

- [ ] **Step 2: push する**

rebase 済みなので force push が必要。

```bash
git push --force-with-lease origin feat/upgrade-eslint-v10-react-v5
```

- [ ] **Step 3: PR 本文を書き換える**

PR は #1074 (Draft)。本文に次を書く。検証に用いたコードベースに関する情報は一切書かない。

- 削除の理由: `eslint-plugin-react` が ESLint v10 で削除された `context.getFilename()` を呼びロード時にクラッシュすること、上流 issue が open のままであること
- ルールの対応表 (spec の表を転記)
- 落とす 6 ルールと、その根拠 (v5 で対応ルールが削除された / 元々代替が無い)
- 破壊的変更: `peerDependencies.eslint` が `^10` になり ESLint v9 では動作しないこと
- 利用側に必要な追随: `react/*` を参照している config の上書きと `eslint-disable` コメントを除去する必要があること
- 落としたルールを拾い直したい場合の選択肢として `eslint-plugin-react-doctor` が `jsx-boolean-value` / `jsx-fragments` / `jsx-filename-extension` / `jsx-handler-names` の移植を持つこと (同プラグインの recommended では無効。ESLint v10 での動作は未検証)
- Task 3 と Task 4 の証跡

- [ ] **Step 4: 自分を Assign する**

```bash
gh pr edit 1074 --add-assignee SlashNephy
```

- [ ] **Step 5: マージ可否を確認する**

```bash
gh pr view 1074 --json mergeable,mergeStateStatus,statusCheckRollup
```

コンフリクトしていれば解消する。CI (`pnpm build` / `pnpm lint`) が通ることを確認する。

- [ ] **Step 6: Draft を解除するか利用者に確認する**

Task 4 で未検証・未解決の事項が残っている場合 (`eslint-plugin-react-doctor` の v10 動作、新規に出た `@eslint-react` v5 の違反など) は Draft のままにし、残件を利用者に報告する。すべて解消していれば Ready にしてよいか確認する。
