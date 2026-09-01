import { T } from "../tokens";
import { useHoverStyle } from "../useHoverStyle";
import type { Timeline, TimelineBlock } from "../timeline";

interface Props {
  timeline: Timeline;
  onSelect: (id: number) => void;
}

/**
 * Day / week timeblock grid. One shared hour rail on the left, one absolutely
 * positioned column per day. Blocks are placed by offset and height, so events
 * of any count and overlap fit without reflowing the grid.
 */
export function TimelineGrid({ timeline, onSelect }: Props) {
  const { hours, columns, gridHeightPx, railWidthPx, blockPadding } = timeline;

  return (
    <div style={{ border: `1px solid ${T.color.line}`, background: T.color.surface, borderRadius: T.radius.md }}>
      {/* Sticky day headers — stay visible while the body scrolls. */}
      <div
        style={{
          display: "flex",
          position: "sticky",
          top: 0,
          zIndex: 3,
          background: T.color.surfaceAlt,
          borderBottom: `1px solid ${T.color.line}`,
          borderRadius: `${T.radius.md}px ${T.radius.md}px 0 0`,
        }}
      >
        <span style={{ width: railWidthPx, flexShrink: 0 }} />
        {columns.map((col) => (
          <span
            key={col.iso}
            style={{
              flex: 1,
              minWidth: 0,
              textAlign: "center",
              padding: "6px 0",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: T.color.muted,
              borderLeft: `1px solid ${T.color.line}`,
            }}
          >
            {col.headLabel}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "stretch", padding: "10px 0 12px" }}>
        <div style={{ position: "relative", width: railWidthPx, flexShrink: 0, height: gridHeightPx }}>
          {hours.map((h) => (
            <span
              key={h.topPx}
              style={{
                position: "absolute",
                top: h.topPx,
                right: 6,
                transform: "translateY(-6px)",
                fontSize: 9,
                fontWeight: 700,
                color: T.color.muted,
                whiteSpace: "nowrap",
              }}
            >
              {h.label}
            </span>
          ))}
        </div>

        {columns.map((col) => (
          <div key={col.iso} style={{ position: "relative", flex: 1, minWidth: 0, height: gridHeightPx, borderLeft: `1px solid ${T.color.line}` }}>
            {hours.map((h) => (
              <span key={h.topPx} style={{ position: "absolute", top: h.topPx, left: 0, right: 0, height: 1, background: T.color.line }} />
            ))}

            {col.blocks.map((b) => (
              <Block key={b.id} block={b} padding={blockPadding} onSelect={onSelect} />
            ))}

            {col.isEmpty && (
              <span style={{ position: "absolute", top: 12, left: 0, right: 0, textAlign: "center", color: T.color.faint, fontSize: 10 }}>
                No events
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Block({ block: b, padding, onSelect }: { block: TimelineBlock; padding: string; onSelect: (id: number) => void }) {
  const hover = useHoverStyle({ borderColor: "#9A9A9A" });
  return (
    <div
      {...hover.bind}
      onClick={() => onSelect(b.id)}
      title={b.tooltip}
      style={{
        position: "absolute",
        boxSizing: "border-box",
        top: b.topPx,
        left: b.left,
        width: b.width,
        height: b.heightPx,
        zIndex: b.zIndex,
        background: b.fill,
        border: `1px solid ${T.color.line}`,
        borderLeft: `3px solid ${b.railColor}`,
        borderRadius: T.radius.md,
        padding,
        cursor: "pointer",
        overflow: "hidden",
        ...hover.style,
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: b.timeLetterSpacing,
          color: b.textColor,
          marginBottom: 3,
          lineHeight: 1.3,
          overflowWrap: "anywhere",
        }}
      >
        {b.timeText}
      </span>
      <span
        style={{
          display: "-webkit-box",
          WebkitLineClamp: b.titleClamp,
          WebkitBoxOrient: "vertical",
          fontSize: b.titleSize,
          fontWeight: 700,
          color: T.color.ink,
          lineHeight: 1.25,
          overflow: "hidden",
          overflowWrap: "break-word",
        }}
      >
        {b.title}
      </span>
      {b.showMeta && (
        <span style={{ display: "block", fontSize: 10.5, color: T.color.muted, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {b.metaLine}
        </span>
      )}
    </div>
  );
}
