import { DownloadProgress } from "@/components/models/DownloadProgress";
import { useModel } from "@/hooks/useModel";
import { useModelStore } from "@/stores/modelStore";
import { terminal as t } from "@/theme/terminal";
import { ModelConfig } from "@/types";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ModelCardProps {
  model: ModelConfig;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const { downloadState, isLoaded, meta } = useModel(model.id);
  const { startDownload, pauseDownload, cancelDownload, activateModel, deleteModel } =
    useModelStore();
  const [confirming, setConfirming] = useState(false);

  const isDownloading = downloadState?.status === "downloading";
  const isPaused = downloadState?.status === "paused";
  const hasError = downloadState?.status === "error";
  const isInFlight = isDownloading || isPaused || hasError;

  const sizegb = (model.sizeBytes / 1e9).toFixed(1);

  const handleDelete = () => {
    Alert.alert(
      "CONFIRM DELETION",
      `> DELETE ${model.name.toUpperCase()}?\nThis frees ${sizegb} GB.`,
      [
        { text: "[N] Cancel", style: "cancel" },
        {
          text: "[Y] Delete",
          style: "destructive",
          onPress: () => deleteModel(model.id),
        },
      ],
    );
  };

  return (
    <View style={[styles.card, isLoaded && styles.cardActive]}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {isLoaded ? "[ACTIVE] " : ""}
          {model.name.toUpperCase()}
        </Text>
        {isLoaded && <Text style={styles.activeBadge}>● LOADED</Text>}
      </View>

      <Text style={styles.meta}>
        {model.params} | {sizegb} GB | CTX {model.contextLength}
      </Text>
      <Text style={styles.meta}>
        FAMILY: {model.family.toUpperCase()} | TIER: {model.tier.toUpperCase()}
      </Text>

      {isInFlight && downloadState && (
        <DownloadProgress modelName={model.name} downloadState={downloadState} />
      )}

      <View style={styles.actions}>
        {!meta.isDownloaded && !isInFlight && (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => startDownload(model.id)}
          >
            <Text style={styles.btnDownload}>[ DOWNLOAD MODULE ]</Text>
          </TouchableOpacity>
        )}

        {isDownloading && (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => pauseDownload(model.id)}
          >
            <Text style={styles.btnWarn}>[ PAUSE ]</Text>
          </TouchableOpacity>
        )}

        {isPaused && (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => startDownload(model.id)}
          >
            <Text style={styles.btnDownload}>[ RESUME ]</Text>
          </TouchableOpacity>
        )}

        {(isDownloading || isPaused) && (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => cancelDownload(model.id)}
          >
            <Text style={styles.btnDanger}>[ CANCEL ]</Text>
          </TouchableOpacity>
        )}

        {meta.isDownloaded && !isLoaded && (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => activateModel(model.id)}
          >
            <Text style={styles.btnActivate}>[ ACTIVATE ]</Text>
          </TouchableOpacity>
        )}

        {meta.isDownloaded && !isLoaded && (
          <TouchableOpacity style={styles.btn} onPress={handleDelete}>
            <Text style={styles.btnDanger}>[ DELETE ]</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: t.colors.primaryMuted,
    backgroundColor: t.colors.bgRaised,
    padding: t.spacing.md,
    marginBottom: t.spacing.md,
  },
  cardActive: {
    borderColor: t.colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: t.spacing.xs,
  },
  name: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.md,
    color: t.colors.primary,
    fontWeight: "700",
    flex: 1,
  },
  activeBadge: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.primary,
    letterSpacing: 1,
  },
  meta: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.textMuted,
    marginBottom: 2,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: t.spacing.sm,
    marginTop: t.spacing.sm,
  },
  btn: {
    paddingHorizontal: t.spacing.sm,
    paddingVertical: t.spacing.xs,
    borderWidth: 1,
    borderColor: t.colors.primaryMuted,
  },
  btnDownload: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.primary,
    fontWeight: "700",
  },
  btnActivate: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: "#00AAFF",
    fontWeight: "700",
  },
  btnWarn: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.warning,
  },
  btnDanger: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.danger,
  },
});
