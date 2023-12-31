import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { cwd } from 'process'

async function bumpVersion(): Promise<void> {
  const path = join(cwd(), 'package.json')
  const content = await readFile(path, 'utf-8')
  const packageJson = JSON.parse(content) satisfies { version: string }

  const [major, minor, patch] = packageJson.version.split('.')
  if (!major || !minor || !patch) {
    throw new Error('Invalid version number detected')
  }

  const patchNumber = parseInt(patch, 10)
  packageJson.version = `${major}.${minor}.${patchNumber + 1}`

  await writeFile(path, JSON.stringify(packageJson, null, 2))
}

bumpVersion().catch(console.error)
