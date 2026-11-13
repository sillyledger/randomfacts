import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// The same rule sets as the old .eslintrc.json ("next/core-web-vitals", "next/typescript"), in ESLint 9's flat format.
export default defineConfig([...nextVitals, ...nextTs, globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])]);
