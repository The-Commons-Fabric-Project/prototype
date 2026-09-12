import { useState, type CSSProperties } from "react";

/**
 * Inline styles cannot express :hover, so hover treatments are applied from
 * state. In the target codebase, prefer a CSS class or your styling library's
 * pseudo-selector support and drop this hook.
 *
 *   const hover = useHoverStyle({ borderColor: "#9A9A9A" });
 *   <div {...hover.bind} style={{ ...base, ...hover.style }} />
 */
export function useHoverStyle(hoverStyle: CSSProperties) {
  const [on, setOn] = useState(false);
  return {
    style: on ? hoverStyle : undefined,
    bind: {
      onMouseEnter: () => setOn(true),
      onMouseLeave: () => setOn(false),
    },
  };
}
