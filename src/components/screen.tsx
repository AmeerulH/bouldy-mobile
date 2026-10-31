import { Surface } from "./surface";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";

import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { IconButton } from "./primitives";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
} from "react";
import { AppError } from "../features/app-error";
import { useAuth } from "../platform/auth";
import { PageSkeleton, type SkeletonPage } from "./page-skeleton";
const Anchors = createContext<
  (id: string, view: ComponentRef<typeof View> | null) => void
>(() => {});
export function ScrollAnchor({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const register = useContext(Anchors),
    ref = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => register(id, ref.current));
    return () => {
      cancelAnimationFrame(frame);
      register(id, null);
    };
  });
  return (
    <View
      ref={ref}
      collapsable={false}
      nativeID={id}
      onLayout={() => register(id, ref.current)}
    >
      {children}
    </View>
  );
}
export function Screen({
  children,
  back,
  label = "Sessions",
  footer,
}: {
  children: ReactNode;
  back?: string;
  label?: string;
  footer?: ReactNode;
}) {
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null),
    params = useLocalSearchParams<Record<string, string>>();
  const hash = params["#"] ?? "";
  // Only allow scrolling when the content is actually taller than the viewport.
  const [viewH, setViewH] = useState(0),
    [contentH, setContentH] = useState(0),
    canScroll = contentH > viewH + 1;
  const anchors = useRef(new Map<string, ComponentRef<typeof View>>());
  const restoreAnchor = useCallback(() => {
    const view = anchors.current.get(hash),
      inner = scroll.current?.getInnerViewRef();
    if (view && inner)
      view.measureLayout(
        inner,
        (_x, y) =>
          scroll.current?.scrollTo({
            y: Math.max(0, y - 176),
            animated: false,
          }),
        () => {},
      );
  }, [hash]);
  // Focus can arrive after child layout. Never overwrite a restored fragment
  // with the ordinary page-top reset, and retry after content is measurable.
  useFocusEffect(
    useCallback(() => {
      const frame = requestAnimationFrame(() => {
        if (hash) restoreAnchor();
        else scroll.current?.scrollTo({ y: 0, animated: false });
      });
      return () => cancelAnimationFrame(frame);
    }, [hash, restoreAnchor]),
  );
  const register = useCallback(
    (id: string, view: ComponentRef<typeof View> | null) => {
      if (view) anchors.current.set(id, view);
      else anchors.current.delete(id);
      if (id === hash) restoreAnchor();
    },
    [hash, restoreAnchor],
  );
  return (
    <Surface>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {back ? (
          <View
            style={{
              minHeight: 64,
              paddingHorizontal: 20,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <IconButton href={back} name="back" label={`Back to ${label}`} />
          </View>
        ) : null}
        <ScrollView
          ref={scroll}
          onLayout={(e) => setViewH(e.nativeEvent.layout.height)}
          onContentSizeChange={(_w, h) => {
            setContentH(h);
            restoreAnchor();
          }}
          scrollEnabled={canScroll}
          bounces={canScroll}
          alwaysBounceVertical={false}
          overScrollMode={canScroll ? "auto" : "never"}
          contentContainerStyle={{ flexGrow: 1 }}
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
        >
          <Anchors.Provider value={register}>{children}</Anchors.Provider>
        </ScrollView>
        {footer}
      </KeyboardAvoidingView>
    </Surface>
  );
}
export function Waiting({
  error,
  page = "home",
}: {
  error?: string;
  page?: SkeletonPage;
}) {
  const auth = useAuth();
  return error ? (
    <AppError retry={auth.refresh} />
  ) : (
    <PageSkeleton page={page} />
  );
}
