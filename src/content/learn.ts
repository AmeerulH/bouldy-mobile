// Authored copy for the Learn area. Plain data so wording can be reviewed in one place.
// Copy rules: no em dashes, describe only what Bouldy does today.

export type Level = "beginner" | "experienced";

export type TourStep = {
  id: string;
  label: string;
  title: string;
  body: string;
  /** Screen the step describes. Omitted for steps that are only explanation. */
  href?: string;
  hrefLabel?: string;
};

export const tourSteps: TourStep[] = [
  {
    id: "welcome",
    label: "Welcome",
    title: "Your climbing logbook.",
    body: "Bouldy is a private journal for bouldering. Log a visit, record each route you try, and see your progress build across visits. This tour takes about two minutes.",
  },
  {
    id: "home",
    label: "Home",
    title: "Home shows your month.",
    body: "Visits, finishes and climbing time for this month sit at the top, then your last visit. The red button at the bottom starts a session, or resumes the one you have open.",
    href: "/",
    hrefLabel: "Open Home",
  },
  {
    id: "sessions",
    label: "Sessions",
    title: "Sessions are your journal.",
    body: "Every visit to a gym is a session. The Sessions tab lists them by month, shows any session in progress, and lets you record a past visit you forgot to log.",
    href: "/sessions",
    hrefLabel: "Open Sessions",
  },
  {
    id: "start",
    label: "Start a visit",
    title: "Pick a gym and begin.",
    body: "Choose the gym you are climbing at. Bouldy keeps one active session at a time, so you can leave the app between tries and come straight back to it.",
    href: "/sessions/new",
    hrefLabel: "Start a session",
  },
  {
    id: "log",
    label: "Log a route",
    title: "Log each route in one tap.",
    body: "Find a route with search or the grade chips. Tap +1 for every try. Tap Sent when you top it, or Flash if you did it first go. A flash only counts when your history for that route is complete.",
  },
  {
    id: "notes",
    label: "Notes",
    title: "Private notes, per route.",
    body: "Open a route to add a note: beta that worked, a hold to avoid, how it felt. Notes are only visible to you. You can edit them even after a session is finished.",
  },
  {
    id: "correct",
    label: "Corrections",
    title: "Fix a mistake, keep the truth.",
    body: "Logged the wrong count or result? Open the route and use Correct. A correction fixes the log. It does not add a try you did not climb.",
  },
  {
    id: "finish",
    label: "Finish",
    title: "Finish when you leave the wall.",
    body: "Tap Finish, choose how long you climbed, and your session is saved. Finished sessions lock their attempts, so your history stays trustworthy. Notes stay editable.",
  },
  {
    id: "progress",
    label: "Progress",
    title: "See routes across visits.",
    body: "Your climbs lists every route you have logged, with total tries across visits. If a route was reset with a new ID, it keeps a separate history. Where history is missing, Bouldy says so instead of guessing.",
    href: "/climbs",
    hrefLabel: "Open your climbs",
  },
  {
    id: "explore",
    label: "Explore",
    title: "Community is coming.",
    body: "Explore will hold shared sessions, challenges and groups. None of it is live yet, and your journal stays private until sharing exists and you choose it.",
    href: "/explore",
    hrefLabel: "Open Explore",
  },
  {
    id: "goals",
    label: "Goals",
    title: "Start with a small goal.",
    body: "The Learn area lists goals like logging your first session or your first send. Bouldy checks them against your real journal, so they only tick when you have actually done them.",
    href: "/learn/goals",
    hrefLabel: "See your goals",
  },
];

export type LessonSection = { heading: string; body: string[] };
export type Lesson = {
  id: string;
  title: string;
  summary: string;
  level: Level | "all";
  minutes: number;
  sections: LessonSection[];
};

export const lessons: Lesson[] = [
  {
    id: "what-is-bouldering",
    title: "What bouldering is",
    summary: "Short, powerful problems without ropes.",
    level: "beginner",
    minutes: 2,
    sections: [
      {
        heading: "Problems, not pitches",
        body: [
          "Bouldering is climbing short walls, usually up to about four metres, without a rope. Thick mats cover the floor to cushion falls.",
          "Each route is called a problem. It has a start, a finish and a set of holds you are allowed to use, usually marked by one colour.",
        ],
      },
      {
        heading: "How a problem works",
        body: [
          "Start with both hands on the start holds. Climb using only the marked holds. Finish by controlling the finish hold with both hands, or by topping out if the problem asks for it.",
          "Falling is part of it. Most problems take several tries, and that is what Bouldy counts.",
        ],
      },
    ],
  },
  {
    id: "gym-safety",
    title: "Gym safety and etiquette",
    summary: "Keep yourself and others safe on the mats.",
    level: "beginner",
    minutes: 3,
    sections: [
      {
        heading: "Mats and space",
        body: [
          "Never stand or sit under someone climbing. Keep bags and water off the mats where people land.",
          "Wait until the area below a problem is clear before you start, and look up before you walk across the floor.",
        ],
      },
      {
        heading: "Falling and downclimbing",
        body: [
          "Fall away from the wall with bent knees and land on both feet, then roll back. Do not put an arm out to catch yourself.",
          "If you are comfortable, downclimb instead of jumping from high up. Check the area below before you jump.",
        ],
      },
      {
        heading: "Taking turns",
        body: [
          "Rest between tries so others can climb. Do not hog a problem, and tell people if you plan to try something for a long time.",
        ],
      },
    ],
  },
  {
    id: "grades",
    title: "Understanding grades",
    summary: "V-scale and Font, and what the numbers mean.",
    level: "beginner",
    minutes: 3,
    sections: [
      {
        heading: "Two common scales",
        body: [
          "The V-scale starts at VB or V0 and goes up. Higher numbers are harder. Font grades, like 6A or 7B, are used across much of Europe.",
          "Gyms may use their own scale. Bouldy shows the grade the gym gave the route.",
        ],
      },
      {
        heading: "Grades are opinions",
        body: [
          "A grade is a guide, not a promise. Reach, strength, style and the setter all change how hard a problem feels.",
          "Compare yourself with you. Your journal shows your own progress across visits.",
        ],
      },
    ],
  },
  {
    id: "reading-routes",
    title: "Reading a route",
    summary: "Holds, colours and planning your moves.",
    level: "beginner",
    minutes: 3,
    sections: [
      {
        heading: "Follow the colour",
        body: [
          "Most gyms mark a problem with one hold colour, and some add tape or a number on the start holds. Check the gym's rules for which holds are allowed.",
        ],
      },
      {
        heading: "Look before you pull on",
        body: [
          "Spend a minute on the floor. Find the start, the finish and the hardest looking move. Think about which hand goes where.",
          "Try the moves in sections. You do not need to climb the whole problem to learn it.",
        ],
      },
    ],
  },
  {
    id: "first-technique",
    title: "Technique before strength",
    summary: "Footwork and body position matter most early on.",
    level: "beginner",
    minutes: 3,
    sections: [
      {
        heading: "Use your feet",
        body: [
          "Put your toes on footholds precisely and push with your legs. Your arms tire quickly, your legs do not.",
        ],
      },
      {
        heading: "Straight arms, hips close",
        body: [
          "Hang on straight arms where you can and keep your hips close to the wall. Rest in positions where the holds carry your weight.",
          "Breathe. Many falls come from holding your breath on a hard move.",
        ],
      },
    ],
  },
  {
    id: "how-bouldy-counts",
    title: "How Bouldy counts your climbing",
    summary: "Tries, finishes and flashes, defined.",
    level: "experienced",
    minutes: 3,
    sections: [
      {
        heading: "Tries and results",
        body: [
          "Each route in a session has a try count and one result: project (still working it), zone, send, or flash.",
          "A send is a finish. A flash is a send on your first ever try. Both count as finishes on Home.",
        ],
      },
      {
        heading: "Prior visits stay separate",
        body: [
          "Tries from earlier visits are shown apart from today's. A route's total is today plus every prior visit, and only shows when the history is complete.",
          "If history cannot be read or a route is logged twice in one session, Bouldy shows that it is unsure instead of counting zero.",
        ],
      },
    ],
  },
  {
    id: "resets-and-history",
    title: "Resets, retired routes and history",
    summary: "What happens to your logs when the wall changes.",
    level: "experienced",
    minutes: 2,
    sections: [
      {
        heading: "Retired routes",
        body: [
          "When a gym strips a problem, it is retired. You can still read its history, but it no longer appears in the active list.",
        ],
      },
      {
        heading: "Reset routes",
        body: [
          "A reset problem gets a new route entry, so its history is separate from the old one. Your totals on the new problem start at zero.",
        ],
      },
    ],
  },
  {
    id: "fast-logging",
    title: "Logging fast between tries",
    summary: "Keep the journal out of the way of your climbing.",
    level: "experienced",
    minutes: 2,
    sections: [
      {
        heading: "One tap per try",
        body: [
          "Use +1 right after a fall and Sent or Flash right after a top. Search and the grade chips find a route quickly.",
        ],
      },
      {
        heading: "Notes can wait",
        body: [
          "Add the private note while you rest. You can edit notes after you finish, so there is no need to write them mid-problem.",
        ],
      },
    ],
  },
  {
    id: "reading-progress",
    title: "Reading your progress honestly",
    summary: "What the numbers on Home and Your climbs mean.",
    level: "all",
    minutes: 2,
    sections: [
      {
        heading: "What is counted",
        body: [
          "Home shows completed visits, finishes and climbing time for the current month. Active sessions are not counted until finished.",
        ],
      },
      {
        heading: "When a number shows a dash",
        body: [
          "A dash means Bouldy could not confirm the value, for example because some history failed to load. It is not zero. Refresh and try again.",
        ],
      },
    ],
  },
];

export type GlossaryCategory =
  | "Holds"
  | "Moves"
  | "Grades and results"
  | "Gym and safety"
  | "Bouldy";

export const glossaryCategories: GlossaryCategory[] = [
  "Holds",
  "Moves",
  "Grades and results",
  "Gym and safety",
  "Bouldy",
];

export type GlossaryTerm = {
  id: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
};

export const glossary: GlossaryTerm[] = [
  { id: "attempt", term: "Attempt", category: "Grades and results", definition: "One try at a problem, from the start holds until you fall, step off or finish." },
  { id: "beta", term: "Beta", category: "Moves", definition: "Information about how to climb a problem: which holds to use and in what order." },
  { id: "crash-pad", term: "Crash pad", category: "Gym and safety", definition: "A thick foam mat that cushions falls. Gyms cover the floor with them." },
  { id: "crimp", term: "Crimp", category: "Holds", definition: "A small, thin edge held with the fingertips." },
  { id: "crux", term: "Crux", category: "Moves", definition: "The hardest move or section of a problem." },
  { id: "downclimb", term: "Downclimb", category: "Gym and safety", definition: "Climbing back down instead of jumping, usually the safer way off a high problem." },
  { id: "drop-knee", term: "Drop knee", category: "Moves", definition: "Twisting your hips and turning one knee down so you can reach further with less effort." },
  { id: "dyno", term: "Dyno", category: "Moves", definition: "A dynamic jump to a hold where you let go of all holds for a moment." },
  { id: "flash", term: "Flash", category: "Grades and results", definition: "Finishing a problem on your first ever try. In Bouldy it counts only when your history for the route is complete." },
  { id: "font-grade", term: "Font grade", category: "Grades and results", definition: "A bouldering grade scale such as 6A or 7B, named after Fontainebleau and common in Europe." },
  { id: "heel-hook", term: "Heel hook", category: "Moves", definition: "Hooking your heel over a hold and pulling with your leg to take weight off your arms." },
  { id: "jug", term: "Jug", category: "Holds", definition: "A large, easy-to-hold hold, good for resting." },
  { id: "match", term: "Match", category: "Moves", definition: "Putting both hands on the same hold." },
  { id: "mantle", term: "Mantle", category: "Moves", definition: "Pressing down on a hold to lift yourself above it, like climbing out of a pool." },
  { id: "pinch", term: "Pinch", category: "Holds", definition: "A hold you squeeze between your thumb and fingers." },
  { id: "pocket", term: "Pocket", category: "Holds", definition: "A hole in the wall or hold that fits one to three fingers." },
  { id: "problem", term: "Problem", category: "Grades and results", definition: "A single bouldering route, with a start, a finish and a set of allowed holds." },
  { id: "project", term: "Project", category: "Grades and results", definition: "A problem you are still working on. Bouldy shows it as In progress." },
  { id: "send", term: "Send", category: "Grades and results", definition: "Finishing a problem. A flash is a send on the first try." },
  { id: "set-reset", term: "Set and reset", category: "Gym and safety", definition: "Setters create new problems (set) and strip old ones (reset), so walls change over time." },
  { id: "sloper", term: "Sloper", category: "Holds", definition: "A rounded hold with no edge, held by friction and body position." },
  { id: "spotting", term: "Spotting", category: "Gym and safety", definition: "Standing below a climber to guide their fall toward the mat. It does not mean catching them." },
  { id: "toe-hook", term: "Toe hook", category: "Moves", definition: "Hooking the top of your foot over a hold to keep balance or pull in." },
  { id: "top-out", term: "Top out", category: "Moves", definition: "Climbing over the top of the wall so you finish standing on it." },
  { id: "v-grade", term: "V-grade", category: "Grades and results", definition: "The V-scale, from VB or V0 upward. A higher number means a harder problem." },
  { id: "volume", term: "Volume", category: "Holds", definition: "A large shape bolted to the wall that holds can be attached to, or that you climb on." },
  { id: "zone", term: "Zone", category: "Grades and results", definition: "A marked intermediate hold. Reaching it can count in some gyms and competitions." },
  { id: "visit", term: "Visit", category: "Bouldy", definition: "One trip to a gym. In Bouldy a visit is a session." },
  { id: "session", term: "Session", category: "Bouldy", definition: "A saved record of one gym visit with its date, duration and every route you logged." },
  { id: "retired-route", term: "Retired route", category: "Bouldy", definition: "A route the gym has removed. Its history stays readable but it is not in the active list." },
  { id: "correction", term: "Correction", category: "Bouldy", definition: "A change to a logged count or result. It fixes the record without adding a physical try." },
];
