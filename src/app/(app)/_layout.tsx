import { Pressable } from "../../components/pressable";
import {
  useNavigationStart,
  navigationPressAllowed,
} from "../../platform/navigation-state";
import { Surface } from "../../components/surface";
import { PageMotion } from "../../components/page-motion";
import { Stack, Redirect, usePathname, Link } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppError } from "../../features/app-error";
import { useAuth } from "../../platform/auth";
import { T, Icon } from "../../components/primitives";
import { colors as c } from "../../theme/colors";
import { PageSkeleton } from "../../components/page-skeleton";
export default function Layout() {
  const startNavigation = useNavigationStart(),
    a = useAuth(),
    path = usePathname(),
    insets = useSafeAreaInsets();
  if (a.hydrationError) return <AppError retry={a.retry} />;
  if (!a.ready)
    return (
      <PageSkeleton
        page={
          path === "/climbs"
            ? "climbs"
            : path.startsWith("/explore") ||
                path.startsWith("/profile/") ||
                /\/beta$/.test(path)
              ? "placeholder"
              : /\/routes\/new$|\/routes\/[^/]+\/edit$/.test(path)
                ? "form"
                : path.startsWith("/gyms")
                  ? "gyms"
                  : path === "/sessions"
                    ? "sessions"
                    : /^\/sessions\/[^/]+/.test(path)
                      ? "session"
                      : "home"
        }
      />
    );
  if (!a.user) return <Redirect href="/welcome" />;
  const tabs = [
    ["/", "Home", "home"],
    ["/explore", "Explore", "explore"],
    ["/sessions", "Sessions", "sessions"],
    ["/profile", "You", "profile"],
  ] as const;
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      {__DEV__ && process.env.EXPO_PUBLIC_FIXTURE_PREVIEW === "1" ? (
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderColor: c.hairline,
          }}
        >
          <T size={12} weight={600} color={c["ink-muted"]}>
            Sample journal · local preview
          </T>
        </View>
      ) : null}
      <PageMotion>
        <Stack screenOptions={{ headerShown: false, animation: "none" }} />
      </PageMotion>
      {!/\/routes\/new$|\/routes\/[^/]+\/edit$/.test(path) ? (
        <View
          accessibilityRole="tablist"
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderColor: c.hairline,
            paddingTop: 8,
            paddingBottom: Math.max(8, insets.bottom),
            backgroundColor: c.bg,
          }}
        >
          <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
            <Surface rock>
              <View />
            </Surface>
          </View>
          {tabs.map(([href, label, icon]) => {
            const active =
              href === "/"
                ? path === "/"
                : path.startsWith(href) ||
                  (href === "/sessions" && path === "/climbs");
            return (
              <Link key={href} href={href} asChild>
                <Pressable
                  onPress={(event) => {
                    if (navigationPressAllowed(event)) startNavigation(href);
                  }}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: 4,
                    paddingVertical: 6,
                  }}
                >
                  <Icon
                    name={icon}
                    color={active ? c.accent : c["ink-faint"]}
                  />
                  <T
                    size={11}
                    weight={500}
                    color={active ? c.accent : c["ink-faint"]}
                    style={{ lineHeight: 16.5 }}
                  >
                    {label}
                  </T>
                  {active ? (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        width: 18,
                        height: 2,
                        borderRadius: 2,
                        backgroundColor: c.accent,
                      }}
                    />
                  ) : null}
                </Pressable>
              </Link>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

export { BouldyErrorBoundary as ErrorBoundary } from "../../components/error-boundary";
