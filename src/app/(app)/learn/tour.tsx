import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Pressable } from "../../../components/pressable";
import { A, Button, Heading, T } from "../../../components/primitives";
import { Screen } from "../../../components/screen";
import { TaskFooter } from "../../../components/task-footer";
import { LevelChips } from "../../../components/learn";
import { tourSteps } from "../../../content/learn";
import { useLearnState } from "../../../platform/learn-state";
import { colors as c } from "../../../theme/colors";
import { s } from "../../../theme/styles";

export default function Tour() {
  const { state, update } = useLearnState(),
    [index, setIndex] = useState(0),
    step = tourSteps[index],
    last = index === tourSteps.length - 1;

  function leave(to: string) {
    router.replace(to as never);
  }
  function skip() {
    void update((st) => ({ ...st, prompted: true }));
    leave("/");
  }
  function finish() {
    void update((st) => ({ ...st, tourDone: true, prompted: true }));
    leave("/learn");
  }

  return (
    <Screen
      footer={
        <TaskFooter>
          <Button onPress={last ? finish : () => setIndex(index + 1)}>
            {last ? "Finish tour" : "Next"}
          </Button>
          {step.href ? (
            <A
              href={step.href}
              style={[s.button, { backgroundColor: c["accent-tint"] }]}
              color={c["accent-tint-ink"]}
            >
              {step.hrefLabel ?? "Show me"}
            </A>
          ) : null}
          {index > 0 ? (
            <Button variant="plain" onPress={() => setIndex(index - 1)}>
              Back
            </Button>
          ) : null}
        </TaskFooter>
      }
    >
      <View style={[s.page, { gap: 20, paddingTop: 16, flexGrow: 1 }]}>
        <View style={[s.between, { minHeight: 44 }]}>
          <View accessibilityLiveRegion="polite" style={{ flex: 1 }}>
            <T size={13} weight={600} color={c["ink-muted"]}>
              {`Step ${index + 1} of ${tourSteps.length}: ${step.label}`}
            </T>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip tour"
            onPress={skip}
            style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: 8 }}
          >
            <T weight={600} color={c["ink-muted"]}>
              {state.tourDone ? "Close" : "Skip"}
            </T>
          </Pressable>
        </View>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Tour progress"
          accessibilityValue={{ min: 1, max: tourSteps.length, now: index + 1 }}
          style={{ flexDirection: "row", gap: 4 }}
        >
          {tourSteps.map((item, i) => (
            <View
              key={item.id}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: i <= index ? c.accent : c.hairline,
              }}
            />
          ))}
        </View>
        <View style={[s.panel, { gap: 16, padding: 24, overflow: "hidden" }]}>
          <Image
            source={require("../../../../assets/source/brand/bolt-b.svg")}
            accessibilityElementsHidden
            importantForAccessibility="no"
            pointerEvents="none"
            style={{ position: "absolute", right: -30, top: -26, width: 180, height: 180, opacity: 0.14 }}
          />
          <Heading size={40} color={c["panel-ink"]} style={{ lineHeight: 44, maxWidth: 300 }}>
            {step.title}
          </Heading>
          <T size={16} color={c["panel-ink"]} style={{ lineHeight: 24, maxWidth: 340 }}>
            {step.body}
          </T>
        </View>
        {index === 0 ? (
          <View style={{ gap: 12 }}>
            <T weight={600}>How much climbing have you done?</T>
            <LevelChips
              level={state.level}
              onChange={(level) => void update((st) => ({ ...st, level }))}
            />
            <T size={13} color={c["ink-muted"]}>
              This only changes which lessons come first.
            </T>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
