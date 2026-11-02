import { useEffect, useRef } from "react";
import { View } from "react-native";
import { T } from "./primitives";
import { colors as c } from "../theme/colors";

// Browsers draw a plain system menu for a native picker, which clashes with the sheet.
// On web the same control is drawn as a snapping wheel, like the one phones show.
const ROW = 40,
  ROWS = 5,
  HEIGHT = ROW * ROWS,
  PAD = ROW * Math.floor(ROWS / 2),
  two = (n: number) => String(n).padStart(2, "0");

function Wheel({
  label,
  count,
  value,
  onChange,
}: {
  label: string;
  count: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const list = useRef<HTMLDivElement>(null),
    settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Follow the value when it changes from outside (first open, or the other wheel).
  useEffect(() => {
    const el = list.current;
    if (el && Math.round(el.scrollTop / ROW) !== value)
      el.scrollTo({ top: value * ROW });
  }, [value]);
  useEffect(() => () => clearTimeout(settle.current), []);
  const select = (next: number) =>
    onChange(Math.max(0, Math.min(count - 1, next)));
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: HEIGHT,
        }}
      >
        {/* The selection band sits behind the numbers, as on a phone. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: PAD,
            height: ROW,
            borderRadius: 10,
            backgroundColor: c.neutral,
          }}
        />
        <div
          ref={list}
          role="spinbutton"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={count - 1}
          aria-valuenow={value}
          aria-valuetext={two(value)}
          onScroll={(event) => {
            const top = event.currentTarget.scrollTop;
            clearTimeout(settle.current);
            // Wait for the snap to land so the value does not flicker while spinning.
            settle.current = setTimeout(() => {
              const next = Math.max(
                0,
                Math.min(count - 1, Math.round(top / ROW)),
              );
              if (next !== value) onChange(next);
            }, 90);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault();
              select(value + (event.key === "ArrowDown" ? 1 : -1));
            }
          }}
          style={{
            position: "relative",
            height: HEIGHT,
            overflowY: "auto",
            scrollSnapType: "y mandatory",
            scrollbarWidth: "none",
            outline: "none",
            overscrollBehavior: "contain",
            WebkitMaskImage:
              "linear-gradient(transparent, #000 28%, #000 72%, transparent)",
            maskImage:
              "linear-gradient(transparent, #000 28%, #000 72%, transparent)",
            paddingTop: PAD,
            paddingBottom: PAD,
            boxSizing: "content-box",
          }}
        >
          {Array.from({ length: count }, (_, n) => (
            <div
              key={n}
              onClick={() => select(n)}
              style={{
                height: ROW,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                scrollSnapAlign: "center",
                cursor: "pointer",
                userSelect: "none",
                fontFamily: "Geist-600, system-ui, sans-serif",
                fontSize: 22,
                color: c.ink,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {two(n)}
            </div>
          ))}
        </div>
      </div>
      <T style={{ textAlign: "center" }} color={c["ink-muted"]}>
        {label.toLowerCase()}
      </T>
    </View>
  );
}

export function DurationPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (minutes: number) => void;
}) {
  const hours = Math.floor(value / 60),
    minutes = value % 60;
  return (
    <View>
      <T weight={600}>Duration</T>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Wheel
          label="Hours"
          count={24}
          value={hours}
          onChange={(h) => onChange(h * 60 + minutes)}
        />
        <T size={24} style={{ marginBottom: 24 }}>
          :
        </T>
        <Wheel
          label="Minutes"
          count={60}
          value={minutes}
          onChange={(m) => onChange(hours * 60 + m)}
        />
      </View>
    </View>
  );
}
