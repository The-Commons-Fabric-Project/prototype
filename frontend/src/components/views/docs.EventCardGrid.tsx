import type { Meta, StoryObj } from '@storybook/tanstack-react';

import EventCardGrid from './EventCardGrid';
import { EXAMPLE_EVENTS } from '../../mocks/events';
import { SEED_ORGS } from '../../mocks/orgs';

const meta = {
  title: "Components/Cards/Event Card Grid",
  component: EventCardGrid,
} satisfies Meta<typeof EventCardGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "events": [
      EXAMPLE_EVENTS[0],
      EXAMPLE_EVENTS[4],
      EXAMPLE_EVENTS[1],
      EXAMPLE_EVENTS[7]
    ],
    onSelect: () => {},
    // Stands in for useOrgLookup, which the app supplies from the query cache.
    // Resolving against the fixtures keeps this story free of a QueryClientProvider.
    orgName: (id: number) => SEED_ORGS.find((org) => org.id === id)?.name,
    rangeStart: "",
    rangeEnd: "",
    setRangeStart: () => {},
    setRangeEnd: () => {},
  },
};