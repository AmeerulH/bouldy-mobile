import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { A, Button, Heading, T } from "../../../../components/primitives";
import { Screen } from "../../../../components/screen";
import { TaskFooter } from "../../../../components/task-footer";
import { LearnHeader } from "../../../../components/learn";
import { lessons } from "../../../../content/learn";
import { orderLessons, toggleLesson } from "../../../../domain/learn-progress";
import { useLearnState } from "../../../../platform/learn-state";
import { colors as c } from "../../../../theme/colors";
import { s } from "../../../../theme/styles";

export default function Lesson() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    { state, update } = useLearnState(),
    lesson = lessons.find((l) => l.id === id);
  if (!lesson)
    return (
      <Screen back="/learn/lessons" label="Lessons">
        <View style={[s.page, { gap: 16 }]}>
          <Heading size={32}>Lesson not found</Heading>
          <A href="/learn/lessons">Back to lessons</A>
        </View>
      </Screen>
    );
  const done = state.lessonsDone.includes(lesson.id),
    ordered = orderLessons(lessons, state.level),
    next = ordered[ordered.findIndex((l) => l.id === lesson.id) + 1];
  return (
    <Screen
      back="/learn/lessons"
      label="Lessons"
      footer={
        <TaskFooter>
          <Button
            variant={done ? "neutral" : "primary"}
            onPress={() => void update((st) => toggleLesson(st, lesson.id))}
          >
            {done ? "Done. Mark as not done" : "Mark as done"}
          </Button>
          {next ? (
            <A
              href={`/learn/lessons/${next.id}`}
              style={[s.button, { backgroundColor: c["accent-tint"] }]}
              color={c["accent-tint-ink"]}
            >
              {`Next: ${next.title}`}
            </A>
          ) : null}
        </TaskFooter>
      }
    >
      <View style={[s.page, { gap: 28, paddingTop: 20 }]}>
        <LearnHeader
          eyebrow={`${lesson.minutes} min read`}
          title={lesson.title}
          summary={lesson.summary}
        />
        {lesson.sections.map((section) => (
          <View key={section.heading} style={{ gap: 10 }}>
            <Heading size={24}>{section.heading}</Heading>
            {section.body.map((text) => (
              <T key={text} size={16} color={c["ink-muted"]} style={{ lineHeight: 24, maxWidth: 520 }}>
                {text}
              </T>
            ))}
          </View>
        ))}
      </View>
    </Screen>
  );
}
