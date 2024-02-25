function escapeRegex(string: string) {
  return string.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
}

export function mapPatternToRegex(pattern: string): string {
  return (
    "^" +
    escapeRegex(pattern.replace(/(.\/)?node_modules\//, "")).replace(
      "*",
      "(.+)",
    )
  );
}

export function mapAliasToReplacement(pattern: string): string {
  return pattern.replace("*", "$1");
}

export function getRewriteRulesFromTsConfigPaths(
  tsConfigPath: Record<string, string[]>,
): Record<string, string> {
  const rewrites: Record<string, string> = {};

  for (const [pattern, paths] of Object.entries(tsConfigPath)) {
    const replacement = mapAliasToReplacement(pattern);
    for (const path of paths) {
      rewrites[mapPatternToRegex(path)] = replacement;
    }
  }
  return rewrites;
}
