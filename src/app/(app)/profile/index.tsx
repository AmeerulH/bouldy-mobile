import { useRef, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Pressable } from "../../../components/pressable";
import { Heading, Icon, T, Feedback, A } from "../../../components/primitives";
import { Screen, Waiting } from "../../../components/screen";
import { useSnapshot } from "../../../data/snapshot";
import { useAuth } from "../../../platform/auth";
import { colors as c } from "../../../theme/colors";
import { s } from "../../../theme/styles";
export default function Profile() {
  const { data, error } = useSnapshot("profile"),
    auth = useAuth(),
    busy = useRef(false),
    [pending, setPending] = useState(false),
    [issue, setIssue] = useState("");
  if (!data)
    return (
      <Screen>
        <Waiting error={error} />
      </Screen>
    );
  async function logout() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    try {
      const out = await auth.command("logout", {});
      if (out.destination) router.replace(out.destination as never);
    } catch (e) {
      setIssue((e as Error).message);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <Screen>
      <View style={s.page}>
        <Heading size={36}>You</Heading>
        <View style={{ gap: 12, paddingVertical: 8 }}>
          <View
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              backgroundColor: c.panel,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heading size={30} color={c["panel-ink"]}>
              {data.user.username.slice(0, 1)}
            </Heading>
          </View>
          <Heading size={30}>{data.user.username}</Heading>
          <T color={c["ink-muted"]}>{data.user.email}</T>
        </View>
        <View style={{ marginHorizontal: -20 }}>
          {[
            ["edit", "Edit profile"],
            ["profile", "Change name"],
            ["lock", "Change password"],
            ["book", "Learn & glossary"],
          ].map(([icon, label]) => (
            <View
              key={label}
              accessibilityState={{ disabled: true }}
              style={[
                s.row,
                {
                  minHeight: 72,
                  padding: 20,
                  gap: 16,
                  borderBottomWidth: 1,
                  borderColor: c.hairline,
                },
              ]}
            >
              <Icon name={icon} color={c["ink-muted"]} size={24} />
              <T
                size={17}
                weight={600}
                color={c["ink-muted"]}
                style={{ flex: 1 }}
              >
                {label}
              </T>
              <T size={10} weight={600} color={c["ink-muted"]}>
                Coming soon
              </T>
            </View>
          ))}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: pending, disabled: pending }}
            disabled={pending}
            onPress={() => void logout()}
            style={({ pressed }) => [
              s.row,
              {
                minHeight: 72,
                padding: 20,
                gap: 16,
                borderBottomWidth: 1,
                borderColor: c.hairline,
                backgroundColor: pressed ? c.pressed : "transparent",
              },
            ]}
          >
            <Icon name="logout" color={c["accent-strong"]} size={24} />
            <T size={17} weight={700} color={c["accent-strong"]}>
              {pending ? "Logging out…" : "Log out"}
            </T>
          </Pressable>
        </View>
        {data.catalogueAdmin ? (
          <A
            href="/gyms"
            style={[s.button, { backgroundColor: c.panel }]}
            color={c["panel-ink"]}
          >
            Manage gyms & routes
          </A>
        ) : null}
        {issue ? <Feedback>{issue}</Feedback> : null}
      </View>
    </Screen>
  );
}
