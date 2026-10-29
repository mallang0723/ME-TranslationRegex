# Explicit read-only import of the authorized reference; never scans other workspaces.
from pathlib import Path
import hashlib,json
import os
root=Path(os.environ.get('MARINARA_REF', '../marinara-engine-ref'))/'packages'
out=Path('vendor/upstream'); out.mkdir(parents=True,exist_ok=True)
files=['client/src/hooks/use-apply-regex.ts','client/src/lib/chat-macros.ts','client/src/lib/chat-html.ts','client/src/lib/chat-message-css.ts']
files += ['shared/src/utils/'+n+'.ts' for n in ['regex-scoping','regex-replacement','regex-safety','macro-engine','preset-choices','quote-format']]
manifest={}
for p in files:
    data=(root/p).read_bytes(); (out/Path(p).name).write_bytes(data)
    manifest[p]=hashlib.sha256(data).hexdigest()
Path('vendor/UPSTREAM.json').write_text(json.dumps(manifest,indent=2)+'\n')
Path('vendor/upstream/LICENSE').write_bytes((root.parent/'LICENSE').read_bytes())
# Remove only React plumbing/types through esbuild later. Every branch retains a source-line reference.
s=(out/'use-apply-regex.ts').read_text().splitlines()
lines=[]
for n,line in enumerate(s[20:160],21):
    if any(x in line for x in ['if (','catch','for (','? ',': row.']):
        lines.append(' '* (len(line)-len(line.lstrip()))+f'// packages/client/src/hooks/use-apply-regex.ts:{n}')
    lines.append(line.replace('function parseScript(', 'export function parseScript(').replace('function applyScripts(', 'export function applyScripts('))
Path('src/regex.ts').write_text('''// Mechanical port of use-apply-regex.ts:21-160. Server order is preserved (176-179).
import { applyRegexReplacement, resolveRegexPatternLiteralMacros } from '../vendor/upstream/regex-replacement';
import { isPatternSafe } from '../vendor/upstream/regex-safety';
export { resolveScopedRegexMode } from '../vendor/upstream/regex-scoping';
'''+ '\n'.join(lines)+'\n')
s=(out/'chat-macros.ts').read_text().splitlines()
Path('src/macros.ts').write_text("import { resolveMacros } from '../vendor/upstream/macro-engine';\n// packages/client/src/lib/chat-macros.ts:13-91,161-252, copied without network/input helpers.\n"+'\n'.join(s[12:91])+ '\n'+'\n'.join(s[160:252])+'\n')
s=(out/'chat-html.ts').read_text().splitlines()
Path('src/html-policy.ts').write_text('// packages/client/src/lib/chat-html.ts:31-116, exact host allowlists.\n'+'\n'.join(s[30:116]).replace('const CHAT_', 'export const CHAT_')+'\n')
s=(out/'chat-message-css.ts').read_text().replace('from "./remote-images"','from "./remote-images"')
Path('src/host-css.ts').write_text('// Adapted import only; packages/client/src/lib/chat-message-css.ts:1-561.\n'+s)
