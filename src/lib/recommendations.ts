export interface BurgerRec {
  name: string;
  neighborhood: string;
  vibe: string;
  source: string;
  tags: string[];
}

// Curated NYC burger spots within ~30 min train/Uber of Williamsburg
// Sources: Infatuation, Bloomberg, Eater, Resy, BK Mag, TimeOut — April 2026
// Note: NO smash burgers. Only thick patty / classic / dry-aged burgers.
export const BURGER_RECS: BurgerRec[] = [
  // === BROOKLYN ===
  {
    name: "Diner",
    neighborhood: "Williamsburg",
    vibe: "Williamsburg institution since '98 — thick patty, sharp cheese, soft bun",
    source: "Infatuation",
    tags: ["classic", "buzzy"],
  },
  {
    name: "Cafe O'Te",
    neighborhood: "Greenpoint",
    vibe: "Bunless Wagyu hamburg steak inside 50 Norman Japanese complex",
    source: "Bloomberg",
    tags: ["buzzy", "wagyu", "unique"],
  },
  {
    name: "Gator",
    neighborhood: "Greenpoint",
    vibe: "Beef patty with miso tempura mushroom + yuzu aioli — Japanese-leaning",
    source: "BK Mag",
    tags: ["buzzy", "unique"],
  },
  {
    name: "Home Frite",
    neighborhood: "Bed-Stuy",
    vibe: "Award Winning Cheeseburger — caramelized onions, secret sauce, brioche bun",
    source: "BK Mag",
    tags: ["hidden-gem", "classic"],
  },
  {
    name: "Liar Liar",
    neighborhood: "Gowanus",
    vibe: "$18 dry-aged bar burger with herb aioli, grilled onions — wine bar sleeper",
    source: "Crain's",
    tags: ["buzzy", "hidden-gem"],
  },
  {
    name: "The Long Island Bar",
    neighborhood: "Cobble Hill",
    vibe: "Iconic neon-lit bar — L.I. Burger is meaty, thick, messy with cheese & fancy sauce",
    source: "Infatuation",
    tags: ["legendary", "classic"],
  },
  {
    name: "Brooklyn Wine Bar",
    neighborhood: "Crown Heights",
    vibe: "$32 dry-aged burger — wood-paneled tavern, restrained toppings, complex beef",
    source: "Various",
    tags: ["hidden-gem", "fine-dining"],
  },
  {
    name: "Swoony's",
    neighborhood: "Carroll Gardens",
    vibe: "American bistro from Brooklyn-based Chef Salvatore Lamboglia",
    source: "Various",
    tags: ["buzzy", "fine-dining"],
  },

  // === EAST VILLAGE / LES ===
  {
    name: "Nowon",
    neighborhood: "East Village",
    vibe: "Legendary Cheeseburger — kimchi, american cheese, special sauce, sesame bun",
    source: "Infatuation",
    tags: ["legendary", "unique"],
  },
  {
    name: "Superiority Burger",
    neighborhood: "East Village",
    vibe: "The veggie burger that converts meat eaters — cult following",
    source: "Infatuation",
    tags: ["legendary", "unique"],
  },
  {
    name: "Mommy Pai's",
    neighborhood: "Lower East Side",
    vibe: "Thai-influenced burger from Thai Diner crew — Mommy Royale cheeseburger",
    source: "Bloomberg",
    tags: ["buzzy", "unique"],
  },

  // === WEST VILLAGE / GREENWICH VILLAGE ===
  {
    name: "Minetta Tavern",
    neighborhood: "Greenwich Village",
    vibe: "$38 Black Label — dry-aged ribeye, caramelized onions, Balthazar bun",
    source: "Infatuation",
    tags: ["legendary", "fine-dining"],
  },
  {
    name: "4 Charles Prime Rib",
    neighborhood: "West Village",
    vibe: "Upscale chophouse — indulgent prime beef burger with gooey American cheese",
    source: "Infatuation",
    tags: ["legendary", "fine-dining"],
  },
  {
    name: "Wild Cherry",
    neighborhood: "West Village",
    vibe: "House blend + choron sauce from the creators of Minetta's Black Label",
    source: "Bloomberg",
    tags: ["buzzy", "fine-dining"],
  },
  {
    name: "Sip & Guzzle",
    neighborhood: "West Village",
    vibe: "A5 Wagyu tavern burger — rich and stupid good",
    source: "Bloomberg",
    tags: ["buzzy", "wagyu"],
  },
  {
    name: "Jack and Charlie's",
    neighborhood: "West Village",
    vibe: "8oz prime beef, aged cheddar, thick-cut bacon — underrated sleeper",
    source: "Various",
    tags: ["hidden-gem", "classic"],
  },

  // === SOHO / NOLITA / TRIBECA ===
  {
    name: "Deux Luxe",
    neighborhood: "SoHo",
    vibe: "City's top new burger 2025 — Wagyu patty, char on the edges, mom's recipe",
    source: "Bloomberg",
    tags: ["buzzy", "wagyu"],
  },
  {
    name: "Raoul's",
    neighborhood: "SoHo",
    vibe: "Peppercorn-crusted, St. Andre cheese, cornichons — intensely buttery",
    source: "Infatuation",
    tags: ["legendary", "fine-dining"],
  },
  {
    name: "199 Prince",
    neighborhood: "SoHo",
    vibe: "French onion soup burger — caramelized onions, melty Gruyère",
    source: "Carboholic",
    tags: ["buzzy", "unique"],
  },
  {
    name: "Crane Club",
    neighborhood: "Tribeca",
    vibe: "Exclusive bar-only dry-aged burger — if you know, you know",
    source: "Bloomberg",
    tags: ["buzzy", "exclusive"],
  },

  // === MIDTOWN (borderline 30 min) ===
  {
    name: "Keens Steakhouse",
    neighborhood: "Midtown",
    vibe: "Thick steak-trimming patty with beefy funk — ask for the pub menu burger",
    source: "Infatuation",
    tags: ["legendary", "fine-dining"],
  },
  {
    name: "Burger Joint",
    neighborhood: "Midtown",
    vibe: "Hidden behind a velvet curtain in a hotel lobby — speakeasy burger",
    source: "Various",
    tags: ["legendary", "hidden-gem"],
  },
];
