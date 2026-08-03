/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  // Proxy the API instead of calling http://localhost:3000 across origins.
  //
  // In production the backend serves this build from its own origin, so /v1 is
  // same-origin there. Proxying in development makes the two match: the session
  // cookie is sameSite: 'lax', which a cross-origin XHR would not send, and no
  // request is ever preflighted. The alternative - absolute URLs plus CORS plus
  // credentials: 'include' - only reproduces in development what production
  // never does.
  server: {
    proxy: {
      '/v1': {
        target: process.env.VITE_API_TARGET || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true
    }), 
    tailwindcss(), 
    react({ 
      // exclude the Claude artifact, ref: https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#exclude
      exclude: [/\/design\//, /\/node_modules\//] 
    }),
    babel({
      presets: [reactCompilerPreset()]
    }),
  ],
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});