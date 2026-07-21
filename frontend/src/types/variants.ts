// reference: https://blog.logrocket.com/building-reusable-react-components-using-tailwind-css/#testing-badge-component
const ButtonVariant = {
  0: 'primary',
  1: 'ghost',
  2: 'subtle',
  3: 'danger',
  4: 'link'
} as const;

export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

const TagVariant = {
  0: 'yellow',
  1: 'blue',
  2: 'pink',
  3: 'green',
  4: 'grey'
} as const;

export type TagVariant = (typeof TagVariant)[keyof typeof TagVariant];

const TextInputVariant = {
  0: 'default',
  1: 'focus',
  2: 'error',
} as const;

export type TextInputVariant = (typeof TextInputVariant)[keyof typeof TextInputVariant];
