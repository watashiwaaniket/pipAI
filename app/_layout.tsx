import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { AppState } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAppStore } from "@/stores/appStore";
import { useModelStore } from "@/stores/modelStore";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const UNSTABLE_SETTINGS = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "onborading/welcome",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Share Tech Mono": require("../assets/fonts/ShareTechMono-Regular.ttf"),
  });

  const [mounted, setMounted] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const initializeModels = useModelStore((s) => s.initialize);
  const verifyDownloads = useModelStore((s) => s.verifyDownloads);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (mounted) {
      initializeModels();
      verifyDownloads();

      const subscription = AppState.addEventListener("change", (nextState) => {
        if (nextState === "active") {
          verifyDownloads();
        }
      });
      return () => subscription.remove();
    }
  }, [mounted, initializeModels, verifyDownloads]);

  useEffect(() => {
    if (!mounted || !loaded) return;

    const inOnboardingGroup = segments[0] === "onborading";

    if (!onboardingComplete && !inOnboardingGroup) {
      router.replace("/onborading/welcome");
    } else if (onboardingComplete && inOnboardingGroup) {
      router.replace("/(tabs)");
    }
  }, [onboardingComplete, segments, loaded, mounted]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onborading" options={{ headerShown: false }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" backgroundColor="#0A0A0A" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
