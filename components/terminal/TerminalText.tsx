import { useTypewriter } from "@/hooks/useTypewriter";
import { terminal as t } from "@/theme/terminal";
import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

interface TerminalTextProps {
  children: string;
  animate?: boolean;
  speed?: number;
  style?: StyleProp<TextStyle>;
  color?: string;
}

export const TerminalText: React.FC<TerminalTextProps> = ({
  children,
  animate = false,
  speed = 18,
  style,
  color,
}) => {
  const animated = useTypewriter(animate ? children : "", speed);
  const displayed = animate ? animated : children;

  return (
    <Text
      style={[
        styles.text,
        color ? { color } : undefined,
        style,
      ]}
    >
      {displayed}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.textPrimary,
    lineHeight: t.fonts.size.sm * t.fonts.lineHeight.normal,
  },
});
