import type {Meta, StoryObj} from '@storybook/react';

import InlineDate from './InlineDate';

const meta: Meta<typeof InlineDate> = {
  component: InlineDate,
};

export default meta;

type Story = StoryObj<typeof InlineDate>;

export const Basic: Story = {args: {
  date: "2026-06-16"
}};
