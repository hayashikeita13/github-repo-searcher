import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintPluginPrettierRecommended,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'es5',
          tabWidth: 2,
          singleQuote: true,
          jsxSingleQuote: true,
          printWidth: 120,
        },
      ],
    },
  },
]);

export default eslintConfig;
