import { DOW, DOW_FULL, durationOf, fmtMinutes, fmtShortMinutes, minutesOf, paletteForOrgName, toIso } from "./utils";
import type { CalendarEvent } from "./types";

export interface TimelineBlock {
  id: number;
  topPx: number;
  heightPx: number;
  /** CSS left/width — lanes split the column in day view, cascade in week view. */
  left: string;
  width: string;
  zIndex: number;
  fill: string;
  railColor: string;
  textColor: string;
  timeText: string;
  timeLetterSpacing: string;
  title: string;
  titleSize: number;
  /** -webkit-line-clamp, derived from the block's height. */
  titleClamp: number;
  showMeta: boolean;
  metaLine: string;
  tooltip: string;
}

export interface TimelineColumn {
  iso: string;
  headLabel: string;
  blocks: TimelineBlock[];
  isEmpty: boolean;
}

export interface Timeline {
  /** Hour gutter rows: label plus absolute offset. */
  hours: { label: string; topPx: number }[];
  columns: TimelineColumn[];
  gridHeightPx: number;
  railWidthPx: number;
  blockPadding: string;
}

const MIN_PX_PER_HOUR = 58;
const TARGET_GRID_PX = 660;

/**
 * Build the day/week timeblock layout.
 *
 * The visible hour range is 08:00–21:00, widened to contain every event in the
 * span. Row height is TARGET_GRID_PX / hours, floored at MIN_PX_PER_HOUR, so a
 * light day fills the frame and a heavy one scrolls.
 *
 * Overlaps are packed into lanes (first lane whose last event has ended). Day
 * view splits the column evenly between lanes; week view is too narrow for
 * that, so lanes cascade by 6px at near-full width, later lanes on top.
 */
export function buildTimeline(dates: Date[], events: CalendarEvent[], isWeek: boolean): Timeline {
  const byIso = new Map<string, CalendarEvent[]>();
  events.forEach((e) => {
    const list = byIso.get(e.date) ?? [];
    list.push(e);
    byIso.set(e.date, list);
  });
  byIso.forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)));

  const inSpan = dates.flatMap((d) => byIso.get(toIso(d)) ?? []);
  let startHour = 8;
  let endHour = 21;
  if (inSpan.length) {
    startHour = Math.min(startHour, Math.floor(Math.min(...inSpan.map((e) => minutesOf(e.time))) / 60));
    endHour = Math.max(endHour, Math.ceil(Math.max(...inSpan.map((e) => minutesOf(e.time) + durationOf(e))) / 60));
  }
  const hourCount = Math.max(1, endHour - startHour);
  const pxPerHour = Math.max(MIN_PX_PER_HOUR, Math.round(TARGET_GRID_PX / hourCount));

  const hours = [];
  for (let h = startHour; h <= endHour; h++) {
    hours.push({
      label: isWeek ? fmtShortMinutes(h * 60) : fmtMinutes(h * 60),
      topPx: (h - startHour) * pxPerHour,
    });
  }

  const columns: TimelineColumn[] = dates.map((dt) => {
    const iso = toIso(dt);
    const list = byIso.get(iso) ?? [];
    const laneEnds: number[] = [];
    const placed = list.map((e) => {
      const start = minutesOf(e.time);
      const end = start + durationOf(e);
      let lane = laneEnds.findIndex((lastEnd) => lastEnd <= start);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(end);
      } else {
        laneEnds[lane] = end;
      }
      return { e, start, end, lane };
    });
    const laneCount = Math.max(1, laneEnds.length);
    const cascade = isWeek && laneCount > 1;

    const blocks: TimelineBlock[] = placed.map((p) => {
      const pal = paletteForOrgName(p.e.org);
      const topPx = ((p.start - startHour * 60) / 60) * pxPerHour;
      const heightPx = Math.max(34, ((p.end - p.start) / 60) * pxPerHour - 4);
      const timeShort = `${fmtShortMinutes(p.start)}–${fmtShortMinutes(p.end)}`;
      const timeLines = isWeek && timeShort.length > 10 ? 2 : 1;
      return {
        id: p.e.id,
        topPx,
        heightPx,
        left: cascade ? `${p.lane * 6 + 2}px` : `calc(${p.lane * (100 / laneCount)}% + 2px)`,
        width: cascade ? `calc(100% - ${p.lane * 6 + 6}px)` : `calc(${100 / laneCount}% - 6px)`,
        zIndex: p.lane + 1,
        fill: `linear-gradient(180deg,${pal.tint},#FAFAFA)`,
        railColor: pal.c1,
        textColor: pal.text,
        timeText: isWeek ? timeShort : `${fmtMinutes(p.start)} – ${fmtMinutes(p.end)}`,
        timeLetterSpacing: isWeek ? "0" : "0.04em",
        title: p.e.title,
        titleSize: isWeek ? 10 : 12.5,
        titleClamp: isWeek
          ? Math.max(1, Math.min(6, Math.floor((heightPx - 12 - 3 - timeLines * 13) / 13)))
          : 4,
        showMeta: !isWeek,
        metaLine: `${p.e.org} · ${p.e.location}`,
        tooltip: `${fmtMinutes(p.start)} – ${fmtMinutes(p.end)} · ${p.e.title} · ${p.e.location}`,
      };
    });

    return {
      iso,
      headLabel: isWeek
        ? `${DOW[dt.getDay()]} ${dt.getDate()}`
        : `${DOW_FULL[dt.getDay()].toUpperCase()} ${dt.getDate()}`,
      blocks,
      isEmpty: blocks.length === 0,
    };
  });

  return {
    hours,
    columns,
    gridHeightPx: hourCount * pxPerHour,
    railWidthPx: isWeek ? 42 : 64,
    blockPadding: isWeek ? "6px 8px" : "7px 9px",
  };
}
