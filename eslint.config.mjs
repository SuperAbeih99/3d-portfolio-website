import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { FlatCompat } from '@eslint/eslintrc';
import nextConfig from 'eslint-config-next';
import turboConfig from 'eslint-config-turbo/flat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const nextAllGlobs = [
  'apps/web/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
  'apps/desktop/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
];

const nextTypeScriptGlobs = [
  'apps/web/**/*.{ts,tsx,mts,cts}',
  'apps/desktop/**/*.{ts,tsx,mts,cts}',
];

const scopedNextConfig = nextConfig.map((config) => {
  if (!config.files) {
    return config;
  }

  const isTsOnly = config.files.every((pattern) => pattern.includes('.ts'));
  return {
    ...config,
    files: isTsOnly ? nextTypeScriptGlobs : nextAllGlobs,
  };
});

const sharedRules = {
  '@next/next/no-html-link-for-pages': [
    'off',
    {
      rootDir: ['apps/web', 'apps/desktop'],
    },
  ],
  'react-hooks/set-state-in-effect': 'warn',
  'react-hooks/purity': 'warn',
  'react-hooks/refs': 'warn',
  'react-hooks/immutability': 'warn',
  'react/no-unescaped-entities': 'warn',
};

const sharedLanguageOptions = {
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
};

const nextRootDirs = ['apps/web', 'apps/desktop'].map((dir) =>
  path.join(__dirname, dir),
);

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      'apps/*/public/**',
    ],
  },
  ...scopedNextConfig,
  ...turboConfig,
  ...compat.extends('prettier'),
  {
    languageOptions: sharedLanguageOptions,
    rules: sharedRules,
    settings: {
      next: {
        rootDir: nextRootDirs,
      },
    },
  },
];
