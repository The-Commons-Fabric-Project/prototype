import type { CalendarEvent, HostColorKey, HostPalette, Organization } from "./types";

/**
 * Commons Fabric design-system host colors. Organizations are assigned a color
 * by their index in SEED_ORGS, cycling through HOST_ORDER.
 */
export const PALETTE: Record<HostColorKey, HostPalette> = {
  green:  { c1:"#10C662", c2:"#90DF97", tint:"#EAF6EC", text:"#0D9E52", stops:["#10C662","#3ACE73","#64D685","#90DF97"] },
  blue:   { c1:"#4C6DC5", c2:"#94BFFE", tint:"#EAF0FB", text:"#4C6DC5", stops:["#4C6DC5","#6488D8","#7CA3EB","#94BFFE"] },
  purple: { c1:"#6F49E0", c2:"#C6AEE7", tint:"#F1EBF8", text:"#6F49E0", stops:["#6F49E0","#9570C7","#B297D6","#C6AEE7"] },
  red:    { c1:"#E2526C", c2:"#ED8497", tint:"#FCEDEF", text:"#C63A54", stops:["#E2526C","#E6637A","#E97388","#ED8497"] },
  orange: { c1:"#E67539", c2:"#F39A6B", tint:"#FBEDE4", text:"#C4551F", stops:["#E67539","#EA814A","#EF8D5A","#F39A6B"] },
  yellow: { c1:"#F8E056", c2:"#FFF2A8", tint:"#FDF8E0", text:"#8A6B00", stops:["#F8E056","#FAE671","#FDEC8C","#FFF2A8"] },
};
export const HOST_ORDER: HostColorKey[] = ["green", "blue", "purple", "red", "orange", "yellow"];

export const SEED_ORGS: Organization[] = [
  { id: 1, name: "Rideau-Rockcliffe Community Resource Centre", blurb: "A neighbourhood anchor offering settlement, employment, family, and seniors programming across Ottawa's east end.", contact: "hello@rrcrc.example", website: "rrcrc.example" },
  { id: 2, name: "Council on Aging of Ottawa", blurb: "Advocacy and convening for older adults, championing age-friendly policy and connection across the city.", contact: "info@coaottawa.example", website: "coaottawa.example" },
  { id: 3, name: "Odawa Native Friendship Centre", blurb: "A welcoming gathering place delivering culturally grounded programs and supports for the urban Indigenous community.", contact: "reception@odawa.example", website: "odawa.example" },
  { id: 4, name: "Social Planning Council of Ottawa", blurb: "Research, policy, and community development working toward a more equitable and inclusive Ottawa.", contact: "spc@spcottawa.example", website: "spcottawa.example" },
  { id: 5, name: "STEAMakers Guild", blurb: "Hands-on science, tech, engineering, art, and math workshops for curious makers of every age.", contact: "build@steamakers.example", website: "steamakers.example" },
  { id: 6, name: "Ottawa Civic Tech", blurb: "Volunteers building open, public-interest technology with and for the Ottawa community.", contact: "hi@ottawacivictech.example", website: "ottawacivictech.example" },
];

export const SEED_EVENTS: CalendarEvent[] = [
  { id: 1, title: "Newcomer Welcome Morning", org: "Rideau-Rockcliffe Community Resource Centre", date: "2026-06-16", time: "10:00", location: "RCH Room 1", description: "A relaxed drop-in for newcomers to the neighbourhood. Meet settlement workers, learn what programs are running this summer, and connect with other families over coffee.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "volunteer@rrcrc.example" },
  { id: 2, title: "Age-Friendly Ottawa Town Hall", org: "Council on Aging of Ottawa", date: "2026-06-19", time: "13:30", location: "RCH Main Hall", description: "An open conversation about making Ottawa more age-friendly. Bring your ideas on transit, housing, and connection — your input shapes this year's advocacy priorities.", registrationRequired: true, registrationLink: "https://example.com/townhall-rsvp", volunteersNeeded: false, volunteerContact: "" },
  { id: 3, title: "Odawa Annual Powwow (Day 1)", org: "Odawa Native Friendship Centre", date: "2026-06-20", time: "11:00", location: "RCH Grounds", description: "Day one of our annual powwow — a celebration of culture, dance, and community. Grand entry at noon, followed by drumming, dancing, craft and food vendors. All are welcome.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "events@odawa.example" },
  { id: 8, title: "Community Potluck Lunch", org: "Rideau-Rockcliffe Community Resource Centre", date: "2026-06-20", time: "12:30", location: "RCH Main Hall", description: "Bring a dish to share and meet your neighbours over a relaxed community lunch. Vegetarian and halal options always welcome.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "volunteer@rrcrc.example" },
  { id: 9, title: "Youth Coding Drop-in", org: "Ottawa Civic Tech", date: "2026-06-20", time: "14:00", location: "RCH Room 2", description: "An afternoon drop-in for youth aged 12+ to tinker with code, games, and hardware alongside friendly mentors. No experience required.", registrationRequired: true, registrationLink: "https://example.com/coding-rsvp", volunteersNeeded: false, volunteerContact: "" },
  { id: 10, title: "Evening Craft Circle", org: "STEAMakers Guild", date: "2026-06-20", time: "18:30", location: "RCH Workshop", description: "Wind down the day with a laid-back making session — bring a project or start something new. Materials provided while they last.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "build@steamakers.example" },
  { id: 7, title: "Odawa Annual Powwow (Day 2)", org: "Odawa Native Friendship Centre", date: "2026-06-21", time: "11:00", location: "RCH Grounds", description: "Day two of our annual powwow, closing on National Indigenous Peoples Day. Grand entry at noon, special performances, honour songs, and a community feast to close the weekend.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "events@odawa.example" },
  { id: 4, title: "Poverty & Policy Briefing", org: "Social Planning Council of Ottawa", date: "2026-06-23", time: "12:00", location: "RCH Room 2", description: "A lunchtime briefing on the latest local data around income, housing, and food security, with time for discussion on where research can drive change.", registrationRequired: true, registrationLink: "https://example.com/briefing-rsvp", volunteersNeeded: false, volunteerContact: "" },
  { id: 5, title: "Family Maker Lab: Circuits", org: "STEAMakers Guild", date: "2026-06-26", time: "15:30", location: "RCH Workshop", description: "Hands-on electronics for curious makers aged 8 and up. Build a working circuit you can take home — no experience needed, just bring your curiosity.", registrationRequired: true, registrationLink: "https://example.com/makerlab-rsvp", volunteersNeeded: true, volunteerContact: "build@steamakers.example" },
  { id: 6, title: "Commons Fabric Meetup", org: "Ottawa Civic Tech", date: "2026-06-18", time: "18:00", location: "RCH Room 2", description: "Monthly working session for the Commons Fabric project. Newcomers welcome — we'll walk through the calendar prototype and pick up open tasks together.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "volunteer@ottawacivictech.example" },
];

/**
 * Fallback durations in minutes, keyed by seed event id. Real data should carry
 * endDate/endTime instead — see durationOf() in utils.ts.
 */
export const DURATIONS: Record<number, number> = { 1: 120, 2: 90, 3: 300, 8: 90, 9: 120, 10: 120, 7: 300, 4: 60, 5: 90, 6: 120 };

export const DEFAULT_DURATION_MIN = 90;

export const DEMO_ACCOUNT = { name: "Ottawa Civic Tech", email: "hi@ottawacivictech.example", password: "demo123" };
