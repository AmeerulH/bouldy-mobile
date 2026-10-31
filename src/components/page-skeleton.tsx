import type { ReactNode } from "react";
import { View, type DimensionValue, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BouldyLoader } from "./bouldy-loader";
import { LoadingPatience } from "./page-loader";
import { T } from "./primitives";
import { colors as c } from "../theme/colors";

// Source-derived geometry; remaining variants stay open in the parity register.
export type SkeletonPage =
  | "home"
  | "sessions"
  | "session"
  | "login"
  | "signup"
  | "gyms"
  | "form"
  | "climbs"
  | "placeholder"
  | "profile"
  | "explore"
  | "gym";
const labels: Record<SkeletonPage, string> = {
  climbs: "Gathering your climbs…",
  placeholder: "Opening…",
  form: "Opening the route form…",
  gyms: "Finding your next wall…",
  signup: "Getting you started…",
  home: "Loading your progress…",
  sessions: "Opening your journal…",
  session: "Getting your routes ready…",
  login: "Preparing your login…",
  profile: "Opening your profile…",
  explore: "Opening Explore…",
  gym: "Finding your next wall…",
};
const line: ViewStyle = { borderColor: c.hairline };
// color-mix(in oklch, oklch(.16 0 0) 9%, oklch(.985 0 0)): L=.91075, sRGB #e1e1e1.
function Bone({
  height,
  width = "100%",
  style,
  dark = false,
}: {
  height: number;
  width?: DimensionValue;
  style?: ViewStyle;
  dark?: boolean;
}) {
  return (
    <View
      style={[
        {
          height,
          width,
          borderRadius: 4,
          backgroundColor: dark ? c["panel-track"] : c.neutral,
        },
        style,
      ]}
    />
  );
}
function Summary() {
  return (
    <View style={{ backgroundColor: c.panel, borderRadius: 12, padding: 20 }}>
      <Bone dark height={12} width={96} />
      <Bone dark height={28} width="75%" style={{ marginTop: 12 }} />
      <Bone dark height={12} width="50%" style={{ marginTop: 12 }} />
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          borderTopWidth: 1,
          borderColor: c["panel-track"],
          marginTop: 20,
          paddingTop: 16,
        }}
      >
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flex: 1 }}>
            <Bone dark height={24} width={24} />
            <Bone dark height={8} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>
    </View>
  );
}
function Routes({ action = true }: { action?: boolean }) {
  return (
    <View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Bone
          height={44}
          style={{ flex: 1, width: undefined, borderRadius: 999 }}
        />
        <Bone height={44} width={96} style={{ borderRadius: 999 }} />
      </View>
      <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Bone key={i} height={36} width={56} style={{ borderRadius: 999 }} />
        ))}
      </View>
      <View style={{ marginTop: 12 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              line,
              {
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 12,
                borderTopWidth: i ? 1 : 0,
              },
            ]}
          >
            <Bone height={40} width={40} style={{ borderRadius: 12 }} />
            <View style={{ flex: 1 }}>
              <Bone height={16} width="33.333%" />
              <Bone height={12} width="60%" style={{ marginTop: 8 }} />
            </View>
            {action ? (
              <Bone height={44} width={56} style={{ borderRadius: 999 }} />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
/** A line of text: reserves the real line height, draws a shorter bone inside it. */
function TextLine({
  size,
  width = "100%",
  dark = false,
  display = false,
  style,
}: {
  size: number;
  width?: DimensionValue;
  dark?: boolean;
  display?: boolean;
  style?: ViewStyle;
}) {
  const lineHeight = display ? Math.ceil(size * 1.12) : Math.ceil(size * 1.5);
  return (
    <View style={[{ height: lineHeight, justifyContent: "center" }, style]}>
      <Bone dark={dark} height={Math.round(size * 0.7)} width={width} />
    </View>
  );
}
/** The Bolt B plus heading used by every main page title. */
function TitleLine({
  size = 36,
  width = 140,
}: {
  size?: number;
  width?: DimensionValue;
}) {
  const mark = Math.round(size * 0.9);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        height: mark,
      }}
    >
      <Bone height={mark} width={mark} style={{ borderRadius: 8 }} />
      <Bone height={Math.round(size * 0.7)} width={width} />
    </View>
  );
}
function Panel({ children }: { children: ReactNode }) {
  return (
    <View style={{ backgroundColor: c.panel, borderRadius: 12, padding: 20 }}>
      {children}
    </View>
  );
}
/** Mirrors the pinned TaskFooter so the bottom of the screen does not jump. */
export function SkeletonFooter({ secondary = false }: { secondary?: boolean }) {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        flexDirection: "row",
        gap: 12,
        backgroundColor: c.bg,
      }}
    >
      <Bone
        height={48}
        style={{ flex: 1, width: undefined, borderRadius: 999 }}
      />
      {secondary ? (
        <Bone height={48} width={48} style={{ borderRadius: 24 }} />
      ) : null}
    </View>
  );
}
function ListRows({
  count,
  minHeight,
  trailing = "chevron",
}: {
  count: number;
  minHeight: number;
  trailing?: "chevron" | "soon" | "none";
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            minHeight,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderColor: c.hairline,
          }}
        >
          <View style={{ flex: 1 }}>
            <TextLine size={22} display width="55%" />
            <TextLine size={14} width="40%" style={{ marginTop: 4 }} />
          </View>
          {trailing === "chevron" ? <Bone height={20} width={20} /> : null}
          {trailing === "soon" ? <Bone height={12} width={72} /> : null}
        </View>
      ))}
    </>
  );
}
export function PageSkeleton({ page }: { page: SkeletonPage }) {
  const auth = page === "login" || page === "signup",
    insets = useSafeAreaInsets();
  const structured = [
    "home",
    "sessions",
    "profile",
    "explore",
    "gyms",
    "climbs",
    "gym",
  ].includes(page);
  const status = (
    <View
      accessibilityLiveRegion="polite"
      pointerEvents="none"
      style={
        structured
          ? {
              position: "absolute",
              bottom: 12,
              alignSelf: "center",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              minHeight: 32,
              paddingHorizontal: 14,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: c.hairline,
              backgroundColor: c.bg,
            }
          : {
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              minHeight: 32,
              marginBottom: 22,
            }
      }
    >
      <BouldyLoader variant={auth ? "hold" : "traverse"} />
      <T size={12} weight={600} color={c["ink-muted"]}>
        {labels[page]}
      </T>
    </View>
  );
  const frame: ViewStyle = {
    flexGrow: 1,
    minHeight: "100%",
    backgroundColor: c.bg,
  };
  if (page === "home")
    return (
      <View
        accessibilityLabel={labels[page]}
        accessibilityState={{ busy: true }}
        style={[
          frame,
          { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32, gap: 20 },
        ]}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ gap: 20 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              height: 36,
            }}
          >
            <Bone height={28} width={28} style={{ borderRadius: 6 }} />
            <Bone height={24} width={116} />
          </View>
          <View style={{ gap: 8 }}>
            <View>
              <TextLine size={36} display width="100%" />
              <TextLine size={36} display width="72%" />
            </View>
            <TextLine size={16} width="58%" />
          </View>
          <Panel>
            <TextLine size={24} display dark width="45%" />
            <View style={{ flexDirection: "row", gap: 16, marginTop: 20 }}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ flex: 1 }}>
                  <TextLine size={40} display dark width="55%" />
                  <TextLine size={14} dark width="70%" />
                </View>
              ))}
            </View>
            <TextLine size={12} dark width="62%" style={{ marginTop: 20 }} />
          </Panel>
          <Panel>
            <TextLine size={16} dark width="40%" />
            <TextLine size={14} dark width="55%" />
          </Panel>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextLine size={24} display width={110} />
            <TextLine size={14} width={64} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingBottom: 20,
            }}
          >
            <Bone
              dark
              height={72}
              width={56}
              style={{ borderRadius: 8, backgroundColor: c.panel }}
            />
            <View style={{ flex: 1 }}>
              <TextLine size={16} width="55%" />
              <TextLine size={14} width="40%" />
            </View>
            <Bone height={32} width={32} style={{ borderRadius: 16 }} />
          </View>
        </View>
        {status}
      </View>
    );
  if (page === "sessions")
    return (
      <View
        accessibilityLabel={labels[page]}
        accessibilityState={{ busy: true }}
        style={[
          frame,
          { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32, gap: 24 },
        ]}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ gap: 24 }}
        >
          <TitleLine />
          <Panel>
            <TextLine size={16} dark width="35%" />
            <TextLine size={14} dark width="50%" />
            <TextLine size={12} dark width="42%" />
          </Panel>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 16,
              }}
            >
              <TextLine size={24} display width={150} />
              <TextLine size={12} width={48} />
            </View>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                  marginHorizontal: -20,
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  minHeight: 88,
                  borderBottomWidth: 1,
                  borderColor: c.hairline,
                }}
              >
                <Bone height={30} width={36} />
                <View style={{ flex: 1 }}>
                  <TextLine size={16} width="55%" />
                  <TextLine size={14} width="75%" />
                </View>
                <Bone height={32} width={32} style={{ borderRadius: 16 }} />
              </View>
            ))}
          </View>
        </View>
        {status}
      </View>
    );
  if (page === "profile")
    return (
      <View
        accessibilityLabel={labels[page]}
        accessibilityState={{ busy: true }}
        style={[frame, { paddingBottom: 32 }]}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ gap: 24 }}
        >
          <View
            style={{
              backgroundColor: c.panel,
              borderBottomLeftRadius: 28,
              borderBottomRightRadius: 28,
              marginTop: -insets.top,
              paddingHorizontal: 40,
              paddingTop: insets.top + 28,
              paddingBottom: 32,
              gap: 20,
            }}
          >
            <Bone dark height={76} width={76} style={{ borderRadius: 38 }} />
            <View style={{ gap: 4 }}>
              <Bone
                dark
                height={30}
                width="68%"
                style={{ marginVertical: 4 }}
              />
              <TextLine size={14} dark width="62%" />
            </View>
          </View>
          <View>
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={{
                  minHeight: 72,
                  padding: 20,
                  gap: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderColor: c.hairline,
                }}
              >
                <Bone height={24} width={24} />
                <Bone
                  height={14}
                  width={i === 4 ? 64 : "42%"}
                  style={{ flex: i === 4 ? undefined : 1 }}
                />
                {i < 4 ? <Bone height={10} width={64} /> : null}
              </View>
            ))}
          </View>
        </View>
        {status}
      </View>
    );
  if (page === "explore")
    return (
      <View
        accessibilityLabel={labels[page]}
        accessibilityState={{ busy: true }}
        style={[
          frame,
          { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },
        ]}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ gap: 28 }}
        >
          <TitleLine />
          <Panel>
            <TextLine size={24} display dark width="60%" />
            <View style={{ marginTop: 8 }}>
              <TextLine size={14} dark width="100%" style={{ height: 24 }} />
              <TextLine size={14} dark width="92%" style={{ height: 24 }} />
              <TextLine size={14} dark width="70%" style={{ height: 24 }} />
            </View>
          </Panel>
          {[2, 3].map((rows) => (
            <View key={rows}>
              <TextLine size={24} display width={96} />
              <View style={{ marginTop: 12 }}>
                {Array.from({ length: rows }, (_, i) => (
                  <View
                    key={i}
                    style={{
                      minHeight: 76,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      marginHorizontal: -20,
                      borderBottomWidth: 1,
                      borderColor: c.hairline,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <TextLine size={16} width="50%" />
                      <TextLine
                        size={14}
                        width="70%"
                        style={{ marginTop: 2 }}
                      />
                    </View>
                    <Bone height={12} width={72} />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
        {status}
      </View>
    );
  if (page === "gyms")
    return (
      <View
        accessibilityLabel={labels[page]}
        accessibilityState={{ busy: true }}
        style={[
          frame,
          { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },
        ]}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ gap: 24 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <TextLine size={14} width={56} />
              <View style={{ marginTop: 6 }}>
                <TitleLine />
              </View>
            </View>
            <Bone height={44} width={112} style={{ borderRadius: 999 }} />
          </View>
          <View
            style={{
              marginHorizontal: -20,
              borderTopWidth: 1,
              borderColor: c.hairline,
            }}
          >
            <ListRows count={5} minHeight={72} />
          </View>
        </View>
        {status}
      </View>
    );
  if (page === "gym")
    return (
      <View
        accessibilityLabel={labels[page]}
        accessibilityState={{ busy: true }}
        style={[
          frame,
          { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32, gap: 24 },
        ]}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ gap: 24 }}
        >
          <View>
            <TextLine size={36} display width="60%" style={{ height: 32 }} />
            <TextLine size={14} width="40%" style={{ marginTop: 8 }} />
          </View>
          <Bone height={48} style={{ borderRadius: 999 }} />
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <TextLine size={24} display width="60%" />
                <TextLine size={12} width={72} style={{ marginTop: 4 }} />
              </View>
              <Bone height={44} width={96} style={{ borderRadius: 999 }} />
            </View>
            <View style={{ marginTop: 12 }}>
              <Routes />
            </View>
          </View>
        </View>
        {status}
      </View>
    );
  if (page === "climbs")
    return (
      <View
        accessibilityLabel={labels[page]}
        accessibilityState={{ busy: true }}
        style={[
          frame,
          { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, gap: 24 },
        ]}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ gap: 24 }}
        >
          <View>
            <TextLine size={14} width="48%" />
            <View style={{ marginTop: 8 }}>
              <TitleLine size={44} width={200} />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: c.hairline,
              paddingVertical: 16,
            }}
          >
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ flex: 1 }}>
                <TextLine size={30} display width={36} />
                <TextLine size={12} width={48} style={{ marginTop: 4 }} />
              </View>
            ))}
          </View>
          <Routes action={false} />
        </View>
        {status}
      </View>
    );
  return (
    <View
      accessibilityLabel={labels[page]}
      accessibilityState={{ busy: true }}
      style={{
        ...frame,
        paddingTop: auth ? 40 : 24,
        paddingBottom: auth ? 40 : 32,
        paddingHorizontal: auth ? 24 : 20,
        justifyContent: auth ? "center" : undefined,
      }}
    >
      {status}
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ gap: 24 }}
      >
        {auth ? (
          <View>
            <Bone height={32} width={96} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                marginTop: 28,
              }}
            >
              <View style={{ flex: 1 }}>
                <Bone height={64} />
                <Bone height={12} width="80%" style={{ marginTop: 12 }} />
              </View>
              <Bone height={80} width={80} style={{ borderRadius: 16 }} />
            </View>
          </View>
        ) : (
          <View>
            <Bone height={12} width={128} />
            <Bone height={36} width="60%" style={{ marginTop: 12 }} />
          </View>
        )}
        {auth ? (
          <>
            <View style={{ gap: 16 }}>
              {Array.from({ length: page === "signup" ? 4 : 2 }, (_, i) => (
                <View key={i}>
                  <Bone height={12} width={80} style={{ marginBottom: 8 }} />
                  <Bone height={48} style={{ borderRadius: 12 }} />
                </View>
              ))}
            </View>
            <Bone height={52} style={{ borderRadius: 999 }} />
            <Bone height={16} width="75%" style={{ alignSelf: "center" }} />
          </>
        ) : page === "placeholder" ? (
          <>
            <Summary />
            <View style={[line, { borderTopWidth: 1, borderBottomWidth: 1 }]}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    line,
                    { paddingVertical: 20, borderTopWidth: i ? 1 : 0 },
                  ]}
                >
                  <Bone height={20} width="60%" />
                  <Bone height={12} width="80%" style={{ marginTop: 12 }} />
                </View>
              ))}
            </View>
          </>
        ) : page === "form" ? (
          <>
            <Bone height={96} style={{ borderRadius: 16 }} />
            <View>
              <Bone height={12} width={80} style={{ marginBottom: 8 }} />
              <Bone height={48} style={{ borderRadius: 12 }} />
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <Bone
                  key={i}
                  height={80}
                  width="23%"
                  style={{ flexGrow: 1, borderRadius: 12 }}
                />
              ))}
            </View>
            <Bone height={48} style={{ borderRadius: 12 }} />
          </>
        ) : (
          <>
            <Summary />
            <Routes />
          </>
        )}
      </View>
      <View style={{ marginTop: 20 }}>
        <LoadingPatience />
      </View>
    </View>
  );
}

export function skeletonPageForPath(path: string): SkeletonPage | undefined {
  if (path === "/") return "home";
  if (path === "/sessions" || path === "/history") return "sessions";
  if (path === "/climbs") return "climbs";
  if (/^\/sessions\/[^/]+\/?$/.test(path)) return "session";
  if (path === "/gyms") return "gyms";
  if (/^\/gyms\/[^/]+\/?$/.test(path)) return "gym";
  if (path === "/profile") return "profile";
  if (path === "/explore") return "explore";
  if (/\/routes\/new$|\/routes\/[^/]+\/edit$/.test(path)) return "form";
  if (
    path.startsWith("/explore/") ||
    /^\/profile\/.+/.test(path) ||
    /^\/routes\/[^/]+\/beta$/.test(path)
  )
    return "placeholder";
  if (path === "/login" || path === "/signup")
    return path.slice(1) as "login" | "signup";
}
