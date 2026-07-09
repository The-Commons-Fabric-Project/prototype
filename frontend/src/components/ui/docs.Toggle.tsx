import type { Meta, StoryObj } from '@storybook/tanstack-react';

import Toggle from './Toggle';

const meta = {
  title: "Components/UI/Toggle",
  component: Toggle,
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};