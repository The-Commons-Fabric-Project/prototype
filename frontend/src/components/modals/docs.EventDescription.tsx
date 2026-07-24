import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import EventDescription from './EventDescription';
import { EXAMPLE_EVENTS } from "../../mocks/events";

const meta = {
  title: 'Components/Pop-Up/Event Description',
  component: EventDescription,
} satisfies Meta<typeof EventDescription>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "event": {...EXAMPLE_EVENTS[1]},
    // "event": {
    //   "id": "id",
    //   "month": "month",
    //   "day": 0,
    //   "year": 0,
    //   "title": "title",
    //   "time": "6/23/2026",
    //   "organization": "organization",
    //   "description": "description",
    //   "location": "location",
    //   "tags": [
    //     "Registration"
    //   ],
    //   "thumbnailUrl": "https://placehold.co/600x400?text=thumbnail\nplaceholder",
    //   "registrationInfo": "registrationInfo",
    //   "registerUrl": "https://example.com"
    // },
    "onClose": fn()
  },
  parameters: {
    docs: {
      story: { height: "500px"}
    }
  }
};