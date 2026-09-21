import type { components } from "../../api/openapi.gen";

/** A timestamp as the API writes it, offset included: "2026-06-16T10:00:00-04:00". */
export type DBTimestamp = components["schemas"]["Timestamp"];

/** A calendar day in "YYYY-MM-DD" format */
export type DateKey = string;

export type Timespan = {
    start: DateKey;
    end: DateKey
};

export const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] as const;
