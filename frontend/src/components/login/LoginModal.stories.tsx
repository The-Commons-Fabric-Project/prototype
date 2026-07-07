import type { Meta, StoryObj } from '@storybook/tanstack-react';

import LoginModal from './LoginModal';

const meta = {
  title: "Pop-up/Log In",
  component: LoginModal,
} satisfies Meta<typeof LoginModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};