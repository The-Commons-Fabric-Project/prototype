import type { Preview } from '@storybook/tanstack-react';
import {INITIAL_VIEWPORTS } from 'storybook/viewport';

import '../src/index.css';
import { AuthProvider } from '../src/hooks/useAuth'
import { OverlayProvider } from '../src/hooks/useOverlayContext';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    viewport: { options: INITIAL_VIEWPORTS, },

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
          // TODO: configure story order for sidebar - ref https://storybook.js.org/docs/react/configure/sidebar-and-urls#sorting-stories or https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy#sorting-stories
          "Design System", [
            "Foundations", 
            "Buttons & Controls", 
            "Tags, Chips, & Status", 
            "Cards & Content", 
            "Navigation & Headers", 
            "Overlays & Feedback", 
            "Calendar"
          ],
          "Components",
        ]
      }
    },
  },

  // enable autodocs for all components - https://storybook.js.org/docs/writing-docs/autodocs/?renderer=react&ref=guide
  tags: ['autodocs'],
  
  
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, { parameters }) => {
      // 👇 Make it configurable by reading the theme value from parameters
      const { theme = 'light' } = parameters;
      return (
        <AuthProvider>
          <OverlayProvider>
            <Story />
          </OverlayProvider>
        </AuthProvider>
      );
    },
  ]
};

export default preview;