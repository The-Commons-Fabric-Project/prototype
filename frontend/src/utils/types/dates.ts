/**
 * types that help interface with the API/backend stored timestamps
 * 
 * OPEN API SPEC: "YYYY-MM-DD HH:MM:SS"
 */

import type { components } from "../../api/openapi.gen";

export type DBTimestamp = components["schemas"]["Timestamp"];

export type Timespan = { 
    start: DBTimestamp; 
    end: DBTimestamp 
};

export const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] as const;

