# Explicit read-only import of the authorized reference; never scans other workspaces.
from pathlib import Path
import hashlib
import json
import os

root = Path(os.environ.get('MARINARA_REF', '../marinara-engine-ref')) / 'packages'
out = Path('vendor/upstream')
out.mkdir(parents=True, exist_ok=True)
files = ['client/src/hooks/use-apply-regex.ts', 'client/src/lib/chat-macros.ts',
         'client/src/lib/chat-html.ts', 'client/src/lib/chat-message-css.ts']
files += ['shared/src/utils/' + n + '.ts' for n in
          ['regex-scoping', 'regex-replacement', 'regex-safety', 'macro-engine',
           'preset-choices', 'quote-format', 'dice-notation']]
targets = {p: out / Path(p).name for p in files}
# Keep dice-notation's relative runtime import intact, without editing vendor bytes.
targets['shared/src/features/tactical-combat/rng.ts'] = Path('vendor/features/tactical-combat/rng.ts')

# Validate extraction boundaries before writing anything. Named boundaries survive
# inserted functions/imports; missing or ambiguous markers fail instead of truncating.
sources = {p: (root / p).read_bytes() for p in targets}

def section(name, start, end):
    source = sources[name].decode()
    if source.count(start) != 1 or source.count(end) != 1:
        raise ValueError(f'Ambiguous extraction boundaries: {name}')
    first, last = source.index(start), source.index(end)
    if last <= first:
        raise ValueError(f'Reversed extraction boundaries: {name}')
    line = source.count('\n', 0, first) + 1
    return source[first:last].rstrip(), line

regex, line = section('client/src/hooks/use-apply-regex.ts', 'type RegexApplyMode', '/**\n * Hook that provides')
lines = []
for n, value in enumerate(regex.splitlines(), line):
    if any(x in value for x in ['if (', 'catch', 'for (', '? ', ': row.']):
        lines.append(' ' * (len(value) - len(value.lstrip())) + f'// packages/client/src/hooks/use-apply-regex.ts:{n}')
    lines.append(value.replace('function parseScript(', 'export function parseScript(')
                 .replace('function applyScripts(', 'export function applyScripts('))
regex_port = f'// Mechanical port of use-apply-regex.ts:{line}-{line + len(regex.splitlines()) - 1}. Server order is preserved.\n' + '''import { applyRegexReplacement, resolveRegexPatternLiteralMacros } from '../vendor/upstream/regex-replacement';
import { isPatternSafe } from '../vendor/upstream/regex-safety';
export { resolveScopedRegexMode } from '../vendor/upstream/regex-scoping';
''' + '\n'.join(lines) + '\n'
macro_data, data_line = section('client/src/lib/chat-macros.ts', 'export interface MacroCharacterData', 'function toMacroPersonaData(')
macro_resolver, resolver_line = section('client/src/lib/chat-macros.ts', 'export function buildMessageMacroContext(', 'export function isPromptPreviewMacro(')
macro_port = "import { resolveMacros, type MacroContext } from '../vendor/upstream/macro-engine';\n" + \
    f'// packages/client/src/lib/chat-macros.ts:{data_line}-{data_line + len(macro_data.splitlines()) - 1},{resolver_line}-{resolver_line + len(macro_resolver.splitlines()) - 1}, copied without network/input helpers.\n' + \
    macro_data + '\n' + macro_resolver + '\n'
policy, policy_line = section('client/src/lib/chat-html.ts', 'const CHAT_HTML_ALLOWED_TAGS', 'export type SanitizeChatHtmlOptions')
policy_port = f'// packages/client/src/lib/chat-html.ts:{policy_line}-{policy_line + len(policy.splitlines()) - 1}, exact host message allowlists.\n' + policy.replace('const CHAT_', 'export const CHAT_') + '\n'

for p, target in targets.items():
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(sources[p])
Path('vendor/UPSTREAM.json').write_text(json.dumps({p: hashlib.sha256(data).hexdigest() for p, data in sources.items()}, indent=2) + '\n')
(out / 'LICENSE').write_bytes((root.parent / 'LICENSE').read_bytes())
Path('src/regex.ts').write_text(regex_port)
Path('src/macros.ts').write_text(macro_port)
Path('src/html-policy.ts').write_text(policy_port)
Path('src/host-css.ts').write_text('// Adapted import only; packages/client/src/lib/chat-message-css.ts:1-561.\n' + sources['client/src/lib/chat-message-css.ts'].decode())
