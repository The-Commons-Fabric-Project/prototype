import type {Meta, StoryObj} from '@storybook/react';

import {MonthGrid} from './MonthGrid';

const meta: Meta<typeof MonthGrid> = {
  component: MonthGrid,
};

export default meta;

type Story = StoryObj<typeof MonthGrid>;

export const Basic: Story = {args: {}};
