// Precedent: anywhere/scripts/build.mjs, self-contained dist artifact with no runtime imports.
import { build as bundle } from 'esbuild';
import { mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export async function build() {
  mkdirSync('dist', { recursive: true }); mkdirSync('qa', { recursive: true });
  await bundle({ entryPoints: ['src/entry.ts'], outfile: 'dist/extension.js', bundle: true,
    platform: 'browser', format: 'iife', target: ['es2020'], legalComments: 'inline',
    banner: { js: '// translation_regex_me · generated; see README.md and NOTICE.' } });
  copyFileSync('manifest.json', 'dist/manifest.json');
  for (const name of ['README.md', 'NOTICE']) copyFileSync(name, `dist/${name}`);
  const output = readFileSync('dist/extension.js', 'utf8');
  if (/\bimport\s*\(/.test(output)) throw Error('Runtime dynamic import is forbidden');
  console.log('Built self-contained extension.js');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await build();
