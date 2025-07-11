import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export const createVueConfig = (options = {}) => {
  const {
    files = ['**/*.{ts,mts,tsx,vue}'],
    vitestFiles = ['src/**/__tests__/*'],
    playwrightFiles = ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    ignores = ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  } = options

  return defineConfigWithVueTs(
    {
      name: 'vue/files-to-lint',
      files,
    },

    globalIgnores(ignores),

    pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,

    {
      ...pluginVitest.configs.recommended,
      files: vitestFiles,
    },

    {
      ...pluginPlaywright.configs['flat/recommended'],
      files: playwrightFiles,
    },
    ...pluginOxlint.configs['flat/recommended'],
    skipFormatting,
  )
}

export default createVueConfig()