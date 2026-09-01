import type { SVGProps } from "react";

/** 2px stroke, round caps, currentColor. 12–14px in use. */
const base = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export const ClockIcon = ({ size = 12 }: { size?: number }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const PinIcon = ({ size = 12 }: { size?: number }) => (
  <svg {...base(size)}>
    <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

export const CalendarIcon = ({ size = 14 }: { size?: number }) => (
  <svg {...base(size)}>
    <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
    <path d="M3 9h18M8 2.5v4M16 2.5v4" />
  </svg>
);

export const TicketIcon = ({ size = 14 }: { size?: number }) => (
  <svg {...base(size)}>
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
    <path d="M13 6v12" />
  </svg>
);

export const PersonIcon = ({ size = 14 }: { size?: number }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </svg>
);

export const RepeatIcon = ({ size = 14 }: { size?: number }) => (
  <svg {...base(size)}>
    <path d="M4 12a8 8 0 0 1 13.7-5.6L21 9" />
    <path d="M21 4v5h-5" />
    <path d="M20 12a8 8 0 0 1-13.7 5.6L3 15" />
    <path d="M3 20v-5h5" />
  </svg>
);

export const SearchIcon = ({ size = 13 }: { size?: number }) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.2-3.2" />
  </svg>
);

export const MailIcon = ({ size = 13 }: { size?: number }) => (
  <svg {...base(size)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);

export const LinkIcon = ({ size = 13 }: { size?: number }) => (
  <svg {...base(size)}>
    <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
    <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
  </svg>
);
