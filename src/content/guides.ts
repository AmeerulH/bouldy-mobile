// Interactive guides. Every step is shown on a practice screen filled with sample data,
// so a guide is instant, works offline and can never touch the user's real journal.
// Copy rules: no em dashes, describe only what Bouldy does today.

/** The practice screen a step is shown on. */
export type Scene =
  | "home"
  | "sessions"
  | "gym"
  | "practice"
  | "climbs"
  | "explore"
  | "profile"
  | "goals";

/** A mark explained in a step's key. */
export type Mark = "try" | "flash" | "send" | "open";

export type GuideStep = {
  id: string;
  title: string;
  body: string;
  scene: Scene;
  /** Practice screen only: show a route's details sheet over the list. */
  sheet?: boolean;
  /** TourTarget id to spotlight. Omit for a centred card. */
  target?: string;
  /** Asks for the climbing level inside the step. */
  choice?: "level";
  /** The user must do this on the practice screen before Next unlocks. */
  expect?: { route: number; kind: "try" | "flash" | "send" };
  /** Shown once `expect` is done. */
  done?: string;
  /** A key to the marks on a route row. */
  legend?: { mark: Mark; title: string; text: string }[];
};

export type Guide = {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  steps: GuideStep[];
};

export const APP_TOUR = "app-tour";

export const guides: Guide[] = [
  {
    id: APP_TOUR,
    title: "Tour of Bouldy",
    summary: "Every main screen, one stop at a time.",
    minutes: 2,
    steps: [
      {
        id: "welcome",
        scene: "home",
        title: "Welcome to Bouldy",
        body: "A private journal for your bouldering. This tour uses sample data, so nothing here is yours and nothing is saved. You can leave at any time.",
        choice: "level",
      },
      {
        id: "home-month",
        scene: "home",
        target: "demo-home-month",
        title: "Your month at a glance",
        body: "Visits, finishes and climbing time for this month collect on Home once you log a visit.",
      },
      {
        id: "home-action",
        scene: "home",
        target: "demo-home-action",
        title: "Start from here",
        body: "This button starts a session, or resumes the one you have open. It is always at the bottom of Home.",
      },
      {
        id: "tabs",
        scene: "home",
        target: "demo-tabs",
        title: "Four places to go",
        body: "Home, Explore, Sessions and Profile. The highlighted item in the nav bar is where you are now.",
      },
      {
        id: "sessions-title",
        scene: "sessions",
        target: "demo-sessions-title",
        title: "Sessions are your journal",
        body: "Every gym visit is a session. They are listed by month, with any session in progress at the top.",
      },
      {
        id: "sessions-actions",
        scene: "sessions",
        target: "demo-sessions-actions",
        title: "Add a visit",
        body: "The red plus starts a session now. Use Record a past visit for a day you forgot to log.",
      },
      {
        id: "climbs",
        scene: "climbs",
        target: "demo-climbs-title",
        title: "Your climbs",
        body: "Every route you have logged, with tries across visits. Where history is missing, Bouldy says so instead of guessing.",
      },
      {
        id: "explore",
        scene: "explore",
        target: "demo-explore-status",
        title: "Community is coming",
        body: "Shared sessions, challenges and groups are not live yet. Your journal stays private until sharing exists and you choose it.",
      },
      {
        id: "profile",
        scene: "profile",
        target: "demo-profile-learn",
        title: "Come back any time",
        body: "Learn & guide holds every guide, the lessons, the glossary and your goals. Replay this tour from here whenever you like.",
      },
    ],
  },
  {
    id: "first-session",
    title: "Log your first session",
    summary: "Practice logging, one tap at a time.",
    minutes: 4,
    steps: [
      {
        id: "start",
        scene: "sessions",
        target: "demo-sessions-actions",
        title: "Start a session",
        body: "Tap the red plus when you arrive at the gym. Bouldy keeps one session open at a time. From here on you can practice with sample routes.",
      },
      {
        id: "gym",
        scene: "gym",
        target: "demo-gym-start",
        title: "Choose your gym",
        body: "Pick the gym you are climbing at, then start. If a session is already open you will see it instead, and can resume or finish it.",
      },
      {
        id: "find",
        scene: "practice",
        target: "demo-filters",
        title: "Find your route",
        body: "Search by colour or route name, or tap a grade chip to narrow the list. Your filters are remembered for this visit.",
      },
      {
        id: "row",
        scene: "practice",
        target: "demo-row-1",
        title: "Reading a route",
        body: "Left to right: the hold colour, the grade and colour name, the route name, then the wall and styles. The buttons log it. The arrow opens its details.",
      },
      {
        id: "try",
        scene: "practice",
        target: "demo-1-try",
        expect: { route: 1, kind: "try" },
        title: "Add a try",
        body: "Tap +1 every time you get on the route and come down without topping it. Try it now on First steps.",
        done: "One try logged. The status line under the name now counts it.",
      },
      {
        id: "flash",
        scene: "practice",
        target: "demo-2-flash",
        expect: { route: 2, kind: "flash" },
        title: "Flash a route",
        body: "A flash is topping a route on your very first try, ever. The lightning only appears on a route you have never tried. Tap it on A little reach.",
        done: "Flashed. The buttons turn into a tag, and a flash counts as a finish.",
      },
      {
        id: "send",
        scene: "practice",
        target: "demo-1-send",
        expect: { route: 1, kind: "send" },
        title: "Mark a send",
        body: "Tap the tick when you top a route after some tries. Your tries so far are kept with the send. Tap it on First steps.",
        done: "Sent. Your tries stay on the log, so you can see how long it took.",
      },
      {
        id: "key",
        scene: "practice",
        title: "What every mark means",
        body: "Once a route is sent or flashed, its buttons are replaced by a tag.",
        legend: [
          { mark: "try", title: "+1", text: "One more try, no finish." },
          {
            mark: "flash",
            title: "Lightning",
            text: "Topped on your first try ever.",
          },
          { mark: "send", title: "Tick", text: "Topped it after some tries." },
          {
            mark: "open",
            title: "Arrow",
            text: "Notes, details and corrections.",
          },
        ],
      },
      {
        id: "details",
        scene: "practice",
        sheet: true,
        target: "demo-sheet-note",
        title: "Notes on a route",
        body: "Tap a route to open it. Add a private note here, such as the beta that worked or what to fix next time.",
      },
      {
        id: "correct",
        scene: "practice",
        sheet: true,
        target: "demo-sheet-correct",
        title: "Fix a mistake",
        body: "Logged the wrong count or result? Change them here and save the correction. A correction fixes the log, it does not add a try.",
      },
      {
        id: "finish",
        scene: "practice",
        target: "demo-finish",
        title: "Finish the visit",
        body: "Tap Finish, set how long you climbed, and the session is saved. Finished sessions lock their attempts so your history stays trustworthy.",
      },
      {
        id: "goals",
        scene: "goals",
        target: "demo-goals",
        title: "Watch your goals tick",
        body: "Your first session, route and send show up here once they are in your journal. Nothing ticks until you have really done it.",
      },
    ],
  },
  {
    id: "progress",
    title: "Read your progress",
    summary: "What the numbers mean, and when they are unsure.",
    minutes: 1,
    steps: [
      {
        id: "month",
        scene: "home",
        target: "demo-home-month",
        title: "This month",
        body: "Completed visits, finishes (sends and flashes) and time climbing. A session in progress is not counted until you finish it.",
      },
      {
        id: "dash",
        scene: "climbs",
        target: "demo-climbs-title",
        title: "A dash is not zero",
        body: "If some history could not be loaded, a value shows a dash or a warning. Refresh and it will fill in. Bouldy never counts unknown as zero.",
      },
      {
        id: "goals",
        scene: "goals",
        target: "demo-goals",
        title: "Goals follow your journal",
        body: "Goals are checked against your real records. If they cannot be confirmed yet, they say so.",
      },
    ],
  },
];

export const guideById = (id: string) => guides.find((g) => g.id === id);
