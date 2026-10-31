import { plainMessage } from "../../features/error-copy";
import { Screen } from "../../components/screen";
import { TaskFooter } from "../../components/task-footer";
import { useRef, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Brand,
  Button,
  Feedback,
  Field,
  Heading,
  T,
} from "../../components/primitives";
import { useAuth } from "../../platform/auth";
import { colors as c } from "../../theme/colors";

export default function Signup() {
  const auth = useAuth(),
    params = useLocalSearchParams<{ error?: string }>();
  const [username, setUsername] = useState(""),
    [email, setEmail] = useState("");
  const [password, setPassword] = useState(""),
    [grade, setGrade] = useState("");
  const [error, setError] = useState(params.error ?? ""),
    [pending, setPending] = useState(false);
  const submitting = useRef(false),
    insets = useSafeAreaInsets();
  async function signup() {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError("");
    try {
      const out = await auth.command("signup", {
        username,
        email,
        password,
        current_grade: grade,
      });
      if (out.destination === "/") router.replace("/");
      else if (out.destination)
        setError(
          new URL(out.destination, "http://local").searchParams.get("error") ??
            "",
        );
    } catch (issue) {
      setError(plainMessage(issue as Error & { status?: number }));
    } finally {
      submitting.current = false;
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
            <Button
              pending={pending}
              pendingLabel="Creating account"
              onPress={() => void signup()}
            >
              Create account
            </Button>
            <Button variant="dark" onPress={() => router.replace("/login")}>
              Log in
            </Button>
          </TaskFooter>
        }
      >
        <View style={{ padding: 20, gap: 20 }}>
          <Brand />
          <View style={{ gap: 8 }}>
            <Heading size={36}>Make it your journal.</Heading>
            <T size={16} color={c["ink-muted"]}>
              Start with the basics. The wall can wait.
            </T>
          </View>
          {error ? <Feedback>{error}</Feedback> : null}
          <Field
            label="Name"
            value={username}
            onChangeText={setUsername}
            autoComplete="username"
            editable={!pending}
          />
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
            autoComplete="new-password"
            editable={!pending}
          />
          <Field
            label="Current grade"
            optional
            value={grade}
            onChangeText={setGrade}
            placeholder="V4"
            editable={!pending}
          />
        </View>
      </Screen>
    </View>
  );
}
