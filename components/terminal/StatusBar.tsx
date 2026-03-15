import { terminal as t } from "@/theme/terminal";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PipStatusBarProps {
  title?: string;
  modelName?: string;
}

export const PipStatusBar: React.FC<PipStatusBarProps> = ({
  title = "PIP-AI",
  modelName,
}) => {
  return (
    <View style={styles.bar}>
      <Text style={styles.left}>{"[ "}{title}{" ]"}</Text>
      <Text style={styles.center}>OFFLINE MODE</Text>
      {modelName ? (
        <Text style={styles.right} numberOfLines={1}>
          {modelName.toUpperCase()}
        </Text>
      ) : (
        <Text style={[styles.right, styles.warn]}>NO MODEL</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: t.colors.bgRaised,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.primaryMuted,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.sm,
  },
  left: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primary,
    fontWeight: "700",
  },
  center: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.warning,
    letterSpacing: 1,
  },
  right: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.primaryDim,
    maxWidth: 120,
  },
  warn: {
    color: t.colors.danger,
  },
});
