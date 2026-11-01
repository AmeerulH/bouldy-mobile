// Interactive guides. Each step can point at a registered <TourTarget id> on a route.
// Guides only explain and navigate; they never create or change journal records.
// Copy rules: no em dashes, describe only what Bouldy does today.

export type GuideStep = {
  id: string;
  title: string;
  body: string;
  /** Screen to show before pointing. Omit to stay on the current screen. */
  route?: string;
  /** TourTarget id to spotlight. Omit, or if it is not on screen, the step is centred. */
  target?: string;
  /** Asks for the climbing level inside the step. */
  choice?: "level";
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
        route: "/",
        title: "Welcome to Bouldy",
        body: "A private journal for your bouldering. This tour visits each screen and points out what matters. You can leave at any time.",
        choice: "level",
      },
      {
        id: "home-month",
        route: "/",
        target: "home-month",
        title: "Your month at a glance",
        body: "Visits, finishes and climbing time for this month collect on Home once you log a visit, with your last visit just below.",
      },
      {
        id: "home-action",
        route: "/",
        target: "home-action",
        title: "Start from here",
        body: "This button starts a session, or resumes the one you have open. It is always at the bottom of Home.",
      },
      {
        id: "tabs",
        route: "/",
        target: "tabs",
        title: "Four places to go",
        body: "Home, Explore, Sessions and Profile. The red one is where you are now.",
      },
      {
        id: "sessions-title",
        route: "/sessions",
        target: "sessions-title",
        title: "Sessions are your journal",
        body: "Every gym visit is a session. They are listed by month, with any session in progress at the top.",
      },
      {
        id: "sessions-actions",
        route: "/sessions",
        target: "sessions-actions",
        title: "Add a visit",
        body: "The red plus starts a session now. Use Record a past visit for a day you forgot to log.",
      },
      {
        id: "climbs",
        route: "/climbs",
        target: "climbs-title",
        title: "Your climbs",
        body: "Every route you have logged, with tries across visits. Where history is missing, Bouldy says so instead of guessing.",
      },
      {
        id: "explore",
        route: "/explore",
        target: "explore-status",
        title: "Community is coming",
        body: "Shared sessions, challenges and groups are not live yet. Your journal stays private until sharing exists and you choose it.",
      },
      {
        id: "profile",
        route: "/profile",
        target: "profile-learn",
        title: "Come back any time",
        body: "Learn & guide holds every guide, the lessons, the glossary and your goals. Replay this tour from here whenever you like.",
      },
    ],
  },
  {
    id: "first-session",
    title: "Log your first session",
    summary: "From picking a gym to finishing a visit.",
    minutes: 2,
    steps: [
      {
        id: "start",
        route: "/sessions",
        target: "sessions-actions",
        title: "Start a session",
        body: "Tap the red plus when you arrive at the gym. Bouldy keeps one session open at a time.",
      },
      {
        id: "gym",
        route: "/sessions/new",
        target: "new-title",
        title: "Choose your gym",
        body: "Pick the gym you are climbing at, then start. If a session is already open you will see it here instead, and can resume or finish it.",
      },
      {
        id: "log",
        title: "Log each route",
        body: "In a session, find a route with search or the grade chips. Tap +1 for every try, Sent when you top it, or Flash for a first-try finish.",
      },
      {
        id: "notes",
        title: "Notes and corrections",
        body: "Open a route to add a private note. If you logged the wrong count or result, use Correct. A correction fixes the log, it does not add a try.",
      },
      {
        id: "finish",
        title: "Finish the visit",
        body: "Tap Finish, set how long you climbed, and the session is saved. Finished sessions lock their attempts so your history stays trustworthy.",
      },
      {
        id: "goals",
        route: "/learn/goals",
        target: "goals-list",
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
        route: "/",
        target: "home-month",
        title: "This month",
        body: "Completed visits, finishes (sends and flashes) and time climbing. A session in progress is not counted until you finish it.",
      },
      {
        id: "dash",
        route: "/climbs",
        target: "climbs-title",
        title: "A dash is not zero",
        body: "If some history could not be loaded, a value shows a dash or a warning. Refresh and it will fill in. Bouldy never counts unknown as zero.",
      },
      {
        id: "goals",
        route: "/learn/goals",
        target: "goals-list",
        title: "Goals follow your journal",
        body: "Goals are checked against your real records. If they cannot be confirmed yet, they say so.",
      },
    ],
  },
];

export const guideById = (id: string) => guides.find((g) => g.id === id);
