import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import Modal from './Modal';
import type { ReactElement } from "react";

const meta = {
  title: "Components/Pop-Up/Modal (Template)",
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

const modalFiller: ReactElement<string> = (
  <div className="flex flex-col gap-4.5 p-4">
    <p>blah blah blah something</p>
  </div>
);

export const Default: Story = {
  args: {
    "children": modalFiller,
    "onClose": fn()
  },
  parameters: {
    docs: {
      story: { height: "500px"}
    }
  }
};