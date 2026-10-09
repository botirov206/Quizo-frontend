/**
 * ESLint Config
 * TypeScript, React Hooks, Vite refresh, and file size rules
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import { defineConfig, globalIgnores } from 'eslint/config'

const fileSize = { max: 300, skipBlankLines: true, skipComments: true }
const size = { rules: { 'max-lines': builtinRules.get('max-lines') } }

export default defineConfig([
  globalIgnores(['dist', 'src/components/ui/**', 'src/api/schema.d.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: { size },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'size/max-lines': ['warn', { ...fileSize, max: 200 }],
      'max-lines': ['error', fileSize],
    },
  },
  {
    // Removed when round 4 deletes OpenTDBGame.
    files: ['src/features/explore/components/OpenTDBGame.tsx'],
    rules: { 'max-lines': 'off' },
  },
])
