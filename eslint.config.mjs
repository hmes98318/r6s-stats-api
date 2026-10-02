import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import {defineConfig} from 'eslint/config';
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {ignores: ['node_modules/**', 'dist/**', '.local/**', 'coverage/**']},
    js.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        plugins: {'@stylistic': stylistic},
        rules: {
            '@stylistic/indent': ['error', 4],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/quotes': ['error', 'single', {avoidEscape: true}],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            '@stylistic/brace-style': ['error', '1tbs'],
            '@stylistic/arrow-parens': ['error', 'as-needed'],
            '@stylistic/object-curly-spacing': ['error', 'never'],
            '@stylistic/array-bracket-spacing': ['error', 'never'],
            '@stylistic/arrow-spacing': 'error',
            '@stylistic/block-spacing': ['error', 'always'],
            '@stylistic/comma-spacing': 'error',
            '@stylistic/computed-property-spacing': ['error', 'never'],
            '@stylistic/eol-last': ['error', 'always'],
            '@stylistic/key-spacing': 'error',
            '@stylistic/keyword-spacing': 'error',
            '@stylistic/no-mixed-spaces-and-tabs': 'error',
            '@stylistic/no-multi-spaces': 'error',
            '@stylistic/no-multiple-empty-lines': [
                'error',
                {max: 1, maxBOF: 0, maxEOF: 0},
            ],
            '@stylistic/no-tabs': 'error',
            '@stylistic/no-trailing-spaces': 'error',
            '@stylistic/semi-spacing': 'error',
            '@stylistic/space-before-blocks': 'error',
            '@stylistic/space-before-function-paren': [
                'error',
                {anonymous: 'always', named: 'never', asyncArrow: 'always'},
            ],
            '@stylistic/space-in-parens': ['error', 'never'],
            '@stylistic/space-infix-ops': 'error',
            '@stylistic/space-unary-ops': 'error',
            '@stylistic/template-curly-spacing': ['error', 'never'],
            '@stylistic/type-annotation-spacing': 'error',
            '@stylistic/max-len': [
                'error',
                {
                    code: 80,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreComments: true,
                },
            ],
            '@stylistic/member-delimiter-style': 'error',
        },
    },
    {
        files: ['**/*.ts'],
        extends: [tseslint.configs.recommendedTypeChecked],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {jsdoc},
        settings: {jsdoc: {tagNamePreference: {file: 'fileoverview'}}},
        rules: {
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/array-type': [
                'error',
                {default: 'array-simple'},
            ],
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-import-type-side-effects': 'error',
            'jsdoc/check-alignment': 'error',
            'jsdoc/check-tag-names': 'error',
            'jsdoc/require-jsdoc': [
                'error',
                {
                    require: {
                        FunctionDeclaration: true,
                        ClassDeclaration: true,
                    },
                },
            ],
            'no-restricted-syntax': [
                'error',
                {
                    selector:
                        'Program > ExpressionStatement[expression.type="AwaitExpression"]',
                    message:
                        'Use an async main function so the published library can also be required from Node.js 24.',
                },
            ],
        },
    },
]);
