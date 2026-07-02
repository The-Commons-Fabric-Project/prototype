import { fn } from "storybook/test";
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import LoginModal from './LoginModal';

const meta = {
  component: LoginModal,
} satisfies Meta<typeof LoginModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "event": {
      "id": "id",
      "month": "month",
      "day": 0,
      "year": 0,
      "title": "title",
      "time": "6/30/2026",
      "organization": "organization",
      "description": "description",
      "location": "location",
      "tags": [
        "Registration"
      ],
      "thumbnailUrl": "https://example.com",
      "registrationInfo": "registrationInfo",
      "registerUrl": "https://example.com"
    },
    "onClose": fn()
  },
};