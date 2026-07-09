import type { StorybookConfig } from '@storybook/tanstack-react';
import { readFile } from 'node:fs/promises';
import { loadCsf } from 'storybook/internal/csf-tools';
import { logger } from 'storybook/internal/node-logger';
import { Indexer } from 'storybook/internal/types';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/@(docs.)*.@(ts|tsx)",
  ],
  docs: {
    docsMode: true,
  },
  experimental_indexers: async (existingIndexers) => {
    const customIndexer: Indexer = {
      test: /docs\..+\.[tj]sx?$/,
      
      // copied from frontend\node_modules\storybook\dist\core-server\presets\common-preset.js
      createIndex: async (fileName, options) => {
        const code = (await readFile(fileName, "utf-8")).toString();
        return code.trim().length === 0 ? (logger.debug(`The file ${fileName} is empty. Skipping indexing.`), []) : loadCsf(code, { ...options, fileName }).parse().indexInputs;
      }
    };
    return [...existingIndexers, customIndexer];
  },
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  "framework": "@storybook/tanstack-react"
};
export default config;