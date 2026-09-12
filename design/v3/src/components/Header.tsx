import { S, T } from "../tokens";
import type { AppView } from "../types";

const HOST_STRIPE = ["#10C662", "#4C6DC5", "#6F49E0", "#E2526C", "#E67539", "#F8E056"];

interface Props {
  view: AppView;
  accentColor: string;
  sessionName: string | null;
  onNavigate: (view: AppView) => void;
  onLogin: () => void;
  onCreateAccount: () => void;
  onLogout: () => void;
}

/** Sticky header: six-color host stripe, wordmark, section nav, session actions. */
export function Header({ view, accentColor, sessionName, onNavigate, onLogin, onCreateAccount, onLogout }: Props) {
  const tab = (target: AppView, label: string, active: boolean) => (
    <button
      key={target}
      onClick={() => onNavigate(target)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: T.font,
        fontSize: 13,
        fontWeight: 700,
        padding: "4px 0 6px",
        color: active ? T.color.ink : T.color.muted,
        borderBottom: `2px solid ${active ? accentColor : "transparent"}`,
      }}
    >
      {label}
    </button>
  );

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: T.color.surface,
        borderBottom: `1px solid ${T.color.line}`,
      }}
    >
      <div style={{ display: "flex", gap: 2 }}>
        {HOST_STRIPE.map((c) => (
          <span key={c} style={{ flex: 1, height: 3, background: c }} />
        ))}
      </div>

      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <button
          onClick={() => onNavigate("landing")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", lineHeight: 1.15 }}
        >
          <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: T.color.ink }}>Commons Fabric</span>
          <span style={{ display: "block", fontSize: 9.5, color: T.color.muted, letterSpacing: "0.06em", fontWeight: 700 }}>
            COMMUNITY CALENDAR
          </span>
        </button>

        <nav style={{ display: "flex", gap: 22, marginLeft: "auto", marginRight: 8 }}>
          {tab("landing", "Events", view === "landing")}
          {tab("directory", "Directory", view === "directory" || view === "profile")}
          {tab("about", "About", view === "about")}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {sessionName ? (
            <>
              <span
                style={{
                  fontSize: 12,
                  color: T.color.ink,
                  fontWeight: 700,
                  maxWidth: 150,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {sessionName}
              </span>
              <button onClick={onLogout} style={{ ...S.btnSecondary, padding: "7px 13px" }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button onClick={onLogin} style={{ ...S.btnSecondary, padding: "7px 13px" }}>
                Log in
              </button>
              <button onClick={onCreateAccount} style={{ ...S.btnPrimary(accentColor), padding: "7px 13px", fontSize: 11 }}>
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
