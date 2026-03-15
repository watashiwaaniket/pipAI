import { terminal as t } from "@/theme/terminal";
import { DownloadState } from "@/types";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface DownloadProgressProps {
  modelName: string;
  downloadState: DownloadState;
}

const BARS = 20;
const FILLED = "█";
const EMPTY = "░";

export const DownloadProgress: React.FC<DownloadProgressProps> = ({
  modelName,
  downloadState,
}) => {
  const animWidth = useRef(new Animated.Value(0)).current;
  const { progress, bytesWritten, status } = downloadState;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, animWidth]);

  const filled = Math.round(progress * BARS);
  const bar = FILLED.repeat(filled) + EMPTY.repeat(BARS - filled);
  const pct = Math.round(progress * 100);
  const mb = (bytesWritten / 1e6).toFixed(0);

  const statusLabel =
    status === "paused"
      ? "PAUSED"
      : status === "error"
        ? "ERROR"
        : "DOWNLOADING";

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {statusLabel} INTELLIGENCE MODULE...
      </Text>
      <Text style={styles.name}>{modelName.toUpperCase()}</Text>
      <View style={styles.barRow}>
        <Text style={[styles.bar, status === "error" && styles.barError]}>
          [{bar}]{" "}
        </Text>
        <Text style={[styles.pct, status === "error" && styles.pctError]}>
          {pct}%
        </Text>
        <Text style={styles.bytes}>  — {mb} MB</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: t.spacing.sm,
    paddingTop: t.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: t.colors.primaryMuted,
  },
  label: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.warning,
    marginBottom: t.spacing.xs,
    letterSpacing: 0.5,
  },
  name: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.primaryMuted,
    marginBottom: t.spacing.xs,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  bar: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.primary,
    letterSpacing: -0.5,
  },
  barError: { color: t.colors.danger },
  pct: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.primary,
  },
  pctError: { color: t.colors.danger },
  bytes: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.textMuted,
  },
});
