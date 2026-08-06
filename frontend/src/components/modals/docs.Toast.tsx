import type {Meta, StoryObj} from '@storybook/react';

import Toast from './Toast';

const meta: Meta<typeof Toast> = {
  component: Toast,
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Basic: Story = {
  parameters: { 
    docs: { story: { height: "100px"}}
  },
  args: { message: "Hurrah!"}
};
