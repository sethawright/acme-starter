import globals from 'globals'
import tseslint from 'typescript-eslint'
import { baseConfig } from './base.js'

export const nodeConfig = tseslint.config(
  ...baseConfig,
  {
    name: 'node/language-options',
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
)

export default nodeConfig