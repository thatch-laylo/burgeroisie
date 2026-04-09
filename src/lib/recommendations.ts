export interface BurgerRec {
  name: string;
  neighborhood: string;
  vibe: string;
  source: string;
  tags: string[];
}

// Curated from Infatuation, Bloomberg, Eater, TimeOut — April 2026
export const BURGER_RECS: BurgerRec[] = [
  // Buzzy / New (2025-2026)
  {
    name: "Deux Luxe",
    neighborhood: "SoHo",
    vibe: "City's top new burger 2025 — Wagyu patty, char on the edges, mom's recipe",
    source: "Bloomberg",
    tags: ["buzzy", "wagyu"],
  },
  {
    name: "Wild Cherry",
    neighborhood: "Manhattan",
    vibe: "House blend + choron sauce from the creators of Minetta's Black Label Burger",
    source: "Bloomberg",
    tags: ["buzzy", "fine-dining"],
  },
  {
    name: "Keens Steakhouse",
    neighborhood: "Midtown",
    vibe: "Thick steak-trimming patty with beefy funk — ask for the pub menu burger anywhere you sit",
    source: "Infatuation",
    tags: ["legendary", "fine-dining"],
  },
  {
    name: "Diner",
    neighborhood: "Williamsburg",
    vibe: "Thick but not-too-thick patty, sharp cheese, soft bun — Williamsburg institution since 1998",
    source: "Infatuation",
    tags: ["classic", "buzzy"],
  },
  {
    name: "Liar Liar",
    neighborhood: "Gowanus",
    vibe: "$18 dry-aged bar burger with herb aioli, grilled onions, pickles — wine bar sleeper",
    source: "Crain's",
    tags: ["buzzy", "hidden-gem"],
  },
  {
    name: "Cafe O'Te",
    neighborhood: "Greenpoint",
    vibe: "Bunless Wagyu hamburg steak inside 50 Norman Japanese complex",
    source: "Bloomberg",
    tags: ["buzzy", "wagyu", "unique"],
  },
  {
    name: "Crane Club",
    neighborhood: "Manhattan",
    vibe: "Exclusive bar-only dry-aged burger — if you know, you know",
    source: "Bloomberg",
    tags: ["buzzy", "exclusive"],
  },
  {
    name: "Sip & Guzzle",
    neighborhood: "Manhattan",
    vibe: "A5 Wagyu tavern burger — rich and stupid good",
    source: "Bloomberg",
    tags: ["buzzy", "wagyu"],
  },
  {
    name: "Mommy Pai's",
    neighborhood: "Manhattan",
    vibe: "Thai-influenced burger from Thai Diner crew — Mommy Royale cheeseburger",
    source: "Bloomberg",
    tags: ["buzzy", "unique"],
  },
  // Legendary / Classic
  {
    name: "Minetta Tavern",
    neighborhood: "Greenwich Village",
    vibe: "$38 Black Label — dry-aged ribeye, caramelized onions, Balthazar bun",
    source: "Infatuation",
    tags: ["legendary", "fine-dining"],
  },
  {
    name: "Raoul's",
    neighborhood: "SoHo",
    vibe: "Peppercorn-crusted, St. Andre cheese, cornichons — intensely buttery",
    source: "Infatuation",
    tags: ["legendary", "fine-dining"],
  },
  {
    name: "Nowon",
    neighborhood: "East Village",
    vibe: "Legendary Cheeseburger — kimchi, american cheese, special sauce, sesame bun",
    source: "Infatuation",
    tags: ["legendary", "unique"],
  },
  {
    name: "Burger Joint",
    neighborhood: "Midtown",
    vibe: "Hidden behind a velvet curtain in a hotel lobby — speakeasy burger",
    source: "Various",
    tags: ["legendary", "hidden-gem"],
  },
  {
    name: "Superiority Burger",
    neighborhood: "East Village",
    vibe: "The veggie burger that converts meat eaters — cult following",
    source: "Infatuation",
    tags: ["legendary", "unique"],
  },
  {
    name: "J.G. Melon",
    neighborhood: "Upper East Side",
    vibe: "Old-school NYC classic — no frills, perfect execution",
    source: "Infatuation",
    tags: ["legendary", "classic"],
  },
  {
    name: "Brooklyn Wine Bar",
    neighborhood: "Crown Heights",
    vibe: "$32 dry-aged burger — wood-paneled tavern, restrained toppings, complex beef flavor",
    source: "Various",
    tags: ["hidden-gem", "fine-dining"],
  },
  {
    name: "Harlem Shake",
    neighborhood: "Harlem",
    vibe: "Neighborhood institution — great shakes too",
    source: "Various",
    tags: ["classic", "value"],
  },
  {
    name: "Jack and Charlie's",
    neighborhood: "Manhattan",
    vibe: "8oz prime beef, aged cheddar, thick-cut bacon — underrated sleeper",
    source: "Various",
    tags: ["hidden-gem", "classic"],
  },
  {
    name: "Bronx Beer Hall",
    neighborhood: "The Bronx",
    vibe: "BBQ Bacon burger + local craft brews — off the beaten path",
    source: "Various",
    tags: ["hidden-gem", "value"],
  },
];
