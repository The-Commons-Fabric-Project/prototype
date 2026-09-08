import { ColorVariantKey } from "../palette";

// reference: https://blog.logrocket.com/building-reusable-react-components-using-tailwind-css/#testing-badge-component
const ButtonVariant = {
  0: 'primary',
  1: 'ghost', // secondary
  2: 'subtle', // tertiary
  3: 'danger', // disabled
  4: 'link' // TODO: get rid of this
} as const;

export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

// const TagVariant = {
//   // 0: 'yellow',
//   // 1: 'blue',
//   // 2: 'pink',
//   // 3: 'green',
//   // 4: 'grey'
//   0: "solid",
//   1: "outline",
// } as const;

export type TagVariant = ColorVariantKey;

const TextInputVariant = {
  0: 'default',
  1: 'focus',
  2: 'error',
} as const;

export type TextInputVariant = (typeof TextInputVariant)[keyof typeof TextInputVariant];

