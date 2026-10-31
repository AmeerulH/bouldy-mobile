import { Image, StyleSheet, View } from "react-native";
import type { ReactNode } from "react";
import { colors as c } from "../theme/colors";
/** Low contrast material, separate from content so the texture never affects hit testing. */
export function Surface({
  children,
  rock = false,
}: {
  children: ReactNode;
  rock?: boolean;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Image
        pointerEvents="none"
        source={
          rock
            ? require("../../assets/textures/limestone-rock.webp")
            : require("../../assets/textures/limestone-grain.webp")
        }
        resizeMode="repeat"
        style={[StyleSheet.absoluteFill, { opacity: rock ? 0.08 : 0.12 }]}
      />
      {children}
    </View>
  );
}
