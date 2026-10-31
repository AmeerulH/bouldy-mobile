import { Pressable } from "./pressable";
import React, { useState, type ReactNode } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  type TextStyle,
  type StyleProp,
  type ViewStyle,
  type TextInputProps,
} from "react-native";
import { markControlTouch } from "../features/touch-guard";
import {
  useNavigationStart,
  navigationPressAllowed,
} from "../platform/navigation-state";
import { ButtonSpinner } from "./button-spinner";
import { Link, type Href } from "expo-router";
import { Image, type ImageStyle } from "expo-image";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { normaliseRouteColour } from "../domain/route-options";
import { semantic as sc } from "../theme/semantic-colors";
import { colors as c } from "../theme/colors";
import { s } from "../theme/styles";
export function T({
  children,
  size = 14,
  weight = 400,
  display = false,
  color = c.ink,
  style,
  lines,
}: {
  children: ReactNode;
  size?: number;
  weight?: 400 | 500 | 600 | 700 | 800;
  display?: boolean;
  color?: string;
  style?: StyleProp<TextStyle>;
  lines?: number;
}) {
  return (
    <Text
      numberOfLines={lines}
      style={[
        {
          fontFamily: display
            ? `BarlowCondensed-${weight === 400 || weight === 500 ? 600 : weight}`
            : `Geist-${weight}`,
          fontSize: size,
          lineHeight: display ? Math.ceil(size * 1.12) : Math.ceil(size * 1.5),
          color,
          includeFontPadding: false,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Heading({
  children,
  size = 24,
  style,
  color = c.ink,
}: {
  children: ReactNode;
  size?: number;
  style?: StyleProp<TextStyle>;
  color?: string;
}) {
  return (
    <T
      display
      weight={800}
      size={size}
      color={color}
      style={[
        { textTransform: "uppercase", letterSpacing: -0.02 * size },
        style,
      ]}
    >
      {children}
    </T>
  );
}
const holdAssets: Record<string, number> = {
  red: require("../../assets/source/route-holds/red.svg"),
  blue: require("../../assets/source/route-holds/blue.svg"),
  green: require("../../assets/source/route-holds/green.svg"),
  yellow: require("../../assets/source/route-holds/yellow.svg"),
  orange: require("../../assets/source/route-holds/orange.svg"),
  purple: require("../../assets/source/route-holds/purple.svg"),
  pink: require("../../assets/source/route-holds/pink.svg"),
  black: require("../../assets/source/route-holds/black.svg"),
  white: require("../../assets/source/route-holds/white.svg"),
  teal: require("../../assets/source/route-holds/teal.svg"),
  mint: require("../../assets/source/route-holds/mint.svg"),
  grey: require("../../assets/source/route-holds/grey.svg"),
  brown: require("../../assets/source/route-holds/brown.svg"),
  transparent: require("../../assets/source/route-holds/transparent.svg"),
  triangle: require("../../assets/source/route-holds/blue-triangle.svg"),
};
export function Hold({
  colour,
  name,
  size = 40,
  style,
}: {
  colour?: string | null;
  name?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const key = normaliseRouteColour(colour) ?? "grey";
  return (
    <Image
      source={
        holdAssets[
          key === "blue" && /arete|triangle|volume/i.test(name ?? "")
            ? "triangle"
            : key
        ]
      }
      contentFit="contain"
      accessibilityElementsHidden
      style={[
        { width: size, height: size, flexShrink: 0 },
        style as StyleProp<ImageStyle>,
      ]}
    />
  );
}
export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <View style={[s.row, { gap: 7 }]}>
      <Image
        source={require("../../assets/source/brand/bolt-b.svg")}
        style={{ width: 28, height: 28 }}
      />
      <T
        display
        size={32}
        weight={800}
        color={dark ? c["panel-ink"] : c.ink}
        style={{ letterSpacing: -0.96 }}
      >
        bouldy
        <T display size={32} weight={800} color={c.accent}>
          .
        </T>
      </T>
    </View>
  );
}
export function A({
  href,
  children,
  style,
  textStyle,
  color = c.accent,
  accessibilityLabel,
}: {
  href: string;
  children: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  color?: string;
}) {
  const start = useNavigationStart();
  const [active, setActive] = useState(false);
  return (
    <Link href={href as Href} asChild>
      <Pressable
        onPress={(event) => {
          if (navigationPressAllowed(event)) start(href);
        }}
        accessibilityRole="link"
        accessibilityLabel={accessibilityLabel}
        onPressIn={() => setActive(true)}
        onPressOut={() => setActive(false)}
        onHoverIn={() => setActive(true)}
        onHoverOut={() => setActive(false)}
        style={StyleSheet.flatten([
          style,
          active
            ? StyleSheet.flatten(style)?.backgroundColor
              ? { opacity: 0.8 }
              : { backgroundColor: c.pressed }
            : {},
        ])}
      >
        {typeof children === "string" || typeof children === "number" ? (
          <T weight={600} color={color} style={textStyle}>
            {children}
          </T>
        ) : (
          children
        )}
      </Pressable>
    </Link>
  );
}
export function Button({
  children,
  onPress,
  pending = false,
  pendingLabel = "Saving",
  variant = "primary",
  style,
  labelStyle,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress: () => void;
  pending?: boolean;
  pendingLabel?: string;
  variant?: "primary" | "dark" | "soft" | "neutral" | "flash" | "plain";
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}) {
  const bg =
    variant === "plain"
      ? "transparent"
      : variant === "dark"
        ? c.panel
        : variant === "soft"
          ? c["accent-tint"]
          : variant === "neutral"
            ? sc.neutral
            : variant === "flash"
              ? sc.flashBg
              : c.accent;
  const fg =
    variant === "plain"
      ? c.ink
      : variant === "dark"
        ? c["panel-ink"]
        : variant === "soft"
          ? c["accent-tint-ink"]
          : variant === "neutral"
            ? c.ink
            : variant === "flash"
              ? sc.flashInk
              : c["accent-ink"];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: pending, disabled: pending }}
      disabled={pending}
      onPress={(event) => {
        event.stopPropagation();
        onPress();
      }}
      style={({ pressed }) => [
        s.button,
        {
          backgroundColor: bg,
          opacity: pending ? 0.72 : 1,
          transform: [
            { translateY: pressed ? 1 : 0 },
            { scale: pressed ? 0.985 : 1 },
          ],
        },
        style,
      ]}
    >
      <View style={{ opacity: pending ? 0 : 1 }}>
        {typeof children === "string" || typeof children === "number" ? (
          <T weight={700} color={fg} style={labelStyle}>
            {children}
          </T>
        ) : (
          children
        )}
      </View>
      {pending ? (
        <View
          accessibilityLiveRegion="polite"
          style={[s.row, { position: "absolute", gap: 8 }]}
        >
          <ButtonSpinner color={fg} />
          {pendingLabel ? (
            <T weight={700} color={fg}>
              {pendingLabel}
            </T>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}
export function Field({
  label,
  optional = false,
  ...props
}: TextInputProps & { label: string; optional?: boolean }) {
  return (
    <View style={{ gap: 6 }}>
      <T size={14} weight={600}>
        {label}
      </T>
      {optional ? (
        <T weight={600} color={c["ink-faint"]}>
          (optional)
        </T>
      ) : null}
      <TextInput
        onTouchStart={(event) => markControlTouch(event.nativeEvent.timestamp)}
        accessibilityLabel={optional ? `${label} (optional)` : label}
        {...props}
        style={[
          {
            fontFamily: "Geist-400",
            fontSize: 16,
            color: c.ink,
            minHeight: 48,
            borderWidth: 1,
            borderColor: c.hairline,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
          },
          props.style,
        ]}
      />
    </View>
  );
}
export function Feedback({ children }: { children: ReactNode }) {
  return (
    <View
      accessibilityRole="alert"
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: c["accent-tint"],
      }}
    >
      <T weight={500} color={c["accent-tint-ink"]}>
        {children}
      </T>
    </View>
  );
}
export const resultLabels = {
  flash: "⚡ Flash",
  send: "Send",
  zone: "Zone",
  project: "In progress",
};
export function Result({ result }: { result: keyof typeof resultLabels }) {
  const colors = {
    flash: [sc.flashBg, sc.flashInk],
    send: [sc.sendBg, sc.sendInk],
    zone: [sc.zoneBg, sc.zoneInk],
    project: [c["accent-tint"], c["accent-tint-ink"]],
  };
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: colors[result][0],
      }}
    >
      <T size={12} weight={700} color={colors[result][1]}>
        {resultLabels[result]}
      </T>
    </View>
  );
}
export function Icon({
  name,
  color = c["ink-faint"],
  size = 20,
}: {
  name: string;
  color?: string;
  size?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === "home" ? (
        <Path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
      ) : name === "explore" ? (
        <>
          <Circle cx={12} cy={12} r={9} />
          <Path d="m15.5 8.5-2 5-5 2 2-5z" />
        </>
      ) : name === "sessions" ? (
        <>
          <Rect x={4} y={5} width={16} height={16} rx={2} />
          <Path d="M8 3v4m8-4v4M4 10h16" />
        </>
      ) : name === "gyms" ? (
        <>
          <Path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
          <Circle cx={12} cy={10} r={2.5} />
        </>
      ) : name === "profile" ? (
        <>
          <Circle cx={12} cy={8} r={3.5} />
          <Path d="M5 20c.8-3.6 3.8-5.5 7-5.5s6.2 1.9 7 5.5" />
        </>
      ) : (
        <Path
          d={
            name === "plus"
              ? "M12 5v14M5 12h14"
              : name === "check"
                ? "m5 12 4 4L19 6"
                : name === "flash"
                  ? "m13 2-9 12h7l-1 8 10-12h-7z"
                  : name === "help"
                    ? "M9.5 8a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1-1.5 3m0 4h.01"
                    : name === "edit"
                      ? "m15 4 5 5-11 11H4v-5z"
                      : name === "lock"
                        ? "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5z"
                        : name === "book"
                          ? "M12 5C8 2 3 4 3 4v16s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1v16"
                          : name === "logout"
                            ? "M9 4H4v16h5m3-13 5 5-5 5m-4-5h13"
                            : name === "info"
                              ? "M12 11v6m0-10h.01"
                              : name === "warning"
                                ? "M12 8v5m0 4h.01M12 3 2 21h20z"
                                : name === "error"
                                  ? "m7 7 10 10M17 7 7 17"
                                  : name === "arrow"
                                    ? "M5 12h14m-6-6 6 6-6 6"
                                    : name === "close"
                                      ? "m6 6 12 12M18 6 6 18"
                                      : name === "back"
                                        ? "m15 6-6 6 6 6"
                                        : name === "down"
                                          ? "m6 9 6 6 6-6"
                                          : "m9 6 6 6-6 6"
          }
        />
      )}
    </Svg>
  );
}

export function IconButton({
  name,
  label,
  onPress,
  href,
}: {
  name: string;
  label: string;
  onPress?: () => void;
  href?: string;
}) {
  const content = <Icon name={name} color={c.ink} size={22} />;
  const style = {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.neutral,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexShrink: 0,
  };
  return href ? (
    <A href={href} accessibilityLabel={label} style={style}>
      {content}
    </A>
  ) : (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [style, { opacity: pressed ? 0.65 : 1 }]}
    >
      {content}
    </Pressable>
  );
}
export function Chevron() {
  return (
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: c.neutral,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name="next" color={c.ink} size={18} />
    </View>
  );
}
