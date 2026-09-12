import { S, T } from "../tokens";

const SECTIONS = [
  {
    heading: "What this is",
    body: "Commons Fabric is a shared community calendar and directory for the Rideau Community Hub. Organizations sharing space at the Hub can list their events in one place, and neighbours can browse everything happening in one view instead of checking a dozen separate sites.",
  },
  {
    heading: "Why it exists",
    body: "Event details were scattered across flyers, mailing lists, and individual org websites, and it was hard for anyone to get a full picture of what was happening at the Hub. Commons Fabric gives every organization a place to post events and be discovered by the wider community.",
  },
  {
    heading: "Get involved",
    body: "If your organization shares space at the Hub, create an account to start publishing your own events and appear in the directory.",
  },
];

/** About page. Copy is placeholder-free but project-specific — confirm before shipping. */
export function AboutView() {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={S.h1}>About Commons Fabric</h1>
        <p style={S.lede}>Why we built this, and what it's for.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 640 }}>
        {SECTIONS.map((s) => (
          <div key={s.heading} style={{ ...S.card, padding: 22 }}>
            <h2 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.color.ink, margin: "0 0 10px" }}>{s.heading}</h2>
            <p style={{ fontSize: 13.5, color: T.color.body, lineHeight: 1.65, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
