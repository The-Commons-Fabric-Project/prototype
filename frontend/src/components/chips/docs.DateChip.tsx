import type { Meta, StoryObj } from '@storybook/tanstack-react';

import DateChip from './DateChip';

const meta = {
  title: "Components/Chips/Date Chip",
  component: DateChip,
} satisfies Meta<typeof DateChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "date": "2023-08-15",
    "large": false
  },
};