import type {Meta, StoryObj} from '@storybook/react';

import Tag from './Tag';

const meta: Meta<typeof Tag> = {
  component: Tag,
  title: "Components/Chips/Tag"
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Basic: Story = {args: {
  variant: "solid",
  children: "#tag"
}};

export const Outline: Story = {args: {
  variant: "outline",
  children: "come as you are"
}}