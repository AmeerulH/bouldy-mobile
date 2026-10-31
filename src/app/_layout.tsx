import React from "react";
import { View, Platform, type ViewStyle } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../platform/auth";
import { usePwa } from "../platform/pwa";
import { colors as c } from "../theme/colors";
import "./global.css";
import { NavigationProvider } from "../components/navigation-provider";
import { SnackbarProvider } from "../components/snackbar";
import { LaunchSplash } from "../components/launch-splash";
import { PageLoader } from "../components/page-loader";

// Native screens fill the device. Only the browser keeps a phone-width canvas.
const frameStyle: ViewStyle = {
  flex: 1,
  width: "100%",
  backgroundColor: c.bg,
  ...(Platform.OS === "web" ? { maxWidth: 430, alignSelf: "center" } : {}),
};

export default function Root() {
  usePwa();
  const [loaded, error] = useFonts({
    "BarlowCondensed-600": require("../../assets/fonts/BarlowCondensed-600.ttf"),
    "BarlowCondensed-700": require("../../assets/fonts/BarlowCondensed-700.ttf"),
    "BarlowCondensed-800": require("../../assets/fonts/BarlowCondensed-800.ttf"),
    "Geist-400": require("../../assets/fonts/Geist-400.ttf"),
    "Geist-500": require("../../assets/fonts/Geist-500.ttf"),
    "Geist-600": require("../../assets/fonts/Geist-600.ttf"),
    "Geist-700": require("../../assets/fonts/Geist-700.ttf"),
    "Geist-800": require("../../assets/fonts/Geist-800.ttf"),
    "GeistMono-400": require("../../assets/fonts/GeistMono-400.ttf"),
  });
  if (error) throw error;
  if (!loaded)
    return (
      <View style={frameStyle}>
        <PageLoader label="Preparing Bouldy…" />
      </View>
    );
  return (
    <SafeAreaProvider style={{ backgroundColor: c.bg }}>
      <AuthProvider>
        <StatusBar style="dark" />
        <View
          style={[
            frameStyle,
            Platform.OS === "web"
              ? { height: "100dvh" as never, overflow: "hidden" }
              : {},
          ]}
        >
          <SnackbarProvider>
            <NavigationProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "none",
                  contentStyle: { backgroundColor: c.bg },
                }}
              />
            </NavigationProvider>
          </SnackbarProvider>
          <LaunchSplash />
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export { BouldyErrorBoundary as ErrorBoundary } from "../components/error-boundary";
