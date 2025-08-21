// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const config = [
    ...tseslint.config(
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
    ),
    {
        "rules": {
            "max-len": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-use-before-define": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/camelcase": "off",
            "comma-dangle": [
                "warn",
                "never"
            ],
            "semi": ["warn", "always"],
            "indent": ["warn", 4],
            "node/no-missing-import": "off",
            "node/no-unsupported-features/es-syntax": "off",
            "node/no-missing-require": "off",
            "node/shebang": "off",
            "no-dupe-class-members": "off",
            "space-before-function-paren": [
                "error",
                {
                    "anonymous": "always",
                    "named": "never",
                    "asyncArrow": "always"
                }
            ]
        },
    }
]

export default config;