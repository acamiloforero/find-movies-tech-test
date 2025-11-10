// eslint.config.js
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

/** @type {import('eslint').FlatESLintConfigItem[]} */
const config = [
  // Ignorar dist y node_modules
  { ignores: ['dist/**/*', 'node_modules/**/*'] },

  // Archivos TypeScript
  {
    files: ['*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'prettier/prettier': ['error', { singleQuote: true, semi: true }],
    },
  },

  // Archivos Angular HTML
  {
    files: ['*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    rules: {},
  },
];

export default config;
