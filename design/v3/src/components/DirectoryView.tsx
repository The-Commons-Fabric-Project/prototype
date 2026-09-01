import { useState } from "react";
import { PALETTE, SEED_ORGS } from "../data";
import { S, T } from "../tokens";
import { orgColorKey, orgInitials } from "../utils";
import { useHoverStyle } from "../useHoverStyle";
import { SearchIcon } from "./Icons";
import type { Organization } from "../types";

interface Props {
  onOpenProfile: (id: number) => void;
}

/** Organization directory: search + A→Z / Z→A sort over a list of org rows. */
export function DirectoryView({ onOpenProfile }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"az" | "za">("az");

  const q = query.trim().toLowerCase();
  const visible = SEED_ORGS
    .filter((o) => !q || o.name.toLowerCase().includes(q) || o.blurb.toLowerCase().includes(q))
    .sort((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  return (
    <>
      <div style={{ marginBottom: 22 }}>
        <h1 style={S.h1}>Organization directory</h1>
        <p style={S.lede}>The non-profits and community groups sharing space at the Rideau Community Hub.</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.color.muted, pointerEvents: "none" }}>
            <SearchIcon />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search organizations…"
            style={{ ...S.input, padding: "8px 11px 8px 32px" }}
          />
        </div>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: T.color.body, textTransform: "uppercase" }}>
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "az" | "za")}
            style={{ ...S.input, width: "auto", padding: "8px 11px", cursor: "pointer" }}
          >
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
        </label>
      </div>

      {!visible.length && (
        <div style={{ background: T.color.surfaceAlt, border: `1px solid ${T.color.line}`, borderRadius: T.radius.md, padding: 36, textAlign: "center", color: T.color.muted, fontSize: 12 }}>
          No organizations match your search.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {visible.map((o) => (
          <OrgRow key={o.id} org={o} onOpenProfile={onOpenProfile} />
        ))}
      </div>
    </>
  );
}

function OrgRow({ org, onOpenProfile }: { org: Organization; onOpenProfile: (id: number) => void }) {
  const hover = useHoverStyle({ borderColor: "#9A9A9A" });
  const pal = PALETTE[orgColorKey(SEED_ORGS.findIndex((o) => o.id === org.id))];

  return (
    <div
      {...hover.bind}
      onClick={() => onOpenProfile(org.id)}
      style={{ ...S.card, cursor: "pointer", display: "flex", gap: 16, padding: "18px 20px", alignItems: "flex-start", ...hover.style }}
    >
      <span style={{ width: 3, alignSelf: "stretch", flexShrink: 0, background: `linear-gradient(180deg,${pal.c1},${pal.c2})` }} />
      {/* Logo plate: org initials until a real logo is supplied. */}
      <div
        style={{
          width: 60,
          height: 60,
          flexShrink: 0,
          borderRadius: T.radius.md,
          background: `linear-gradient(180deg,${pal.tint},${T.color.surfaceAlt})`,
          borderTop: `3px solid ${pal.c1}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: pal.c1,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: T.font,
        }}
      >
        {orgInitials(org.name)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.color.ink, margin: "0 0 6px", lineHeight: 1.25 }}>{org.name}</h3>
        <p style={{ fontSize: 12.5, color: T.color.body, lineHeight: 1.5, margin: 0 }}>{org.blurb}</p>
      </div>
    </div>
  );
}
