import type { CSSProperties } from "react";

/**
 * Commons Fabric design tokens. Every value here is taken from the design
 * system; do not introduce new colors or radii without checking it first.
 */
export const T = {
  color: {
    ink: "#262626",
    body: "#6B6B6B",
    muted: "#8A8A8A",
    faint: "#B8B8B8",
    line: "#D1D1D1",
    surface: "#FAFAFA",
    surfaceAlt: "#F5F5F5",
    field: "#FFFFFF",
    trackOff: "#E8E8E8",
    danger: "#F50A1E",
    accent: "#6F49E0",
    accentSoft: "#B297D6",
    footer: "#1E1E1E",
    footerLine: "#333333",
    footerText: "#B8B8B8",
    overlay: "rgba(38,38,38,0.55)",
  },
  radius: { sm: 6, md: 8, lg: 12, pill: 999 },
  font: "Helvetica,Arial,sans-serif",
  /** Fixed height of the calendar body; day/week views scroll inside it. */
  calendarBodyHeight: 496,
} as const;

export const accentGradient = (accent: string) =>
  `linear-gradient(135deg,${accent},${T.color.accentSoft})`;

export const S = {
  page: {
    background: T.color.surface,
    minHeight: "100vh",
    color: T.color.ink,
    fontFamily: T.font,
  } as CSSProperties,

  shell: { maxWidth: 1040, margin: "0 auto", padding: "36px 24px 80px" } as CSSProperties,

  card: {
    background: T.color.surface,
    border: `1px solid ${T.color.line}`,
    borderRadius: T.radius.lg,
  } as CSSProperties,

  h1: {
    fontFamily: T.font,
    fontSize: "clamp(26px,5vw,36px)",
    fontWeight: 700,
    color: T.color.ink,
    margin: "0 0 10px",
    letterSpacing: "-0.01em",
    lineHeight: 1.1,
  } as CSSProperties,

  lede: { fontSize: 14, color: T.color.body, margin: 0, maxWidth: 560, lineHeight: 1.6 } as CSSProperties,

  /** Uppercase micro-label used above fields and section groups. */
  fieldLabel: {
    display: "block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: T.color.body,
    marginBottom: 6,
    textTransform: "uppercase",
  } as CSSProperties,

  /** Uppercase eyebrow used in toolbars ("FILTER BY ORG", "SHOW"). */
  eyebrow: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: T.color.muted,
  } as CSSProperties,

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 11px",
    borderRadius: T.radius.md,
    fontSize: 12.5,
    border: `1px solid ${T.color.line}`,
    background: T.color.field,
    color: T.color.ink,
    fontFamily: T.font,
    outline: "none",
  } as CSSProperties,

  /** Applied on :focus — 1px ink frame with a 2px accent underline. */
  inputFocus: {
    border: `1px solid ${T.color.ink}`,
    borderBottom: `2px solid ${T.color.accent}`,
  } as CSSProperties,

  error: { display: "block", marginTop: 5, fontSize: 10.5, color: T.color.danger, fontWeight: 700 } as CSSProperties,

  btnPrimary: (accent: string) =>
    ({
      background: accentGradient(accent),
      color: "#fff",
      border: "none",
      padding: "9px 18px",
      borderRadius: T.radius.md,
      fontSize: 12,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.02em",
      cursor: "pointer",
      fontFamily: T.font,
    } as CSSProperties),

  btnSecondary: {
    background: T.color.surface,
    color: T.color.body,
    border: `1px solid ${T.color.line}`,
    padding: "8px 14px",
    borderRadius: T.radius.md,
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.02em",
    cursor: "pointer",
    fontFamily: T.font,
  } as CSSProperties,

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background: T.color.overlay,
    animation: "cf-fade .16s ease",
  } as CSSProperties,

  modal: (maxWidth: number) =>
    ({
      width: "100%",
      maxWidth,
      maxHeight: "88vh",
      overflowY: "auto",
      background: T.color.surface,
      borderRadius: T.radius.lg,
      border: `1px solid ${T.color.ink}`,
      animation: "cf-pop .18s ease",
    } as CSSProperties),

  toast: {
    position: "fixed",
    bottom: 26,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 200,
    background: T.color.ink,
    color: "#FFFFFF",
    padding: "11px 20px",
    borderRadius: T.radius.md,
    fontSize: 13,
    fontWeight: 500,
    animation: "cf-rise .3s ease",
    maxWidth: "90vw",
    textAlign: "center",
    fontFamily: T.font,
  } as CSSProperties,
};

/**
 * Keyframes and resets that cannot be expressed as inline styles. Inject once
 * at the app root, or port into the target codebase's global stylesheet.
 */
export const GLOBAL_CSS = `
  body { margin: 0; background: ${T.color.surface}; }
  a { color: ${T.color.accent}; text-decoration: underline; }
  a:hover { color: #4A2FB0; }
  input, textarea, select, button { box-sizing: border-box; }
  @keyframes cf-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cf-pop { 0% { opacity: 0; transform: scale(0.97); } 100% { opacity: 1; transform: scale(1); } }
  @keyframes cf-rise { 0% { opacity: 0; transform: translate(-50%, 12px); } 100% { opacity: 1; transform: translate(-50%, 0); } }
`;
