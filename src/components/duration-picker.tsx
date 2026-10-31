import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { T } from "./primitives";
import { colors as c } from "../theme/colors";
export function DurationPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (minutes: number) => void;
}) {
  const hours = Math.floor(value / 60),
    minutes = value % 60;
  return (
    <View>
      <T weight={600}>Duration</T>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Picker
            accessibilityLabel="Duration hours"
            selectedValue={hours}
            onValueChange={(h) => onChange(Number(h) * 60 + minutes)}
            itemStyle={{ color: c.ink, fontFamily: "Geist-600" }}
          >
            {Array.from({ length: 24 }, (_, h) => (
              <Picker.Item
                key={h}
                label={String(h).padStart(2, "0")}
                value={h}
              />
            ))}
          </Picker>
          <T style={{ textAlign: "center" }} color={c["ink-muted"]}>
            hours
          </T>
        </View>
        <T size={24}>:</T>
        <View style={{ flex: 1 }}>
          <Picker
            accessibilityLabel="Duration minutes"
            selectedValue={minutes}
            onValueChange={(m) => onChange(hours * 60 + Number(m))}
            itemStyle={{ color: c.ink, fontFamily: "Geist-600" }}
          >
            {Array.from({ length: 60 }, (_, m) => (
              <Picker.Item
                key={m}
                label={String(m).padStart(2, "0")}
                value={m}
              />
            ))}
          </Picker>
          <T style={{ textAlign: "center" }} color={c["ink-muted"]}>
            minutes
          </T>
        </View>
      </View>
    </View>
  );
}
