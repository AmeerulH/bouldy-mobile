import { View } from "react-native";
import { A, T } from "../../../components/primitives";
import { Screen, Waiting } from "../../../components/screen";
import { LearnHeader, StatusMark } from "../../../components/learn";
import { useSnapshot } from "../../../data/snapshot";
import { evaluateGoals, goalsDone, type Goal } from "../../../domain/learn-goals";
import { colors as c } from "../../../theme/colors";
import { s } from "../../../theme/styles";

const statusText = { done: "Done", todo: "To do", unknown: "Can’t confirm yet" } as const;

function GoalRow({ goal }: { goal: Goal }) {
  const style = [
    s.row,
    {
      minHeight: 72,
      gap: 14,
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderColor: c.hairline,
    },
  ];
  const body = (
    <>
      <StatusMark status={goal.status} />
      <View style={{ flex: 1, gap: 2 }}>
        <T size={16} weight={700}>
          {goal.title}
        </T>
        <T size={13} color={c["ink-muted"]}>
          {goal.status === "done"
            ? "Done"
            : goal.progress
              ? `${goal.progress.value} of ${goal.progress.target}. ${goal.hint}`
              : goal.hint}
        </T>
        {goal.status === "unknown" ? (
          <T size={12} color={c["accent-strong"]}>
            Some history is unavailable.
          </T>
        ) : null}
      </View>
    </>
  );
  if (goal.status === "done")
    return (
      <View
        accessible
        accessibilityLabel={`${goal.title}, ${statusText.done}`}
        style={style}
      >
        {body}
      </View>
    );
  return (
    <A
      href={goal.href}
      accessibilityLabel={`${goal.title}, ${statusText[goal.status]}. ${goal.hrefLabel}`}
      style={style}
    >
      {body}
      <T size={13} weight={600} color={c.accent}>
        {goal.hrefLabel}
      </T>
    </A>
  );
}

export default function Goals() {
  const { data, error } = useSnapshot();
  if (!data)
    return (
      <Screen back="/learn" label="Learn">
        <Waiting error={error} />
      </Screen>
    );
  const goals = evaluateGoals(data.journal);
  return (
    <Screen back="/learn" label="Learn">
      <View style={[s.page, { gap: 24, paddingTop: 20 }]}>
        <LearnHeader
          eyebrow={`${goalsDone(goals)} of ${goals.length} done`}
          title="Goals"
          summary="Checked against your real journal. More goals arrive as Bouldy grows."
        />
        <View style={{ marginHorizontal: -20, borderTopWidth: 1, borderColor: c.hairline }}>
          {goals.map((goal) => (
            <GoalRow key={goal.id} goal={goal} />
          ))}
        </View>
      </View>
    </Screen>
  );
}
