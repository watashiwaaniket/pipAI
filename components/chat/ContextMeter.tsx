import { terminal as t } from "@/theme/terminal";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ContextMeterProps {
  used: number;
  max: number;
}

const FILLED = "█";
const EMPTY = "░";
const BARS = 20;

export const ContextMeter: React.FC<ContextMeterProps> = ({ used, max }) => {
  const ratio = Math.min(used / max, 1);
  const pct = Math.round(ratio * 100);
  const filled = Math.round(ratio * BARS);

  const barColor =
    ratio > 0.9
      ? t.colors.danger
      : ratio > 0.7
        ? t.colors.warning
        : t.colors.primary;

  const bar =
    FILLED.repeat(filled) + EMPTY.repeat(BARS - filled);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.bar, { color: barColor }]}>[{bar}]</Text>
      <Text style={[styles.pct, { color: barColor }]}>{pct}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.xs,
  },
  bar: {
    fontFamily: t.fonts.mono,
    fontSize: 9,
    letterSpacing: -0.5,
  },
  pct: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
  },
});
