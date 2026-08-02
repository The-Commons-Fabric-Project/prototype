// ---------------------------------------------------------------------------
// Icons (grayscale, stroke = currentColor)
// this is S trying to be clever with typescript

import type { ReactElement, SVGProps } from "react";

// ---------------------------------------------------------------------------
const svgBase = { 
  fill: "none", 
  stroke: "currentColor", 
  strokeWidth: 2, 
  strokeLinecap: "round", 
  strokeLinejoin: "round" 
} as Partial<SVGProps<SVGSVGElement>>;

type IconProps = {name?: IconName, size: number}
type IconComponent = (args: IconProps) => ReactElement<SVGProps<any>, any>;

function ClockIcon({ size = 14 }: IconProps) { 
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ); 
}

function PinIcon({ size = 14 }: IconProps) { 
  return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.4" /></svg>); 
}

function CalendarIcon({ size = 14 }: IconProps) { 
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><rect x="3" y="4.5" width="18" height="16.5" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>
  ); 
}

function TicketIcon({ size = 14 }: IconProps) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" /><path d="M13 6v12" /></svg>); }

function UserIcon({ size = 14 }: IconProps) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>); }

function MailIcon({ size = 14 }: IconProps) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>); }

function LinkIcon({ size = 14 }: IconProps) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" /></svg>); }

function SearchIcon({ size = 15 }: IconProps) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.2-3.2" /></svg>); }

const ICON_MAP = {
  clock: ClockIcon,
  pin: PinIcon,
  calendar: CalendarIcon,
  ticket: TicketIcon,
  user: UserIcon,
  mail: MailIcon,
  link: LinkIcon,
  search: SearchIcon,
};

type IconName = keyof typeof ICON_MAP;

export default function Icon({ name, size }: Required<IconProps>) {
  return ICON_MAP[name]({ size });
}