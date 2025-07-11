import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginOxlint from 'eslint-plugin-oxlint'

export const baseConfig = tseslint.config(
  {
    name: 'base/files-to-lint',
    files: ['**/*.{js,mjs,cjs,ts,mts}'],
  },

  {
    ignores: ['**/dist/**', '**/build/**', '**/coverage/**', '**/node_modules/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginOxlint.configs['flat/recommended'],
)

export default baseConfig