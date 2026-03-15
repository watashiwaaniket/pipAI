import { terminal as t } from "@/theme/terminal";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BOOT_LINES = [
  "PIP-AI SURVIVAL INTERFACE v1.0",
  "INITIALIZING NEURAL CORE...",
  "LOADING INFERENCE ENGINE...",
  "CALIBRATING CONTEXT WINDOW...",
  "OFFLINE MODE: ACTIVE",
  "ALL SYSTEMS NOMINAL",
  "> READY.",
];

interface BootSequenceProps {
  onComplete?: () => void;
  lineDelay?: number;
}

export const BootSequence: React.FC<BootSequenceProps> = ({
  onComplete,
  lineDelay = 320,
}) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [cursorOpacity]);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => onComplete?.(), 600);
        return;
      }
      setVisibleLines((prev) => [...prev, BOOT_LINES[idx]]);
      idx++;
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    }, lineDelay);
    return () => clearInterval(interval);
  }, [lineDelay, onComplete]);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      scrollEnabled={false}
    >
      {visibleLines.map((line, idx) => {
        const isReady = line.startsWith(">");
        const isDone = isReady || line.startsWith("ALL");
        return (
          <BootLine key={idx} text={line} bright={isDone} />
        );
      })}
      {visibleLines.length < BOOT_LINES.length && (
        <View style={styles.cursorRow}>
          <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
            █
          </Animated.Text>
        </View>
      )}
    </ScrollView>
  );
};

const BootLine: React.FC<{ text: string; bright: boolean }> = ({
  text,
  bright,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.Text
      style={[
        styles.line,
        bright ? styles.lineBright : styles.lineDim,
        { opacity },
      ]}
    >
      {text}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: t.spacing.md },
  line: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    lineHeight: t.fonts.size.sm * 2,
  },
  lineDim: { color: t.colors.primaryDim },
  lineBright: { color: t.colors.primary, fontWeight: "700" },
  cursorRow: { flexDirection: "row" },
  cursor: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primary,
  },
});
