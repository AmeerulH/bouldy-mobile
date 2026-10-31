import { View } from "react-native";
import type { ReactNode } from "react";
import { Hold, Heading, T } from "./primitives";
import { colors as c } from "../theme/colors";
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 32,
        paddingHorizontal: 20,
        gap: 20,
      }}
    >
      <View style={{ flexDirection: "row", gap: 16, alignItems: "flex-end" }}>
        <Hold colour="red" size={64} />
        <Hold colour="grey" size={44} />
      </View>
      <Heading size={30} style={{ textAlign: "center" }}>
        {title}
      </Heading>
      <T
        size={16}
        color={c["ink-muted"]}
        style={{ textAlign: "center", maxWidth: 320 }}
      >
        {children}
      </T>
    </View>
  );
}
