/**
 * News stories shown in the reader. Only facts already on the site: the rebrand, the tryout process and format, the second
 * team, and that no tournament is running. Dates are the ones printed on the cards.
 */
export type Story = {
  id: string;
  tag: string;
  date: string;
  read: string;
  title: string;
  body: string[];
  /** optional call to action at the end of the story */
  cta?: { label: string; href: string };
};

export const STORIES: Record<string, Story> = {
  rebrand: {
    id: "rebrand",
    tag: "ORGANIZATION",
    date: "NOV 04",
    read: "4 MIN",
    title: "Aeronova Esport is now COUR E-PRO",
    body: [
      "Aeronova Esport has a new name. We are COUR E-PRO: a Philippines-based Mobile Legends: Bang Bang team, established in January 2026 and competing only on the PH server.",
      "The name changes, the team stays. Our direction is the same two lines that guide every draft, scrim and review: Beyond the horizon, and beyond ourselves. We look past the next match, and teamwork comes before individual glory.",
      "Right now we run COUR UNO, our active squad, and we are building COUR DOS, a second squad that is still finding its players. Tryouts are open for all five lanes.",
    ],
    cta: { label: "SEE THE TEAMS", href: "/teams" },
  },
  "tryouts-open": {
    id: "tryouts-open",
    tag: "ANNOUNCEMENT",
    date: "NOV 03",
    read: "2 MIN",
    title: "Tryouts are now open for all five lanes",
    body: [
      "Tryouts are open for Gold, EXP, Mid, Jungle and Roam. Every lane has slots on both squads: 4 per lane on COUR UNO and 5 per lane on COUR DOS.",
      "So many players joined our tryout server that matches are now played 5v5 instead of the planned ranked games. We are grateful for the interest from everyone who wanted to try out.",
      "COUR DOS exists to give more players with potential a chance. The schedule and further details will be announced soon, so join our Discord to hear first.",
    ],
    cta: { label: "SEE THE TRYOUT PROCESS", href: "/tryouts" },
  },
  process: {
    id: "process",
    tag: "GUIDE",
    date: "NOV 02",
    read: "3 MIN",
    title: "How the tryout process works, step by step",
    body: [
      "The process has three phases, built on what we learned from our previous tryouts, so that selection stays fair and the roster fits in both skill and character.",
      "Phase 1, Gameplay: we evaluate your gameplay and your individual performance. Phase 2, Observation: a one-week observation period to assess your attitude, communication and activeness within the team.",
      "Phase 3, Final review: the final evaluation to determine whether you are a good fit for the team. To start, join the Discord and send your IGN and your main role.",
    ],
    cta: { label: "OPEN THE TRYOUT PAGE", href: "/tryouts" },
  },
  events: {
    id: "events",
    tag: "EVENTS",
    date: "TBA",
    read: "1 MIN",
    title: "Tournaments and events: to be announced",
    body: [
      "There is no tournament happening at the moment. Nothing is scheduled yet, so every date, format and registration detail on the site is marked TBA.",
      "When an event is announced, the news page and our Discord will be the first places to carry it, including how squads can register.",
    ],
    cta: { label: "SEE TOURNAMENTS", href: "/tournaments" },
  },
};
