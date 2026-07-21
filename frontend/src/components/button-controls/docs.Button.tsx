import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import Button, { ButtonVariant } from './Button';

const meta = {
  title: "Components/Input/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "variant": ButtonVariant.PRIMARY,
    "label": "Click me",
    "onClick": fn()
  },
};

export const Ghost: Story = {
  args: {
    "variant": ButtonVariant.GHOST,
    "label": "You can't click me",
    "onClick": fn()
  }
}

export const Danger: Story = {
  args: {
    "variant": ButtonVariant.DANGER,
    "label": "Bad things will happen",
    "onClick": fn()
  }
}
