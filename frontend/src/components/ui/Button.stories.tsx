import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import Button from './Button';

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "label": "label",
    "onClick": fn()
  },
};