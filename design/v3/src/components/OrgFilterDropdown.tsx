import { useState } from "react";
import { PALETTE, SEED_ORGS } from "../data";
import { S, T, accentGradient } from "../tokens";
import { orgColorKey } from "../utils";

const ALL_STRIPE = "linear-gradient(90deg,#10C662,#4C6DC5,#6F49E0,#E2526C,#E67539,#F8E056)";

interface Props {
  accentColor: string;
  /** Currently applied filter. */
  appliedOrgIds: number[];
  onApply: (ids: number[]) => void;
}

/**
 * Org filter dropdown. Checkbox selections are staged locally and only take
 * effect on Apply, so the calendar doesn't re-flow on every tick. Opening the
 * menu re-seeds the staged set from what is applied.
 */
export function OrgFilterDropdown({ accentColor, appliedOrgIds, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<number[]>(appliedOrgIds);

  const toggle = () => {
    if (!open) setPending(appliedOrgIds);
    setOpen(!open);
  };

  const dirty = [...pending].sort().join() !== [...appliedOrgIds].sort().join();
  const allSelected = appliedOrgIds.length === SEED_ORGS.length;
  const firstIdx = Math.max(0, SEED_ORGS.findIndex((o) => appliedOrgIds.includes(o.id)));
  const firstPal = PALETTE[orgColorKey(firstIdx)];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggle}
        style={{
          ...S.btnSecondary,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: T.color.ink,
          borderColor: open ? T.color.ink : T.color.line,
        }}
      >
        <span
          style={{
            width: 12,
            height: 4,
            borderRadius: 2,
            background: allSelected ? ALL_STRIPE : `linear-gradient(90deg,${firstPal.c1},${firstPal.c2})`,
          }}
        />
        {allSelected ? "All organizations" : `${appliedOrgIds.length} of ${SEED_ORGS.length} orgs`}
        <span style={{ color: T.color.muted, fontSize: 9 }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 20,
            top: "calc(100% + 6px)",
            right: 0,
            width: 264,
            background: T.color.surface,
            border: `1px solid ${T.color.ink}`,
            borderRadius: T.radius.lg,
            padding: 14,
            animation: "cf-pop .16s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
            <span style={S.eyebrow}>FILTER BY ORG</span>
            <button
              onClick={() => setPending(SEED_ORGS.map((o) => o.id))}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: T.font,
                fontSize: 10.5,
                fontWeight: 700,
                color: T.color.body,
                textDecoration: "underline",
              }}
            >
              All
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 12, maxHeight: 230, overflowY: "auto" }}>
            {SEED_ORGS.map((o, i) => {
              const pal = PALETTE[orgColorKey(i)];
              const checked = pending.includes(o.id);
              return (
                <label
                  key={o.id}
                  style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "6px 4px", borderRadius: T.radius.sm, cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setPending(checked ? pending.filter((id) => id !== o.id) : [...pending, o.id])
                    }
                    style={{ margin: "1px 0 0", width: 13, height: 13, flexShrink: 0, accentColor, cursor: "pointer" }}
                  />
                  <span
                    style={{
                      width: 12,
                      height: 4,
                      borderRadius: 2,
                      flexShrink: 0,
                      marginTop: 5,
                      background: `linear-gradient(90deg,${pal.c1},${pal.c2})`,
                    }}
                  />
                  <span style={{ fontSize: 11.5, color: T.color.ink, lineHeight: 1.35, minWidth: 0 }}>{o.name}</span>
                </label>
              );
            })}
          </div>

          <button
            onClick={() => {
              onApply(pending);
              setOpen(false);
            }}
            style={{
              width: "100%",
              background: dirty ? accentGradient(accentColor) : T.color.surface,
              color: dirty ? "#FFFFFF" : T.color.body,
              border: `1px solid ${dirty ? accentColor : T.color.line}`,
              padding: 9,
              borderRadius: T.radius.md,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              cursor: "pointer",
              fontFamily: T.font,
            }}
          >
            Apply
          </button>
          <p style={{ fontSize: 10.5, color: T.color.muted, margin: "9px 0 0", lineHeight: 1.4 }}>
            {allSelected
              ? "Showing all organizations."
              : `Showing ${appliedOrgIds.length} of ${SEED_ORGS.length} organizations.`}
          </p>
        </div>
      )}
    </div>
  );
}
