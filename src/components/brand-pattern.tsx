import { View } from "react-native";
import { Image } from "expo-image";

const mark = 30,
  pitchX = 58,
  pitchY = 46,
  columns = 9,
  rows = 5;
/**
 * Faint Bolt B tiled in a staggered grid. Place as the first child of a panel
 * that has `overflow: "hidden"`; it fills the panel and never takes input.
 */
export function BrandPattern({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: columns }, (_, col) => (
          <Image
            key={`${row}-${col}`}
            source={require("../../assets/source/brand/bolt-b.svg")}
            style={{
              position: "absolute",
              left: col * pitchX + (row % 2 ? pitchX / 2 : 0) - 14,
              top: row * pitchY - 6,
              width: mark,
              height: mark,
              opacity,
            }}
          />
        )),
      )}
    </View>
  );
}
