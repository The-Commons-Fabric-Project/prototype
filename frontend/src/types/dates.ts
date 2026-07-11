// TODO: convert these to types

export type Month = {
  num: number,
  abbv: string,
  full: string,
  days?: number,
}

const MONTHS_DATA = {
  num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  abbv: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  full: ["January","February","March","April","May","June","July","August","September","October","November","December"],
}

export const MONTHS = MONTHS_DATA.abbv;
export const MONTHS_FULL = MONTHS_DATA.full;

export const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] as const;

// export type MonthStringAbbv = typeof MONTHS_DATA["abbv"][number];
// export type MonthStringFull = typeof MONTHS_DATA.full[number];

// let x = Array.from(MONTHS.keys()).map((m) => {
//   return {
//     num: m+1,
//     abbv: MONTHS[m] as MonthStringAbbv,
//     full: MONTHS_FULL[m] as MonthStringFull
//   }
// })