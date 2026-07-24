import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import OrgCard from './OrgCard';

const meta = {
  component: OrgCard,
} satisfies Meta<typeof OrgCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "org": {
      "id": 0,
      "name": "name",
      "blurb": "blurb",
      "tags": [],
      "contact": "contact",
      "website": "website"
    },
    "onClick": fn(),
    "idx": 0
  },
};