import { View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Brand, Heading, T, Button, Hold } from "../../components/primitives";
import { Screen } from "../../components/screen";
import { TaskFooter } from "../../components/task-footer";
import { colors as c } from "../../theme/colors";
export default function Welcome() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: c.bg,
      }}
    >
      <Screen
        footer={
          <TaskFooter>
            <Button onPress={() => router.push("/signup")}>
              Create account
            </Button>
            <Button variant="dark" onPress={() => router.push("/login")}>
              Already climbing with us? Log in
            </Button>
          </TaskFooter>
        }
      >
        <View style={{ padding: 20, gap: 32, flexGrow: 1 }}>
          <Brand />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: 24,
              paddingVertical: 24,
            }}
          >
            <Hold colour="red" size={112} />
            <Hold colour="grey" size={78} />
          </View>
          <View style={{ gap: 16 }}>
            <Heading size={44}>{"Every try.\nA little further."}</Heading>
            <T size={16} color={c["ink-muted"]}>
              Log your climbs. Pick up where you left off.
            </T>
          </View>
        </View>
      </Screen>
    </View>
  );
}
