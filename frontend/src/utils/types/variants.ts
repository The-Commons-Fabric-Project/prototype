import { accentGradient, type ColorVariantKey } from "../palette";

// reference: https://blog.logrocket.com/building-reusable-react-components-using-tailwind-css/#testing-badge-component
const ButtonVariant = {
  0: 'primary',
  1: 'secondary', // ghost
  2: 'tertiary', // subtle
  3: 'disabled', // danger
  4: 'link' // TODO: get rid of this
} as const;

export const BUTTON_VARIANT_MAPS: Record<ButtonVariant, string> = {
  primary: `bg-[${accentGradient("purple")}] text-white border-accent`,
  secondary: "bg-white text-ink border-line",
  tertiary: "bg-accentSoft text-ink border-line",
  disabled: "bg-white text-danger border-line",
  link: "bg-transparent text-bg-subtle underline"
}

export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export type TagVariant = ColorVariantKey;

const TextInputVariant = {
  0: 'default',
  1: 'focus',
  2: 'error',
} as const;

export type TextInputVariant = (typeof TextInputVariant)[keyof typeof TextInputVariant];

