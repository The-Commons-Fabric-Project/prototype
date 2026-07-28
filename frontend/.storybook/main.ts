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
      
      // this is silly, but I was just experimenting with the guts of storybook and how it parses things
      // copied from node_modules\storybook\dist\core-server\presets\common-preset.js
      createIndex: async (fileName) => {
        const customMakeTitle = (userTitle: string) => { 
          console.log(`Called custom makeTitle function, input: ${userTitle ? userTitle : "undefined, file is "+fileName}`);
          if (userTitle) return userTitle;
          
          const relPath = fileName.split("src")[1].split("/");
          relPath.pop();
          relPath.shift();
          relPath.map((dir)=>dir.toUpperCase());
          const component = fileName.split('.')[1].split(/(?=[A-Z])/).join(" ");
          relPath.push(component);
          console.log(relPath);
          const res = relPath.join("/");
          console.log(`auto title: ${res}`);
          return res; 
        };

        const options = {makeTitle: customMakeTitle}
        console.log(`Called custom createIndex function, args: { fileName: ${fileName}, options: {${options.makeTitle.toString()}}`);
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