// Mechanical port of use-apply-regex.ts:21-186. Server order is preserved.
import { applyRegexReplacement, resolveRegexPatternLiteralMacros } from '../vendor/upstream/regex-replacement';
import { isPatternSafe } from '../vendor/upstream/regex-safety';
export { resolveScopedRegexMode } from '../vendor/upstream/regex-scoping';
type RegexApplyMode = "prompt" | "display" | "both";

function getApplyMode(row: RegexScriptRow): RegexApplyMode {
  return row.applyMode === "prompt" || row.applyMode === "display" || row.applyMode === "both"
    // packages/client/src/hooks/use-apply-regex.ts:25
    ? row.applyMode
    // packages/client/src/hooks/use-apply-regex.ts:26
    : row.promptOnly === "true"
      // packages/client/src/hooks/use-apply-regex.ts:27
      ? "prompt"
      : "display";
}

/**
 * Parses a RegexScriptRow from DB into a usable form.
 */
export function parseScript(row: RegexScriptRow) {
  const placements: RegexPlacement[] = (() => {
    try {
      const parsed = JSON.parse(row.placement) as unknown;
      // packages/client/src/hooks/use-apply-regex.ts:38
      if (!Array.isArray(parsed)) return ["ai_output"];
      return parsed.filter(
        (placement): placement is RegexPlacement => placement === "ai_output" || placement === "user_input",
      );
    // packages/client/src/hooks/use-apply-regex.ts:42
    } catch {
      return ["ai_output"];
    }
  })();
  const trimStrings: string[] = (() => {
    try {
      const parsed = JSON.parse(row.trimStrings) as unknown;
      // packages/client/src/hooks/use-apply-regex.ts:49
      return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === "string") : [];
    // packages/client/src/hooks/use-apply-regex.ts:50
    } catch {
      return [];
    }
  })();
  const targetCharacterIds: string[] = (() => {
    try {
      const parsed = JSON.parse(row.targetCharacterIds);
      // packages/client/src/hooks/use-apply-regex.ts:57
      return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === "string") : [];
    // packages/client/src/hooks/use-apply-regex.ts:58
    } catch {
      return [];
    }
  })();
  const targetPromptPresetIds: string[] = (() => {
    try {
      const parsed = JSON.parse(row.targetPromptPresetIds);
      // packages/client/src/hooks/use-apply-regex.ts:65
      return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === "string") : [];
    // packages/client/src/hooks/use-apply-regex.ts:66
    } catch {
      return [];
    }
  })();
  return {
    ...row,
    // packages/client/src/hooks/use-apply-regex.ts:72
    enabledBool: row.enabled === "true",
    applyMode: getApplyMode(row),
    placements,
    trimStrings,
    targetCharacterIds,
    targetPromptPresetIds,
  };
}

// Each script's pattern is checked and compiled once, not once per message it touches. Patterns with
// macros resolve to a different source per speaker, so the key is the resolved source and its flags.
const COMPILED_PATTERN_LIMIT = 500;
const compiledPatterns = new Map<string, RegExp | null>();

export function compileRegexScriptPattern(source: string, flags: string): RegExp | null {
  const key = `${flags}\u0000${source}`;
  // packages/client/src/hooks/use-apply-regex.ts:88
  if (compiledPatterns.has(key)) return compiledPatterns.get(key)!;
  let compiled: RegExp | null = null;
  // packages/client/src/hooks/use-apply-regex.ts:90
  if (isPatternSafe(source)) {
    try {
      compiled = new RegExp(source, flags);
    // packages/client/src/hooks/use-apply-regex.ts:93
    } catch {
      compiled = null;
    }
  }
  // packages/client/src/hooks/use-apply-regex.ts:97
  if (compiledPatterns.size >= COMPILED_PATTERN_LIMIT) {
    const oldest = compiledPatterns.keys().next().value;
    // packages/client/src/hooks/use-apply-regex.ts:99
    if (oldest !== undefined) compiledPatterns.delete(oldest);
  }
  compiledPatterns.set(key, compiled);
  return compiled;
}

/**
 * Applies all enabled regex scripts for a given placement to the input text.
 * @param depth — message depth (0 = latest message, 1 = one before, etc.). When
 *   undefined, depth range filtering is skipped (all scripts apply).
 */
export function applyScripts(
  text: string,
  scripts: ReturnType<typeof parseScript>[],
  placement: RegexPlacement,
  options?: {
    promptOnly?: boolean;
    depth?: number;
    resolveMacros?: (value: string) => string;
    targetCharacterId?: string | null;
    targetedOnly?: boolean;
    scopedMode?: ScopedRegexMode | null;
    characterId?: string | null;
    promptPresetId?: string | null;
  },
): string {
  let result = text;
  // packages/client/src/hooks/use-apply-regex.ts:126
  for (const script of scripts) {
    // packages/client/src/hooks/use-apply-regex.ts:127
    if (!script.enabledBool) continue;
    // packages/client/src/hooks/use-apply-regex.ts:128
    if (!script.placements.includes(placement)) continue;
    // Prompt context is opt-in. Display context runs visual scripts only.
    // packages/client/src/hooks/use-apply-regex.ts:130
    if (options?.promptOnly) {
      // packages/client/src/hooks/use-apply-regex.ts:131
      if (script.applyMode !== "prompt" && script.applyMode !== "both") continue;
    // packages/client/src/hooks/use-apply-regex.ts:132
    } else if (script.applyMode !== "display" && script.applyMode !== "both") {
      continue;
    }

    // packages/client/src/hooks/use-apply-regex.ts:136
    if (options?.targetedOnly && script.targetCharacterIds.length === 0) continue;
    // packages/client/src/hooks/use-apply-regex.ts:137
    if (script.targetCharacterIds.length > 0) {
      // packages/client/src/hooks/use-apply-regex.ts:138
      if (options?.promptOnly) {
        // Prompt context: match the character whose prompt is being assembled.
        // packages/client/src/hooks/use-apply-regex.ts:140
        if (!options.targetCharacterId || !script.targetCharacterIds.includes(options.targetCharacterId)) continue;
      } else {
        // Display context: gate the scoped script by the chat's tri-state mode —
        // disabled → off; exclusive → only on a target character's own messages;
        // chat → on every message.
        const rawMode = options?.scopedMode;
        // packages/client/src/hooks/use-apply-regex.ts:146
        const mode: ScopedRegexMode = rawMode === "exclusive" || rawMode === "chat" ? rawMode : "disabled";
        // packages/client/src/hooks/use-apply-regex.ts:147
        if (mode === "disabled") continue;
        // packages/client/src/hooks/use-apply-regex.ts:148
        if (mode === "exclusive") {
          const charId = options?.characterId;
          // packages/client/src/hooks/use-apply-regex.ts:150
          if (!charId || !script.targetCharacterIds.includes(charId)) continue;
        }
      }
    }
    // packages/client/src/hooks/use-apply-regex.ts:154
    if (script.targetPromptPresetIds.length > 0) {
      // packages/client/src/hooks/use-apply-regex.ts:155
      if (!options?.promptPresetId || !script.targetPromptPresetIds.includes(options.promptPresetId)) continue;
    }

    // Depth range filtering
    // packages/client/src/hooks/use-apply-regex.ts:159
    if (options?.depth != null) {
      // packages/client/src/hooks/use-apply-regex.ts:160
      if (script.minDepth != null && options.depth < script.minDepth) continue;
      // packages/client/src/hooks/use-apply-regex.ts:161
      if (script.maxDepth != null && options.depth > script.maxDepth) continue;
    }

    try {
      const findRegex = options?.resolveMacros
        // packages/client/src/hooks/use-apply-regex.ts:166
        ? resolveRegexPatternLiteralMacros(script.findRegex, options.resolveMacros)
        : script.findRegex;
      // packages/client/src/hooks/use-apply-regex.ts:168
      if (!findRegex) continue;
      const re = compileRegexScriptPattern(findRegex, script.flags);
      // packages/client/src/hooks/use-apply-regex.ts:170
      if (!re) continue;
      // A shared sticky pattern resumes from its last match, so every use starts at the beginning.
      re.lastIndex = 0;
      result = applyRegexReplacement(result, re, script.replaceString, (value) =>
        // packages/client/src/hooks/use-apply-regex.ts:174
        options?.resolveMacros ? options.resolveMacros(value) : value,
      );
      // Apply trim strings
      // packages/client/src/hooks/use-apply-regex.ts:177
      for (const trim of script.trimStrings) {
        // packages/client/src/hooks/use-apply-regex.ts:178
        const resolvedTrim = options?.resolveMacros ? options.resolveMacros(trim) : trim;
        // packages/client/src/hooks/use-apply-regex.ts:179
        if (resolvedTrim) result = result.split(resolvedTrim).join("");
      }
    // packages/client/src/hooks/use-apply-regex.ts:181
    } catch {
      // Invalid regex — skip silently
    }
  }
  return result;
}
