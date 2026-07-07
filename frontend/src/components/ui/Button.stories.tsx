import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import Button from './Button';

const meta = {
  title: "UI/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "variant": "primary",
    "label": "Click me",
    "onClick": fn()
  },
};

export const VariantA: Story = {
  args:{
    "variant": "ghost",
    "label": "You can't click me"
  }
}