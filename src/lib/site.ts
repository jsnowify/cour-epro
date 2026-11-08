import { DISCORD_URL, PORTFOLIO_URL } from "@/lib/links";

/**
 * One source of truth for what the site says about itself: metadata, structured data (JSON-LD), sitemap and llms.txt all
 * read from here, so search engines, answer engines and AI assistants get the same facts everywhere. Only facts that are
 * already on the site.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://cour-epro.vercel.app").replace(/\/$/, "");

export const TEAM = {
  name: "COUR E-PRO",
  formerly: "Aeronova Esport",
  game: "Mobile Legends: Bang Bang",
  region: "Philippines",
  country: "PH",
  server: "PH server",
  founded: "2026-01",
  founder: "Snowi",
  motto: "Beyond the horizon. Beyond ourselves.",
  squads: { active: "COUR UNO", forming: "COUR DOS" },
  discord: DISCORD_URL,
  founderSite: PORTFOLIO_URL,
};

/** One-paragraph answer used for the meta description and for AI summaries. */
export const SUMMARY =
  "COUR E-PRO (formerly Aeronova Esport) is a Philippines-based Mobile Legends: Bang Bang esports team founded by Snowi in January 2026, competing on the PH server. Tryouts are open for all five lanes.";

export const abs = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

export const PAGES = [
  { path: "/", title: "COUR E-PRO | Mobile Legends esports team, Philippines", description: SUMMARY, priority: 1 },
  {
    path: "/tryouts",
    title: "Tryouts: how to join COUR E-PRO",
    description:
      "COUR E-PRO tryouts are open for all five Mobile Legends lanes on the PH server. Three phases (gameplay, one-week observation, final review), played 5v5. Apply on Discord.",
    priority: 0.9,
  },
  {
    path: "/teams",
    title: "Teams: COUR UNO and COUR DOS",
    description: "COUR UNO is our active Mobile Legends squad. COUR DOS is forming and recruiting. See the roster, the lanes and how to join.",
    priority: 0.8,
  },
  {
    path: "/players",
    title: "Players: the COUR UNO roster",
    description: "Meet the COUR UNO players by IGN and lane: Gold, EXP, Mid, Jungle and Roam, plus the open slots on COUR DOS.",
    priority: 0.7,
  },
  {
    path: "/tournaments",
    title: "Tournaments: no event right now",
    description: "There is no COUR E-PRO tournament at the moment. Dates, format and registration will be announced on our Discord.",
    priority: 0.6,
  },
  {
    path: "/news",
    title: "News: tryouts, guides and announcements",
    description: "Announcements from COUR E-PRO: the rebrand from Aeronova Esport, tryout updates, guides and events.",
    priority: 0.6,
  },
  {
    path: "/about",
    title: "About COUR E-PRO and its founder Snowi",
    description:
      "COUR E-PRO, formerly Aeronova Esport, is a Philippines-based Mobile Legends team founded by Snowi in January 2026. Our motto: beyond the horizon, beyond ourselves.",
    priority: 0.7,
  },
] as const;

export const pageMeta = (path: (typeof PAGES)[number]["path"]) => {
  const p = PAGES.find((x) => x.path === path)!;
  return {
    title: { absolute: p.title }, // each title already carries the brand, so no template suffix
    description: p.description,
    alternates: { canonical: abs(p.path) },
    // a page-level openGraph replaces the layout's, so it carries everything itself (image, site name, locale)
    openGraph: {
      title: p.title,
      description: p.description,
      url: abs(p.path),
      type: "website" as const,
      siteName: TEAM.name,
      locale: "en_PH",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "COUR E-PRO, Mobile Legends esports team, Philippines" }],
    },
    twitter: { card: "summary_large_image" as const, title: p.title, description: p.description, images: [`${SITE_URL}/opengraph-image`] },
  };
};

/** WebPage + BreadcrumbList for a route (the home page has no breadcrumb trail). */
export function pageLd(path: (typeof PAGES)[number]["path"]) {
  const p = PAGES.find((x) => x.path === path)!;
  const graph: object[] = [
    {
      "@type": "WebPage",
      "@id": `${abs(p.path)}#webpage`,
      url: abs(p.path),
      name: p.title,
      description: p.description,
      inLanguage: "en-PH",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#team` },
    },
  ];
  if (p.path !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${abs(p.path)}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: p.title, item: abs(p.path) },
      ],
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/** Site-wide entities: the team (also a SportsTeam), the website and its founder. Referenced by @id from every page. */
export const siteLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "SportsTeam"],
      "@id": `${SITE_URL}/#team`,
      name: TEAM.name,
      alternateName: [TEAM.formerly, "COUR"],
      url: SITE_URL,
      logo: `${SITE_URL}/assets/press/cour-e-pro-logo.svg`,
      image: `${SITE_URL}/opengraph-image`,
      description: SUMMARY,
      slogan: TEAM.motto,
      foundingDate: TEAM.founded,
      founder: { "@id": `${SITE_URL}/about#snowi` },
      sport: TEAM.game,
      areaServed: { "@type": "Country", name: TEAM.region },
      location: { "@type": "Country", name: TEAM.region },
      sameAs: [TEAM.discord, TEAM.founderSite],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: TEAM.name,
      description: SUMMARY,
      inLanguage: "en-PH",
      publisher: { "@id": `${SITE_URL}/#team` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/about#snowi`,
      name: "Snowi",
      jobTitle: `Founder of ${TEAM.name}`,
      description: `Snowi founded ${TEAM.name} (formerly ${TEAM.formerly}) in January 2026 and designed and built this website.`,
      url: TEAM.founderSite,
      image: `${SITE_URL}/assets/snowi.svg`,
      sameAs: [TEAM.founderSite],
      worksFor: { "@id": `${SITE_URL}/#team` },
    },
  ],
};
