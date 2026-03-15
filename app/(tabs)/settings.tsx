import { ModelCard } from "@/components/models/ModelCard";
import { ScanlineOverlay } from "@/components/terminal/ScanlineOverlay";
import { PipStatusBar } from "@/components/terminal/StatusBar";
import { AVAILABLE_MODELS } from "@/constants/models";
import { useAppStore } from "@/stores/appStore";
import { selectStorageUsedLabel, useModelStore } from "@/stores/modelStore";
import { terminal as t } from "@/theme/terminal";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const models = useModelStore((s) => s.models);
  const lastError = useModelStore((s) => s.lastError);
  const clearError = useModelStore((s) => s.clearError);
  const storageLabel = useModelStore(selectStorageUsedLabel);

  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const resetSettings = useAppStore((s) => s.resetSettings);
  const reset = useAppStore((s) => s.reset);
  const activeModelId = useAppStore((s) => s.activeModelId);

  const router = useRouter();
  const activeModel = activeModelId
    ? AVAILABLE_MODELS.find((m) => m.id === activeModelId)
    : null;

  const handleFactoryReset = () => {
    Alert.alert(
      "FACTORY RESET",
      "> ALL SETTINGS AND CHATS WILL BE ERASED.\n> CONFIRM?",
      [
        { text: "[N] Cancel", style: "cancel" },
        {
          text: "[Y] Confirm",
          style: "destructive",
          onPress: () => {
            reset();
            router.replace("/onborading/welcome");
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScanlineOverlay />
      <PipStatusBar title="CONFIG" modelName={activeModel?.name} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionHeader}>╔══ SYSTEM CONFIGURATION ══╗</Text>

        {lastError && (
          <TouchableOpacity style={styles.errorBanner} onPress={clearError}>
            <Text style={styles.errorText}>! {lastError}</Text>
            <Text style={styles.errorDismiss}>[DISMISS]</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.section}>{">"} INTELLIGENCE MODULES</Text>
        {models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}

        <Text style={styles.section}>{">"} STORAGE</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>TOTAL USED</Text>
          <Text style={styles.infoValue}>{storageLabel}</Text>
        </View>

        <Text style={styles.section}>{">"} DISPLAY SETTINGS</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>SCANLINES</Text>
          <Switch
            value={settings.scanlineEnabled}
            onValueChange={(v) => updateSettings({ scanlineEnabled: v })}
            trackColor={{ false: t.colors.primaryMuted, true: t.colors.primary }}
            thumbColor={t.colors.bg}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>STREAMING</Text>
          <Switch
            value={settings.streamingEnabled}
            onValueChange={(v) => updateSettings({ streamingEnabled: v })}
            trackColor={{ false: t.colors.primaryMuted, true: t.colors.primary }}
            thumbColor={t.colors.bg}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>TYPEWRITER SPEED</Text>
          <Text style={styles.settingValue}>{settings.typewriterSpeed}ms</Text>
        </View>
        <View style={styles.sliderRow}>
          {[8, 14, 18, 28, 40].map((speed) => (
            <TouchableOpacity
              key={speed}
              onPress={() => updateSettings({ typewriterSpeed: speed })}
              style={[
                styles.speedBtn,
                settings.typewriterSpeed === speed && styles.speedBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.speedBtnText,
                  settings.typewriterSpeed === speed && styles.speedBtnTextActive,
                ]}
              >
                {speed}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.section}>{">"} SYSTEM PROMPT</Text>
        <TextInput
          style={styles.promptInput}
          value={settings.systemPrompt}
          onChangeText={(v) => updateSettings({ systemPrompt: v })}
          multiline
          numberOfLines={8}
          placeholderTextColor={t.colors.primaryMuted}
          selectionColor={t.colors.primary}
        />
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={resetSettings}
        >
          <Text style={styles.actionBtnText}>[ RESET SETTINGS ]</Text>
        </TouchableOpacity>

        <Text style={styles.section}>{">"} SYSTEM INFO</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>VERSION</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NETWORK</Text>
          <Text style={styles.infoValue}>OFFLINE ONLY</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>INFERENCE</Text>
          <Text style={styles.infoValue}>llama.rn / llama.cpp</Text>
        </View>

        <Text style={[styles.section, styles.dangerSection]}>{">"} DANGER ZONE</Text>
        <TouchableOpacity
          style={styles.dangerBtn}
          onPress={handleFactoryReset}
        >
          <Text style={styles.dangerBtnText}>[ FACTORY RESET ]</Text>
        </TouchableOpacity>
        <Text style={styles.dangerHint}>
          Clears all settings, chats, and removes active model — cannot be undone.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: t.colors.bg },
  scroll: { padding: t.spacing.md, paddingBottom: 64 },
  sectionHeader: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.lg,
    color: t.colors.primary,
    marginBottom: t.spacing.md,
  },
  section: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primaryDim,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: t.spacing.lg,
    marginBottom: t.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.primaryMuted,
    paddingBottom: t.spacing.xs,
  },
  dangerSection: {
    color: t.colors.danger,
    borderBottomColor: t.colors.danger,
  },
  errorBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2A0000",
    borderWidth: 1,
    borderColor: t.colors.danger,
    padding: t.spacing.sm,
    marginBottom: t.spacing.md,
  },
  errorText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.danger,
    flex: 1,
  },
  errorDismiss: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.danger,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: t.spacing.xs,
  },
  infoLabel: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.textMuted,
  },
  infoValue: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primaryDim,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: t.spacing.sm,
  },
  settingLabel: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primaryDim,
  },
  settingValue: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primary,
  },
  sliderRow: {
    flexDirection: "row",
    gap: t.spacing.sm,
    marginBottom: t.spacing.sm,
  },
  speedBtn: {
    borderWidth: 1,
    borderColor: t.colors.primaryMuted,
    paddingHorizontal: t.spacing.sm,
    paddingVertical: t.spacing.xs,
  },
  speedBtnActive: {
    borderColor: t.colors.primary,
    backgroundColor: t.colors.primaryGhost,
  },
  speedBtnText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.textMuted,
  },
  speedBtnTextActive: {
    color: t.colors.primary,
    fontWeight: "700",
  },
  promptInput: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.primaryDim,
    backgroundColor: t.colors.bgRaised,
    borderWidth: 1,
    borderColor: t.colors.primaryMuted,
    padding: t.spacing.sm,
    lineHeight: t.fonts.size.sm * 1.5,
    minHeight: 120,
    textAlignVertical: "top",
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: t.colors.primaryMuted,
    padding: t.spacing.sm,
    alignItems: "center",
    marginTop: t.spacing.sm,
  },
  actionBtnText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primaryMuted,
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: t.colors.danger,
    padding: t.spacing.md,
    alignItems: "center",
    marginBottom: t.spacing.sm,
  },
  dangerBtnText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.md,
    color: t.colors.danger,
    fontWeight: "700",
    letterSpacing: 1,
  },
  dangerHint: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.textMuted,
    marginBottom: t.spacing.lg,
  },
});
