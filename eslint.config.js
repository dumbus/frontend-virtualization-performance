import path from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import hooksPlugin from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  js.configs.recommended,
  {
    ...reactRecommended,
    plugins: {
      react: reactPlugin
    },
    languageOptions: {
    globals: {
      window: 'readonly',
      document: 'readonly',
      performance: 'readonly',
      console: 'readonly',
      setInterval: 'readonly',
      setTimeout: 'readonly',
      clearInterval: 'readonly',
      requestAnimationFrame: 'readonly',
      cancelAnimationFrame: 'readonly',
      localStorage: 'readonly',
      process: 'readonly'
    },
    ecmaVersion: 2021,
  },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'react-hooks': hooksPlugin
    },
    rules: hooksPlugin.configs.recommended.rules
  },
  {
    plugins: {
      prettier: prettier
    },
    rules: {
      ...prettier.configs.recommended.rules,
      'prettier/prettier': 'warn'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: path.join(__dirname, 'tsconfig.json')
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-console': 'warn',
      'import/default': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before'
            },
            {
              pattern: 'context/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: 'app/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: 'features/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: 'pages/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: 'shared/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: 'styles/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: 'tests/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: 'widgets/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: './**/*.module.scss',
              group: 'sibling',
              position: 'after'
            },
            {
              pattern: '**/*.scss',
              group: 'index',
              position: 'after'
            }
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          },
          'newlines-between': 'always'
        }
      ]
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        typescript: {
          project: [
            path.join(__dirname, 'tsconfig.json'),
          ],
          alwaysTryTypes: true,
        }
      },
      react: {
        version: 'detect'
      }
    }
  },
  {
    ignores: ['eslint.config.js', '.prettierrc.js', '.vscode/settings.json']
  }
];
