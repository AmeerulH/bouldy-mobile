import { useState, type ReactNode } from "react";
import { View, FlatList, TextInput, ScrollView } from "react-native";
import { Pressable } from "./pressable";
import { T, Heading, Hold, Button, Icon, Chevron } from "./primitives";
import { EmptyState } from "./empty-state";
import { LogActionButton, type LogKind } from "./log-action-button";
import { CompleteBadge } from "./complete-badge";
import { TourTarget } from "./tour-context";
import { useAuth } from "../platform/auth";
import { useRouteFilters } from "../platform/route-filters";
import { compareGrades, gradeKey, matchesQuery } from "../domain/route-grades";
import { statusText, type RouteState } from "../features/session-state";
import { colors as c } from "../theme/colors";
import { s } from "../theme/styles";
function Mark({
  on,
  id,
  children,
}: {
  on: boolean;
  id: string;
  children: ReactNode;
}) {
  return on ? <TourTarget id={id}>{children}</TourTarget> : <>{children}</>;
}
export function SessionRouteList({
  states,
  sessionId,
  ended,
  pending,
  open,
  log,
  practice = false,
}: {
  states: RouteState[];
  sessionId: number;
  ended: boolean;
  pending: { id: number; intent: string } | null;
  open: (id: number) => void;
  log: (state: RouteState, intent: string) => Promise<void>;
  /** Practice screens: mark the parts a guide step can spotlight. */
  practice?: boolean;
}) {
  const auth = useAuth(),
    { filters, set } = useRouteFilters(`${auth.user?.id}:session-${sessionId}`),
    [limit, setLimit] = useState(20),[hoveredRow,setHoveredRow]=useState<number|null>(null);
  const grades = [...new Set(states.map((x) => x.route.grade))].sort(
      compareGrades,
    ),
    visible = states.filter(
      (x) =>
        (!filters.grade || gradeKey(x.route.grade) === filters.grade) &&
        matchesQuery([x.route.route_name, x.route.colour].join(" "), filters.q),
    );
  return (
    <View style={{ flex: 1, minHeight: 0 }}>
      <Mark on={practice} id="demo-filters">
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 8,
          gap: 12,
        }}
      >
        <View
          style={[
            s.row,
            {
              borderRadius: 999,
              borderWidth: 1,
              borderColor: c.hairline,
              paddingLeft: 16,
            },
          ]}
        >
          <Icon name="explore" color={c.ink} />
          <TextInput
            accessibilityLabel="Search colour or route name"
            placeholder="Colour or route name"
            placeholderTextColor={c["ink-muted"]}
            value={filters.q}
            onChangeText={(q) => {
              set({ q });
              setLimit(20);
            }}
            style={{
              flex: 1,
              fontFamily: "Geist-400",
              fontSize: 16,
              color: c.ink,
              backgroundColor: c.bg,
              paddingHorizontal: 12,
              minHeight: 48,
            }}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {[["", "All"], ...grades.map((g) => [gradeKey(g), g])].map(
            ([key, label]) => (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityState={{ selected: (filters.grade ?? "") === key }}
                onPress={() => {
                  set({ grade: key });
                  setLimit(20);
                }}
                style={{
                  minHeight: 44,
                  minWidth: 44,
                  paddingHorizontal: 16,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: c.hairline,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    (filters.grade ?? "") === key ? c.panel : "transparent",
                }}
              >
                <T
                  weight={700}
                  color={(filters.grade ?? "") === key ? c["panel-ink"] : c.ink}
                >
                  {label}
                </T>
              </Pressable>
            ),
          )}
        </ScrollView>
        <T size={12} color={c["ink-muted"]}>
          Tap a route for notes & details
        </T>
      </View>
      </Mark>
      <FlatList
        data={visible.slice(0, limit)}
        keyExtractor={(state) => String(state.route.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        onEndReached={() => setLimit((n) => Math.min(visible.length, n + 20))}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          <EmptyState title="No matching routes">
            Try another grade, colour or route name.
          </EmptyState>
        }
        ListFooterComponent={
          !visible.length ? (
            <View style={{ padding: 20 }}>
              <Button onPress={() => set({ q: "", grade: "" })}>
                Clear filters
              </Button>
            </View>
          ) : undefined
        }
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: c.hairline }} />
        )}
        renderItem={({ item: state }) => {
          const { route, attempt, ambiguous, previous } = state,
            complete =
              attempt?.result === "send" || attempt?.result === "flash",
            canLog =
              !ended && route.status === "active" && !ambiguous && !complete,
            flash =
              canLog &&
              !attempt &&
              previous.complete &&
              !previous.ambiguous &&
              !previous.tried;
          return (
            <Mark on={practice} id={`demo-row-${route.id}`}>
            <View
              style={[
                s.row,
                {
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  gap: 10,
                  minHeight: 100,
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${route.grade} ${route.route_name}, notes and details`}
                onPress={() => open(route.id)}
                onHoverIn={()=>setHoveredRow(route.id)} onHoverOut={()=>setHoveredRow(null)} style={({ pressed }) => [
                  {
                    position: "absolute",
                    inset: 0,
                    backgroundColor:
                      pressed || hoveredRow===route.id ? c.pressed : "transparent",
                  },
                ]}
              />
              <View pointerEvents="none">
                <Hold colour={route.colour} name={route.route_name} size={32} />
              </View>
              <View pointerEvents="none" style={{ flex: 1, minWidth: 0 }}>
                <View style={[s.row, { gap: 6, alignItems: "baseline" }]}>
                  <Heading size={22}>{route.grade}</Heading>
                  <T size={11} color={c["ink-muted"]}>
                    {route.colour}
                  </T>
                </View>
                <T size={12} weight={700}>
                  {route.route_name}
                </T>
                <T size={10} color={c["ink-muted"]}>
                  {statusText(state, ended)}
                </T>
              </View>
              {canLog ? (
                <View style={[s.row, { gap: 4 }]}>
                  {(
                    [
                      ["try", "attempt", `Add try on ${route.route_name}`],
                      ...(flash
                        ? [["flash", "flash", `Flash ${route.route_name}`]]
                        : []),
                      // A tick means "topped it", so it only appears once there is a try to top it after.
                      ...(attempt
                        ? [["send", "send", `Mark ${route.route_name} sent`]]
                        : []),
                    ] as [LogKind, string, string][]
                  ).map(([kind, intent, label]) => (
                    <Mark
                      key={kind}
                      on={practice}
                      id={`demo-${route.id}-${kind}`}
                    >
                    <LogActionButton
                      kind={kind}
                      label={label}
                      playing={
                        pending?.id === route.id && pending.intent === intent
                      }
                      disabled={!!pending}
                      onPress={() => void log(state, intent)}
                    />
                    </Mark>
                  ))}
                </View>
              ) : complete && attempt ? (
                <CompleteBadge result={attempt.result as "flash" | "send"} />
              ) : null}
              <View pointerEvents="none">
                <Chevron />
              </View>
            </View>
            </Mark>
          );
        }}
      />
    </View>
  );
}
