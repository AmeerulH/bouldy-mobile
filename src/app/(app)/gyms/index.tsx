import { reportFrom, reportFromDestination, useActionError } from "../../../components/error-sheet";
import { useRef, useState } from "react";
import { View } from "react-native";
import {
  A,
  Button,
  Feedback,
  Field,
  Heading,
  Icon,
  T,
  PageTitle,
} from "../../../components/primitives";
import { Screen, Waiting } from "../../../components/screen";
import { Sheet } from "../../../components/sheet";
import { useSnapshot } from "../../../data/snapshot";
import { useAuth } from "../../../platform/auth";
import { useSheetNavigation } from "../../../platform/sheet-navigation";
import { colors as c } from "../../../theme/colors";
import { s } from "../../../theme/styles";

export default function Gyms() {
  const { data, error: readError } = useSnapshot("gyms"),
    auth = useAuth(),
    nav = useSheetNavigation();
  const [name, setName] = useState(""),
    [location, setLocation] = useState("");
  const [adding, setAdding] = useState(false);
  const report = useActionError(),
    [localError, setLocalError] = useState(""),
    busy = useRef(false);
  function openAdd() {
    setName("");
    setLocation("");
    setLocalError("");
    nav.open("add-gym");
  }
  async function add() {
    if (busy.current) return;
    busy.current = true;
    setAdding(true);
    setLocalError("");
    try {
      const out = await auth.command("addGym", { name, location });
      const failure = reportFromDestination(out.destination, {
        context: "add-gym",
        retry: add,
      });
      if (failure?.server) report(failure);
      else if (out.destination) nav.apply(out.destination);
    } catch (issue) {
      report(reportFrom(issue, { context: "add-gym", retry: add }));
    } finally {
      busy.current = false;
      setAdding(false);
    }
  }
  if (!data)
    return (
      <Screen>
        <Waiting error={readError} page="gyms" />
      </Screen>
    );
  const gyms = data.gyms ?? [],
    sheetOpen = nav.sheet === "add-gym";
  const error = localError || nav.error;
  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <View style={[s.page, { paddingTop: 24, gap: 24 }]}>
          <View style={[s.between, { alignItems: "flex-end", gap: 12 }]}>
            <View style={{ flex: 1 }}>
              <T color={c["ink-muted"]}>
                {gyms.length === 1 ? "1 gym" : `${gyms.length} gyms`}
              </T>
              <View style={{ marginTop: 6 }}>
                <PageTitle>Gyms</PageTitle>
              </View>
            </View>
            <Button
              onPress={openAdd}
              style={{ minHeight: 44, paddingHorizontal: 16 }}
              labelStyle={{ fontSize: 14 }}
            >
              + Add gym
            </Button>
          </View>
          {error && !sheetOpen ? <Feedback>{error}</Feedback> : null}
          {!gyms.length ? (
            <View style={{ gap: 16, paddingVertical: 24 }}>
              <Heading size={24}>No gyms yet</Heading>
              <T
                color={c["ink-muted"]}
                style={{ maxWidth: 280, lineHeight: 24 }}
              >
                Add a gym first, then add its routes.
              </T>
            </View>
          ) : (
            <View
              style={{
                marginHorizontal: -20,
                borderTopWidth: 1,
                borderColor: c.hairline,
              }}
            >
              {gyms.map((gym) => (
                <A
                  key={gym.id}
                  href={`/gyms/${gym.id}`}
                  accessibilityLabel={`${gym.name}, ${gym.location}. Manage routes`}
                  style={[
                    s.row,
                    {
                      gap: 12,
                      minHeight: 72,
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderColor: c.hairline,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Heading
                      size={22}
                      style={{ fontFamily: "BarlowCondensed-700" }}
                    >
                      {gym.name}
                    </Heading>
                    <T
                      color={c["ink-muted"]}
                      lines={1}
                      style={{ marginTop: 4 }}
                    >
                      {gym.location}
                    </T>
                  </View>
                  <Icon name="next" size={20} />
                </A>
              ))}
            </View>
          )}
        </View>
      </Screen>
      <Sheet
        title="Add a gym"
        open={sheetOpen}
        close={() => {
          setLocalError("");
          nav.close();
        }}
      >
        <View style={{ gap: 16 }}>
          {error ? <Feedback>{error}</Feedback> : null}
          <Field
            label="Gym name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Bump Bouldering"
            editable={!adding}
          />
          <Field
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Petaling Jaya"
            editable={!adding}
            onSubmitEditing={() => void add()}
          />
          <Button
            pending={adding}
            pendingLabel="Adding gym"
            onPress={() => void add()}
          >
            Add gym
          </Button>
        </View>
      </Sheet>
    </View>
  );
}
