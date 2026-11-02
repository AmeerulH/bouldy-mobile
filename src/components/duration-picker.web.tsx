import { View } from "react-native";
import { Pressable } from "./pressable";
import { Heading, Icon, T } from "./primitives";
import { colors as c } from "../theme/colors";
import { s } from "../theme/styles";

// Browsers draw a plain system menu for a native picker, which clashes with the sheet.
// On web the same value is set with presets and steppers instead. Phones keep the native wheel.
const presets = [30, 45, 60, 90, 120, 180] as const,
  label = (minutes: number) =>
    minutes < 60
      ? `${minutes} min`
      : `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60}` : ""}`,
  max = 23 * 60 + 59;

function Step({
  name,
  text,
  disabled,
  onPress,
}: {
  name: "plus" | "minus";
  text: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={text}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: c.hairline,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.35 : 1,
        backgroundColor: pressed ? c.pressed : "transparent",
      })}
    >
      {name === "plus" ? (
        <Icon name="plus" color={c.ink} />
      ) : (
        <T size={22} weight={700}>
          -
        </T>
      )}
    </Pressable>
  );
}

export function DurationPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (minutes: number) => void;
}) {
  const hours = Math.floor(value / 60),
    minutes = value % 60,
    set = (next: number) => onChange(Math.max(0, Math.min(max, next))),
    field = (name: string, shown: string, unit: string, step: number) => (
      <View style={{ flex: 1, alignItems: "center", gap: 8 }}>
        <T size={12} weight={600} color={c["ink-muted"]}>
          {name}
        </T>
        <View style={[s.row, { gap: 12 }]}>
          <Step
            name="minus"
            text={`Fewer ${unit}`}
            disabled={value - step < 0}
            onPress={() => set(value - step)}
          />
          <View style={{ minWidth: 44, alignItems: "center" }}>
            <Heading size={32} style={{ textTransform: "none" }}>
              {shown}
            </Heading>
          </View>
          <Step
            name="plus"
            text={`More ${unit}`}
            disabled={value + step > max}
            onPress={() => set(value + step)}
          />
        </View>
      </View>
    );
  return (
    <View style={{ gap: 16 }}>
      <T weight={600}>Duration</T>
      <View
        accessibilityRole="adjustable"
        accessibilityLabel={`Duration ${label(value)}`}
        style={[s.row, { gap: 8, alignItems: "flex-start" }]}
      >
        {field("Hours", String(hours).padStart(2, "0"), "hours", 60)}
        {field("Minutes", String(minutes).padStart(2, "0"), "minutes", 5)}
      </View>
      <View style={[s.row, { flexWrap: "wrap", gap: 8 }]}>
        {presets.map((p) => (
          <Pressable
            key={p}
            accessibilityRole="button"
            accessibilityState={{ selected: value === p }}
            onPress={() => set(p)}
            style={{
              minHeight: 44,
              paddingHorizontal: 16,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: c.hairline,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: value === p ? c.panel : "transparent",
            }}
          >
            <T weight={700} color={value === p ? c["panel-ink"] : c.ink}>
              {label(p)}
            </T>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
