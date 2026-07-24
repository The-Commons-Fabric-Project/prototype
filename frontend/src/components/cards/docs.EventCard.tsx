import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { EXAMPLE_EVENTS } from '../../mocks/events';
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
    event: EXAMPLE_EVENTS[0],
    onClick: ()=>{},
    idx: 0
  },
};