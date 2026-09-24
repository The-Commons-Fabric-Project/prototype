import type {Meta, StoryObj} from '@storybook/react';

import Summary from './Summary';

const meta: Meta<typeof Summary> = {
  component: Summary,
};

export default meta;

type Story = StoryObj<typeof Summary>;

export const Default: Story = {args: {
  label: "Something",
  value: 100,
  last: false
}};

export const Last: Story = {args: {
  label: "The last one",
  value: -3,
  last: true,
}}
