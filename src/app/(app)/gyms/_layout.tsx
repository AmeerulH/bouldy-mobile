import { Stack, Redirect } from "expo-router";
import { useSnapshot } from "../../../data/snapshot";
import { Waiting } from "../../../components/screen";
export default function CatalogueLayout() {
  const { data, error } = useSnapshot("profile");
  if (!data) return <Waiting error={error} />;
  if (!data.catalogueAdmin) return <Redirect href="/profile" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
