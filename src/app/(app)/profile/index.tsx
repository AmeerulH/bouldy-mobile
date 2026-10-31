import { reportFrom, useActionError } from "../../../components/error-sheet";
import { useRef, useState } from "react";
import { View } from "react-native";
import { router, useIsFocused } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Pressable } from "../../../components/pressable";
import { Heading, Icon, T, A } from "../../../components/primitives";
import { Screen, Waiting } from "../../../components/screen";
import { useSnapshot } from "../../../data/snapshot";
import { useAuth } from "../../../platform/auth";
import { colors as c } from "../../../theme/colors";
import { s } from "../../../theme/styles";
export default function Profile() {
  const { data, error } = useSnapshot("profile"),
    auth = useAuth(),
    report = useActionError(),
    insets = useSafeAreaInsets(),
    focused = useIsFocused(),
    busy = useRef(false),
    [pending, setPending] = useState(false);
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
      report(reportFrom(e, { context: "logout", retry: logout }));
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <Screen>
      {focused ? <StatusBar style="light" /> : null}
      <View style={[s.page, { paddingTop: 0 }]}>
        <View
          style={{
            backgroundColor: c.panel,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            marginHorizontal: -20,
            marginTop: -insets.top,
            paddingHorizontal: 40,
            paddingBottom: 32,
            paddingTop: insets.top + 28,
            gap: 20,
            overflow: "hidden",
          }}
        >
          <Image
            source={require("../../../../assets/source/brand/bolt-b.svg")}
            accessibilityElementsHidden
            importantForAccessibility="no"
            pointerEvents="none"
            style={{
              position: "absolute",
              right: -20,
              top: insets.top - 20,
              width: 200,
              height: 200,
              opacity: 0.14,
            }}
          />
          <View
            style={{
              height: 76,
              width: 76,
              borderRadius: 38,
              backgroundColor: c.accent,
              borderWidth: 4,
              borderColor: c["panel-track"],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heading
              size={44}
              color={c["accent-ink"]}
              style={{ textTransform: "uppercase" }}
            >
              {data.user.username.slice(0, 1)}
            </Heading>
          </View>
          <View style={{ gap: 4 }}>
            <Heading
              size={data.user.username.length > 12 ? 32 : 40}
              color={c["panel-ink"]}
              style={{ lineHeight: data.user.username.length > 12 ? 32 : 38 }}
            >
              {data.user.username}
            </Heading>
            <T color={c["panel-ink-muted"]}>{data.user.email}</T>
          </View>
          {data.catalogueAdmin ? (
            <View
              style={{
                alignSelf: "flex-start",
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 5,
                backgroundColor: c["accent-tint"],
              }}
            >
              <T size={12} weight={700} color={c["accent-tint-ink"]}>
                Admin
              </T>
            </View>
          ) : null}
        </View>
        <View style={{ marginHorizontal: -20 }}>
          {data.catalogueAdmin ? (
            <A
              href="/gyms"
              accessibilityLabel="Gyms, admin. Manage gyms and routes"
              style={[
                s.row,
                {
                  minHeight: 72,
                  padding: 20,
                  gap: 16,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: c.hairline,
                },
              ]}
            >
              <Icon name="gyms" color={c.ink} size={24} />
              <View style={{ flex: 1 }}>
                <T size={17} weight={600}>
                  Manage gyms
                </T>
                <T size={12} color={c["ink-muted"]}>
                  Gyms and routes
                </T>
              </View>
              <Icon name="next" size={20} />
            </A>
          ) : null}
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
      </View>
    </Screen>
  );
}
