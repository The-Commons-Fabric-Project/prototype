import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Route } from '../routes/index';

// ref: https://storybook.js.org/docs/get-started/frameworks/tanstack-react#rendering-a-route
const meta = {
  title: "Pages/Index (Events)",
  parameters: {
    layout: 'fullscreen',
    tanstack: {
      router: {
        route: Route, // 👈 Supply the Route here
        // 👇 Rest of these properties are type-safe
        // params: { id: '42' },
        // query: { tab: 'details' },
      },
    },
  },
} satisfies Meta<typeof Route>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
