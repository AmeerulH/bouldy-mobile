import type { Journal } from "./journal-summary.ts";
import type {
  GlossaryCategory,
  GlossaryTerm,
  Lesson,
  Level,
} from "../content/learn.ts";

export type LearnState = {
  level: Level | null;
  tourDone: boolean;
  /** The user skipped or declined the tour; never prompt automatically again. */
  prompted: boolean;
  lessonsDone: string[];
};

export const emptyLearnState: LearnState = {
  level: null,
  tourDone: false,
  prompted: false,
  lessonsDone: [],
};

export const learnKey = (userId: number) => `bouldy_learn_v1_${userId}`;

/** Tolerant parse: storage can be missing, old or corrupted. Never throws. */
export function parseLearnState(raw: string | null): LearnState {
  if (!raw) return emptyLearnState;
  try {
    const v = JSON.parse(raw) as Partial<LearnState> | null;
    if (!v || typeof v !== "object") return emptyLearnState;
    return {
      level:
        v.level === "beginner" || v.level === "experienced" ? v.level : null,
      tourDone: v.tourDone === true,
      prompted: v.prompted === true,
      lessonsDone: Array.isArray(v.lessonsDone)
        ? v.lessonsDone.filter((id): id is string => typeof id === "string")
        : [],
    };
  } catch {
    return emptyLearnState;
  }
}

export type TourEntry = "auto" | "offer" | "none";

/**
 * auto: nothing logged yet, so open the tour once.
 * offer: has history but never saw the tour, so show a dismissible card.
 * none: already handled, or history is not known yet (never guess).
 */
export function tourEntry(state: LearnState, journal: Journal): TourEntry {
  if (state.tourDone || state.prompted || !journal.sessionsLoaded) return "none";
  return journal.records.length === 0 ? "auto" : "offer";
}

/** Matching-level lessons first, then the rest. Order inside each group is kept. */
export function orderLessons(lessons: Lesson[], level: Level | null): Lesson[] {
  if (!level) return lessons;
  const rank = (l: Lesson) => (l.level === level ? 0 : l.level === "all" ? 1 : 2);
  return lessons
    .map((l, i) => ({ l, i }))
    .sort((a, b) => rank(a.l) - rank(b.l) || a.i - b.i)
    .map(({ l }) => l);
}

export function searchGlossary(
  terms: GlossaryTerm[],
  query: string,
  category: GlossaryCategory | null,
): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  return terms
    .filter((t) => !category || t.category === category)
    .filter(
      (t) =>
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q),
    )
    .sort((a, b) => a.term.localeCompare(b.term));
}

export function toggleLesson(state: LearnState, id: string): LearnState {
  return {
    ...state,
    lessonsDone: state.lessonsDone.includes(id)
      ? state.lessonsDone.filter((x) => x !== id)
      : [...state.lessonsDone, id],
  };
}
