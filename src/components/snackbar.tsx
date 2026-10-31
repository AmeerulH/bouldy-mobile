import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  useId,
  type ReactNode,
} from "react";
import { View } from "react-native";
import Animated, { cubicBezier } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "./pressable";
import { T, Icon } from "./primitives";
import { useReducedMotion } from "../platform/reduced-motion";
import { colors as c } from "../theme/colors";
import { motion } from "../theme/motion";
import { useNotice } from "../platform/notice";
type Kind = "success" | "error" | "info" | "warning";
type Notice = { text: string; kind: Kind };
const Context = createContext<{
  show: (text: string, kind?: Kind) => void;
  notice: Notice | null;
  dismiss: () => void;
  host:string|null;
  register:(id:string)=>()=>void;
}>({ show: () => {}, notice: null, dismiss: () => {},host:null,register:()=>()=>{} });
export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<Notice | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [hosts,setHosts]=useState<string[]>([]);
  const register=useCallback((id:string)=>{setHosts(current=>[...current.filter(value=>value!==id),id]);return()=>setHosts(current=>current.filter(value=>value!==id));},[]);
  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setNotice(null);
  }, []);
  const show = useCallback((text: string, kind: Kind = "success") => {
    clearTimeout(timer.current);
    setNotice({ text, kind });
    if (kind === "success" || kind === "info")
      timer.current = setTimeout(() => setNotice(null), 4000);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  useNotice(show);
  return (
    <Context.Provider value={{ show, notice, dismiss,host:hosts.at(-1)??null,register }}>
      {children}
      <SnackbarHost root />
    </Context.Provider>
  );
}
// Native Modal owns a separate presentation layer. Mount a host there as well.
export function SnackbarHost({root=false,active=true}:{root?:boolean;active?:boolean}={}) {
  const id=useId();
  const { notice, dismiss,host,register } = useContext(Context),
    insets = useSafeAreaInsets(),
    reduced = useReducedMotion();
  useEffect(()=>{if(!root&&active)return register(id);},[id,root,active,register]);
  if (!notice||!active||(root?host!==null:host!==id)) return null;
  const color = {
    success: "#83cc92",
    error: "#ffb4a8",
    info: "#b8d3ee",
    warning: "#efca7d",
  }[notice.kind];
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: Math.max(12, insets.top),
        left: 12,
        right: 12,
        zIndex: 100,
      }}
    >
      <Animated.View
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingLeft: 14,
            paddingRight: 4,
            paddingVertical: 4,
            borderRadius: 10,
            backgroundColor: c.panel,
            minHeight: 52,
            boxShadow: "0 4px 16px rgba(13,13,13,.2)",
          },
          reduced
            ? {}
            : {
                animationName: {
                  from: { opacity: 0, transform: [{ translateY: -8 }] },
                },
                animationDuration: "180ms",
                animationTimingFunction: cubicBezier(...motion.easeOut),
              },
        ]}
      >
        <Icon
          name={
            notice.kind === "success"
              ? "check"
              : notice.kind === "error"
                ? "error"
                : notice.kind === "warning"
                  ? "warning"
                  : "info"
          }
          color={color}
        />
        <T color={c["panel-ink"]} style={{ flex: 1 }}>
          {notice.text}
        </T>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
          onPress={dismiss}
          style={{
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="close" color={c["panel-ink"]} />
        </Pressable>
      </Animated.View>
    </View>
  );
}
export const useSnackbar = () => useContext(Context).show;
