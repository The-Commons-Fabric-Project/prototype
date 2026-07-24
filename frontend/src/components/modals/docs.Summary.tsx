import type {Meta, StoryObj} from '@storybook/react';

import Summary from './Summary';

const meta: Meta<typeof Summary> = {
  component: Summary,
};

export default meta;

type Story = StoryObj<typeof Summary>;

export const Basic: Story = {args: {}};
