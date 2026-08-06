import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import EventDetailModal from './EventDetailModal';
import { EXAMPLE_EVENTS } from "../../mocks/events";

const meta = {
  component: EventDetailModal,
} satisfies Meta<typeof EventDetailModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "event": {...EXAMPLE_EVENTS[1]},
    "onClose": fn()
  },
  parameters: {
    docs: {
      story: { height: "500px"}
    }
  }
};