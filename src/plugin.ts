import { rewriteImportsRule } from "src/rules/rewriteImports";

const plugin = {
  rules: { "rewrite-imports": rewriteImportsRule },
};

export = plugin;
