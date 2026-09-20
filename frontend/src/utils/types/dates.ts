/**
 * types that help interface with the API/backend stored timestamps
 * 
 * OPEN API SPEC: "YYYY-MM-DD HH:MM:SS"
 */

import type { components } from "../../api/openapi.gen";

export type DBTimestamp = components["schemas"]["Timestamp"];
export type ParsedTimestamp = Date;

export type Timespan = { start: DBTimestamp; end: DBTimestamp };

const MONTHS_DATA = {
  num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  abbv: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  full: ["January","February","March","April","May","June","July","August","September","October","November","December"],
}

export const MONTHS = MONTHS_DATA.abbv;
export const MONTHS_FULL = MONTHS_DATA.full;

export const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] as const;

export const DOW_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] as const;
