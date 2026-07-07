import type { Meta, StoryObj } from '@storybook/tanstack-react';

import LoginModal from './LoginModal';

const meta = {
  component: LoginModal,
} satisfies Meta<typeof LoginModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};