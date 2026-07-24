import type { Meta, StoryObj } from '@storybook/tanstack-react';

import EventCard from './EventCard';

const meta = {
  title: "Components/Cards/Event Card",
  component: EventCard,
} satisfies Meta<typeof EventCard>;

export default meta;

type Story = StoryObj<typeof meta>;

// what shows up in the Storybook default preview
export const Default: Story = {
  args: {
    "month": "June",
    "day": 23,
    "title": "Example",
    "time": "6/23/2026",
    description: "Add a description for your event here"
  },
};