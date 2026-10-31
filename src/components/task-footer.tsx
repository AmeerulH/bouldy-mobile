import type { ReactNode } from "react";
import { View } from "react-native";
import { colors as c } from "../theme/colors";
export function TaskFooter({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        gap: 12,
        backgroundColor: c.bg,
      }}
    >
      {children}
    </View>
  );
}
