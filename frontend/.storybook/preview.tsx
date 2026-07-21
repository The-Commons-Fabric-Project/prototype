import type { Preview } from '@storybook/tanstack-react';

import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    // make custom story order here
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          // TODO: configure story order for sidebar - https://storybook.js.org/docs/react/configure/sidebar-and-urls#sorting-stories
          // "Design System/Foundations",
          // "Components",
        ]
      }
    },
  },
  // enable autodocs for all components - https://storybook.js.org/docs/writing-docs/autodocs/?renderer=react&ref=guide
  tags: ['autodocs'],
};

export default preview;