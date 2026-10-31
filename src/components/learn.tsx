import type { ReactNode } from "react";
import { View } from "react-native";
import { Pressable } from "./pressable";
import { A, Chevron, Heading, Icon, T } from "./primitives";
import type { Level } from "../content/learn";
import type { GoalStatus } from "../domain/learn-goals";
import { colors as c } from "../theme/colors";
import { s } from "../theme/styles";

export function LearnHeader({
  eyebrow,
  title,
  summary,
}: {
  eyebrow: string;
  title: string;
  summary?: string;
}) {
  return (
    <View style={{ gap: 12 }}>
      <T size={12} weight={700} color={c["ink-muted"]} style={{ letterSpacing: 1.44, textTransform: "uppercase" }}>
        {eyebrow}
      </T>
      <Heading size={36} style={{ letterSpacing: -1.08 }}>
        {title}
      </Heading>
      {summary ? (
        <T size={16} color={c["ink-muted"]} style={{ maxWidth: 480 }}>
          {summary}
        </T>
      ) : null}
    </View>
  );
}

/** Full-width hairline row, matching the Profile and Explore lists. */
export function LearnRow({
  href,
  title,
  hint,
  trailing,
  label,
}: {
  href: string;
  title: string;
  hint?: string;
  trailing?: ReactNode;
  label?: string;
}) {
  return (
    <A
      href={href}
      accessibilityLabel={label}
      style={[
        s.row,
        {
          minHeight: 72,
          gap: 12,
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderColor: c.hairline,
        },
      ]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <T size={16} weight={700}>
          {title}
        </T>
        {hint ? (
          <T size={13} color={c["ink-muted"]}>
            {hint}
          </T>
        ) : null}
      </View>
      {trailing}
      <Chevron />
    </A>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: c["accent-tint"],
      }}
    >
      <T size={12} weight={700} color={c["accent-tint-ink"]}>
        {children}
      </T>
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        minHeight: 44,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? c.panel : c.hairline,
        backgroundColor: active ? c.panel : c.bg,
        justifyContent: "center",
      }}
    >
      <T weight={600} color={active ? c["panel-ink"] : c.ink}>
        {label}
      </T>
    </Pressable>
  );
}

export const levelLabel: Record<Level, string> = {
  beginner: "New to climbing",
  experienced: "I climb already",
};

export function LevelChips({
  level,
  onChange,
}: {
  level: Level | null;
  onChange: (level: Level) => void;
}) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Your climbing level"
      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
    >
      {(["beginner", "experienced"] as const).map((value) => (
        <Chip
          key={value}
          label={levelLabel[value]}
          active={level === value}
          onPress={() => onChange(value)}
        />
      ))}
    </View>
  );
}

/** Done = filled, to do = empty ring, unknown = ring with a dash. Never colour alone. */
export function StatusMark({ status }: { status: GoalStatus }) {
  const done = status === "done";
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: done ? c.panel : "transparent",
        borderWidth: done ? 0 : 2,
        borderColor: c["ink-faint"],
      }}
    >
      {done ? (
        <Icon name="check" color={c["panel-ink"]} size={18} />
      ) : status === "unknown" ? (
        <T size={14} weight={700} color={c["ink-faint"]}>
          ?
        </T>
      ) : null}
    </View>
  );
}
