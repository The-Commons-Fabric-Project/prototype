import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { CalendarView } from './Calendar';
import { Route } from '../../routes/index';

import { EXAMPLE_EVENTS } from '../../mocks/events';

const meta = {
  title: "Components/Calendar",
  component: CalendarView,
} satisfies Meta<typeof CalendarView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "events": EXAMPLE_EVENTS,
    onSelect: () => {},
  },
};