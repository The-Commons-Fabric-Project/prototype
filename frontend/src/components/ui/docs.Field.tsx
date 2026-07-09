import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import Field from './Field';

const meta = {
  title: "UI/Field",
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "label": "label",
    "error": "error",
    "children": fn()
  },
};