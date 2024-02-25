<!-- begin auto-generated rules list -->

# eslint-plugin-rewrite-imports

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                             | Description                                                      | 🔧 |
| :----------------------------------------------- | :--------------------------------------------------------------- | :- |
| [rewrite-imports](docs/rules/rewrite-imports.md) | Rewrite imports based on regex pattern or paths in tsconfig.json | 🔧 |

<!-- end auto-generated rules list -->


## Installation

Install from NPM:

```
npm install --save-dev eslint-plugin-rewrite-imports
```

In `.eslintrc.js`:

* Add `"rewrite-imports"` to `plugins` .
* Add `"rewrite-imports/rewrite-imports"` to `"rules"`.

```
module.exports = {
    ...
    plugins: ["rewrite-imports"],
    rules: {
        ...
        "rewrite-imports/rewrite-imports": ["error", {
            rewrites: {
                // Define your rewrite rules here.
            }
        }],
    }
}
```

## Rewrite rules

Define rules in the `rewrites` object. The keys are regex patterns. The values are replacement strings. If the regex matches an import path, then the import will be replaced by `String.replace(pattern, replacement)`.

```
{
    rewrites: {
        "^\\.\\./Foo(.*)": "@src/Foo$1",
    }
}
```
The above rule will rewrite
```
import { Bar } from '../Foo/Bar';,
```
into 
```
import { Bar } from '@src/Foo/Bar';
```

## Rewrite tsconfig aliases 

Instead of defining custom rewrite rules, the plugin reads `compilerOptions.paths` from `tsconfig.json` in the current working directory.

```
{
    compilerOptions: {
        paths: {
            "@src/Foo/*": ["../Foo/*"]
        }
    }
}
```

This is equivalent to the rewrite rules defined in `eslintrc.js`. You can choose either way.

