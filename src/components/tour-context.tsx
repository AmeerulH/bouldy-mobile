import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ComponentRef,
  type ReactNode,
  type RefObject,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

export type TourApi = {
  start: (guideId: string) => void;
  stop: () => void;
  active: string | null;
  register: (
    id: string,
    ref: RefObject<ComponentRef<typeof View> | null>,
  ) => () => void;
};

export const TourContext = createContext<TourApi>({
  start: () => {},
  stop: () => {},
  active: null,
  register: () => () => {},
});
export const useTour = () => useContext(TourContext);

/** Marks an element a guide step can spotlight. Adds one wrapper View and no styling. */
export function TourTarget({
  id,
  children,
  style,
}: {
  id: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { register } = useContext(TourContext),
    ref = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => register(id, ref), [id, register]);
  return (
    <View ref={ref} collapsable={false} style={style}>
      {children}
    </View>
  );
}
