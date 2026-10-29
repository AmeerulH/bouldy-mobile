import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { A, Button, Feedback, Field, Heading, T } from '../../../components/primitives';
import { Screen, Waiting } from '../../../components/screen';
import { Sheet } from '../../../components/sheet';
import { useSnapshot } from '../../../data/snapshot';
import { useAuth } from '../../../platform/auth';
import { useSheetNavigation } from '../../../platform/sheet-navigation';
import { colors as c } from '../../../theme/colors';
import { s } from '../../../theme/styles';

export default function Gyms() {
  const { data, error: readError } = useSnapshot('gyms'), auth = useAuth(), nav = useSheetNavigation();
  const [name, setName] = useState(''), [location, setLocation] = useState('');
  const [adding, setAdding] = useState(false), [starting, setStarting] = useState<number | null>(null);
  const [localError, setLocalError] = useState(''), busy = useRef(false);
  function openAdd() { setName(''); setLocation(''); setLocalError(''); nav.open('add-gym'); }
  async function start(gymId: number) {
    if (busy.current) return;
    busy.current = true; setStarting(gymId); setLocalError('');
    try {
      const out = await auth.command('startSession', { gym_id: gymId });
      if (out.destination) {
        if (out.destination.startsWith('/gyms?')) nav.apply(out.destination);
        else router.push(out.destination as never);
      }
    } catch (issue) { setLocalError((issue as Error).message); }
    finally { busy.current = false; setStarting(null); }
  }
  async function add() {
    if (busy.current) return;
    busy.current = true; setAdding(true); setLocalError('');
    try {
      const out = await auth.command('addGym', { name, location });
      if (out.destination) nav.apply(out.destination);
    } catch (issue) { setLocalError((issue as Error).message); }
    finally { busy.current = false; setAdding(false); }
  }
  if (!data) return <Screen><Waiting error={readError} page="gyms" /></Screen>;
  const gyms = data.gyms ?? [], sheetOpen = nav.sheet === 'add-gym';
  const error = localError || nav.error;
  return <View style={{ flex: 1 }}><Screen><View style={[s.page, { paddingTop: 24, gap: 28 }]}>
    <View style={[s.between, { alignItems: 'flex-end', gap: 12 }]}><View style={{ flex: 1 }}><T color={c['ink-muted']}>Choose your wall.</T><Heading size={36} style={{ marginTop: 4, lineHeight: 32.4, letterSpacing: -1.08 }}>Gyms</Heading></View><Button variant="soft" onPress={openAdd} style={{ minHeight: 44, paddingHorizontal: 16 }} labelStyle={{ fontSize: 14 }}>+ Add gym</Button></View>
    {error && !sheetOpen ? <Feedback>{error}</Feedback> : null}
    <View><View style={[s.between, { alignItems: 'baseline', gap: 12 }]}><Heading>All gyms</Heading><T color={c['ink-muted']}>{gyms.length} total</T></View>
      {!gyms.length ? <T color={c['ink-muted']} style={{ marginTop: 16, maxWidth: 280, lineHeight: 24 }}>Add the first gym and you’ll be ready to start your first session.</T> : <View style={{ marginTop: 16, borderTopWidth: 1, borderColor: c.hairline }}>{gyms.map(gym => <View key={gym.id} style={[s.row, { gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderColor: c.hairline }]}>
        <A href={`/gyms/${gym.id}`} style={{ flex: 1, paddingVertical: 8 }}><Heading size={20} style={{ fontFamily: 'BarlowCondensed-700' }}>{gym.name}</Heading><T color={c['ink-muted']} lines={1} style={{ marginTop: 6 }}>{gym.location} · View routes</T></A>
        <Button variant="dark" pending={starting === gym.id} pendingLabel="Starting" onPress={() => void start(gym.id)} style={{ minHeight: 44, paddingHorizontal: 16 }} labelStyle={{ fontSize: 12 }}>Start</Button>
      </View>)}</View>}
    </View>
    <A href="/sessions" color={c['ink-muted']} textStyle={{ textAlign: 'center', textDecorationLine: 'underline' }}>View your session journal</A>
  </View></Screen>
    <Sheet title="Add a gym" open={sheetOpen} close={() => { setLocalError(''); nav.close(); }}><View style={{ gap: 16 }}>
      {error ? <Feedback>{error}</Feedback> : null}
      <Field label="Gym name" value={name} onChangeText={setName} placeholder="e.g. Bump Bouldering" editable={!adding} />
      <Field label="Location" value={location} onChangeText={setLocation} placeholder="e.g. Petaling Jaya" editable={!adding} onSubmitEditing={() => void add()} />
      <T color={c['ink-muted']}><T weight={600}>Coming soon:</T> each gym will be able to label its grading system in its own words.</T>
      <Button pending={adding} pendingLabel="Adding gym" onPress={() => void add()}>Add gym</Button>
    </View></Sheet>
  </View>;
}
