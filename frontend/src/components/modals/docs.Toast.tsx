import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Toast} from './Toast';

const meta: Meta<typeof Toast> = {
  component: Toast,
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Basic: Story = {args: {}};
