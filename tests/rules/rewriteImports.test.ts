import { RuleTester } from "@typescript-eslint/rule-tester";
import {
  RewriteImportsRuleMessages,
  RewriteImportsRuleOptions,
  rewriteImportsRule,
} from "src/rules/rewriteImports";

const ruleTester = new RuleTester();

describe("rewrite-imports", () => {
  ruleTester.run<RewriteImportsRuleMessages, RewriteImportsRuleOptions>(
    "rewriteImportsRule",
    rewriteImportsRule,
    {
      valid: [
        {
          code: `import { Bar } from '../Foo/Bar';`,
          options: [
            {
              rewrites: {},
            },
          ],
        },
      ],
      invalid: [
        {
          code: `import { Bar } from '../Foo/Bar';`,
          options: [
            {
              rewrites: {
                "^\\.\\./Foo(.*)": "@src/Foo$1",
              },
            },
          ],
          errors: [
            {
              messageId: "rewrite",
              data: {
                pattern: "^\\.\\./Foo(.*)",
                newPath: "@src/Foo/Bar",
              },
            },
          ],
          output: `import { Bar } from '@src/Foo/Bar';`,
        },

        {
          code: `import { YYY } from 'XXX/YYY';`,
          options: [{}],
          errors: [
            {
              messageId: "rewrite",
              data: {
                pattern: "^XXX/(.+)",
                newPath: "@XXX/YYY",
              },
            },
          ],
          output: `import { YYY } from '@XXX/YYY';`,
        },
      ],
    },
  );
});
