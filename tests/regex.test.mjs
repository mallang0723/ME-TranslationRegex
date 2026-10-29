import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { rule } from './harness.mjs';
async function moduleOf(options) {
  const result = await build({ bundle: true, platform: 'node', format: 'esm', write: false, ...options });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
}
const actual = await moduleOf({ entryPoints: ['src/regex.ts'] });
const source = readFileSync('vendor/upstream/use-apply-regex.ts', 'utf8');
const oracle = await moduleOf({ stdin: { contents:
  `import { applyRegexReplacement, resolveRegexPatternLiteralMacros } from './vendor/upstream/regex-replacement';
import { isPatternSafe } from './vendor/upstream/regex-safety';
export { resolveScopedRegexMode } from './vendor/upstream/regex-scoping';\n` +
  source.slice(source.indexOf('type RegexApplyMode'), source.indexOf('/**\n * Hook that provides')) + '\nexport { parseScript, applyScripts };',
  loader: 'ts', resolveDir: process.cwd() } });
const apply = (row, options = {}, text = 'X') => actual.applyScripts(text, [actual.parseScript(rule({ findRegex: 'X', replaceString: 'Y', ...row }))], 'ai_output', options);
const cases = [
  ['global default', {}, {}, 'Y'], ['disabled string', { enabled: 'false' }, {}, 'X'], ['boolean is not enabled string', { enabled: true }, {}, 'X'],
  ['prompt skipped', { applyMode: 'prompt' }, {}, 'X'], ['both', { applyMode: 'both' }, {}, 'Y'],
  ['legacy promptOnly', { applyMode: null, promptOnly: 'true' }, {}, 'X'], ['legacy display', { applyMode: 'invalid' }, {}, 'Y'],
  ['user placement skipped', { placement: '["user_input"]' }, {}, 'X'], ['broken placement default', { placement: 'bad' }, {}, 'Y'],
  ['empty placement', { placement: '[]' }, {}, 'X'], ['bad trim harmless', { trimStrings: '{}' }, {}, 'Y'],
  ['target disabled default', { targetCharacterIds: '["a"]' }, {}, 'X'],
  ['target disabled explicit', { targetCharacterIds: '["a"]' }, { scopedMode: 'disabled', characterId: 'a' }, 'X'],
  ['exclusive same', { targetCharacterIds: '["a"]' }, { scopedMode: 'exclusive', characterId: 'a' }, 'Y'],
  ['exclusive other', { targetCharacterIds: '["a"]' }, { scopedMode: 'exclusive', characterId: 'b' }, 'X'],
  ['exclusive missing', { targetCharacterIds: '["a"]' }, { scopedMode: 'exclusive' }, 'X'],
  ['chat mode other character', { targetCharacterIds: '["a"]' }, { scopedMode: 'chat', characterId: 'b' }, 'Y'],
  ['chat mode missing character', { targetCharacterIds: '["a"]' }, { scopedMode: 'chat' }, 'Y'],
  ['invalid mode disabled', { targetCharacterIds: '["a"]' }, { scopedMode: 'garbage' }, 'X'],
  ['preset exact', { targetPromptPresetIds: '["p"]' }, { promptPresetId: 'p' }, 'Y'],
  ['preset mismatch', { targetPromptPresetIds: '["p"]' }, { promptPresetId: 'q' }, 'X'],
  ['preset missing', { targetPromptPresetIds: '["p"]' }, {}, 'X'],
  ['min inclusive', { minDepth: 2 }, { depth: 2 }, 'Y'], ['min outside', { minDepth: 2 }, { depth: 1 }, 'X'],
  ['max inclusive', { maxDepth: 2 }, { depth: 2 }, 'Y'], ['max outside', { maxDepth: 2 }, { depth: 3 }, 'X'],
  ['undefined depth skips', { minDepth: 20, maxDepth: 30 }, {}, 'Y'],
  ['trim runs after replacement', { trimStrings: '["Y",null,5]' }, {}, ''],
  ['empty pattern skipped', { findRegex: '' }, {}, 'X'], ['invalid regex skipped', { findRegex: '[' }, {}, 'X'],
  ['unsafe nested repetition skipped', { findRegex: '(X+)+' }, {}, 'X'],
  ['targetedOnly global skipped', {}, { targetedOnly: true }, 'X'],
];
for (const [name, row, options, expected] of cases) test(name, () => {
  assert.equal(apply(row, options), expected);
  assert.equal(apply(row, options), oracle.applyScripts('X', [oracle.parseScript(rule({ findRegex: 'X', replaceString: 'Y', ...row }))], 'ai_output', options));
});
test('scope precedence exhaustive matches unchanged reference (49 combinations)', () => {
  const values = [undefined, null, '', 'bad', 'disabled', 'exclusive', 'chat'];
  for (const override of values) for (const preset of values) assert.equal(actual.resolveScopedRegexMode(override, preset), oracle.resolveScopedRegexMode(override, preset));
  assert.equal(actual.resolveScopedRegexMode('disabled', 'chat'), 'disabled');
  assert.equal(actual.resolveScopedRegexMode(undefined, 'exclusive'), 'exclusive');
});
test('scope/target/preset/depth cross product matches unchanged reference (720 combinations)', () => {
  for (const mode of [undefined, 'disabled', 'exclusive', 'chat']) for (const characterId of [undefined, 'a', 'b'])
    for (const targetCharacterIds of ['[]', '["a"]']) for (const promptPresetId of [undefined, 'p', 'q'])
      for (const targetPromptPresetIds of ['[]', '["p"]']) for (const depth of [undefined, 0, 1, 2, 3]) {
        const row = rule({ targetCharacterIds, targetPromptPresetIds, minDepth: 1, maxDepth: 2 });
        const options = { scopedMode: mode, characterId, promptPresetId, depth };
        assert.equal(actual.applyScripts('<status>ok</status>', [actual.parseScript(row)], 'ai_output', options),
          oracle.applyScripts('<status>ok</status>', [oracle.parseScript(row)], 'ai_output', options));
      }
});
test('macros only in pattern literals/replacement literals/trim; capture macros are not expanded by applyScripts', () => {
  const resolveMacros = x => x.replaceAll('{{char}}', 'A+B').replaceAll('{{user}}', '$1');
  const rows = [actual.parseScript(rule({ findRegex: '{{char}}:(.*)', replaceString: '{{user}} / $1', trimStrings: '[" / "]' }))];
  assert.equal(actual.applyScripts('A+B:{{char}}', rows, 'ai_output', { resolveMacros }), '$1{{char}}');
});
test('upstream replacement case commands, named captures, rule order', () => {
  const rows = [rule({ findRegex: '(?<name>x)', replaceString: '\\U$<name>\\E', flags: 'g' }), rule({ findRegex: 'X', replaceString: 'done' })].map(actual.parseScript);
  assert.equal(actual.applyScripts('x', rows, 'ai_output'), 'done');
});
const macros = await moduleOf({ entryPoints: ['src/macros.ts'] });
test('seeded display macro resolver reuses seed and leaves unsupported server context unresolved', () => {
  const context = { userName: '독자', primaryCharacter: { name: 'Sola' }, variables: { mood: 'calm' } };
  const a = macros.createMessageMacroResolver(context, { randomSeed: 'm:0' });
  const b = macros.createMessageMacroResolver(context, { randomSeed: 'm:0' });
  assert.equal(a('{{char}} / {{user}} / {{mood}}'), 'Sola / 독자 / calm');
  assert.equal(a('{{random::a::b::c}}'), b('{{random::a::b::c}}'));
  assert.equal(a('{{include::secret}}'), '{{include::secret}}');
});
