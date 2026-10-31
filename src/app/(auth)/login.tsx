import { plainMessage } from "../../features/error-copy";
import { Screen } from "../../components/screen";
import { TaskFooter } from "../../components/task-footer";
import { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Brand,
  Heading,
  T,
  Button,
  Field,
  Feedback,
} from "../../components/primitives";
import { useAuth } from "../../platform/auth";
import { colors as c } from "../../theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function Login() {
  const a = useAuth();
  const params = useLocalSearchParams<{ error?: string }>();
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(params.error ?? ""),
    [pending, setPending] = useState(false);
  const insets = useSafeAreaInsets();
  async function login() {
    setPending(true);
    setError("");
    try {
      const out = await a.command("login", { email, password });
      if (out.destination === "/") router.replace("/");
      else if (out.destination)
        setError(
          new URL(out.destination, "http://local").searchParams.get("error") ??
            "",
        );
    } catch (e) {
      setError(plainMessage(e as Error & { status?: number }));
    } finally {
      setPending(false);
    }
  }
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
        back="/welcome"
        label="Welcome"
        footer={
          <TaskFooter>
            <Button onPress={login} pending={pending} pendingLabel="Logging in">
              Log in
            </Button>
            <Button variant="dark" onPress={() => router.replace("/signup")}>
              Create account
            </Button>
          </TaskFooter>
        }
      >
        <View style={{ padding: 20, gap: 24 }}>
          <Brand />
          <View style={{ gap: 8 }}>
            <Heading size={36}>Welcome back.</Heading>
            <T size={16} color={c["ink-muted"]}>
              Your climbs are right where you left them.
            </T>
          </View>
          {error ? <Feedback>{error}</Feedback> : null}
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!pending}
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="current-password"
            editable={!pending}
            onSubmitEditing={login}
          />
        </View>
      </Screen>
    </View>
  );
}
