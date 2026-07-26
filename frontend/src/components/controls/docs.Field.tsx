import type { Meta, StoryObj } from '@storybook/tanstack-react';

import Field from './Field';

const meta = {
  title: "Components/Input/Field",
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

function blankInput(){ return (
  <input 
    type='text' className='border border-bg-subtle rounded-md'
    placeholder="placeholder"  
  />
)}

export const Default: Story = {
  args: {
    "label": "label",
    "error": "error",
    "children": blankInput(),
  },
};