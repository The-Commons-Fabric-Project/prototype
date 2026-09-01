import type { ReactNode } from "react";
import { S, T } from "../tokens";

interface Props {
  /** Four-stop ramp for the top bar. Defaults to the purple accent ramp. */
  stops?: [string, string, string, string];
  maxWidth?: number;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

const PURPLE_RAMP: [string, string, string, string] = ["#6F49E0", "#9570C7", "#B297D6", "#C6AEE7"];

/**
 * Modal shell: scrim, four-stop top bar, ink border, close affordance.
 * Clicking the scrim (not the panel) closes.
 */
export function ModalShell({ stops = PURPLE_RAMP, maxWidth = 500, title, subtitle, onClose, children }: Props) {
  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={S.modalOverlay}
    >
      <div style={S.modal(maxWidth)}>
        <div style={{ display: "flex", gap: 2 }}>
          {stops.map((c, i) => (
            <span key={i} style={{ flex: 1, height: 3, background: c }} />
          ))}
        </div>

        {title && (
          <div style={{ padding: "20px 24px 16px", position: "relative", borderBottom: `1px solid ${T.color.line}` }}>
            <CloseButton onClose={onClose} />
            <h2 style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, color: T.color.ink, margin: 0, paddingRight: 32 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 12, color: T.color.body, margin: "6px 0 0" }}>{subtitle}</p>}
          </div>
        )}

        <div style={{ padding: "18px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

export function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      aria-label="Close"
      style={{
        position: "absolute",
        top: 14,
        right: 16,
        width: 28,
        height: 28,
        borderRadius: T.radius.md,
        border: `1px solid ${T.color.line}`,
        background: T.color.surface,
        cursor: "pointer",
        color: T.color.body,
        fontSize: 15,
        zIndex: 2,
      }}
    >
      ×
    </button>
  );
}

/** Labelled text field with the design system's error treatment. */
export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={S.fieldLabel}>{label}</span>
      {children}
      {error && <span style={S.error}>{error}</span>}
    </label>
  );
}

/** 40×20 pill toggle. Knob is 16px + 1px border, box-sizing:border-box, top:1px. */
export function Toggle({ on, accentColor, onChange }: { on: boolean; accentColor: string; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={on}
      style={{
        flexShrink: 0,
        width: 40,
        height: 20,
        borderRadius: 10,
        border: `1px solid ${on ? accentColor : T.color.line}`,
        cursor: "pointer",
        position: "relative",
        background: on ? `linear-gradient(135deg,${accentColor},${T.color.accentSoft})` : T.color.trackOff,
      }}
    >
      <span
        style={{
          position: "absolute",
          boxSizing: "border-box",
          top: 1,
          left: on ? 22 : 2,
          width: 16,
          height: 16,
          borderRadius: 8,
          background: "#FFFFFF",
          border: `1px solid ${T.color.line}`,
        }}
      />
    </button>
  );
}

/** Label + helper text + toggle, in a bordered row. */
export function ToggleRow({
  title,
  hint,
  on,
  accentColor,
  onChange,
}: {
  title: string;
  hint: string;
  on: boolean;
  accentColor: string;
  onChange: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 14,
        padding: "11px 13px",
        background: T.color.field,
        border: `1px solid ${T.color.line}`,
        borderRadius: T.radius.md,
        marginBottom: 14,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.color.ink }}>{title}</span>
        <span style={{ display: "block", fontSize: 11, color: T.color.muted, marginTop: 2 }}>{hint}</span>
      </div>
      <div style={{ marginTop: 2 }}>
        <Toggle on={on} accentColor={accentColor} onChange={onChange} />
      </div>
    </div>
  );
}

/** Review-step summary table used by the two-step forms. */
export function SummaryRow({ label, value, first }: { label: string; value: string; first?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        borderTop: first ? undefined : `1px solid ${T.color.line}`,
        paddingTop: first ? undefined : 8,
      }}
    >
      <span style={{ fontSize: 11, color: T.color.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      <span style={{ fontSize: 13, color: T.color.ink, textAlign: "right" }}>{value}</span>
    </div>
  );
}
