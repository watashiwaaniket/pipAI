/**
 * SignalCard.tsx
 * PIP-AI — SOS screen signal reference card
 *
 * Displays a single SOSSignal entry in a collapsible
 * terminal-styled card. Tap the header to expand/collapse.
 *
 * Design language: Fallout Pip-Boy terminal — phosphor green
 * on near-black, monospace font, ASCII box-drawing borders,
 * no rounded corners, CRT aesthetic throughout.
 */

import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import type { SOSSignal } from "../../data/sos";
import { terminal as t } from "../../theme/terminal";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const CATEGORY_GLYPH: Record<string, string> = {
  VISUAL: "[*]",
  "AUDIO/LIGHT": "[~]",
  AUDIO: "[~]",
  LOCATION: "[+]",
};

const CATEGORY_COLOR: Record<string, string> = {
  VISUAL: t.colors.primary,
  "AUDIO/LIGHT": t.colors.warning,
  AUDIO: t.colors.warning,
  LOCATION: "#00AAFF",
};

interface SignalCardProps {
  signal: SOSSignal;
  defaultOpen?: boolean;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  defaultOpen = false,
}) => {
  const [expanded, setExpanded] = useState(defaultOpen);

  const rotAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext({
      duration: 180,
      update: { type: "easeInEaseOut" },
      create: { type: "easeInEaseOut", property: "opacity" },
    });

    Animated.timing(rotAnim, {
      toValue: expanded ? 0 : 1,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    setExpanded((prev) => !prev);
  };

  const chevronRotate = rotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const accentColor = CATEGORY_COLOR[signal.category] ?? t.colors.primary;
  const glyph = CATEGORY_GLYPH[signal.category] ?? "[?]";

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBorderRow}>
        <Text style={[styles.borderChar, { color: accentColor }]}>┌</Text>
        <Text style={[styles.categoryGlyph, { color: accentColor }]}>
          {glyph}
        </Text>
        <Text style={[styles.categoryLabel, { color: accentColor }]}>
          {signal.category}
        </Text>
        <Text style={[styles.borderFill, { color: accentColor }]}>
          {"─".repeat(4)}
        </Text>
        <Text style={[styles.borderChar, { color: accentColor }]}>┐</Text>
      </View>

      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.7}
        style={styles.header}
        accessibilityRole="button"
        accessibilityLabel={`${signal.title}, ${expanded ? "collapse" : "expand"}`}
        accessibilityHint="Double tap to toggle details"
      >
        <Text style={[styles.sideBorder, { color: accentColor }]}>│</Text>
        <Text style={styles.prompt}>{"> "}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {signal.title}
        </Text>
        <View style={{ flex: 1 }} />
        <Animated.Text
          style={[
            styles.chevron,
            { color: accentColor, transform: [{ rotate: chevronRotate }] },
          ]}
        >
          ▶
        </Animated.Text>
        <Text style={[styles.sideBorder, { color: accentColor }]}>│</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.dividerRow}>
          <Text style={[styles.borderChar, { color: accentColor }]}>├</Text>
          <Text style={[styles.dividerLine, { color: accentColor }]}>
            {"─".repeat(40)}
          </Text>
          <Text style={[styles.borderChar, { color: accentColor }]}>┤</Text>
        </View>
      )}

      {expanded && (
        <View style={styles.body}>
          <View style={styles.bodyInner}>
            <Text style={[styles.sideBorder, { color: accentColor }]}>│</Text>

            <View style={styles.bodyContent}>
              <Text style={styles.description}>{signal.description}</Text>
              <View style={styles.stepsBlock}>
                {signal.steps.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <Text style={[styles.stepNum, { color: accentColor }]}>
                      {String(idx + 1).padStart(2, "0")}
                    </Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
              {signal.note && (
                <View style={styles.noteBlock}>
                  <Text
                    style={[styles.notePrefix, { color: t.colors.warning }]}
                  >
                    {"[NOTE] "}
                  </Text>
                  <Text style={styles.noteText}>{signal.note}</Text>
                </View>
              )}
            </View>

            <Text style={[styles.sideBorder, { color: accentColor }]}>│</Text>
          </View>
        </View>
      )}

      <View style={styles.bottomBorderRow}>
        <Text style={[styles.borderChar, { color: accentColor }]}>└</Text>
        <Text style={[styles.borderFill, { color: accentColor }]}>
          {"─".repeat(40)}
        </Text>
        <Text style={[styles.borderChar, { color: accentColor }]}>┘</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: t.spacing.md,
    backgroundColor: t.colors.bgRaised,
  },
  topBorderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: t.spacing.sm,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: t.spacing.sm,
  },
  bottomBorderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: t.spacing.sm,
  },

  borderChar: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.md,
    lineHeight: t.fonts.size.md * 1.4,
  },
  borderFill: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.md,
    flex: 1,
    lineHeight: t.fonts.size.md * 1.4,
  },
  dividerLine: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.md,
    flex: 1,
    lineHeight: t.fonts.size.md * 1.4,
  },

  categoryGlyph: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    marginHorizontal: t.spacing.xs,
    lineHeight: t.fonts.size.md * 1.4,
  },
  categoryLabel: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    letterSpacing: 1.5,
    marginRight: t.spacing.xs,
    lineHeight: t.fonts.size.md * 1.4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.sm,
    minHeight: 44, // touch target
  },
  sideBorder: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.md,
    lineHeight: t.fonts.size.md * 1.4,
  },
  prompt: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primaryMuted,
    marginHorizontal: t.spacing.xs,
  },
  title: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.md,
    color: t.colors.primary,
    fontWeight: "700",
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  chevron: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    marginHorizontal: t.spacing.sm,
  },
  body: {
    paddingHorizontal: t.spacing.sm,
  },
  bodyInner: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  bodyContent: {
    flex: 1,
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
  },

  description: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.textSecondary,
    lineHeight: t.fonts.size.sm * t.fonts.lineHeight.normal,
    marginBottom: t.spacing.md,
  },
  stepsBlock: {
    marginBottom: t.spacing.md,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: t.spacing.sm,
  },
  stepNum: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    fontWeight: "700",
    marginRight: t.spacing.sm,
    width: 24,
    lineHeight: t.fonts.size.sm * t.fonts.lineHeight.normal,
  },
  stepText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.textPrimary,
    flex: 1,
    lineHeight: t.fonts.size.sm * t.fonts.lineHeight.normal,
  },
  noteBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderLeftWidth: 2,
    borderLeftColor: t.colors.warning,
    paddingLeft: t.spacing.sm,
    marginTop: t.spacing.xs,
  },
  notePrefix: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  noteText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.textSecondary,
    flex: 1,
    lineHeight: t.fonts.size.xs * t.fonts.lineHeight.normal,
  },
});
