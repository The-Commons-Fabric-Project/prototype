/** Main color families */
export type ColorVariantKey = "green" | "blue" | "purple" | "red" | "orange" | "yellow";

export const COLOR_ORDER: ColorVariantKey[] = ["green", "blue", "purple", "red", "orange", "yellow"];
export const NUMCOLORS: number = COLOR_ORDER.length;

export type CFColorVariable = `--color-cf-${ColorVariantKey}`;

/** Palette for various components of a color variant */
export interface ColorVariantPalette {
  /** Primary rail / border color */
  c1: string;
  /** Secondary gradient stop */
  c2: string;
  /** Pale surface tint (logo plate, timeblock fill) */
  tint: string;
  /** AA-safe text color on neutral surfaces */
  text: string;
  /** Four-stop ramp for modal top bars */
  stops: [string, string, string, string];
}

export const PALETTE: Record<ColorVariantKey, ColorVariantPalette> = {
  green:  { 
    c1:"#10C662", 
    c2:"#90DF97", 
    tint:"#EAF6EC", 
    text:"#0D9E52", 
    stops:["#10C662",
      "#3ACE73",
      "#64D685",
      "#90DF97"] },
  blue:   { 
    c1:"#4C6DC5", 
    c2:"#94BFFE", 
    tint:"#EAF0FB", 
    text:"#4C6DC5", 
    stops:["#4C6DC5",
      "#6488D8",
      "#7CA3EB",
      "#94BFFE"] },
  purple: { 
    c1:"#6F49E0", 
    c2:"#C6AEE7", 
    tint:"#F1EBF8", 
    text:"#6F49E0", 
    stops:["#6F49E0",
      "#9570C7",
      "#B297D6",
      "#C6AEE7"] },
  red:    { 
    c1:"#E2526C", 
    c2:"#ED8497", 
    tint:"#FCEDEF", 
    text:"#C63A54", 
    stops:["#E2526C",
      "#E6637A",
      "#E97388",
      "#ED8497"] },
  orange: { 
    c1:"#E67539", 
    c2:"#F39A6B", 
    tint:"#FBEDE4", 
    text:"#C4551F", 
    stops:["#E67539",
      "#EA814A",
      "#EF8D5A",
      "#F39A6B"] },
  yellow: { 
    c1:"#F8E056", 
    c2:"#FFF2A8", 
    tint:"#FDF8E0", 
    text:"#8A6B00", 
    stops:["#F8E056",
      "#FAE671",
      "#FDEC8C",
      "#FFF2A8"] },
};

export function colorKey(idx: number): ColorVariantKey {
  return COLOR_ORDER[idx % COLOR_ORDER.length];
}
/**
 * 
 * @param idx 
 * @returns 
 */
export function paletteForID(id: number): ColorVariantPalette {
  const idx = id % NUMCOLORS;
  return PALETTE[colorKey(idx < 0 ? 0 : idx)];
}

export function linearGradient(dir: string, from: string, to: string): string {
  return `linear-gradient(${dir},${from},${to})`;
}
