import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScanlineOverlay } from "../../components/terminal/ScanlineOverlay";
import { useAppStore } from "../../stores/appStore";
import { terminal } from "../../theme/terminal";

const BOOT_LINES = [
  "> PIP-AI FIELD UNIT v1.0",
  "> INITIALIZING NEURAL CORE...",
  "> SCANNING HARDWARE PROFILE...",
  "> RAM: SUFFICIENT",
  "> NETWORK STATUS: OFFLINE [NOMINAL]",
  "> LOADING SURVIVAL PROTOCOLS...",
  "> ALL SYSTEMS OPERATIONAL",
  "",
  "> WELCOME, SURVIVOR.",
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);

  useEffect(() => {
    if (onboardingComplete) {
      router.replace("/(tabs)");
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => router.push("/onborading/model-select" as any), 1200);
        return;
      }
      setVisibleLines((prev) => [...prev, BOOT_LINES[i]]);
      i++;
    }, 320);

    return () => clearInterval(interval);
  }, [onboardingComplete]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScanlineOverlay />
      {visibleLines.map((line, idx) => (
        <Text key={idx} style={styles.line}>
          {line}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: terminal.colors.bg,
    padding: terminal.spacing.xl,
    justifyContent: "center",
  },
  line: {
    fontFamily: terminal.fonts.mono,
    fontSize: terminal.fonts.size.md,
    color: terminal.colors.primaryDim,
    lineHeight: terminal.fonts.size.md * terminal.fonts.lineHeight.loose,
  },
});
