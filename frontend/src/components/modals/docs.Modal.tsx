import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import Modal, { ModalHeader, type ModalProps } from './Modal';
import type { ReactElement } from "react";

const meta = {
  title: "Components/Modals/Modal (Template)",
  component: Modal,
  subcomponents: { ModalHeader },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

const modalFiller: ReactElement<ModalProps, typeof Modal> = (
  <>
  <ModalHeader 
    title="blank modal" 
    onClose={()=>console.log("modal close button")}
    subtitle="close button will do nothing"
  />
  <div className="flex flex-col gap-4.5 p-4">
    <p>blah blah blah something</p>
  </div>
  </>
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