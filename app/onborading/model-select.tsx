import * as Device from "expo-device";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScanlineOverlay } from "../../components/terminal/ScanlineOverlay";
import { AVAILABLE_MODELS, MODEL_TIERS } from "../../constants/models";
import { useModelStore } from "../../stores/modelStore";
import { terminal } from "../../theme/terminal";

export default function ModelSelectScreen() {
  const [selected, setSelected] = useState<"light" | "heavy" | null>(null);
  const { startDownload } = useModelStore();

  // suggest tier based on device RAM
  const ramGB = (Device.totalMemory ?? 0) / 1_073_741_824;
  const recommended: "light" | "heavy" = ramGB >= 6 ? "heavy" : "light";

  const handleConfirm = async () => {
    if (!selected) return;
    const tier = MODEL_TIERS[selected];
    await startDownload(tier.modelId);
    router.replace("/(tabs)");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScanlineOverlay />

      <Text style={styles.header}>╔══ SELECT INTELLIGENCE MODULE ══╗</Text>
      <Text style={styles.sub}>
        {">"} DETECTED RAM: {ramGB.toFixed(1)}GB
        {"\n"}
        {">"} RECOMMENDED: {recommended.toUpperCase()} UNIT
      </Text>

      {(["light", "heavy"] as const).map((tier) => {
        const model = AVAILABLE_MODELS.find(
          (m: any) => m.id === MODEL_TIERS[tier].modelId,
        )!;
        const isSelected = selected === tier;
        const isRec = recommended === tier;

        return (
          <TouchableOpacity
            key={tier}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => setSelected(tier)}
          >
            <Text style={styles.cardTitle}>
              {isSelected ? "▶ " : "  "}[{tier.toUpperCase()} UNIT] {model.name}
            </Text>
            <Text style={styles.cardDetail}>PARAMS : {model.params}</Text>
            <Text style={styles.cardDetail}>
              SIZE : {(model.sizeBytes / 1e9).toFixed(1)}GB
            </Text>
            <Text style={styles.cardDetail}>
              CONTEXT : {model.contextLength} tokens
            </Text>
            <Text style={styles.cardDetail}>
              SPEED :{" "}
              {tier === "light"
                ? "FAST — LOWER ACCURACY"
                : "SLOW — HIGHER ACCURACY"}
            </Text>
            {isRec && (
              <Text style={styles.recommended}>
                {">>> RECOMMENDED FOR YOUR DEVICE <<<"}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}

      <Text style={styles.note}>
        {">"} You can switch models anytime in SETTINGS.{"\n"}
        {">"} Requires Wi-Fi for initial download.{"\n"}
        {">"} After that, fully offline.
      </Text>

      <TouchableOpacity
        style={[styles.confirmBtn, !selected && styles.confirmDisabled]}
        onPress={handleConfirm}
        disabled={!selected}
      >
        <Text style={styles.confirmText}>
          {selected
            ? "[ CONFIRM & DOWNLOAD MODULE ]"
            : "[ SELECT A MODULE TO CONTINUE ]"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = terminal;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: s.colors.bg },
  content: { padding: s.spacing.lg },
  header: {
    fontFamily: s.fonts.mono,
    fontSize: s.fonts.size.lg,
    color: s.colors.primary,
    marginBottom: s.spacing.md,
  },
  sub: {
    fontFamily: s.fonts.mono,
    fontSize: s.fonts.size.sm,
    color: s.colors.primaryDim,
    marginBottom: s.spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderColor: s.colors.primaryMuted,
    padding: s.spacing.md,
    marginBottom: s.spacing.md,
    backgroundColor: s.colors.bgRaised,
  },
  cardSelected: {
    borderColor: s.colors.primary,
    backgroundColor: s.colors.primaryGhost,
  },
  cardTitle: {
    fontFamily: s.fonts.mono,
    fontSize: s.fonts.size.md,
    color: s.colors.primary,
    marginBottom: s.spacing.sm,
  },
  cardDetail: {
    fontFamily: s.fonts.mono,
    fontSize: s.fonts.size.sm,
    color: s.colors.primaryDim,
  },
  recommended: {
    fontFamily: s.fonts.mono,
    fontSize: s.fonts.size.xs,
    color: s.colors.warning,
    marginTop: s.spacing.sm,
  },
  note: {
    fontFamily: s.fonts.mono,
    fontSize: s.fonts.size.xs,
    color: s.colors.textMuted,
    marginVertical: s.spacing.lg,
  },
  confirmBtn: {
    borderWidth: 1,
    borderColor: s.colors.primary,
    padding: s.spacing.md,
    alignItems: "center",
  },
  confirmDisabled: { borderColor: s.colors.primaryMuted },
  confirmText: {
    fontFamily: s.fonts.mono,
    fontSize: s.fonts.size.md,
    color: s.colors.primary,
  },
});
