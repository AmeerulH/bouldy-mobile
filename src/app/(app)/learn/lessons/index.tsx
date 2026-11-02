import { View } from "react-native";
import { T } from "../../../../components/primitives";
import { Screen } from "../../../../components/screen";
import { Badge, LearnHeader, LearnRow, LevelChips } from "../../../../components/learn";
import { lessons } from "../../../../content/learn";
import { orderLessons } from "../../../../domain/learn-progress";
import { useLearnState } from "../../../../platform/learn-state";
import { colors as c } from "../../../../theme/colors";
import { s } from "../../../../theme/styles";

export default function Lessons() {
  const { state, update } = useLearnState(),
    ordered = orderLessons(lessons, state.level);
  return (
    <Screen back="/learn" label="Learn">
      <View style={[s.page, { gap: 24, paddingTop: 20 }]}>
        <LearnHeader
          eyebrow={`${state.lessonsDone.length} of ${lessons.length} done`}
          title="Lessons"
          summary="Short reads, two to three minutes each."
        />
        <View style={{ gap: 12 }}>
          <T weight={600}>Show first</T>
          <LevelChips
            level={state.level}
            onChange={(level) => void update((st) => ({ ...st, level }))}
          />
        </View>
        <View style={{ marginHorizontal: -20, borderTopWidth: 1, borderColor: c.hairline }}>
          {ordered.map((lesson) => {
            const done = state.lessonsDone.includes(lesson.id);
            return (
              <LearnRow
                key={lesson.id}
                href={`/learn/lessons/${lesson.id}`}
                title={lesson.title}
                hint={`${lesson.summary} ${lesson.minutes} min`}
                label={`${lesson.title}, ${lesson.minutes} minutes${done ? ", done" : ""}`}
                trailing={done ? <Badge>Done</Badge> : null}
              />
            );
          })}
        </View>
      </View>
    </Screen>
  );
}
