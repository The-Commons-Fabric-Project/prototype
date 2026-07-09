import type { Meta, StoryObj } from '@storybook/tanstack-react';

import DateChip from './DateChip';

const meta = {
  title: "Date Chip",
  component: DateChip,
} satisfies Meta<typeof DateChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};