import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import Tag from './Tag';

const meta: Meta<typeof Tag> = {
  component: Tag,
  title: "Components/Chips/Tag"
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Basic: Story = {args: {}};
