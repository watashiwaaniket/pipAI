import { llamaService } from "@/services/llama.service";
import { selectIsReady, useAppStore } from "@/stores/appStore";
import { useModelStore } from "@/stores/modelStore";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState, Platform, UIManager } from "react-native";
import "react-native-reanimated";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ShareTechMono: require("../assets/fonts/ShareTechMono-Regular.ttf"),
  });

  const isReady = useAppStore(selectIsReady);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const activeModelId = useAppStore((s) => s.activeModelId);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    useModelStore.getState().initialize();
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;
    const inOnboarding = segments[0] === "onborading";
    if (!onboardingComplete && !inOnboarding) {
      router.replace("/onborading/welcome");
    }
  }, [fontsLoaded, onboardingComplete, segments, router]);

  useEffect(() => {
    if (!isReady || !activeModelId) return;
    const meta = useModelStore.getState().meta[activeModelId];
    if (meta?.isDownloaded && meta.localPath) {
      llamaService.loadModel(activeModelId, meta.localPath);
    }
  }, [isReady, activeModelId]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        useModelStore.getState().verifyDownloads();
      }
    });
    return () => sub.remove();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onborading" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="light" backgroundColor="#0A0A0A" />
    </ThemeProvider>
  );
}
