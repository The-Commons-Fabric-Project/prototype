import { T } from "../tokens";
import type { AppView } from "../types";

interface Props {
  onNavigate: (view: AppView) => void;
}

/** Dark footer, present on every view. */
export function Footer({ onNavigate }: Props) {
  const link = (target: AppView, label: string) => (
    <button
      key={target}
      onClick={() => onNavigate(target)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: T.font,
        fontSize: 11.5,
        fontWeight: 700,
        color: T.color.footerText,
        padding: 0,
      }}
    >
      {label}
    </button>
  );

  return (
    <footer
      style={{
        background: T.color.footer,
        borderTop: `1px solid ${T.color.footerLine}`,
        padding: "22px 24px",
        marginTop: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 11.5, color: T.color.footerText }}>
          Powered by the people at the Commons Fabric
        </span>
        <nav style={{ display: "flex", gap: 18 }}>
          {link("landing", "Events")}
          {link("directory", "Directory")}
          {link("about", "About")}
        </nav>
      </div>
    </footer>
  );
}
