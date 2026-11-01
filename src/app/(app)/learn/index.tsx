import { View } from "react-native";
import { Image } from "expo-image";
import { Button, Heading, T } from "../../../components/primitives";
import { Screen } from "../../../components/screen";
import {
  Badge,
  LearnHeader,
  LearnRow,
  LevelChips,
} from "../../../components/learn";
import { useTour } from "../../../components/tour";
import { glossary, lessons } from "../../../content/learn";
import { guides } from "../../../content/guides";
import { useSnapshot } from "../../../data/snapshot";
import {
  evaluateGoals,
  goalsDone,
  nextGoal,
} from "../../../domain/learn-goals";
import { orderLessons } from "../../../domain/learn-progress";
import { useLearnState } from "../../../platform/learn-state";
import { colors as c } from "../../../theme/colors";
import { s } from "../../../theme/styles";

export default function Learn() {
  const { state, update } = useLearnState(),
    tour = useTour(),
    { data } = useSnapshot(),
    goals = data ? evaluateGoals(data.journal) : null,
    next = goals ? nextGoal(goals) : undefined,
    ordered = orderLessons(lessons, state.level),
    pending = guides.find((g) => !state.guidesDone.includes(g.id)),
    done = (id: string) => state.guidesDone.includes(id);
  return (
    <Screen back="/profile" label="Profile">
      <View style={[s.page, { gap: 28, paddingTop: 20 }]}>
        <LearnHeader
          eyebrow="Learn"
          title="Guides and lessons"
          summary="Guides walk you through the real screens. Lessons and the glossary cover climbing itself."
        />
        <View style={[s.panel, { gap: 16, overflow: "hidden" }]}>
          <Image
            source={require("../../../../assets/source/brand/bolt-b.svg")}
            accessibilityElementsHidden
            importantForAccessibility="no"
            pointerEvents="none"
            style={{
              position: "absolute",
              right: -24,
              top: -22,
              width: 150,
              height: 150,
              opacity: 0.14,
            }}
          />
          <Heading color={c["panel-ink"]}>
            {pending ? "Up next" : "All guides done"}
          </Heading>
          <T color={c["panel-ink-muted"]} style={{ maxWidth: 320 }}>
            {pending
              ? `${pending.title}. ${pending.summary}`
              : "Replay any guide below whenever you like."}
          </T>
          {pending ? (
            <Button
              style={{ alignSelf: "flex-start" }}
              onPress={() => tour.start(pending.id)}
            >
              Start guide
            </Button>
          ) : null}
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
        <View style={{ gap: 12 }}>
          <Heading>Guides</Heading>
          <View
            style={{
              marginHorizontal: -20,
              borderTopWidth: 1,
              borderColor: c.hairline,
            }}
          >
            {guides.map((g) => (
              <LearnRow
                key={g.id}
                onPress={() => tour.start(g.id)}
                title={g.title}
                hint={`${g.summary} ${g.steps.length} steps`}
                label={`${g.title}, ${g.steps.length} steps${done(g.id) ? ", completed. Replay" : ""}`}
                trailing={done(g.id) ? <Badge>Done</Badge> : null}
              />
            ))}
          </View>
        </View>
        <View style={{ gap: 12 }}>
          <Heading>Learn and track</Heading>
          <View
            style={{
              marginHorizontal: -20,
              borderTopWidth: 1,
              borderColor: c.hairline,
            }}
          >
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
                  {
                    state.lessonsDone.filter((id) =>
                      lessons.some((l) => l.id === id),
                    ).length
                  }{" "}
                  of {lessons.length}
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
      </View>
    </Screen>
  );
}
