import { SlideTextButton } from '../../components/slide-text-button';
import { useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand, Button, Feedback, Field, Heading, Hold, T } from '../../components/primitives';
import { useAuth } from '../../platform/auth';
import { colors as c } from '../../theme/colors';

export default function Signup() {
  const auth = useAuth(), params = useLocalSearchParams<{ error?: string }>();
  const [username, setUsername] = useState(''), [email, setEmail] = useState('');
  const [password, setPassword] = useState(''), [grade, setGrade] = useState('');
  const [error, setError] = useState(params.error ?? ''), [pending, setPending] = useState(false);
  const submitting = useRef(false), { width } = useWindowDimensions(), insets = useSafeAreaInsets();
  async function signup() {
    if (submitting.current) return;
    submitting.current = true; setPending(true); setError('');
    try {
      const out = await auth.command('signup', { username, email, password, current_grade: grade });
      if (out.destination === '/') router.replace('/');
      else if (out.destination) setError(new URL(out.destination, 'http://local').searchParams.get('error') ?? '');
    } catch (issue) { setError((issue as Error).message); }
    finally { submitting.current = false; setPending(false); }
  }
  return <ScrollView automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 26, paddingHorizontal: 24, paddingTop: 36 + insets.top, paddingBottom: 36 + insets.bottom, backgroundColor: c.bg }}>
    <View><Brand /><View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 30 }}>
      <View style={{ flexShrink: 1 }}><Heading size={36} style={{ lineHeight: 34.2, letterSpacing: -.72 }}>{'Every climb.\nYour story.'}</Heading><T color={c['ink-muted']} style={{ marginTop: 12, lineHeight: 24, maxWidth: 234 }}>Start your journal. Find your next wall.</T></View>
      <Hold colour="green" size={width <= 360 ? 72 : 100} style={{ transform: [{ rotate: '-14deg' }] }} />
    </View></View>
    {error ? <Feedback>{error}</Feedback> : null}
    <View style={{ gap: 16 }}>
      <Field label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" autoComplete="username" editable={!pending} />
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" editable={!pending} />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" editable={!pending} />
      <Field label="Current grade" optional value={grade} onChangeText={setGrade} placeholder="V4" editable={!pending} onSubmitEditing={() => void signup()} />
      <Button pending={pending} pendingLabel="Creating account" onPress={() => void signup()} style={{ marginTop: 8 }}>Create account</Button>
    </View>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}><T color={c['ink-muted']}>Already climbing with us?</T><SlideTextButton href="/login" text="Log in" hoverText="Welcome back"/></View>
  </ScrollView>;
}
