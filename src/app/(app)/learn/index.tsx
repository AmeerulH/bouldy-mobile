import { View } from "react-native";
import { Image } from "expo-image";
import { A, Heading, T } from "../../../components/primitives";
import { Screen } from "../../../components/screen";
import { LearnHeader, LearnRow, LevelChips } from "../../../components/learn";
import { glossary, lessons, tourSteps } from "../../../content/learn";
import { useSnapshot } from "../../../data/snapshot";
import { evaluateGoals, goalsDone, nextGoal } from "../../../domain/learn-goals";
import { orderLessons } from "../../../domain/learn-progress";
import { useLearnState } from "../../../platform/learn-state";
import { colors as c } from "../../../theme/colors";
import { s } from "../../../theme/styles";

export default function Learn() {
  const { state, update } = useLearnState(),
    { data } = useSnapshot(),
    goals = data ? evaluateGoals(data.journal) : null,
    next = goals ? nextGoal(goals) : undefined,
    ordered = orderLessons(lessons, state.level),
    started = state.tourDone || state.prompted;
  return (
    <Screen back="/profile" label="Profile">
      <View style={[s.page, { gap: 28, paddingTop: 20 }]}>
        <LearnHeader
          eyebrow="Learn"
          title="Guide and lessons"
          summary="Take the tour, learn the words climbers use, and set small goals as you go."
        />
        <View style={[s.panel, { gap: 16, overflow: "hidden" }]}>
          <Image
            source={require("../../../../assets/source/brand/bolt-b.svg")}
            accessibilityElementsHidden
            importantForAccessibility="no"
            pointerEvents="none"
            style={{ position: "absolute", right: -24, top: -22, width: 150, height: 150, opacity: 0.14 }}
          />
          <Heading color={c["panel-ink"]}>
            {state.tourDone ? "Replay the tour" : "Guided tour"}
          </Heading>
          <T color={c["panel-ink-muted"]} style={{ maxWidth: 320 }}>
            {state.tourDone
              ? "Walk through the app again, one step at a time."
              : `${tourSteps.length} short steps from your first session to your progress.`}
          </T>
          <A
            href="/learn/tour"
            style={[s.button, { backgroundColor: c.accent, alignSelf: "flex-start" }]}
            color={c["accent-ink"]}
          >
            {state.tourDone ? "Replay tour" : started ? "Start tour" : "Take the tour"}
          </A>
        </View>
        <View style={{ gap: 12 }}>
          <Heading>Your level</Heading>
          <T color={c["ink-muted"]}>
            We put the lessons that suit you first. Everything stays open.
          </T>
          <LevelChips
            level={state.level}
            onChange={(level) => void update((st) => ({ ...st, level }))}
          />
        </View>
        <View style={{ marginHorizontal: -20, borderTopWidth: 1, borderColor: c.hairline }}>
          <LearnRow
            href="/learn/goals"
            title="Goals"
            hint={
              goals
                ? next
                  ? `Next: ${next.title}`
                  : "All goals done"
                : "Checking your journal"
            }
            trailing={
              goals ? (
                <T size={13} weight={600} color={c["ink-muted"]}>
                  {goalsDone(goals)} of {goals.length}
                </T>
              ) : null
            }
          />
          <LearnRow
            href="/learn/lessons"
            title="Lessons"
            hint={`Start with: ${ordered[0].title}`}
            trailing={
              <T size={13} weight={600} color={c["ink-muted"]}>
                {state.lessonsDone.filter((id) => lessons.some((l) => l.id === id)).length} of {lessons.length}
              </T>
            }
          />
          <LearnRow
            href="/learn/glossary"
            title="Glossary"
            hint="Holds, moves, grades and Bouldy terms"
            trailing={
              <T size={13} weight={600} color={c["ink-muted"]}>
                {glossary.length} terms
              </T>
            }
          />
        </View>
      </View>
    </Screen>
  );
}
