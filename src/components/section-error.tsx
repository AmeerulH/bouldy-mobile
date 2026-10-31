import { useState } from "react";
import { View } from "react-native";
import { Button, Heading, Icon, T } from "./primitives";
import { describeLoadFailure } from "../features/error-copy";
import { useAuth } from "../platform/auth";
import { colors as c } from "../theme/colors";

/**
 * A failed list or section. It sits where the content would have been, so the
 * rest of the page never jumps. `what` reads after "Couldn't load", for example
 * "your visits".
 */
export function SectionError({
  what,
  status,
  retry,
}: {
  what: string;
  status?: number;
  retry?: () => void | Promise<void>;
}) {
  const auth = useAuth(),
    [pending, setPending] = useState(false),
    copy = describeLoadFailure(status, what);
  async function again() {
    setPending(true);
    try {
      await (retry ?? auth.refresh)();
    } finally {
      setPending(false);
    }
  }
  return (
    <View
      accessibilityRole="alert"
      style={{
        minHeight: 168,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: c.hairline,
        paddingHorizontal: 20,
        paddingVertical: 24,
        gap: 16,
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Icon name="close" color={c["accent-strong"]} size={24} />
      <View style={{ gap: 4 }}>
        <Heading size={22}>{copy.title}</Heading>
        <T color={c["ink-muted"]}>{copy.reason}</T>
      </View>
      <Button
        variant="dark"
        pending={pending}
        pendingLabel="Trying again"
        onPress={() => void again()}
        style={{ minHeight: 44 }}
      >
        Try again
      </Button>
    </View>
  );
}
