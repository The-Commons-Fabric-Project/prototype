import type { Meta, StoryObj } from '@storybook/tanstack-react';

import Toggle from './Toggle';

const meta = {
  title: "Components/Input/Toggle",
  component: Toggle,
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "toggle",
    hint: "this doesn't actually do anything",
    checked: false,
    onChange: (checked: boolean) => console.log("toggle is", checked),
  }
};