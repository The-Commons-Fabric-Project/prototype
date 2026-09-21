/**
 * Every component in `src/components` that has a variant attribute should have a [Component]Variant const that lists the options.
 */

import { type ColorVariantKey } from "../palette";

// reference: https://blog.logrocket.com/building-reusable-react-components-using-tailwind-css/#testing-badge-component
const ButtonVariant = {
  0: 'primary',
  1: 'secondary', // secondary, formerly "ghost" in v2
  2: 'tertiary', // tertiary, formerly "subtle"
  3: 'disabled', // disabled, formerly "danger"
  // 4: 'link' // TODO: get rid of this
} as const;

export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export type TagVariant = ColorVariantKey;

const TextInputVariant = {
  0: 'default',
  1: 'focus',
  2: 'error',
} as const;

export type TextInputVariant = (typeof TextInputVariant)[keyof typeof TextInputVariant];

