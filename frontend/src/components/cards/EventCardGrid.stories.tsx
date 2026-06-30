import type { Meta, StoryObj } from '@storybook/tanstack-react';

import EventCardGrid from './EventCardGrid';

const meta = {
  component: EventCardGrid,
} satisfies Meta<typeof EventCardGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "events": [
      {
        "id": "id",
        "month": "month",
        "day": 0,
        "year": 0,
        "title": "title",
        "time": "6/23/2026",
        "organization": "organization",
        "description": "description",
        "location": "location",
        "tags": [
          "Registration"
        ],
        "thumbnailUrl": "https://example.com",
        "registrationInfo": "registrationInfo",
        "registerUrl": "https://example.com"
      }
    ]
  },
};