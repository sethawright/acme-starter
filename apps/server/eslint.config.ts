import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginOxlint from 'eslint-plugin-oxlint'

const config: ReturnType<typeof tseslint.config> = tseslint.config(
  {
    name: 'server/files-to-lint',
    files: ['**/*.{js,mjs,cjs,ts,mts}'],
  },

  {
    ignores: ['**/dist/**', '**/build/**', '**/coverage/**', '**/node_modules/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },

  ...pluginOxlint.configs['flat/recommended'],
)

export default config
