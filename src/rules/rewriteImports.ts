import { ESLintUtils } from "@typescript-eslint/utils";
import { getTsconfig } from "get-tsconfig";
import { getRewriteRulesFromTsConfigPaths } from "src/utils";

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = ESLintUtils.RuleCreator(
  (name) => `https://my-website.io/eslint/${name}`,
);

export type RewriteImportsRuleOptions = [
  {
    rewrites?: Record<string, string>;
  },
];

export type RewriteImportsRuleMessages = "rewrite";

export const rewriteImportsRule = createRule<
  RewriteImportsRuleOptions,
  RewriteImportsRuleMessages
>({
  name: "rewrite-imports",
  meta: {
    docs: {
      description: "An example ESLint rule",
    },
    fixable: "code",
    type: "suggestion",
    messages: {
      rewrite:
        'Import path matched pattern "{{pattern}}". Use "{{newPath}}" instead.',
    },
    schema: [
      {
        type: "object",
        properties: {
          rewrites: {
            type: "object",
            patternProperties: {
              ".*": {
                type: "string",
              },
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create: (context, options) => {
    const config = options.at(0) ?? {};
    const rewrites = config.rewrites ?? {};
    const { config: tsconfigObject } = getTsconfig() ?? {};
    const tsconfigPaths = tsconfigObject?.compilerOptions?.paths ?? {};
    const additionalRewrites = getRewriteRulesFromTsConfigPaths(tsconfigPaths);
    const allRewrites = { ...rewrites, ...additionalRewrites };

    return {
      ImportDeclaration(node) {
        const oldPath = node.source.value;
        for (const [pattern, replacement] of Object.entries(allRewrites)) {
          const regex = new RegExp(pattern);
          if (oldPath.match(regex)) {
            const newPath = oldPath.replace(regex, replacement);
            context.report({
              node,
              messageId: "rewrite",
              data: {
                pattern,
                newPath,
              },
              fix(fixer) {
                return fixer.replaceText(node.source, `'${newPath}'`);
              },
            });
            break;
          }
        }
      },
    };
  },
});
