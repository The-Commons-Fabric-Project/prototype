import type { Meta, StoryObj } from '@storybook/tanstack-react';

import FilterBar from './FilterBar';

const meta = {
  component: FilterBar,
} satisfies Meta<typeof FilterBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "children": null
  },
};